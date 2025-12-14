export function isAndroidCapacitorShell(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }

    const w = window as unknown as { Capacitor?: { getPlatform?: () => string } };

    if (w.Capacitor && typeof w.Capacitor.getPlatform === 'function') {
        try {
            return w.Capacitor.getPlatform() === 'android';
        } catch {
            return false;
        }
    }

    return false;
}
