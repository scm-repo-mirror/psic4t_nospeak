import { writable } from 'svelte/store';

export interface Contact {
    npub: string;
    name?: string;
    picture?: string;
    hasUnread: boolean;
    lastMessageTime?: number;
}

export const contacts = writable<Contact[]>([]);
