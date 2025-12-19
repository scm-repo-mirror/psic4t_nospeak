import { writable } from 'svelte/store';
import type { RelayHealth } from '$lib/core/connection/ConnectionManager';

export const relayHealths = writable<RelayHealth[]>([]);

export interface ConnectionStats {
    connected: number;
    total: number;
    authRequiredConnected: number;
    authAuthenticatedConnected: number;
    authPendingConnected: number;
    authFailedConnected: number;
}

export const connectionStats = writable<ConnectionStats>({
    connected: 0,
    total: 0,
    authRequiredConnected: 0,
    authAuthenticatedConnected: 0,
    authPendingConnected: 0,
    authFailedConnected: 0,
});
export const isOnline = writable(true);
export const showRelayStatusModal = writable(false);
