import { get, writable, type Writable } from 'svelte/store';

import { DEFAULT_RUNTIME_CONFIG } from './defaults';
import type { RuntimeConfig } from './types';

const runtimeConfig: Writable<RuntimeConfig> = writable(DEFAULT_RUNTIME_CONFIG);

function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

function normalizeHttpsOrigin(value: string): string | null {
    try {
        const trimmed = value.trim();
        if (!trimmed) {
            return null;
        }

        const url = new URL(trimmed);
        if (url.protocol !== 'https:') {
            return null;
        }

        return url.origin;
    } catch {
        return null;
    }
}

function isRuntimeConfig(value: unknown): value is RuntimeConfig {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Partial<RuntimeConfig>;

    return (
        Array.isArray(candidate.discoveryRelays) &&
        Array.isArray(candidate.defaultMessagingRelays) &&
        Array.isArray(candidate.defaultBlossomServers) &&
        isNonEmptyString(candidate.searchRelayUrl) &&
        isNonEmptyString(candidate.blasterRelayUrl) &&
        isNonEmptyString(candidate.webAppBaseUrl)
    );
}

export async function initRuntimeConfig(fetchImpl: typeof fetch = fetch): Promise<void> {
    if (typeof window === 'undefined') {
        return;
    }

    // Preserve existing Android/static build-time configuration when present.
    try {
        const envBase = (import.meta.env.PUBLIC_WEB_APP_BASE_URL as string | undefined) ?? '';
        const normalized = envBase ? normalizeHttpsOrigin(envBase) : null;
        if (normalized) {
            runtimeConfig.update((current) => ({
                ...current,
                webAppBaseUrl: normalized
            }));
        }
    } catch {
        // ignore
    }

    try {
        const response = await fetchImpl('/api/runtime-config', {
            headers: {
                accept: 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Runtime config fetch failed: ${response.status}`);
        }

        const json = (await response.json()) as unknown;

        if (!isRuntimeConfig(json)) {
            throw new Error('Runtime config response invalid');
        }

        // Normalize https origins in case server format changes.
        const normalizedWebBase = normalizeHttpsOrigin(json.webAppBaseUrl) ?? DEFAULT_RUNTIME_CONFIG.webAppBaseUrl;

        runtimeConfig.set({
            ...json,
            webAppBaseUrl: normalizedWebBase
        });
    } catch (e) {
        console.warn('Failed to initialize runtime config; using defaults', e);
    }
}

export function getRuntimeConfigSnapshot(): RuntimeConfig {
    return get(runtimeConfig);
}

export function getDiscoveryRelays(): string[] {
    return getRuntimeConfigSnapshot().discoveryRelays;
}

export function getDefaultMessagingRelays(): string[] {
    return getRuntimeConfigSnapshot().defaultMessagingRelays;
}

export function getSearchRelayUrl(): string {
    return getRuntimeConfigSnapshot().searchRelayUrl;
}

export function getBlasterRelayUrl(): string {
    return getRuntimeConfigSnapshot().blasterRelayUrl;
}

export function getDefaultBlossomServers(): string[] {
    return getRuntimeConfigSnapshot().defaultBlossomServers;
}

export function getWebAppBaseUrl(): string {
    return getRuntimeConfigSnapshot().webAppBaseUrl;
}

export { runtimeConfig };
