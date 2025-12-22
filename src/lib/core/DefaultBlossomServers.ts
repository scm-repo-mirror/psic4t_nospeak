import { get } from 'svelte/store';

import { profileRepo } from '$lib/db/ProfileRepository';
import { currentUser } from '$lib/stores/auth';
import { getDefaultBlossomServers } from '$lib/core/runtimeConfig';

import { mediaServerSettingsService } from './MediaServerSettingsService';

export async function ensureDefaultBlossomServersForCurrentUser(): Promise<{
    servers: string[];
    didSetDefaults: boolean;
}> {
    const user = get(currentUser);
    if (!user?.npub) {
        throw new Error('Not authenticated');
    }

    const profile = await profileRepo.getProfileIgnoreTTL(user.npub);
    const servers = profile?.mediaServers ?? [];
    const defaultServers = getDefaultBlossomServers();

    if (servers.length > 0) {
        return { servers, didSetDefaults: false };
    }

    await mediaServerSettingsService.updateSettings([...defaultServers]);

    const refreshed = await profileRepo.getProfileIgnoreTTL(user.npub);
    return {
        servers: refreshed?.mediaServers ?? [...defaultServers],
        didSetDefaults: true
    };
}
