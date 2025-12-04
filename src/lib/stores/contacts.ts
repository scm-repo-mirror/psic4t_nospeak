import { writable } from 'svelte/store';

export interface Contact {
    npub: string;
    name?: string;
    picture?: string;
    hasUnread: boolean;
    lastMessageTime?: number;
    nip05?: string;
    nip05Status?: 'valid' | 'invalid' | 'unknown';
}

export const contacts = writable<Contact[]>([]);
