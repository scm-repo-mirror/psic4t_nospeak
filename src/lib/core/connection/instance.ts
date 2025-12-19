import { ConnectionManager } from './ConnectionManager';
import { relayHealths, connectionStats } from '$lib/stores/connection';
import { RetryQueue } from './RetryQueue';
import { browser } from '$app/environment';
import { signer } from '$lib/stores/auth';
import { get } from 'svelte/store';

export const connectionManager = new ConnectionManager(undefined, true);

connectionManager.setAuthSigner(async (eventTemplate) => {
    const currentSigner = get(signer);
    if (!currentSigner) {
        throw new Error('Missing signer');
    }

    return await currentSigner.signEvent(eventTemplate);
});

connectionManager.setUpdateCallback((relays) => {
    relayHealths.set(relays);

    const connectedRelays = relays.filter((relay) => relay.isConnected);
    const connected = connectedRelays.length;

    const authRequiredConnected = connectedRelays.filter((relay) => relay.authStatus !== 'not_required').length;
    const authAuthenticatedConnected = connectedRelays.filter((relay) => relay.authStatus === 'authenticated').length;
    const authPendingConnected = connectedRelays.filter(
        (relay) => relay.authStatus === 'required' || relay.authStatus === 'authenticating'
    ).length;
    const authFailedConnected = connectedRelays.filter((relay) => relay.authStatus === 'failed').length;

    connectionStats.set({
        connected,
        total: relays.length,
        authRequiredConnected,
        authAuthenticatedConnected,
        authPendingConnected,
        authFailedConnected,
    });
});

export const retryQueue = new RetryQueue(connectionManager, true);

if (browser) {
    connectionManager.start();
    retryQueue.start();
}

