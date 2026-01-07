import { describe, expect, it } from 'vitest';

import {
    formatDurationMs,
    isVoiceDurationExceeded,
    pickSupportedOpusMimeType,
    VOICE_MESSAGE_MAX_DURATION_MS
} from './VoiceRecorder';

describe('VoiceRecorder', () => {
    it('pickSupportedOpusMimeType chooses first supported candidate', () => {
        const supported = new Set(['audio/ogg;codecs=opus']);
        const picked = pickSupportedOpusMimeType({
            isTypeSupported: (mimeType) => supported.has(mimeType)
        });

        expect(picked).toBe('audio/ogg;codecs=opus');
    });

    it('pickSupportedOpusMimeType returns null when none supported', () => {
        const picked = pickSupportedOpusMimeType({
            isTypeSupported: () => false
        });

        expect(picked).toBeNull();
    });

    it('formatDurationMs formats mm:ss', () => {
        expect(formatDurationMs(0)).toBe('0:00');
        expect(formatDurationMs(999)).toBe('0:00');
        expect(formatDurationMs(1_000)).toBe('0:01');
        expect(formatDurationMs(61_000)).toBe('1:01');
        expect(formatDurationMs(3 * 60 * 1000)).toBe('3:00');
    });

    it('isVoiceDurationExceeded enforces max duration', () => {
        expect(isVoiceDurationExceeded(VOICE_MESSAGE_MAX_DURATION_MS - 1)).toBe(false);
        expect(isVoiceDurationExceeded(VOICE_MESSAGE_MAX_DURATION_MS)).toBe(true);
        expect(isVoiceDurationExceeded(VOICE_MESSAGE_MAX_DURATION_MS + 1)).toBe(true);
    });
});
