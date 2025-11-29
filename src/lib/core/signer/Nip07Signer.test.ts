import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Nip07Signer } from './Nip07Signer';

// Mock window.nostr
const mockGetPublicKey = vi.fn();
const mockSignEvent = vi.fn();
const mockEncrypt = vi.fn();
const mockDecrypt = vi.fn();

Object.defineProperty(window, 'nostr', {
    value: {
        getPublicKey: mockGetPublicKey,
        signEvent: mockSignEvent,
        nip44: {
            encrypt: mockEncrypt,
            decrypt: mockDecrypt
        }
    },
    writable: true
});

describe('Nip07Signer', () => {
    let signer: Nip07Signer;

    beforeEach(() => {
        vi.clearAllMocks();
        // Clear static cache between tests
        Nip07Signer.clearCache();
        signer = new Nip07Signer();
        
        // Setup default mock returns
        mockGetPublicKey.mockResolvedValue('test-pubkey');
        mockEncrypt.mockResolvedValue('encrypted-result');
        mockDecrypt.mockResolvedValue('decrypted-result');
    });

    it('should cache public key to prevent multiple calls', async () => {
        const pubkey = 'test-pubkey';
        mockGetPublicKey.mockResolvedValue(pubkey);

        // First call should make the request
        const result1 = await signer.getPublicKey();
        expect(result1).toBe(pubkey);
        expect(mockGetPublicKey).toHaveBeenCalledTimes(1);

        // Second call should use cache
        const result2 = await signer.getPublicKey();
        expect(result2).toBe(pubkey);
        expect(mockGetPublicKey).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('should handle concurrent calls without multiple requests', async () => {
        const pubkey = 'test-pubkey';
        mockGetPublicKey.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve(pubkey), 100))
        );

        // Make multiple concurrent calls
        const [result1, result2, result3] = await Promise.all([
            signer.getPublicKey(),
            signer.getPublicKey(),
            signer.getPublicKey()
        ]);

        expect(result1).toBe(pubkey);
        expect(result2).toBe(pubkey);
        expect(result3).toBe(pubkey);
        expect(mockGetPublicKey).toHaveBeenCalledTimes(1); // Only called once
    });

    it('should cache encryption to prevent multiple extension prompts', async () => {
        const recipient = 'test-recipient';
        const message = 'test-message';
        
        // First call should make the request
        const result1 = await signer.encrypt(recipient, message);
        expect(result1).toBe('encrypted-result');
        expect(mockEncrypt).toHaveBeenCalledTimes(1);

        // Second call with same params should use cache
        const result2 = await signer.encrypt(recipient, message);
        expect(result2).toBe('encrypted-result');
        expect(mockEncrypt).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('should cache decryption to prevent multiple extension prompts', async () => {
        const sender = 'test-sender';
        const ciphertext = 'test-ciphertext';
        
        // First call should make the request
        const result1 = await signer.decrypt(sender, ciphertext);
        expect(result1).toBe('decrypted-result');
        expect(mockDecrypt).toHaveBeenCalledTimes(1);

        // Second call with same params should use cache
        const result2 = await signer.decrypt(sender, ciphertext);
        expect(result2).toBe('decrypted-result');
        expect(mockDecrypt).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('should handle concurrent encryption calls without multiple requests', async () => {
        const recipient = 'test-recipient';
        const message = 'test-message';
        
        mockEncrypt.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve('encrypted-result'), 100))
        );

        // Make multiple concurrent encryption calls
        const [result1, result2, result3] = await Promise.all([
            signer.encrypt(recipient, message),
            signer.encrypt(recipient, message),
            signer.encrypt(recipient, message)
        ]);

        expect(result1).toBe('encrypted-result');
        expect(result2).toBe('encrypted-result');
        expect(result3).toBe('encrypted-result');
        expect(mockEncrypt).toHaveBeenCalledTimes(1); // Only called once
    });

    it('should request NIP-44 permissions by performing encrypt/decrypt cycle', async () => {
        const pubkey = 'test-pubkey';
        mockGetPublicKey.mockResolvedValue(pubkey);
        mockEncrypt.mockResolvedValue('ciphertext');
        mockDecrypt.mockResolvedValue('plaintext');

        await signer.requestNip44Permissions();

        // Should fetch pubkey
        expect(mockGetPublicKey).toHaveBeenCalled();
        
        // Should call encrypt with pubkey and a check message
        expect(mockEncrypt).toHaveBeenCalledWith(pubkey, expect.any(String));
        
        // Should call decrypt with pubkey and the result of encrypt
        expect(mockDecrypt).toHaveBeenCalledWith(pubkey, 'ciphertext');
    });
    
});