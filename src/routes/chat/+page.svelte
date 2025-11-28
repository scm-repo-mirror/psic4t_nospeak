<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

    function isSelected(npub: string) {
        return page.url.pathname.includes(npub);
    }
</script>

<div class="flex-1 flex flex-col items-center justify-center text-gray-500 h-full bg-gray-50 dark:bg-gray-900">
    <p class="mb-4">Select a contact to start chatting</p>
</div>
