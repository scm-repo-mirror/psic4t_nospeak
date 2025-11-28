import { db, type Profile } from './db';

export class ProfileRepository {
    private ttl: number = 24 * 60 * 60 * 1000; // 24 hours

    public async getProfile(npub: string): Promise<Profile | undefined> {
        const profile = await db.profiles.get(npub);
        if (profile) {
            if (Date.now() > profile.expiresAt) {
                // Expired, but return it while we might fetch new one?
                // Or let caller handle expiry. 
                // Return undefined to signal "need refresh"
                // But offline mode needs it.
                // We'll return it, but maybe add a flag?
                // For now, strict TTL logic usually means "it's stale".
                // But let's return it and let logic decide.
                // Actually, logic usually checks cache miss.
                // If I return undefined, it triggers fetch.
                return undefined; 
            }
            return profile;
        }
        return undefined;
    }

    public async getProfileIgnoreTTL(npub: string): Promise<Profile | undefined> {
        return await db.profiles.get(npub);
    }

    public async cacheProfile(npub: string, metadata: any, readRelays: string[], writeRelays: string[]) {
        const now = Date.now();
        // Check if exists to preserve fields if needed (similar to SQLite implementation)
        // But IndexedDB put replaces. 
        // Logic in SQLite:
        // If hasRelays: replace everything (profile + relays)
        // If !hasRelays: update profile only, preserve relays.
        
        const existing = await db.profiles.get(npub);
        
        let profile: Profile;
        
        if (readRelays.length > 0 || writeRelays.length > 0) {
            // Full update
            profile = {
                npub,
                metadata: metadata || (existing?.metadata), // Keep existing metadata if nil passed? Go code replaces if profile provided.
                readRelays,
                writeRelays,
                cachedAt: now,
                expiresAt: now + this.ttl
            };
        } else {
            // Profile only update, preserve relays
            profile = {
                npub,
                metadata,
                readRelays: existing?.readRelays || [],
                writeRelays: existing?.writeRelays || [],
                cachedAt: now,
                expiresAt: now + this.ttl
            };
        }
        
        await db.profiles.put(profile);
    }
}

export const profileRepo = new ProfileRepository();
