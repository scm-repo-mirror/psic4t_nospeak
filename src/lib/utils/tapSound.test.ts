import { describe, it, expect, vi, beforeEach } from 'vitest';

const { tapMock } = vi.hoisted(() => ({
    tapMock: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('$lib/core/AndroidTapSound', () => ({
    AndroidTapSound: {
        tap: tapMock
    }
}));

import { tapSoundClick } from './tapSound';

describe('tapSoundClick', () => {
    const originalWindow = globalThis.window;

    beforeEach(() => {
        tapMock.mockClear();

        if (originalWindow) {
            globalThis.window = originalWindow;
        }

        if (typeof window !== 'undefined') {
            (window as unknown as { Capacitor?: unknown }).Capacitor = undefined;
        }
    });

    it('no-ops when not in Android Capacitor shell', () => {
        if (typeof window === 'undefined') {
            return;
        }

        expect(() => tapSoundClick()).not.toThrow();
        expect(tapMock).not.toHaveBeenCalled();
    });

    it('invokes AndroidTapSound.tap in Android Capacitor shell', () => {
        if (typeof window === 'undefined') {
            return;
        }

        (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor = {
            getPlatform: () => 'android'
        };

        expect(() => tapSoundClick()).not.toThrow();
        expect(tapMock).toHaveBeenCalled();
    });

    it('swallows errors from tap sound calls', () => {
        if (typeof window === 'undefined') {
            return;
        }

        (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor = {
            getPlatform: () => 'android'
        };

        tapMock.mockRejectedValueOnce(new Error('tap sound failed'));

        expect(() => tapSoundClick()).not.toThrow();
    });
});
