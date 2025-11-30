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
        // Use NIP-44 for encryption as required by NIP-59 (Gift Wrap)
        return this.inner.nip44Encrypt(recipient, message);
    }

    async decrypt(sender: string, ciphertext: string): Promise<string> {
        // Try NIP-44 first (standard for NIP-59)
        try {
            return await this.inner.nip44Decrypt(sender, ciphertext);
        } catch (e) {
            // Fallback to NIP-04 if NIP-44 fails (e.g. legacy messages or if remote doesn't support NIP-44 yet)
            // Note: If remote doesn't support NIP-44, it might fail encryption too, preventing new messages.
            try {
                return await this.inner.nip04Decrypt(sender, ciphertext);
            } catch (e2) {
                // If both fail, throw the original error (or the last one)
                console.warn('NIP-46 decryption failed for both NIP-44 and NIP-04');
                throw e;
            }
        }
    }
}
