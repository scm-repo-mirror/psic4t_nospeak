<script lang="ts">
    import ChatView from '$lib/components/ChatView.svelte';
    import { messageRepo } from '$lib/db/MessageRepository';
    import { signer } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import type { Message } from '$lib/db/db';
    import { messagingService } from '$lib/core/Messaging';
    import { liveQuery } from 'dexie';
    import { page } from '$app/state';
    
    let messages = $state<Message[]>([]);
    let currentPartner = $derived(page.params.npub);
    let previousPartner = '';
    
    let myPubkey = '';

    // Effect to update subscription when partner changes or component mounts
    $effect(() => {
        const s = $signer;
        if (!s || !currentPartner) return;
        
        // Prevent redundant setup if partner hasn't changed (though $effect triggers on dep change)
        // But setup is async, we want to make sure we clean up previous sub.
        
        let subDb: { unsubscribe: () => void };

        const setup = async () => {
            if (!myPubkey) myPubkey = await s.getPublicKey();
            
            // Subscribe to DB changes for SPECIFIC partner
            subDb = liveQuery(async () => {
                 return await messageRepo.getMessages(currentPartner, 50); 
            }).subscribe(msgs => {
                messages = msgs;
            });
        };

        setup();

        return () => {
            if (subDb) subDb.unsubscribe();
        };
    });
</script>

<ChatView {messages} partnerNpub={currentPartner} />
