<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
    import { isOnline } from '$lib/stores/connection';
    import { authService } from '$lib/core/AuthService';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/state';

	let { children } = $props();
    let isInitialized = $state(false);

    onMount(async () => {
        const restored = await authService.restore();
        isInitialized = true;
        // If restored and on login page, go to chat
        if (restored && location.pathname === '/') {
            goto('/chat');
        }
    });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window 
    ononline={() => isOnline.set(true)} 
    onoffline={() => isOnline.set(false)} 
/>

{#if isInitialized}
    {@render children()}
{/if}
