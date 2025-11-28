import { connectionManager } from './instance';
import { profileResolver } from '../ProfileResolver';
import { profileRepo } from '$lib/db/ProfileRepository';

export const DEFAULT_DISCOVERY_RELAYS = [
    'wss://nostr.data.haus',
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.primal.net'
];

export async function discoverUserRelays(npub: string) {
    console.log('Starting relay discovery for', npub);

    // 1. Connect to discovery relays (Temporary)
    for (const url of DEFAULT_DISCOVERY_RELAYS) {
        connectionManager.addTemporaryRelay(url);
    }

    // Wait a bit for connections
    await new Promise(r => setTimeout(r, 1000));

    // 2. Resolve Profile (fetches Kind 0 and 10002 and caches them)
    await profileResolver.resolveProfile(npub, true);

    // 3. Connect to user relays from cache
    const profile = await profileRepo.getProfile(npub);
    if (profile) {
        // Add Read relays
        if (profile.readRelays && profile.readRelays.length > 0) {
            console.log('Connecting to read relays:', profile.readRelays);
            for (const url of profile.readRelays) {
                connectionManager.addPersistentRelay(url);
            }
        }
        
        // Add Write relays? Usually we connect to read relays for listening.
        // nospeak connects to read relays for receiving messages.
        // It might connect to write relays for sending.
        // The ConnectionManager manages all of them.
        if (profile.writeRelays && profile.writeRelays.length > 0) {
             console.log('Connecting to write relays:', profile.writeRelays);
             for (const url of profile.writeRelays) {
                connectionManager.addPersistentRelay(url);
            }
        }
    } else {
        console.log('No profile found after discovery');
    }
}
