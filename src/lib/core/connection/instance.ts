import { ConnectionManager } from './ConnectionManager';
import { relayHealths, connectionStats } from '$lib/stores/connection';
import { RetryQueue } from './RetryQueue';
import { browser } from '$app/environment';

export const connectionManager = new ConnectionManager(undefined, true);

connectionManager.setUpdateCallback((relays) => {
    relayHealths.set(relays);
    const connected = relays.filter(r => r.isConnected).length;
    connectionStats.set({ connected, total: relays.length });
});

export const retryQueue = new RetryQueue(connectionManager, true);

if (browser) {
    connectionManager.start();
    retryQueue.start();
}

