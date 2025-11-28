<script lang="ts">
    import { connectionStats } from '$lib/stores/connection';
    import RelayStatusModal from './RelayStatusModal.svelte';

    let isModalOpen = $state(false);
</script>

<div class="p-2 border-t dark:border-gray-700">
    <button 
        onclick={() => isModalOpen = true}
        class="w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
        <div class={`w-2 h-2 rounded-full ${$connectionStats.connected > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
        Relays: {$connectionStats.connected}/{$connectionStats.total}
    </button>
</div>

<RelayStatusModal isOpen={isModalOpen} close={() => isModalOpen = false} />
