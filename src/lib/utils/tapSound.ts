import { AndroidTapSound } from '$lib/core/AndroidTapSound';

import { isAndroidCapacitorShell } from './platform';

function callTapSoundSafely(): void {
    if (!isAndroidCapacitorShell()) {
        return;
    }

    const plugin = AndroidTapSound as unknown as { tap?: () => Promise<void> } | null;
    if (!plugin || typeof plugin.tap !== 'function') {
        return;
    }

    try {
        const result = plugin.tap();

        if (result && typeof (result as Promise<void>).catch === 'function') {
            (result as Promise<void>).catch(() => {
                // Swallow plugin errors to keep tap sounds non-blocking
            });
        }
    } catch {
        // Ignore synchronous errors from the plugin
    }
}

export function tapSoundClick(): void {
    callTapSoundSafely();
}
