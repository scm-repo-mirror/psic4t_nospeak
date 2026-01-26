import { Capacitor, registerPlugin } from '@capacitor/core';

/**
 * Contact data for creating a sharing shortcut.
 */
export interface SharingShortcutContact {
    /** The conversation ID (npub for 1-on-1, hash for groups) */
    conversationId: string;
    /** Display name to show in the share sheet */
    displayName: string;
    /** Optional avatar URL */
    avatarUrl?: string;
}

/**
 * Capacitor plugin interface for Android Sharing Shortcuts.
 */
export interface AndroidSharingShortcutsPlugin {
    /**
     * Publish sharing shortcuts for the given contacts.
     * These contacts will appear in the Android share sheet for direct sharing.
     * 
     * @param options Object containing array of contacts
     */
    publishShortcuts(options: { contacts: SharingShortcutContact[] }): Promise<void>;
}

/**
 * The Android Sharing Shortcuts plugin instance.
 * Only available on Android platform.
 */
export const AndroidSharingShortcuts = Capacitor.getPlatform() === 'android'
    ? registerPlugin<AndroidSharingShortcutsPlugin>('AndroidSharingShortcuts')
    : (null as unknown as AndroidSharingShortcutsPlugin);

/**
 * Check if Android Sharing Shortcuts are available.
 */
export function isAndroidSharingShortcutsAvailable(): boolean {
    return Capacitor.getPlatform() === 'android' && AndroidSharingShortcuts !== null;
}

/**
 * Publish sharing shortcuts for recent contacts.
 * Safe to call on any platform - will no-op on non-Android.
 * 
 * @param contacts Array of contacts to publish as shortcuts
 */
export async function publishSharingShortcuts(contacts: SharingShortcutContact[]): Promise<void> {
    if (!isAndroidSharingShortcutsAvailable()) {
        return;
    }

    try {
        await AndroidSharingShortcuts.publishShortcuts({ contacts });
    } catch (error) {
        console.error('Failed to publish sharing shortcuts:', error);
    }
}
