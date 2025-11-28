import type { Signer } from './Signer';
import type { NostrEvent } from 'nostr-tools';

declare global {
    interface Window {
        nostr?: {
            getPublicKey(): Promise<string>;
            signEvent(event: any): Promise<NostrEvent>;
            nip04?: {
                encrypt(pubkey: string, plaintext: string): Promise<string>;
                decrypt(pubkey: string, ciphertext: string): Promise<string>;
            };
            nip44?: {
                encrypt(pubkey: string, plaintext: string): Promise<string>;
                decrypt(pubkey: string, ciphertext: string): Promise<string>;
            };
        };
    }
}

export class Nip07Signer implements Signer {
    async getPublicKey(): Promise<string> {
        this.checkExtension();
        return window.nostr!.getPublicKey();
    }

    async signEvent(event: Partial<NostrEvent>): Promise<NostrEvent> {
        this.checkExtension();
        return window.nostr!.signEvent(event);
    }

    async encrypt(recipient: string, message: string): Promise<string> {
        this.checkExtension();
        if (window.nostr!.nip44) {
            return window.nostr!.nip44.encrypt(recipient, message);
        }
        throw new Error('Extension does not support NIP-44');
    }

    async decrypt(sender: string, ciphertext: string): Promise<string> {
        this.checkExtension();
        if (window.nostr!.nip44) {
            return window.nostr!.nip44.decrypt(sender, ciphertext);
        }
        throw new Error('Extension does not support NIP-44');
    }

    private checkExtension() {
        if (!window.nostr) {
            throw new Error('Nostr extension not found');
        }
    }
}
