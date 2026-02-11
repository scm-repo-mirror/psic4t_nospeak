import { createHash } from 'crypto';
import type { RequestEvent } from '@sveltejs/kit';

export interface MetricsSnapshot {
    uptime_seconds: number;
    total_requests: number;
    unique_visitors_today: number;
    requests_by_path: Record<string, number>;
}

const EXCLUDED_PATHS = new Set(['/api/health', '/api/metrics']);

const serverStartedAt = Date.now();

let totalRequests = 0;
let uniqueVisitors = new Set<string>();
let requestsByPath = new Map<string, number>();
let currentDay = getCurrentDay();

function getCurrentDay(): string {
    return new Date().toISOString().slice(0, 10);
}

function resetDailyIfNeeded(): void {
    const today = getCurrentDay();
    if (today !== currentDay) {
        uniqueVisitors = new Set<string>();
        currentDay = today;
    }
}

function hashIp(ip: string): string {
    return createHash('sha256').update(ip).digest('hex');
}

function normalizePath(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return '/';
    }

    if (segments[0] === 'api' && segments.length >= 2) {
        return `/${segments[0]}/${segments[1]}`;
    }

    return `/${segments[0]}`;
}

export function recordRequest(event: RequestEvent): void {
    const pathname = event.url.pathname;
    const normalized = normalizePath(pathname);

    if (EXCLUDED_PATHS.has(normalized)) {
        return;
    }

    resetDailyIfNeeded();

    totalRequests++;

    const ip = event.getClientAddress();
    uniqueVisitors.add(hashIp(ip));

    const count = requestsByPath.get(normalized) ?? 0;
    requestsByPath.set(normalized, count + 1);
}

export function getMetrics(): MetricsSnapshot {
    resetDailyIfNeeded();

    const pathEntries: Record<string, number> = {};
    for (const [path, count] of requestsByPath) {
        pathEntries[path] = count;
    }

    return {
        uptime_seconds: Math.floor((Date.now() - serverStartedAt) / 1000),
        total_requests: totalRequests,
        unique_visitors_today: uniqueVisitors.size,
        requests_by_path: pathEntries
    };
}
