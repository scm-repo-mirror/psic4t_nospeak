import { describe, it, expect } from 'vitest';
import { decryptAesGcmToBytes, encryptFileWithAesGcm } from './FileEncryption';
import { webcrypto } from 'crypto';

// Polyfill for Node.js test environment
if (typeof globalThis.crypto === 'undefined') {
    (globalThis as any).crypto = webcrypto;
}

// Helper to create test encrypted data using Web Crypto API directly
async function createTestEncryptedData(plaintext: Uint8Array, keyBytes: Uint8Array, nonceBytes: Uint8Array) {
    const key = await crypto.subtle.importKey(
        'raw',
        keyBytes.buffer as ArrayBuffer,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
    );

    const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: nonceBytes as any },
        key,
        plaintext as any
    );

    return new Uint8Array(ciphertext);
}

function toHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function toBase64Url(bytes: Uint8Array): string {
    const binary = String.fromCharCode(...bytes);
    const b64 = Buffer.from(binary, 'binary').toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

describe('FileEncryption', () => {
    describe('decryptAesGcmToBytes', () => {
        it('decrypts with hex-encoded key and nonce (Amethyst format)', async () => {
            const plaintext = new TextEncoder().encode('Hello, Nostr!');
            const keyBytes = new Uint8Array(32);
            const nonceBytes = new Uint8Array(12);
            crypto.getRandomValues(keyBytes);
            crypto.getRandomValues(nonceBytes);

            const ciphertext = await createTestEncryptedData(plaintext, keyBytes, nonceBytes);

            // Use hex encoding (Amethyst format)
            const keyHex = toHex(keyBytes);
            const nonceHex = toHex(nonceBytes);

            const decrypted = await decryptAesGcmToBytes(ciphertext, keyHex, nonceHex);
            const decryptedText = new TextDecoder().decode(decrypted);

            expect(decryptedText).toBe('Hello, Nostr!');
        });

        it('decrypts with base64url-encoded key and nonce (legacy NoSpeak format)', async () => {
            const plaintext = new TextEncoder().encode('Hello, legacy NoSpeak!');
            const keyBytes = new Uint8Array(32);
            const nonceBytes = new Uint8Array(12);
            crypto.getRandomValues(keyBytes);
            crypto.getRandomValues(nonceBytes);

            const ciphertext = await createTestEncryptedData(plaintext, keyBytes, nonceBytes);

            // Use base64url encoding (legacy NoSpeak format)
            const keyBase64Url = toBase64Url(keyBytes);
            const nonceBase64Url = toBase64Url(nonceBytes);

            const decrypted = await decryptAesGcmToBytes(ciphertext, keyBase64Url, nonceBase64Url);
            const decryptedText = new TextDecoder().decode(decrypted);

            expect(decryptedText).toBe('Hello, legacy NoSpeak!');
        });

        it('decrypts with 16-byte nonce (Amethyst uses 16-byte nonces)', async () => {
            const plaintext = new TextEncoder().encode('Testing 16-byte nonce');
            const keyBytes = new Uint8Array(32);
            const nonceBytes = new Uint8Array(16); // 16-byte nonce like Amethyst
            crypto.getRandomValues(keyBytes);
            crypto.getRandomValues(nonceBytes);

            const ciphertext = await createTestEncryptedData(plaintext, keyBytes, nonceBytes);

            // Use hex encoding
            const keyHex = toHex(keyBytes);
            const nonceHex = toHex(nonceBytes);

            const decrypted = await decryptAesGcmToBytes(ciphertext, keyHex, nonceHex);
            const decryptedText = new TextDecoder().decode(decrypted);

            expect(decryptedText).toBe('Testing 16-byte nonce');
        });

        it('decrypts with AES-128 key (16 bytes)', async () => {
            const plaintext = new TextEncoder().encode('AES-128 test');
            const keyBytes = new Uint8Array(16); // AES-128
            const nonceBytes = new Uint8Array(12);
            crypto.getRandomValues(keyBytes);
            crypto.getRandomValues(nonceBytes);

            // Encrypt with AES-128
            const key = await crypto.subtle.importKey(
                'raw',
                keyBytes.buffer as ArrayBuffer,
                { name: 'AES-GCM', length: 128 },
                false,
                ['encrypt']
            );
            const ciphertext = new Uint8Array(
                await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonceBytes as any }, key, plaintext as any)
            );

            const keyHex = toHex(keyBytes);
            const nonceHex = toHex(nonceBytes);

            const decrypted = await decryptAesGcmToBytes(ciphertext, keyHex, nonceHex);
            const decryptedText = new TextDecoder().decode(decrypted);

            expect(decryptedText).toBe('AES-128 test');
        });

        it('throws error for invalid key size (20 bytes)', async () => {
            const ciphertext = new Uint8Array([1, 2, 3, 4]);
            // 20 bytes = 40 hex chars (invalid - not 16 or 32 bytes)
            const invalidKey = '0102030405060708091011121314151617181920';
            const nonce = '0102030405060708090a0b0c';

            await expect(
                decryptAesGcmToBytes(ciphertext, invalidKey, nonce)
            ).rejects.toThrow('Invalid AES key size: expected 16 or 32 bytes, got 20 bytes');
        });

        it('throws error for invalid key size (8 bytes)', async () => {
            const ciphertext = new Uint8Array([1, 2, 3, 4]);
            // 8 bytes = 16 hex chars (invalid)
            const invalidKey = '0102030405060708';
            const nonce = '0102030405060708090a0b0c';

            await expect(
                decryptAesGcmToBytes(ciphertext, invalidKey, nonce)
            ).rejects.toThrow('Invalid AES key size: expected 16 or 32 bytes, got 8 bytes');
        });

        it('decrypts binary data correctly', async () => {
            const plaintext = new Uint8Array([0, 1, 2, 255, 254, 253, 128, 127]);
            const keyBytes = new Uint8Array(32);
            const nonceBytes = new Uint8Array(12);
            crypto.getRandomValues(keyBytes);
            crypto.getRandomValues(nonceBytes);

            const ciphertext = await createTestEncryptedData(plaintext, keyBytes, nonceBytes);

            const decrypted = await decryptAesGcmToBytes(ciphertext, toHex(keyBytes), toHex(nonceBytes));

            expect(Array.from(decrypted)).toEqual(Array.from(plaintext));
        });

        it('decrypts empty data', async () => {
            const plaintext = new Uint8Array(0);
            const keyBytes = new Uint8Array(32);
            const nonceBytes = new Uint8Array(12);
            crypto.getRandomValues(keyBytes);
            crypto.getRandomValues(nonceBytes);

            const ciphertext = await createTestEncryptedData(plaintext, keyBytes, nonceBytes);

            const decrypted = await decryptAesGcmToBytes(ciphertext, toHex(keyBytes), toHex(nonceBytes));

            expect(decrypted.length).toBe(0);
        });

        it('decrypts with real Amethyst-style data format', async () => {
            // Simulate the exact format from Amethyst: 64-char hex key, 32-char hex nonce
            const plaintext = new TextEncoder().encode('Amethyst compatibility test');
            const keyBytes = new Uint8Array(32);
            const nonceBytes = new Uint8Array(16); // Amethyst uses 16-byte nonces
            crypto.getRandomValues(keyBytes);
            crypto.getRandomValues(nonceBytes);

            const ciphertext = await createTestEncryptedData(plaintext, keyBytes, nonceBytes);

            // Key: 64 hex chars, Nonce: 32 hex chars (like in the bug report)
            const keyHex = toHex(keyBytes);
            const nonceHex = toHex(nonceBytes);

            expect(keyHex.length).toBe(64);
            expect(nonceHex.length).toBe(32);

            const decrypted = await decryptAesGcmToBytes(ciphertext, keyHex, nonceHex);
            const decryptedText = new TextDecoder().decode(decrypted);

            expect(decryptedText).toBe('Amethyst compatibility test');
        });
    });

    describe('encoding detection', () => {
        it('correctly identifies hex vs base64url for 256-bit key', async () => {
            const plaintext = new TextEncoder().encode('test');
            const keyBytes = new Uint8Array(32);
            const nonceBytes = new Uint8Array(12);
            crypto.getRandomValues(keyBytes);
            crypto.getRandomValues(nonceBytes);

            const ciphertext = await createTestEncryptedData(plaintext, keyBytes, nonceBytes);

            // Hex: 64 chars
            const keyHex = toHex(keyBytes);
            expect(keyHex.length).toBe(64);

            // Base64url: ~43 chars
            const keyBase64Url = toBase64Url(keyBytes);
            expect(keyBase64Url.length).toBe(43);

            // Both should decrypt correctly
            const decrypted1 = await decryptAesGcmToBytes(ciphertext, keyHex, toHex(nonceBytes));
            const decrypted2 = await decryptAesGcmToBytes(ciphertext, keyBase64Url, toBase64Url(nonceBytes));

            expect(new TextDecoder().decode(decrypted1)).toBe('test');
            expect(new TextDecoder().decode(decrypted2)).toBe('test');
        });
    });

    describe('encryptFileWithAesGcm output format', () => {
        // Mock File for Node.js environment
        class MockFile {
            private content: Uint8Array;
            name: string;
            type: string;

            constructor(content: Uint8Array | string, name: string, options?: { type?: string }) {
                this.content = typeof content === 'string' 
                    ? new TextEncoder().encode(content) 
                    : content;
                this.name = name;
                this.type = options?.type ?? 'application/octet-stream';
            }

            async arrayBuffer(): Promise<ArrayBuffer> {
                return this.content.buffer.slice(
                    this.content.byteOffset,
                    this.content.byteOffset + this.content.byteLength
                ) as ArrayBuffer;
            }
        }

        it('outputs hex-encoded key (64 chars) and nonce (32 chars) for Amethyst compatibility', async () => {
            const file = new MockFile('test content', 'test.txt', { type: 'text/plain' });
            const result = await encryptFileWithAesGcm(file as unknown as File);

            // Key: 64 hex chars (32 bytes = 256 bits)
            expect(result.key).toMatch(/^[0-9a-f]{64}$/);
            expect(result.key.length).toBe(64);

            // Nonce: 32 hex chars (16 bytes) - Amethyst format
            expect(result.nonce).toMatch(/^[0-9a-f]{32}$/);
            expect(result.nonce.length).toBe(32);

            // Hashes should also be hex
            expect(result.hashEncrypted).toMatch(/^[0-9a-f]{64}$/);
            expect(result.hashPlain).toMatch(/^[0-9a-f]{64}$/);
        });

        it('produces ciphertext that can be decrypted with the output key and nonce', async () => {
            const originalContent = 'Hello, Amethyst!';
            const file = new MockFile(originalContent, 'test.txt', { type: 'text/plain' });
            const result = await encryptFileWithAesGcm(file as unknown as File);

            // Decrypt using the hex-encoded key and nonce from encryption
            const decrypted = await decryptAesGcmToBytes(result.ciphertext, result.key, result.nonce);
            const decryptedText = new TextDecoder().decode(decrypted);

            expect(decryptedText).toBe(originalContent);
        });

        it('ciphertext size includes 16-byte auth tag', async () => {
            const content = 'test content';
            const file = new MockFile(content, 'test.txt', { type: 'text/plain' });
            const result = await encryptFileWithAesGcm(file as unknown as File);

            // AES-GCM adds a 16-byte authentication tag
            expect(result.size).toBe(content.length + 16);
            expect(result.ciphertext.length).toBe(content.length + 16);
        });
    });
});
