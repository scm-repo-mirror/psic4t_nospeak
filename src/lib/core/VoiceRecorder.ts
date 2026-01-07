export const VOICE_MESSAGE_MAX_DURATION_MS = 3 * 60 * 1000;

export const PREFERRED_OPUS_MIME_TYPES = [
    'audio/webm;codecs=opus',
    'audio/ogg;codecs=opus',
    'audio/webm'
] as const;

export function pickSupportedOpusMimeType(params: {
    isTypeSupported: (mimeType: string) => boolean;
    candidates?: readonly string[];
}): string | null {
    const candidates = params.candidates ?? PREFERRED_OPUS_MIME_TYPES;
    for (const candidate of candidates) {
        if (params.isTypeSupported(candidate)) {
            return candidate;
        }
    }
    return null;
}

export function getSupportedOpusMimeType(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const mediaRecorder = (window as any).MediaRecorder as typeof MediaRecorder | undefined;
    if (!mediaRecorder || typeof mediaRecorder.isTypeSupported !== 'function') {
        return null;
    }

    return pickSupportedOpusMimeType({
        isTypeSupported: (mimeType) => mediaRecorder.isTypeSupported(mimeType)
    });
}

export function isVoiceRecordingSupported(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    const hasGetUserMedia =
        typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function';

    if (!hasGetUserMedia) {
        return false;
    }

    return getSupportedOpusMimeType() !== null;
}

export function isVoiceDurationExceeded(elapsedMs: number, maxMs: number = VOICE_MESSAGE_MAX_DURATION_MS): boolean {
    return elapsedMs >= maxMs;
}

export function formatDurationMs(ms: number): string {
    if (!isFinite(ms) || ms <= 0) {
        return '0:00';
    }

    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const padded = secs < 10 ? `0${secs}` : `${secs}`;
    return `${mins}:${padded}`;
}
