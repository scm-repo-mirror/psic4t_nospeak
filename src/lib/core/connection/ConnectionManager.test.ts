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
});
