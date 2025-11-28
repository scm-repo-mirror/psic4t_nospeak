import { connectionManager } from './connection/instance';
import { messageRepo } from '$lib/db/MessageRepository';
import { nip19, type Event, type NostrEvent, generateSecretKey, getPublicKey, finalizeEvent, nip44 } from 'nostr-tools';
import { signer, currentUser } from '$lib/stores/auth';
import { get } from 'svelte/store';
import { profileRepo } from '$lib/db/ProfileRepository';
import { discoverUserRelays } from './connection/Discovery';
import { notificationService } from './NotificationService';

export class MessagingService {
    private debug: boolean = true;

    // Listen for incoming messages
    public listenForMessages(publicKey: string): () => void {
        const filters = [{
            kinds: [1059], // Kind 1059 Gift Wrap
            '#p': [publicKey]
        }];

        if (this.debug) console.log('Listening for messages...', filters);

        const unsub = connectionManager.subscribe(filters, async (event) => {
            if (this.debug) console.log('Received gift wrap event:', event);
            
            // Deduplicate? (ConnectionManager might not dedupe if multiple relays send same event)
            if (await messageRepo.hasMessage(event.id)) {
                if (this.debug) console.log('Message already in cache, skipping');
                return;
            }

            await this.handleGiftWrap(event);
        });

        return unsub;
    }

    private async handleGiftWrap(event: NostrEvent) {
        const s = get(signer);
        if (!s) return;

        try {
            // Step 1: Decrypt Gift Wrap
            const decryptedGiftWrap = await s.decrypt(event.pubkey, event.content);
            const seal = JSON.parse(decryptedGiftWrap) as NostrEvent;
            
            if (seal.kind !== 13) throw new Error(`Expected Seal (Kind 13), got ${seal.kind}`);
            
            // Step 2: Decrypt Seal
            const decryptedSeal = await s.decrypt(seal.pubkey, seal.content);
            const rumor = JSON.parse(decryptedSeal) as NostrEvent;
            
            if (rumor.kind !== 14) throw new Error(`Expected Rumor (Kind 14), got ${rumor.kind}`);
            
            // Validate p tag in rumor (must be for me)
            const myPubkey = await s.getPublicKey();
            const pTag = rumor.tags.find(t => t[0] === 'p');
            if (!pTag || pTag[1] !== myPubkey) {
                // If it's a self-wrap (from me to me), p tag might be recipient's key?
                // NIP-59 says: "The inner event (kind 14) MUST contain a p tag with the recipient's public key."
                // For received messages (from others), p=ME.
                // For self-wrapped messages (from me to me), p=RECIPIENT.
                if (rumor.pubkey !== myPubkey) {
                    throw new Error('Received rumor p tag does not match my public key');
                }
            }

            this.processRumor(rumor, event.id);

        } catch (e) {
            console.error('Failed to unwrap/decrypt message:', e);
        }
    }

    private async processRumor(rumor: NostrEvent, originalEventId: string) {
        const s = get(signer);
        const user = get(currentUser);
        if (!s || !user) return;

        // Determine direction and partner
        let direction: 'sent' | 'received';
        let partnerNpub: string;
        
        // My pubkey (hex)
        const myPubkey = await s.getPublicKey();

        if (rumor.pubkey === myPubkey) {
            direction = 'sent';
            // Find actual recipient from 'p' tag
            const pTag = rumor.tags.find(t => t[0] === 'p');
            const targetHex = pTag ? pTag[1] : myPubkey; // Fallback to self
            partnerNpub = nip19.npubEncode(targetHex);
        } else {
            direction = 'received';
            partnerNpub = nip19.npubEncode(rumor.pubkey);
        }

        if (this.debug) console.log(`Processed ${direction} message with ${partnerNpub}: ${rumor.content}`);

        await messageRepo.saveMessage({
            recipientNpub: partnerNpub,
            message: rumor.content,
            sentAt: rumor.created_at * 1000,
            eventId: originalEventId,
            direction,
            createdAt: Date.now()
        });

        // Show notification for received messages
        if (direction === 'received') {
            await notificationService.showNewMessageNotification(partnerNpub, rumor.content);
        }
    }

    // Explicitly fetch history to fill gaps
    public async fetchHistory() {
        const s = get(signer);
        if (!s) return;
        const myPubkey = await s.getPublicKey();

        // 1. Get user relays
        const relays = await this.getReadRelays(nip19.npubEncode(myPubkey));
        if (relays.length === 0) {
            relays.push('wss://nostr.data.haus');
        }

        // 2. Connect to them temporarily for fetching
        for (const url of relays) {
            connectionManager.addTemporaryRelay(url);
        }
        await new Promise(r => setTimeout(r, 1000));

        const filters = [{
            kinds: [1059],
            '#p': [myPubkey],
            limit: 100 // Fetch last 100 messages
        }];

        if (this.debug) console.log('Fetching message history...', filters);

        const events = await connectionManager.fetchEvents(filters);
        if (this.debug) console.log(`Fetched ${events.length} historical events`);

        for (const event of events) {
            if (await messageRepo.hasMessage(event.id)) continue;
            await this.handleGiftWrap(event);
        }
    }

