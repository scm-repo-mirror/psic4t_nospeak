import { describe, it, expect } from 'vitest';
import { extractYouTubeVideoId, isYouTubeUrl } from './YouTube';

describe('YouTube URL parsing', () => {
    it('extracts from youtu.be short links', () => {
        expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        expect(extractYouTubeVideoId('https://youtu.be/dQw4w9WgXcQ?t=42')).toBe('dQw4w9WgXcQ');
    });

    it('extracts from youtube watch links', () => {
        expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        expect(extractYouTubeVideoId('https://m.youtube.com/watch?v=dQw4w9WgXcQ&feature=youtu.be')).toBe('dQw4w9WgXcQ');
    });

    it('extracts from youtube shorts links', () => {
        expect(extractYouTubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        expect(extractYouTubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ?feature=share')).toBe('dQw4w9WgXcQ');
    });

    it('extracts from youtube embed links', () => {
        expect(extractYouTubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    it('rejects non-youtube hosts and invalid IDs', () => {
        expect(extractYouTubeVideoId('https://example.com/watch?v=dQw4w9WgXcQ')).toBeNull();
        expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=not-an-id')).toBeNull();
        expect(extractYouTubeVideoId('not a url')).toBeNull();
    });

    it('isYouTubeUrl reflects extractability', () => {
        expect(isYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
        expect(isYouTubeUrl('https://example.com')).toBe(false);
    });
});
