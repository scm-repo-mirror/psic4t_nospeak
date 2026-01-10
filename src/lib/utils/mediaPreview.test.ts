import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the i18n module
vi.mock('$lib/i18n', () => ({
    t: {
        subscribe: vi.fn((fn) => {
            fn((key: string) => {
                const translations: Record<string, string> = {
                    'contacts.mediaPreview.voiceMessage': 'Voice Message',
                    'contacts.mediaPreview.image': 'Image',
                    'contacts.mediaPreview.video': 'Video',
                    'contacts.mediaPreview.audio': 'Audio',
                    'contacts.mediaPreview.file': 'File'
                };
                return translations[key] || key;
            });
            return () => {};
        })
    }
}));

import { getMediaPreviewLabel } from './mediaPreview';

describe('getMediaPreviewLabel', () => {
    it('returns voice message label for audio/webm', () => {
        expect(getMediaPreviewLabel('audio/webm')).toBe('🎤 Voice Message');
    });

    it('returns voice message label for audio/ogg', () => {
        expect(getMediaPreviewLabel('audio/ogg')).toBe('🎤 Voice Message');
    });

    it('returns voice message label for audio/mp4 (m4a)', () => {
        expect(getMediaPreviewLabel('audio/mp4')).toBe('🎤 Voice Message');
    });

    it('returns voice message label for audio/x-m4a', () => {
        expect(getMediaPreviewLabel('audio/x-m4a')).toBe('🎤 Voice Message');
    });

    it('returns voice message label for codecs containing opus', () => {
        expect(getMediaPreviewLabel('audio/ogg; codecs=opus')).toBe('🎤 Voice Message');
    });

    it('returns image label for image/* types', () => {
        expect(getMediaPreviewLabel('image/jpeg')).toBe('📷 Image');
        expect(getMediaPreviewLabel('image/png')).toBe('📷 Image');
        expect(getMediaPreviewLabel('image/gif')).toBe('📷 Image');
        expect(getMediaPreviewLabel('image/webp')).toBe('📷 Image');
    });

    it('returns video label for video/* types', () => {
        expect(getMediaPreviewLabel('video/mp4')).toBe('🎬 Video');
        expect(getMediaPreviewLabel('video/webm')).toBe('🎬 Video');
        expect(getMediaPreviewLabel('video/quicktime')).toBe('🎬 Video');
    });

    it('returns audio label for other audio/* types (music)', () => {
        expect(getMediaPreviewLabel('audio/mpeg')).toBe('🎵 Audio');
        expect(getMediaPreviewLabel('audio/mp3')).toBe('🎵 Audio');
        expect(getMediaPreviewLabel('audio/wav')).toBe('🎵 Audio');
    });

    it('returns file label for unknown types', () => {
        expect(getMediaPreviewLabel('application/pdf')).toBe('📎 File');
        expect(getMediaPreviewLabel('application/zip')).toBe('📎 File');
        expect(getMediaPreviewLabel('text/plain')).toBe('📎 File');
    });
});
