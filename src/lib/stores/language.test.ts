import { describe, it, expect, vi } from 'vitest';
import { get } from 'svelte/store';
import { language, initLanguage, setLanguage } from '$lib/stores/language';

const STORAGE_KEY = 'nospeak-language';

describe('language store', () => {
    it('persists language selection via setLanguage', () => {
        const originalLocalStorage = (globalThis as any).localStorage;
        const mockLocalStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn()
        } as any;

        (globalThis as any).localStorage = mockLocalStorage;

        try {
            setLanguage('de');

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, 'de');
            expect(get(language)).toBe('de');
        } finally {
            (globalThis as any).localStorage = originalLocalStorage;
        }
    });

    it('uses stored language when initializing', () => {
        const originalLocalStorage = (globalThis as any).localStorage;
        const mockLocalStorage = {
            getItem: vi.fn().mockReturnValue('de'),
            setItem: vi.fn(),
            removeItem: vi.fn()
        } as any;

        (globalThis as any).localStorage = mockLocalStorage;

        try {
            initLanguage();

            expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
            expect(get(language)).toBe('de');
        } finally {
            (globalThis as any).localStorage = originalLocalStorage;
        }
    });
});
