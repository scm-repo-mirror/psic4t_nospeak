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
    let isFetchingHistory = $state(false);

    async function handleLoadMore() {
        if (currentPartner && messages.length > 0) {
            const oldest = messages[0];
            if (oldest) {
                isFetchingHistory = true;
                try {
                    await messagingService.fetchOlderMessages(Math.floor(oldest.sentAt / 1000));
                    // The liveQuery will automatically pick up newly saved messages
                    // since we query ALL messages for this partner (no limit)
                } catch (e) {
                    console.error('Failed to fetch older messages:', e);
                } finally {
                    isFetchingHistory = false;
                }
            }
        }
    }

    // Effect to update subscription when partner changes or component mounts
    $effect(() => {
        const s = $signer;
        const partner = currentPartner;
        if (!s || !partner) return;
        
        // Subscribe to DB changes for SPECIFIC partner
        // Query ALL messages for this partner - no limit, so newly fetched older messages are included
        const sub = liveQuery(() => {
            if (partner === 'ALL') {
                return db.messages.orderBy('sentAt').toArray();
            } else {
                return db.messages
                    .where('[recipientNpub+sentAt]')
                    .between(
                        [partner, Dexie.minKey],
                        [partner, Dexie.maxKey],
                        true, // include lower
                        true // include upper
                    )
                    .toArray();
            }
        }).subscribe({
            next: (msgs) => {
                // Sort by sentAt in chronological order
                messages = msgs.sort((a, b) => a.sentAt - b.sentAt);
                
                // Mark as read
                if (partner && partner !== 'ALL') {
                    contactRepo.markAsRead(partner).catch(console.error);
                }
            },
            error: (err) => {
                console.error('liveQuery error:', err);
            }
        });

        return () => {
            sub.unsubscribe();
        };
    });
</script>

<ChatView {messages} partnerNpub={currentPartner} onLoadMore={handleLoadMore} {isFetchingHistory} />
