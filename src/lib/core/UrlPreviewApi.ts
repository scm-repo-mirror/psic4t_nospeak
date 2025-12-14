const DEFAULT_SERVER_BASE_URL = 'https://nospeak.chat';

function getServerBaseUrl(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const envBase = import.meta.env.PUBLIC_WEB_APP_BASE_URL as string | undefined;
    const trimmedEnvBase = envBase ? envBase.trim() : '';

    if (trimmedEnvBase) {
        return trimmedEnvBase.replace(/\/$/, '');
    }

    return DEFAULT_SERVER_BASE_URL;
}

import { isAndroidCapacitorShell } from '$lib/utils/platform';

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
