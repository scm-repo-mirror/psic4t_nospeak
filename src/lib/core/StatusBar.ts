import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

export async function configureAndroidStatusBar(): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
            await StatusBar.setOverlaysWebView({ overlay: true });
        }
    } catch (error) {
        console.warn('Failed to configure Android status bar', error);
    }
}

export async function syncAndroidStatusBarTheme(isDark: boolean): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
            // Status bar is transparent (overlay mode), only set icon style
            await StatusBar.setStyle({
                style: isDark ? Style.Dark : Style.Light
            });
        }
    } catch (error) {
        console.warn('Failed to sync Android status bar theme', error);
    }
}
