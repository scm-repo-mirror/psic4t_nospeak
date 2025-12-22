import { getWebAppBaseUrl } from '$lib/core/runtimeConfig';
import { isAndroidCapacitorShell } from '$lib/utils/platform';

function getServerBaseUrl(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return getWebAppBaseUrl().replace(/\/$/, '');
}

export function getUrlPreviewApiUrl(targetUrl: string): string {
    const encodedTarget = encodeURIComponent(targetUrl);

    // Server-side or standard web browser: use same-origin relative path
    if (!isAndroidCapacitorShell()) {
        return `/api/url-preview?url=${encodedTarget}`;
    }

    // Android Capacitor shell: call remote preview API on nospeak.chat (or configured base)
    const base = getServerBaseUrl();

    if (!base) {
        // Fallback to relative path; preview may fail but messaging still works
        return `/api/url-preview?url=${encodedTarget}`;
    }

    return `${base}/api/url-preview?url=${encodedTarget}`;
}
