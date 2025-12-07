import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: () => false,
        getPlatform: () => 'web'
    }
}));

vi.mock('@capacitor/dialog', () => ({
    Dialog: {
        alert: vi.fn(),
        confirm: vi.fn().mockResolvedValue({ value: true })
    }
}));

vi.mock('@capacitor/share', () => ({
    Share: {
        share: vi.fn().mockResolvedValue(undefined)
    }
}));

describe('nativeDialogService web fallbacks', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('falls back to window.alert when not on Android', async () => {
        const alertSpy = vi.fn();

        (globalThis as any).window = {
            alert: alertSpy,
            confirm: vi.fn()
        } as any;

        const module = await import('./NativeDialogs');
        await module.nativeDialogService.alert({ message: 'Test error' });

        expect(alertSpy).toHaveBeenCalledWith('Test error');
    });

    it('falls back to window.confirm when not on Android', async () => {
        const confirmSpy = vi.fn().mockReturnValue(true);

        (globalThis as any).window = {
            alert: vi.fn(),
            confirm: confirmSpy
        } as any;

        const module = await import('./NativeDialogs');
        const result = await module.nativeDialogService.confirm({ message: 'Are you sure?' });

        expect(confirmSpy).toHaveBeenCalledWith('Are you sure?');
        expect(result).toBe(true);
    });
});
