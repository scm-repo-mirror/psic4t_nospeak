import { connectionManager } from './connection/instance';
import { profileRepo } from '$lib/db/ProfileRepository';
import { nip19 } from 'nostr-tools';

export class ProfileResolver {
    
    public async resolveProfile(npub: string, forceRefresh: boolean = false): Promise<void> {
        // 1. Try cache
        const cached = await profileRepo.getProfile(npub);
        if (cached && !forceRefresh) {
            console.log(`Using cached profile for ${npub}`);
            return;
        }

        // 2. Fetch from network
        const { type, data } = nip19.decode(npub);
        const pubkey = data as string;

        console.log(`Fetching profile for ${npub}...`);

        const filters = [
            {
                kinds: [0, 10002],
                authors: [pubkey],
                limit: 10 // Get multiple to ensure we catch both kinds if they exist
            }
        ];

        return new Promise<void>((resolve) => {
            let metadata: any = null;
            let readRelays: string[] = [];
            let writeRelays: string[] = [];
            let foundProfile = false;
            let foundRelays = false;

            // Simple timeout
            const timeout = setTimeout(async () => {
                cleanup();
                // Cache whatever we found
                await profileRepo.cacheProfile(npub, metadata, readRelays, writeRelays);
                resolve();
            }, 3000);

            const cleanup = connectionManager.subscribe(filters, (event) => {
                if (event.kind === 0 && !foundProfile) {
                    try {
                        metadata = JSON.parse(event.content);
                        foundProfile = true;
                    } catch (e) {
                        console.error('Failed to parse profile metadata', e);
                    }
                } else if (event.kind === 10002 && !foundRelays) {
                    const parsed = this.parseNIP65RelayList(event);
                    readRelays = parsed.read;
                    writeRelays = parsed.write;
                    foundRelays = true;
                }

                if (foundProfile && foundRelays) {
                    clearTimeout(timeout);
                    cleanup();
                    profileRepo.cacheProfile(npub, metadata, readRelays, writeRelays).then(resolve);
                }
            });
        });
    }

    private parseNIP65RelayList(event: any): { read: string[], write: string[] } {
        const read: string[] = [];
        const write: string[] = [];
        const seenRead = new Set<string>();
        const seenWrite = new Set<string>();

        for (const tag of event.tags) {
            if (tag.length < 2 || tag[0] !== 'r') continue;
            
            const url = tag[1];
            if (!url) continue;

            const marker = tag.length >= 3 ? tag[2] : '';

            if (marker === 'read') {
                if (!seenRead.has(url)) {
                    read.push(url);
                    seenRead.add(url);
                }
            } else if (marker === 'write') {
                if (!seenWrite.has(url)) {
                    write.push(url);
                    seenWrite.add(url);
                }
            } else {
                // Both
                if (!seenRead.has(url)) {
                    read.push(url);
                    seenRead.add(url);
                }
                if (!seenWrite.has(url)) {
                    write.push(url);
                    seenWrite.add(url);
                }
            }
        }

        return { read, write };
    }
}

export const profileResolver = new ProfileResolver();
