import type { Signer } from './Signer';
import { type NostrEvent, generateSecretKey } from 'nostr-tools';

export class Nip46Signer implements Signer {
    private bunkerUrl: string;
    private localKey: Uint8Array;
    private remotePubkey: string | null = null;

    constructor(bunkerUrl: string) {
        this.bunkerUrl = bunkerUrl;
        this.localKey = generateSecretKey();
    }

    async getPublicKey(): Promise<string> {
        if (!this.remotePubkey) throw new Error('Not connected');
        return this.remotePubkey;
    }

    async signEvent(event: Partial<NostrEvent>): Promise<NostrEvent> {
        throw new Error('NIP-46 signing not yet implemented');
    }

    async encrypt(recipient: string, message: string): Promise<string> {
        throw new Error('NIP-46 encryption not yet implemented');
    }

    async decrypt(sender: string, ciphertext: string): Promise<string> {
        throw new Error('NIP-46 decryption not yet implemented');
    }
}
