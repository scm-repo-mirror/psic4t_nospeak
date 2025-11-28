<script lang="ts">
    import { profileRepo } from '$lib/db/ProfileRepository';
    import { onMount } from 'svelte';
    import type { Profile } from '$lib/db/db';
    import Avatar from './Avatar.svelte';

    let { isOpen, close, npub } = $props<{ isOpen: boolean, close: () => void, npub: string }>();
    
    let profile = $state<Profile | undefined>(undefined);
    let loading = $state(false);

    $effect(() => {
        if (isOpen && npub) {
            loadProfile();
        }
    });

    async function loadProfile() {
        loading = true;
        profile = await profileRepo.getProfileIgnoreTTL(npub);
        loading = false;
    }

    function formatRelays(relays: string[]) {
        if (!relays || relays.length === 0) return 'None';
        return relays.join(', ');
    }
</script>

{#if isOpen}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-h-[80vh] flex flex-col shadow-xl">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-xl font-bold dark:text-white">Profile Info</h2>
                <button onclick={close} class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    ✕
                </button>
            </div>
            
            {#if loading}
                <div class="text-center py-4 dark:text-gray-300">Loading...</div>
            {:else if profile}
                <div class="flex flex-col items-center mb-4">
                    <div class="mb-2">
                        <Avatar npub={npub} src={profile.metadata?.picture} size="xl" />
                    </div>
                    <h3 class="text-lg font-bold dark:text-white text-center">
                        {profile.metadata?.name || profile.metadata?.display_name || 'Unknown'}
                    </h3>
                    {#if profile.metadata?.nip05}
                        <div class="text-sm text-purple-600 dark:text-purple-400">{profile.metadata.nip05}</div>
                    {/if}
                </div>

                <div class="space-y-3 overflow-y-auto text-sm">
                    <div>
                        <div class="font-semibold text-gray-500 dark:text-gray-400">About</div>
                        <div class="dark:text-gray-200 whitespace-pre-wrap">{profile.metadata?.about || 'No bio'}</div>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-500 dark:text-gray-400">Public Key</div>
                        <div class="dark:text-gray-200 font-mono text-xs break-all">{npub}</div>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-500 dark:text-gray-400">Read Relays</div>
                        <div class="dark:text-gray-200 text-xs">{formatRelays(profile.readRelays)}</div>
                    </div>

                    <div>
                        <div class="font-semibold text-gray-500 dark:text-gray-400">Write Relays</div>
                        <div class="dark:text-gray-200 text-xs">{formatRelays(profile.writeRelays)}</div>
                    </div>
                </div>
            {:else}
                <div class="text-center py-4 dark:text-gray-300">Profile not found</div>
            {/if}
        </div>
    </div>
{/if}
