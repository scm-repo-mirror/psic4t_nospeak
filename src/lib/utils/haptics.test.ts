import { describe, it, expect, vi, beforeEach } from 'vitest';

const { impactMock, selectionChangedMock, tapSoundClickMock } = vi.hoisted(() => ({
    impactMock: vi.fn().mockResolvedValue(undefined),
    selectionChangedMock: vi.fn().mockResolvedValue(undefined),
    tapSoundClickMock: vi.fn()
}));

vi.mock('@capacitor/haptics', () => ({
    Haptics: {
        impact: impactMock,
        selectionChanged: selectionChangedMock
    },
    ImpactStyle: {
        Light: 'light'
    }
}));

vi.mock('./tapSound', () => ({
    tapSoundClick: tapSoundClickMock
}));

import { hapticLightImpact, hapticSelection } from './haptics';

describe('hapticLightImpact', () => {
    const originalWindow = globalThis.window;

    beforeEach(() => {
        impactMock.mockClear();

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

        (window as unknown as { Capacitor?: unknown }).Capacitor = undefined;

        expect(() => hapticLightImpact()).not.toThrow();
        expect(impactMock).not.toHaveBeenCalled();
    });

    it('invokes Capacitor Haptics impact in Android Capacitor shell', () => {
        if (typeof window === 'undefined') {
            return;
        }

        (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor = {
            getPlatform: () => 'android'
        };

        expect(() => hapticLightImpact()).not.toThrow();
        expect(impactMock).toHaveBeenCalledWith({ style: 'light' });
    });

    it('swallows errors from impact calls', () => {
        if (typeof window === 'undefined') {
            return;
        }

        (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor = {
            getPlatform: () => 'android'
        };

        impactMock.mockRejectedValueOnce(new Error('haptics failed'));

        expect(() => hapticLightImpact()).not.toThrow();
    });
});

describe('hapticSelection', () => {
    const originalWindow = globalThis.window;

    beforeEach(() => {
        selectionChangedMock.mockClear();
        tapSoundClickMock.mockClear();

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

        expect(() => hapticSelection()).not.toThrow();
        expect(tapSoundClickMock).not.toHaveBeenCalled();
        expect(selectionChangedMock).not.toHaveBeenCalled();
    });

    it('invokes Capacitor Haptics selectionChanged in Android Capacitor shell', () => {
        if (typeof window === 'undefined') {
            return;
        }

        (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor = {
            getPlatform: () => 'android'
        };

        expect(() => hapticSelection()).not.toThrow();
        expect(tapSoundClickMock).toHaveBeenCalled();
        expect(selectionChangedMock).toHaveBeenCalled();
    });

    it('swallows errors from selection calls', () => {
        if (typeof window === 'undefined') {
            return;
        }

        (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor = {
            getPlatform: () => 'android'
        };

        selectionChangedMock.mockRejectedValueOnce(new Error('haptics failed'));

        expect(() => hapticSelection()).not.toThrow();
        expect(tapSoundClickMock).toHaveBeenCalled();
    });
});
