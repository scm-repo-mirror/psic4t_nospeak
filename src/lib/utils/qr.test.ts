import { describe, it, expect } from 'vitest';

import { parseNpubFromQrPayload } from './qr';

describe('parseNpubFromQrPayload', () => {
    it('extracts npub from nostr:npub URI', () => {
        const result = parseNpubFromQrPayload('nostr:npub1example');
        expect(result).toBe('npub1example');
    });

    it('handles mixed-case nostr prefix and whitespace', () => {
        const result = parseNpubFromQrPayload('  Nostr:npub1mixedcase ');
        expect(result).toBe('npub1mixedcase');
    });

    it('returns npub when payload is bare npub', () => {
        const result = parseNpubFromQrPayload('npub1barevalue');
        expect(result).toBe('npub1barevalue');
    });

    it('returns null for non-npub nostr URIs', () => {
        const result = parseNpubFromQrPayload('nostr:nprofile1something');
        expect(result).toBeNull();
    });

    it('returns null for unrelated payloads', () => {
        expect(parseNpubFromQrPayload('http://example.com')).toBeNull();
        expect(parseNpubFromQrPayload('')).toBeNull();
    });
});
