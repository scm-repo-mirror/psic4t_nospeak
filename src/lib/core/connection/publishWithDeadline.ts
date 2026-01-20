import type { NostrEvent } from 'nostr-tools';

export interface RelayPublisher {
    publish(event: NostrEvent): Promise<unknown>;
    auth?: (signAuthEvent: (evt: any) => Promise<any>) => Promise<unknown>;
    onauth?: ((evt: any) => Promise<any>) | undefined;
}

export interface RelayHealthSnapshot {
    relay: RelayPublisher | null;
    isConnected: boolean;
}

export interface ConnectionManagerSnapshot {
    getRelayHealth(url: string): RelayHealthSnapshot | undefined;
    markRelayAuthRequired?(url: string): void;
    authenticateRelay?(url: string): Promise<boolean>;
}

export interface PublishWithDeadlineOptions {
    connectionManager: ConnectionManagerSnapshot;
    event: NostrEvent;
    relayUrls: string[];
    deadlineMs: number;
    pollIntervalMs?: number;
    onRelaySuccess?: (relayUrl: string) => void;
}

export interface PublishWithDeadlineResult {
    successfulRelays: string[];
    failedRelays: string[];
    timedOutRelays: string[];
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function promiseWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    if (timeoutMs <= 0) {
        throw new Error('Timeout');
    }

    return await Promise.race([
        promise,
        sleep(timeoutMs).then(() => {
            throw new Error('Timeout');
        }),
    ]);
}

async function waitForRelayConnected(
    connectionManager: ConnectionManagerSnapshot,
    url: string,
    deadlineAt: number,
    pollIntervalMs: number
): Promise<RelayHealthSnapshot | null> {
    while (Date.now() < deadlineAt) {
        const health = connectionManager.getRelayHealth(url);
        if (health?.isConnected && health.relay) {
            return health;
        }
        await sleep(pollIntervalMs);
    }

    return null;
}

export async function publishWithDeadline(options: PublishWithDeadlineOptions): Promise<PublishWithDeadlineResult> {
    const {
        connectionManager,
        event,
        relayUrls,
        deadlineMs,
        pollIntervalMs = 50,
        onRelaySuccess,
    } = options;

    console.log(`[publishWithDeadline] Starting publish to ${relayUrls.length} relays: ${relayUrls.join(', ')}`);

    const deadlineAt = Date.now() + deadlineMs;

    const attemptPublish = async (url: string) => {
        console.log(`[publishWithDeadline] ${url}: Waiting for connection...`);
        const remainingForConnect = deadlineAt - Date.now();
        if (remainingForConnect <= 0) {
            console.log(`[publishWithDeadline] ${url}: Connection timeout (no time remaining)`);
            return { url, status: 'timeout' as const };
        }

        const health = await waitForRelayConnected(connectionManager, url, deadlineAt, pollIntervalMs);
        if (!health?.relay || !health.isConnected) {
            console.log(`[publishWithDeadline] ${url}: Connection timeout (relay not connected)`);
            return { url, status: 'timeout' as const };
        }

        const remainingForPublish = deadlineAt - Date.now();
        if (remainingForPublish <= 0) {
            console.log(`[publishWithDeadline] ${url}: Timeout after connection (no time for publish)`);
            return { url, status: 'timeout' as const };
        }

        const relay = health.relay;
        if (!relay) {
            console.log(`[publishWithDeadline] ${url}: Timeout (relay object missing)`);
            return { url, status: 'timeout' as const };
        }
        
        console.log(`[publishWithDeadline] ${url}: Connected, attempting publish`);

        const publishOnce = async () => {
            const remaining = deadlineAt - Date.now();
            if (remaining <= 0) {
                throw new Error('Timeout');
            }

            const publishPromise = relay.publish(event);
            // Ensure late rejections do not become unhandled rejections.
            publishPromise.catch(() => undefined);
            await promiseWithTimeout(publishPromise, remaining);
        };

        let retriedAfterAuth = false;

        try {
            await publishOnce();
            console.log(`[publishWithDeadline] ${url}: Publish successful`);
            onRelaySuccess?.(url);
            return { url, status: 'success' as const };
        } catch (e) {
            const message = (e as Error)?.message || String(e);

            if (message === 'Timeout') {
                console.log(`[publishWithDeadline] ${url}: Publish timeout`);
                return { url, status: 'timeout' as const };
            }

            if (!retriedAfterAuth && message.startsWith('auth-required')) {
                console.log(`[publishWithDeadline] ${url}: Publish failed with 'auth-required', attempting AUTH...`);
                retriedAfterAuth = true;
                connectionManager.markRelayAuthRequired?.(url);

                const remainingForAuth = deadlineAt - Date.now();
                if (remainingForAuth <= 0) {
                    console.log(`[publishWithDeadline] ${url}: AUTH timeout (no time remaining)`);
                    return { url, status: 'timeout' as const };
                }

                try {
                    const authPromise = connectionManager.authenticateRelay
                        ? connectionManager.authenticateRelay(url)
                        : (relay.auth && relay.onauth ? relay.auth(relay.onauth) : false);

                    const authenticated = await promiseWithTimeout(Promise.resolve(authPromise), remainingForAuth);

                    if (authenticated === false) {
                        console.log(`[publishWithDeadline] ${url}: AUTH returned false (no auth handler or denied)`);
                        return { url, status: 'failure' as const };
                    }

                    console.log(`[publishWithDeadline] ${url}: AUTH succeeded, retrying publish...`);
                    await publishOnce();
                    console.log(`[publishWithDeadline] ${url}: Post-AUTH publish successful`);
                    onRelaySuccess?.(url);
                    return { url, status: 'success' as const };
                } catch (authError) {
                    const authMessage = (authError as Error)?.message || String(authError);
                    if (authMessage === 'Timeout') {
                        console.log(`[publishWithDeadline] ${url}: AUTH timeout`);
                        return { url, status: 'timeout' as const };
                    }
                    console.log(`[publishWithDeadline] ${url}: AUTH error: ${authMessage}`);
                    return { url, status: 'failure' as const };
                }
            }

            console.log(`[publishWithDeadline] ${url}: Publish failed: ${message}`);
            return { url, status: 'failure' as const };
        }
    };

    const settled = await Promise.allSettled(relayUrls.map((url) => attemptPublish(url)));

    const successfulRelays: string[] = [];
    const failedRelays: string[] = [];
    const timedOutRelays: string[] = [];

    for (const item of settled) {
        if (item.status !== 'fulfilled') {
            continue;
        }
        if (item.value.status === 'success') {
            successfulRelays.push(item.value.url);
        } else if (item.value.status === 'timeout') {
            timedOutRelays.push(item.value.url);
        } else {
            failedRelays.push(item.value.url);
        }
    }

    console.log(`[publishWithDeadline] Result: ${successfulRelays.length} successful, ${failedRelays.length} failed, ${timedOutRelays.length} timed out`);
    return { successfulRelays, failedRelays, timedOutRelays };
}
