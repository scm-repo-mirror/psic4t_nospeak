import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { isAndroidCapacitorShell } from './platform';
import { tapSoundClick } from './tapSound';

function callHapticsSafely(invoke: () => Promise<void> | void): void {
    if (!isAndroidCapacitorShell()) {
        return;
    }

    try {
        const result = invoke();

        if (result && typeof (result as Promise<void>).catch === 'function') {
            (result as Promise<void>).catch(() => {
                // Swallow plugin errors to keep haptics non-blocking
            });
        }
    } catch {
        // Ignore synchronous errors from the haptics plugin
    }
}

export function hapticLightImpact(): void {
    callHapticsSafely(() => Haptics.impact({ style: ImpactStyle.Light }));
}

export function hapticSelection(): void {
    callHapticsSafely(() => {
        tapSoundClick();
        return Haptics.selectionChanged();
    });
}
