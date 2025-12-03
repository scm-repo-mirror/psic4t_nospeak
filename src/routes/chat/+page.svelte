<script lang="ts">
    import { syncState } from '$lib/stores/sync';
</script>

<div class="flex-1 flex flex-col items-center justify-center text-gray-500 h-full bg-gray-50 dark:bg-gray-900">
    {#if $syncState.isSyncing && $syncState.isFirstSync}
        <div class="flex flex-col items-center gap-4">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <div class="text-center">
                <div class="text-lg font-medium dark:text-white">Syncing messages...</div>
                <div class="text-gray-500 dark:text-gray-400 mt-1">({$syncState.progress} fetched)</div>
            </div>
        </div>
    {:else}
        <p class="mb-4">Select a contact to start chatting</p>
    {/if}
</div>
