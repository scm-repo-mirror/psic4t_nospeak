import { writable } from 'svelte/store';

export interface RelaySendStatus {
    eventId: string;
    recipientNpub?: string;      // For 1-on-1 DMs
    conversationId?: string;     // For group messages
    successfulRelays: number;
    desiredRelays: number;
}

export const lastRelaySendStatus = writable<RelaySendStatus | null>(null);

export function initRelaySendStatus(
    eventId: string,
    desiredRelays: number,
    recipientNpub?: string,
    conversationId?: string
) {
    lastRelaySendStatus.set({
        eventId,
        recipientNpub,
        conversationId,
        successfulRelays: 0,
        desiredRelays,
    });
}

export function registerRelaySuccess(eventId: string, _relay: string) {
    lastRelaySendStatus.update((current) => {
        if (!current || current.eventId !== eventId) return current;

        return {
            ...current,
            successfulRelays: Math.min(current.successfulRelays + 1, current.desiredRelays),
        };
    });
}

export function clearRelayStatus() {
    lastRelaySendStatus.set(null);
}
