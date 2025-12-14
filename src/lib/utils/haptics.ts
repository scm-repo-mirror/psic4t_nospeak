import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { isAndroidCapacitorShell } from './platform';

export function softVibrate(): void {
    if (!isAndroidCapacitorShell()) {
        return;
    }

    try {
        const result = Haptics.impact({
            style: ImpactStyle.Light
        });

        if (result && typeof (result as Promise<void>).catch === 'function') {
            (result as Promise<void>).catch(() => {
                // Swallow plugin errors to keep haptics non-blocking
            });
        }
    } catch {
        // Ignore synchronous errors from the haptics plugin
    }
}
