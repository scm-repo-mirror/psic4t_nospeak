import type { NostrEvent } from 'nostr-tools';

export interface Signer {
    getPublicKey(): Promise<string>;
    signEvent(event: Partial<NostrEvent>): Promise<NostrEvent>;
    encrypt(recipient: string, message: string): Promise<string>;
    decrypt(sender: string, ciphertext: string): Promise<string>;
}
