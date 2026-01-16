import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core';

export async function configureAndroidStatusBar(): Promise<void> {
    // Edge-to-edge is now automatic in Android 15+ / Capacitor 8
    // No configuration needed on startup
}

export async function syncAndroidStatusBarTheme(isDark: boolean): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
            await SystemBars.setStyle({
                style: isDark ? SystemBarsStyle.Dark : SystemBarsStyle.Light
            });
        }
    } catch (error) {
        console.warn('Failed to sync Android system bars theme', error);
    }
}
