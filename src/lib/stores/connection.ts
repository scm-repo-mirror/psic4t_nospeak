import { writable } from 'svelte/store';
import type { RelayHealth } from '$lib/core/connection/ConnectionManager';

export const relayHealths = writable<RelayHealth[]>([]);
export const connectionStats = writable({ connected: 0, total: 0 });
export const isOnline = writable(true);
