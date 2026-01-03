import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConnectionManager, ConnectionType, DefaultRetryConfig } from './ConnectionManager';

vi.mock('nostr-tools', () => {
    return {
        Relay: {
            connect: vi.fn()
        }
    };
});

describe('ConnectionManager', () => {
    let cm: ConnectionManager;

    beforeEach(() => {
        vi.useFakeTimers();
        cm = new ConnectionManager(DefaultRetryConfig, false);
    });

    afterEach(() => {
        cm.stop();
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('should add a persistent relay', () => {
        const url = 'wss://relay.example.com';
        cm.addPersistentRelay(url);
        const health = cm.getRelayHealth(url);
        expect(health).toBeDefined();
        expect(health?.url).toBe(url);
    });

    it('should track consecutive failures', () => {
        const cmAny = cm as any;
        const url = 'wss://fail.com';
        cm.addPersistentRelay(url);
        
        cmAny.markRelayFailure(url);
        expect(cm.getRelayHealth(url)?.consecutiveFails).toBe(1);
        
        cmAny.markRelayFailure(url);
        expect(cm.getRelayHealth(url)?.consecutiveFails).toBe(2);
    });

    it('applies more conservative backoff in background mode', () => {
        const cmAny = cm as any;
        const normalBackoff = cmAny.calculateBackoff(3);
        cmAny.setBackgroundModeEnabled(true);
        const backgroundBackoff = cmAny.calculateBackoff(3);
        expect(backgroundBackoff).toBeGreaterThanOrEqual(normalBackoff);
        
        cmAny.setBackgroundModeEnabled(false);
        const restoredBackoff = cmAny.calculateBackoff(3);
        expect(restoredBackoff).toBe(normalBackoff);
    });

    it('does not schedule ws.send after intentional relay close', async () => {
        const relayUrl = 'wss://closing-race.example.com';

        const ws: any = {
            readyState: 1,
            send: vi.fn(),
            close: vi.fn(() => {
                ws.readyState = 2;
            }),
        };

        const relay: any = {
            url: relayUrl,
            ws,
            _WebSocket: { OPEN: 1 },
            _connected: true,
            connectionPromise: Promise.resolve(),
            get connected() {
                return this._connected;
            },
            openSubs: new Map<string, any>(),
            closeAllSubscriptions(reason: string) {
                for (const [, sub] of this.openSubs) {
                    sub.close(reason);
                }
                this.openSubs.clear();
            },
            close() {
                this.closeAllSubscriptions('relay connection closed by us');
                this.ws.close();
                this._connected = false;
            },
        };

        const subscription: any = {
            closed: false,
            relay,
            close: vi.fn(() => {
                if (subscription.closed) {
                    return;
                }
                if (relay.connected) {
                    Promise.resolve().then(() => ws.send('["CLOSE","sub:1"]'));
                }
                subscription.closed = true;
            }),
        };

        relay.openSubs.set('sub:1', subscription);

        const cmAny = cm as any;
        cmAny.relays.set(relayUrl, {
            url: relayUrl,
            relay,
            isConnected: true,
            lastConnected: 0,
            lastAttempt: 0,
            successCount: 0,
            failureCount: 0,
            consecutiveFails: 0,
            type: ConnectionType.Persistent,
            authStatus: 'not_required',
            lastAuthAt: 0,
            lastAuthError: null,
        });

        cm.removeRelay(relayUrl);

        // Flush microtasks that would send after ws.close.
        await Promise.resolve();
        await Promise.resolve();

        expect(ws.send).not.toHaveBeenCalled();
    });

    it('does not send on CLOSING websocket during relay close', () => {
        const relayUrl = 'wss://closing.example.com';

        const subscriptionClose = vi.fn(() => {
            if (relay.connected) {
                throw new Error('would send CLOSE on non-open websocket');
            }
        });

        const relay: any = {
            url: relayUrl,
            ws: { readyState: 2 },
            _WebSocket: { OPEN: 1 },
            _connected: true,
            get connected() {
                return this._connected;
            },
            openSubs: new Map<string, any>(),
            closeAllSubscriptions(reason: string) {
                for (const [, sub] of this.openSubs) {
                    sub.close(reason);
                }
                this.openSubs.clear();
            },
            close() {
                this.closeAllSubscriptions('relay connection closed by us');
                this._connected = false;
            },
        };

        relay.openSubs.set('sub:1', { close: subscriptionClose });

        const cmAny = cm as any;
        cmAny.relays.set(relayUrl, {
            url: relayUrl,
            relay,
            isConnected: true,
            lastConnected: 0,
            lastAttempt: 0,
            successCount: 0,
            failureCount: 0,
            consecutiveFails: 0,
            type: ConnectionType.Persistent,
            authStatus: 'not_required',
            lastAuthAt: 0,
            lastAuthError: null,
        });

        expect(() => cm.removeRelay(relayUrl)).not.toThrow();
        expect(subscriptionClose).toHaveBeenCalledTimes(1);
    });

    it('does not send on CLOSING websocket during unsubscribe', () => {
        const relayUrl = 'wss://closing-unsub.example.com';

        let subscription: any;

        const relay: any = {
            url: relayUrl,
            ws: { readyState: 2 },
            _WebSocket: { OPEN: 1 },
            _connected: true,
            get connected() {
                return this._connected;
            },
            close: vi.fn(),
            subscribe: vi.fn(() => subscription),
        };

        subscription = {
            relay,
            close: vi.fn(() => {
                if (relay.connected) {
                    throw new Error('would send CLOSE on non-open websocket');
                }
            }),
        };

        const cmAny = cm as any;
        cmAny.relays.set(relayUrl, {
            url: relayUrl,
            relay,
            isConnected: true,
            lastConnected: 0,
            lastAttempt: 0,
            successCount: 0,
            failureCount: 0,
            consecutiveFails: 0,
            type: ConnectionType.Persistent,
            authStatus: 'not_required',
            lastAuthAt: 0,
            lastAuthError: null,
        });

        const unsubscribe = cm.subscribe([{ kinds: [1] }], vi.fn());
        expect(() => unsubscribe()).not.toThrow();
        expect(subscription.close).toHaveBeenCalledTimes(1);
    });

    it('re-subscribes once after auth-required close', async () => {
        const relayUrl = 'wss://relay.example.com';

        const relay: any = {
            url: relayUrl,
            close: vi.fn(),
            subscribe: vi.fn((_filters: any[], params: any) => {
                setTimeout(() => {
                    params.onclose?.('auth-required: subscription requires auth');
                }, 0);
                return { close: vi.fn() };
            }),
        };

        const cmAny = cm as any;
        cmAny.relays.set(relayUrl, {
            url: relayUrl,
            relay,
            isConnected: true,
            lastConnected: 0,
            lastAttempt: 0,
            successCount: 0,
            failureCount: 0,
            consecutiveFails: 0,
            type: ConnectionType.Persistent,
            authStatus: 'not_required',
            lastAuthAt: 0,
            lastAuthError: null,
        });

        vi.spyOn(cm, 'authenticateRelay').mockResolvedValue(true);

        const unsubscribe = cm.subscribe([{ kinds: [1] }], vi.fn());

        await vi.runAllTimersAsync();

        expect(relay.subscribe).toHaveBeenCalledTimes(2);
        expect(cm.authenticateRelay).toHaveBeenCalledTimes(1);

        unsubscribe();
    });

    it('verifies WebSocket state in health check and clears stale connections', () => {
        const relayUrl = 'wss://stale.example.com';

        const relay: any = {
            url: relayUrl,
            ws: { readyState: 3 }, // CLOSED
            _WebSocket: { OPEN: 1 },
            _connected: true,
            get connected() {
                return this._connected;
            },
            close: vi.fn(),
        };

        const cmAny = cm as any;
        cmAny.relays.set(relayUrl, {
            url: relayUrl,
            relay,
            isConnected: true,
            lastConnected: Date.now(),
            lastAttempt: 0,
            successCount: 1,
            failureCount: 0,
            consecutiveFails: 0,
            type: ConnectionType.Persistent,
            authStatus: 'not_required',
            lastAuthAt: 0,
            lastAuthError: null,
        });

        // Run health check
        cmAny.checkAllRelayHealth();

        // Should detect dead socket and mark as disconnected
        const health = cm.getRelayHealth(relayUrl);
        expect(health?.isConnected).toBe(false);
        expect(health?.relay).toBe(null);
    });

    it('triggers reconnection when visibility changes and socket is dead', () => {
        const relayUrl = 'wss://visibility.example.com';

        const relay: any = {
            url: relayUrl,
            ws: { readyState: 3 }, // CLOSED
            _WebSocket: { OPEN: 1 },
            _connected: true,
            get connected() {
                return this._connected;
            },
            close: vi.fn(),
        };

        const cmAny = cm as any;
        cmAny.relays.set(relayUrl, {
            url: relayUrl,
            relay,
            isConnected: true,
            lastConnected: Date.now(),
            lastAttempt: 0,
            successCount: 1,
            failureCount: 0,
            consecutiveFails: 0,
            type: ConnectionType.Persistent,
            authStatus: 'not_required',
            lastAuthAt: 0,
            lastAuthError: null,
        });

        // Simulate visibility change handler
        cmAny.verifyAllConnections();

        // Should detect dead socket and mark as disconnected
        const health = cm.getRelayHealth(relayUrl);
        expect(health?.isConnected).toBe(false);
        expect(health?.relay).toBe(null);
    });

    it('ping success clears pending state', async () => {
        const relayUrl = 'wss://ping.example.com';
        let eoseCallback: () => void = () => {};

        const relay: any = {
            url: relayUrl,
            ws: { readyState: 1 },
            _WebSocket: { OPEN: 1 },
            close: vi.fn(),
            subscribe: vi.fn((_filters: any[], params: any) => {
                eoseCallback = params.oneose;
                return { close: vi.fn() };
            }),
        };

        const cmAny = cm as any;
        cmAny.relays.set(relayUrl, {
            url: relayUrl,
            relay,
            isConnected: true,
            lastConnected: Date.now(),
            lastAttempt: 0,
            successCount: 1,
            failureCount: 0,
            consecutiveFails: 0,
            type: ConnectionType.Persistent,
            authStatus: 'not_required',
            lastAuthAt: 0,
            lastAuthError: null,
        });

        // Send ping
        cmAny.pingRelay(relayUrl, relay);

        // Should have pending ping
        expect(cmAny.pendingPings.has(relayUrl)).toBe(true);

        // Simulate EOSE response
        eoseCallback();

        // Pending ping should be cleared
        expect(cmAny.pendingPings.has(relayUrl)).toBe(false);
    });

    it('ping timeout triggers reconnection', async () => {
        const relayUrl = 'wss://timeout.example.com';

        const relay: any = {
            url: relayUrl,
            ws: { readyState: 1 },
            _WebSocket: { OPEN: 1 },
            _connected: true,
            get connected() {
                return this._connected;
            },
            close: vi.fn(),
            subscribe: vi.fn(() => {
                // Never call oneose - simulate timeout
                return { close: vi.fn() };
            }),
        };

        const cmAny = cm as any;
        cmAny.relays.set(relayUrl, {
            url: relayUrl,
            relay,
            isConnected: true,
            lastConnected: Date.now(),
            lastAttempt: 0,
            successCount: 1,
            failureCount: 0,
            consecutiveFails: 0,
            type: ConnectionType.Persistent,
            authStatus: 'not_required',
            lastAuthAt: 0,
            lastAuthError: null,
        });

        // Send ping
        cmAny.pingRelay(relayUrl, relay);

        // Advance timer past ping timeout (default 5000ms)
        await vi.advanceTimersByTimeAsync(6000);

        // Should mark relay as disconnected and increment failures
        const health = cm.getRelayHealth(relayUrl);
        expect(health?.isConnected).toBe(false);
        // consecutiveFails may be > 1 due to reconnection attempts also failing
        expect(health?.consecutiveFails).toBeGreaterThanOrEqual(1);
    });

    it('stop() cleans up ping resources', () => {
        const cmAny = cm as any;

        // Start the ping loop
        cmAny.startPingLoop();
        expect(cmAny.pingTimer).not.toBe(null);

        // Add a fake pending ping
        cmAny.pendingPings.set('wss://test.com', {
            timeout: setTimeout(() => {}, 10000),
            sub: { close: vi.fn() }
        });

        cm.stop();

        expect(cmAny.pingTimer).toBe(null);
        expect(cmAny.pendingPings.size).toBe(0);
    });
});
