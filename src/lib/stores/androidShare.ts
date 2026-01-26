import { get, writable } from 'svelte/store';
import type { AndroidShareMediaType } from '$lib/core/AndroidShareTarget';

export interface PendingAndroidMediaShare {
    file: File;
    mediaType: AndroidShareMediaType;
    /** If true, user must select a contact. If false, targetConversationId is set. */
    requiresContactSelection: boolean;
    /** Target conversation ID from Direct Share (bypasses contact selection) */
    targetConversationId?: string;
}

export interface PendingAndroidTextShare {
    text: string;
    /** If true, user must select a contact. If false, targetConversationId is set. */
    requiresContactSelection: boolean;
    /** Target conversation ID from Direct Share (bypasses contact selection) */
    targetConversationId?: string;
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
