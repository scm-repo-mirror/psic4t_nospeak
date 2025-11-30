import type { Signer } from './Signer';
import type { NostrEvent } from 'nostr-tools';
import { BunkerSigner } from 'nostr-tools/nip46';

export class Nip46Signer implements Signer {
    private inner: BunkerSigner;

    constructor(inner: BunkerSigner) {
        this.inner = inner;
    }

    async getPublicKey(): Promise<string> {
        return this.inner.getPublicKey();
    }

    async signEvent(event: Partial<NostrEvent>): Promise<NostrEvent> {
        // BunkerSigner expects the event template, which Partial<NostrEvent> satisfies
        return this.inner.signEvent(event as any);
    }

    async encrypt(recipient: string, message: string): Promise<string> {
        return this.inner.nip04Encrypt(recipient, message);
    }

    async decrypt(sender: string, ciphertext: string): Promise<string> {
        return this.inner.nip04Decrypt(sender, ciphertext);
    }
}
