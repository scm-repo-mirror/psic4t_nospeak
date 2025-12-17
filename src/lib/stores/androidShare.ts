import { get, writable } from 'svelte/store';
import type { AndroidShareMediaType } from '$lib/core/AndroidShareTarget';

export interface PendingAndroidMediaShare {
    file: File;
    mediaType: AndroidShareMediaType;
    requiresContactSelection: boolean;
}

export interface PendingAndroidTextShare {
    text: string;
    requiresContactSelection: boolean;
}

const mediaStore = writable<PendingAndroidMediaShare | null>(null);
const textStore = writable<PendingAndroidTextShare | null>(null);

export const pendingAndroidMediaShare = mediaStore;
export const pendingAndroidTextShare = textStore;

export function setPendingAndroidMediaShare(value: PendingAndroidMediaShare | null): void {
    mediaStore.set(value);
}

export function setPendingAndroidTextShare(value: PendingAndroidTextShare | null): void {
    textStore.set(value);
}

export function consumePendingAndroidMediaShare(): PendingAndroidMediaShare | null {
    const value = get(mediaStore);
    mediaStore.set(null);
    return value;
}

export function consumePendingAndroidTextShare(): PendingAndroidTextShare | null {
    const value = get(textStore);
    textStore.set(null);
    return value;
}
