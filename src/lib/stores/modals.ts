import { writable } from 'svelte/store';

export const showSettingsModal = writable(false);
export const showManageContactsModal = writable(false);
export const showEmptyProfileModal = writable(false);
export const profileModalState = writable<{ isOpen: boolean; npub: string | null }>({
    isOpen: false,
    npub: null
});

export function openProfileModal(npub: string) {
    profileModalState.set({ isOpen: true, npub });
}

export function closeProfileModal() {
    profileModalState.set({ isOpen: false, npub: null });
}
