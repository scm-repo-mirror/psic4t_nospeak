export function clamp01(value: number): number {
    if (!isFinite(value)) {
        return 0;
    }
    return Math.min(1, Math.max(0, value));
}

export function downsamplePeaks(peaks: number[], targetCount: number): number[] {
    if (targetCount <= 0) {
        return [];
    }

    if (peaks.length === 0) {
        return [];
    }

    if (peaks.length === targetCount) {
        return peaks.map(clamp01);
    }

    const bucketSize = peaks.length / targetCount;
    const result: number[] = [];

    for (let i = 0; i < targetCount; i++) {
        const start = Math.floor(i * bucketSize);
        const end = Math.min(peaks.length, Math.floor((i + 1) * bucketSize));

        let max = 0;
        for (let j = start; j < end; j++) {
            max = Math.max(max, peaks[j] ?? 0);
        }

        result.push(clamp01(max));
    }

    return result;
}

export function computePeaksFromAudioBuffer(buffer: AudioBuffer, targetCount: number): number[] {
    const channelCount = Math.max(1, buffer.numberOfChannels);
    const totalSamples = buffer.length;

    if (targetCount <= 0 || totalSamples <= 0) {
        return [];
    }

    const samplesPerBar = Math.max(1, Math.floor(totalSamples / targetCount));
    const peaks: number[] = [];

    for (let i = 0; i < targetCount; i++) {
        const start = i * samplesPerBar;
        const end = Math.min(totalSamples, start + samplesPerBar);

        let max = 0;
        for (let c = 0; c < channelCount; c++) {
            const data = buffer.getChannelData(c);
            for (let s = start; s < end; s++) {
                max = Math.max(max, Math.abs(data[s] ?? 0));
            }
        }

        // Slightly lift small peaks so silence still renders.
        const lifted = Math.min(1, 0.08 + max * 1.15);
        peaks.push(clamp01(lifted));
    }

    return peaks;
}

export function buildFallbackPeaks(seed: string, targetCount: number): number[] {
    if (targetCount <= 0) {
        return [];
    }

    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }

    let x = hash >>> 0;
    const peaks: number[] = [];
    for (let i = 0; i < targetCount; i++) {
        // xorshift32
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        const r = (x >>> 0) / 0xffffffff;
        peaks.push(0.15 + r * 0.75);
    }

    // light smoothing pass
    const smoothed: number[] = [];
    for (let i = 0; i < targetCount; i++) {
        const prev = peaks[Math.max(0, i - 1)] ?? 0;
        const cur = peaks[i] ?? 0;
        const next = peaks[Math.min(targetCount - 1, i + 1)] ?? 0;
        smoothed.push(clamp01((prev + cur + next) / 3));
    }

    return smoothed;
}
