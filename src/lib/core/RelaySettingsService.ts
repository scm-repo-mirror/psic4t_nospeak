import { get } from 'svelte/store';
import { signer, currentUser } from '$lib/stores/auth';
import { connectionManager } from './connection/instance';
import { DEFAULT_DISCOVERY_RELAYS } from './connection/Discovery';
import { Relay } from 'nostr-tools';
import { ConnectionType } from './connection/ConnectionManager';
import { profileRepo } from '$lib/db/ProfileRepository';

export class RelaySettingsService {
    public async updateSettings(readRelays: string[], writeRelays: string[]): Promise<void> {
        // 1. Update Profile Repo Cache
        const currentUserData = get(currentUser);
        if (currentUserData) {
            const profile = await profileRepo.getProfileIgnoreTTL(currentUserData.npub);
            await profileRepo.cacheProfile(
                currentUserData.npub,
                profile?.metadata, // keep existing metadata
                readRelays,
                writeRelays
            );
        }

        // 2. Publish NIP-65 event
        await this.publishRelayList(readRelays, writeRelays);

        // 3. Apply settings to current connections
        await this.applyRelaySettings(readRelays, writeRelays);
    }

    private async publishRelayList(readRelays: string[], writeRelays: string[]): Promise<void> {
        const currentSigner = get(signer);
        const currentUserData = get(currentUser);
        
        if (!currentSigner || !currentUserData) {
            throw new Error('User not authenticated');
        }

        // Build NIP-65 tags
        const tags: string[][] = [];
        
        // Add read relays
        for (const relay of readRelays) {
            if (!writeRelays.includes(relay)) {
                tags.push(['r', relay, 'read']);
            }
        }
        
        // Add write relays
        for (const relay of writeRelays) {
            if (!readRelays.includes(relay)) {
                tags.push(['r', relay, 'write']);
            }
        }
        
        // Add relays that are both read and write (no marker)
        const bothRelays = readRelays.filter(r => writeRelays.includes(r));
        for (const relay of bothRelays) {
            tags.push(['r', relay]);
        }

        const event = {
            kind: 10002,
            tags,
            content: '',
            created_at: Math.floor(Date.now() / 1000)
        };

        try {
            const signedEvent = await currentSigner.signEvent(event);
            
            // Publish to all relays: discovery + blaster + connected + configured
            const allRelays = new Set([
                ...DEFAULT_DISCOVERY_RELAYS,
                'wss://sendit.nosflare.com',
                ...connectionManager.getAllRelayHealth().map(h => h.url),
                ...readRelays,
                ...writeRelays
            ]);

            for (const relayUrl of allRelays) {
                try {
                    // Connect temporarily if not already connected
                    let relay = connectionManager.getRelayHealth(relayUrl)?.relay;
                    if (!relay) {
                        try {
                            relay = await Relay.connect(relayUrl);
                        } catch (e) {
                            console.warn(`Could not connect to ${relayUrl} to publish relay list`);
                            continue;
                        }
                    }
                    
                    // nostr-tools v2 publish returns a Promise that resolves when OK is received
                    await relay.publish(signedEvent);
                    console.log(`Published relay list to ${relayUrl}`);
                    
                } catch (e) {
                    console.error(`Failed to publish relay list to ${relayUrl}:`, e);
                    // Continue with other relays even if one fails
                }
            }
        } catch (e) {
            console.error('Failed to sign or publish relay list event:', e);
            throw e;
        }
    }

    public async applyRelaySettings(readRelays: string[], writeRelays: string[]): Promise<void> {
        // Get current relay healths from the store
        const { relayHealths } = await import('$lib/stores/connection');
        const currentHealths = get(relayHealths);
        
        // Remove existing persistent relays that are not in the read list
        const persistentRelaysToKeep = new Set(readRelays);
        
        for (const health of currentHealths) {
            if (health.type === ConnectionType.Persistent && 
                !persistentRelaysToKeep.has(health.url)) {
                connectionManager.removeRelay(health.url);
            }
        }

        // Add new relays from settings
        for (const relay of readRelays) {
            connectionManager.addPersistentRelay(relay);
        }
    }
}

export const relaySettingsService = new RelaySettingsService();
