<script lang="ts">
    import ChatView from '$lib/components/ChatView.svelte';
    import { messageRepo } from '$lib/db/MessageRepository';
    import { signer } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import type { Message } from '$lib/db/db';
    import { messagingService } from '$lib/core/Messaging';
    import { liveQuery } from 'dexie';
    import { page } from '$app/state';
    import { db } from '$lib/db/db';
    import Dexie from 'dexie';
    import { contactRepo } from '$lib/db/ContactRepository';
    
    let messages = $state<Message[]>([]);
    let currentPartner = $derived(page.params.npub);
    let previousPartner = '';
    let limit = $state(50);
    let isFetchingHistory = $state(false);
    
    let myPubkey = '';

    // Reset limit when partner changes
    $effect(() => {
        // Dependency
        currentPartner;
        // Logic
        limit = 50;
    });

    async function handleLoadMore() {
        const currentCount = messages.length;
        limit += 50;

        if (currentPartner) {
            const totalLocal = await messageRepo.countMessages(currentPartner);
            if (currentCount >= totalLocal) {
                const oldest = messages[0];
                if (oldest) {
                    isFetchingHistory = true;
                    try {
                        await messagingService.fetchOlderMessages(Math.floor(oldest.sentAt / 1000));
                    } catch (e) {
                        console.error('Failed to fetch older messages:', e);
                    } finally {
                        isFetchingHistory = false;
                    }
                }
            }
        }
    }

    // Effect to update subscription when partner changes or component mounts
    $effect(() => {
        const s = $signer;
        if (!s || !currentPartner) return;
        
        // Prevent redundant setup if partner hasn't changed (though $effect triggers on dep change)
        // But setup is async, we want to make sure we clean up previous sub.
        
        let subDb: { unsubscribe: () => void };

        const setup = async () => {
            if (!myPubkey) myPubkey = await s.getPublicKey();
            
            // Fetch message history to ensure we have the latest messages
            // Only fetch if limit is small (initial load) to avoid spamming on scroll
            if (limit === 50) {
                 messagingService.fetchHistory().catch(console.error);
            }
            
            // Subscribe to DB changes for SPECIFIC partner
            subDb = liveQuery(() => {
                if (currentPartner === 'ALL') {
                    return db.messages.orderBy('sentAt').reverse().limit(limit).toArray();
                } else {
                    return db.messages
                        .where('[recipientNpub+sentAt]')
                        .between(
                            [currentPartner, Dexie.minKey],
                            [currentPartner, Dexie.maxKey],
                            true, // include lower
                            false // exclude upper
                        )
                        .reverse()
                        .limit(limit)
                        .toArray();
                }
            }).subscribe(msgs => {
                messages = msgs.reverse(); // Reverse to chronological order
                
                // Mark as read
                if (currentPartner && currentPartner !== 'ALL') {
                    contactRepo.markAsRead(currentPartner).catch(console.error);
                }
            });
        };

        setup();

        return () => {
            if (subDb) subDb.unsubscribe();
        };
    });
</script>

<ChatView {messages} partnerNpub={currentPartner} onLoadMore={handleLoadMore} {isFetchingHistory} />