    public async sendMessage(recipientNpub: string, text: string) {
        const s = get(signer);
        if (!s) throw new Error('Not authenticated');

        const senderPubkey = await s.getPublicKey();
        const senderNpub = nip19.npubEncode(senderPubkey);
        const { data: recipientPubkey } = nip19.decode(recipientNpub);

        // 1. Get Relays
        const recipientRelays = await this.getReadRelays(recipientNpub);
        const senderRelays = await this.getWriteRelays(senderNpub);
        
        const targetRelays = [...new Set([...recipientRelays, ...senderRelays])];
        if (targetRelays.length === 0) {
            targetRelays.push('wss://nostr.data.haus'); // Fallback
        }

        if (this.debug) console.log('Sending message to relays:', targetRelays);

        // Connect temporarily
        for (const url of targetRelays) {
            connectionManager.addTemporaryRelay(url);
        }
        
        // Wait a bit for connections? (ConnectionManager handles queueing if we use it properly, but here we construct locally)
        // Actually, we construct locally then publish.
        // We might want to wait a split second for connection establishment if they are new.
        await new Promise(r => setTimeout(r, 500));

        // 2. Create Rumor (Kind 14)
        const rumor: Partial<NostrEvent> = {
            kind: 14,
            pubkey: senderPubkey,
            created_at: Math.floor(Date.now() / 1000),
            content: text,
            tags: [['p', recipientPubkey as string]]
        };

        // 3. Create Gift Wrap for Recipient
        const giftWrap = await this.createGiftWrap(rumor, recipientPubkey as string, s);

        // 4. Publish to Recipient's Read Relays + My Write Relays
        // Actually, logic is: Send to Recipient Read + My Write.
        // We already combined them in targetRelays.
        // RetryQueue handles publishing.
        for (const url of targetRelays) {
            await retryQueue.enqueue(giftWrap, url);
        }

        // 5. Create Gift Wrap for Self (History)
        // We encrypt the SAME rumor for OURSELVES.
        const selfGiftWrap = await this.createGiftWrap(rumor, senderPubkey, s);
        
        // Publish self-wrap to my write relays
        for (const url of senderRelays) {
            await retryQueue.enqueue(selfGiftWrap, url);
        }

        // 6. Cache locally immediately
        await messageRepo.saveMessage({
            recipientNpub,
            message: text,
            sentAt: (rumor.created_at || 0) * 1000,
            eventId: selfGiftWrap.id, // Save SELF-WRAP ID to match incoming
            direction: 'sent',
            createdAt: Date.now()
        });
    }

    private async createGiftWrap(rumor: Partial<NostrEvent>, recipientPubkey: string, s: any): Promise<NostrEvent> {
        // 1. Encrypt Rumor -> Seal
        const rumorJson = JSON.stringify(rumor);
        const encryptedRumor = await s.encrypt(recipientPubkey, rumorJson);

        const seal: Partial<NostrEvent> = {
            kind: 13,
            pubkey: await s.getPublicKey(),
            created_at: Math.floor(Date.now() / 1000),
            content: encryptedRumor,
            tags: []
        };

        const signedSeal = await s.signEvent(seal);
        const sealJson = JSON.stringify(signedSeal);

        // 2. Encrypt Seal -> Gift Wrap (using Ephemeral Key)
        const ephemeralPrivKey = generateSecretKey();
        const ephemeralPubkey = getPublicKey(ephemeralPrivKey);
        
        const conversationKey = nip44.v2.utils.getConversationKey(ephemeralPrivKey, recipientPubkey);
        const encryptedSeal = nip44.v2.encrypt(sealJson, conversationKey);

        const giftWrap: Partial<NostrEvent> = {
            kind: 1059,
            pubkey: ephemeralPubkey,
            created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 172800), // Randomize up to 2 days in past
            content: encryptedSeal,
            tags: [['p', recipientPubkey]]
        };

        return finalizeEvent(giftWrap as any, ephemeralPrivKey);
    }

    private async getReadRelays(npub: string): Promise<string[]> {
        let profile = await profileRepo.getProfile(npub);
        if (!profile) {
            // Try to resolve
            await discoverUserRelays(npub);
            profile = await profileRepo.getProfile(npub);
        }
        return profile?.readRelays || [];
    }

    private async getWriteRelays(npub: string): Promise<string[]> {
        let profile = await profileRepo.getProfile(npub);
        if (!profile) {
            await discoverUserRelays(npub);
            profile = await profileRepo.getProfile(npub);
        }
        return profile?.writeRelays || [];
    }
}

export const messagingService = new MessagingService();

// Need to import retryQueue to use it, but circular dependency if in instance.ts?
// Actually MessagingService imports connectionManager from instance.ts.
// instance.ts imports RetryQueue class but exports the instance.
// We can import the instance here.
import { retryQueue } from './connection/instance';
