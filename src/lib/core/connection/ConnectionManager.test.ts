import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConnectionManager, DefaultRetryConfig } from './ConnectionManager';
import { Relay } from 'nostr-tools';

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
        // Access private method or simulate failure?
        // We can't easily access private methods in TS tests unless we cast to any
        const cmAny = cm as any;
        const url = 'wss://fail.com';
        cm.addPersistentRelay(url);
        
        cmAny.markRelayFailure(url);
        expect(cm.getRelayHealth(url)?.consecutiveFails).toBe(1);
        
        cmAny.markRelayFailure(url);
        expect(cm.getRelayHealth(url)?.consecutiveFails).toBe(2);
    });
});
