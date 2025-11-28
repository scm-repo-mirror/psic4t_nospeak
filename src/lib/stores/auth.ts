import { writable } from 'svelte/store';
import type { Signer } from '$lib/core/signer/Signer';

export const signer = writable<Signer | null>(null);
export const currentUser = writable<{ npub: string } | null>(null);
