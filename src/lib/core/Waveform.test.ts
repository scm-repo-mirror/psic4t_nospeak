import { describe, expect, it } from 'vitest';

import { buildFallbackPeaks, clamp01, downsamplePeaks } from './Waveform';

describe('Waveform', () => {
    it('clamp01 clamps values', () => {
        expect(clamp01(-1)).toBe(0);
        expect(clamp01(0.5)).toBe(0.5);
        expect(clamp01(2)).toBe(1);
    });

    it('downsamplePeaks returns max per bucket', () => {
        const peaks = [0.1, 0.9, 0.2, 0.3];
        expect(downsamplePeaks(peaks, 2)).toEqual([0.9, 0.3]);
    });

    it('buildFallbackPeaks is deterministic', () => {
        const a = buildFallbackPeaks('seed', 5);
        const b = buildFallbackPeaks('seed', 5);
        const c = buildFallbackPeaks('seed2', 5);

        expect(a).toEqual(b);
        expect(a).not.toEqual(c);
        expect(a).toHaveLength(5);
    });
});
