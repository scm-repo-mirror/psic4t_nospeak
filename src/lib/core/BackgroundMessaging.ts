import { get } from 'svelte/store';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { nip19 } from 'nostr-tools';
import { currentUser, signer } from '$lib/stores/auth';
import { profileRepo } from '$lib/db/ProfileRepository';
import { connectionManager } from './connection/instance';
import { ConnectionType, type RelayHealth } from './connection/ConnectionManager';
import { relayHealths } from '$lib/stores/connection';
import { isAndroidNative } from './NativeDialogs';


interface NospeakSettings {
    notificationsEnabled?: boolean;
    urlPreviewsEnabled?: boolean;
    backgroundMessagingEnabled?: boolean;
}

function loadSettings(): NospeakSettings {
    if (typeof window === 'undefined' || !window.localStorage) {
        return {};
    }

    try {
        const raw = window.localStorage.getItem('nospeak-settings');
        if (!raw) return {};
        const parsed = JSON.parse(raw) as NospeakSettings;
        return parsed || {};
    } catch (e) {
        console.error('Failed to load nospeak-settings for background messaging:', e);
        return {};
    }
}

export function isBackgroundMessagingPreferenceEnabled(): boolean {
    const settings = loadSettings();
    return settings.backgroundMessagingEnabled === true;
}

function buildRelaySummary(relays: string[]): string {
    if (!relays || relays.length === 0) {
        return 'No read relays configured';
    }
 
    const uniqueRelays = Array.from(new Set(relays));
    const limited = uniqueRelays.slice(0, 4);
    const list = limited.join(', ');
 
    return `Connected to read relays: ${list}`;
}
 
function buildConnectedRelaySummary(healths: RelayHealth[]): string {
    const connectedUrls = healths
        .filter((h) => h.isConnected && h.type === ConnectionType.Persistent)
        .map((h) => h.url);
 
    if (connectedUrls.length === 0) {
        return 'No read relays connected';
    }
 
    const uniqueRelays = Array.from(new Set(connectedUrls));
    const limited = uniqueRelays.slice(0, 4);
    const list = limited.join(', ');
 
    return `Connected read relays: ${list}`;
}
 
let relayHealthUnsubscribe: (() => void) | null = null;
let lastNotificationSummary: string | null = null;

interface AndroidBackgroundMessagingPlugin {
    start(options: {
        mode: 'nsec' | 'amber';
        pubkeyHex: string;
        nsecHex?: string;
        readRelays: string[];
        summary: string;
    }): Promise<void>;
    update(options: { summary: string }): Promise<void>;
    stop(): Promise<void>;
}

const AndroidBackgroundMessaging = registerPlugin<AndroidBackgroundMessagingPlugin>('AndroidBackgroundMessaging');

async function startNativeForegroundService(summary: string, readRelays: string[]): Promise<void> {
    if (Capacitor.getPlatform() !== 'android') {
        return;
    }

    const s = get(signer);
    const user = get(currentUser);
    if (!user) {
        console.warn('Cannot start Android background messaging: missing user');
        return;
    }

    let mode: 'nsec' | 'amber' = 'amber';
    let nsecHex: string | undefined;

    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            const authMethod = window.localStorage.getItem('nospeak:auth_method');
            const storedNsec = window.localStorage.getItem('nospeak:nsec');
            if (authMethod === 'local' && storedNsec) {
                mode = 'nsec';
                nsecHex = storedNsec;
            }
        } catch (e) {
            console.warn('Failed to read auth method for Android background messaging:', e);
        }
    }

    let pubkeyHex: string | null = null;

    // Prefer decoding from npub so we don't depend on the signer being ready.
    if (user.npub) {
        try {
            const decoded = nip19.decode(user.npub);
            if (decoded.type === 'npub' && typeof decoded.data === 'string') {
                pubkeyHex = decoded.data;
            }
        } catch (e) {
            console.warn('Failed to decode npub for Android background messaging:', e);
        }
    }

    if (!pubkeyHex) {
        if (!s) {
            console.warn('Cannot start Android background messaging: missing signer and unable to decode npub');
            return;
        }
        try {
            pubkeyHex = await s.getPublicKey();
        } catch (e) {
            console.error('Failed to get pubkey from signer for Android background messaging:', e);
            return;
        }
    }

    try {
        await AndroidBackgroundMessaging.start({
            mode,
            pubkeyHex,
            nsecHex,
            readRelays,
            summary
        });
    } catch (e) {
        console.error('Failed to start Android background messaging service:', e);
    }
}

async function updateNativeForegroundService(summary: string): Promise<void> {
    if (Capacitor.getPlatform() !== 'android') {
        return;
    }

    try {
        await AndroidBackgroundMessaging.update({ summary });
    } catch (e) {
        console.error('Failed to update Android background messaging service:', e);
    }
}

async function stopNativeForegroundService(): Promise<void> {
    if (Capacitor.getPlatform() !== 'android') {
        return;
    }

    try {
        await AndroidBackgroundMessaging.stop();
    } catch (e) {
        console.error('Failed to stop Android background messaging service:', e);
    }
}

function ensureRelayHealthSubscription(): void {
    if (relayHealthUnsubscribe || typeof window === 'undefined') {
        return;
    }
 
    relayHealthUnsubscribe = relayHealths.subscribe((healths: RelayHealth[]) => {
        const summary = buildConnectedRelaySummary(healths);
        if (summary === lastNotificationSummary) {
            return;
        }
 
        lastNotificationSummary = summary;
        void updateNativeForegroundService(summary);
    });
}



export async function enableAndroidBackgroundMessaging(): Promise<void> {
    if (!isAndroidNative()) {
        return;
    }

    const user = get(currentUser);
    let readRelays: string[] = [];

    try {
        if (user?.npub) {
            const profile = await profileRepo.getProfileIgnoreTTL(user.npub);
            if (profile?.readRelays && Array.isArray(profile.readRelays)) {
                readRelays = profile.readRelays;
            }
        }
    } catch (e) {
        console.error('Failed to load profile for Android background messaging:', e);
    }

    const summary = buildRelaySummary(readRelays);
 
    // Apply more conservative reconnection behavior while background messaging is enabled
    connectionManager.setBackgroundModeEnabled(true);
 
    // Track the current summary and start the foreground service
    lastNotificationSummary = summary;
    await startNativeForegroundService(summary, readRelays);
 
    // Keep the notification in sync with connected relays
    ensureRelayHealthSubscription();
}



export async function disableAndroidBackgroundMessaging(): Promise<void> {
    if (!isAndroidNative()) {
        return;
    }

    // Restore default reconnection behavior
    connectionManager.setBackgroundModeEnabled(false);
 
    await stopNativeForegroundService();
 
    // Tear down relay health subscription
    if (relayHealthUnsubscribe) {
        relayHealthUnsubscribe();
        relayHealthUnsubscribe = null;
    }
    lastNotificationSummary = null;
}


export async function syncAndroidBackgroundMessagingFromPreference(): Promise<void> {
    if (!isAndroidNative()) {
        return;
    }

    if (isBackgroundMessagingPreferenceEnabled()) {
        await enableAndroidBackgroundMessaging();
    } else {
        await disableAndroidBackgroundMessaging();
    }
}
