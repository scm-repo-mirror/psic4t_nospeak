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

    const deadlineAt = Date.now() + deadlineMs;

    const attemptPublish = async (url: string) => {
        const remainingForConnect = deadlineAt - Date.now();
        if (remainingForConnect <= 0) {
            return { url, status: 'timeout' as const };
        }

        const health = await waitForRelayConnected(connectionManager, url, deadlineAt, pollIntervalMs);
        if (!health?.relay || !health.isConnected) {
            return { url, status: 'timeout' as const };
        }

        const remainingForPublish = deadlineAt - Date.now();
        if (remainingForPublish <= 0) {
            return { url, status: 'timeout' as const };
        }

        const relay = health.relay;
        if (!relay) {
            return { url, status: 'timeout' as const };
        }

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
            onRelaySuccess?.(url);
            return { url, status: 'success' as const };
        } catch (e) {
            const message = (e as Error)?.message || String(e);

            if (message === 'Timeout') {
                return { url, status: 'timeout' as const };
            }

            if (!retriedAfterAuth && message.startsWith('auth-required')) {
                retriedAfterAuth = true;
                connectionManager.markRelayAuthRequired?.(url);

                const remainingForAuth = deadlineAt - Date.now();
                if (remainingForAuth <= 0) {
                    return { url, status: 'timeout' as const };
                }

                try {
                    const authPromise = connectionManager.authenticateRelay
                        ? connectionManager.authenticateRelay(url)
                        : (relay.auth && relay.onauth ? relay.auth(relay.onauth) : false);

                    const authenticated = await promiseWithTimeout(Promise.resolve(authPromise), remainingForAuth);

                    if (authenticated === false) {
                        return { url, status: 'failure' as const };
                    }

                    await publishOnce();
                    onRelaySuccess?.(url);
                    return { url, status: 'success' as const };
                } catch (authError) {
                    const authMessage = (authError as Error)?.message || String(authError);
                    if (authMessage === 'Timeout') {
                        return { url, status: 'timeout' as const };
                    }
                    return { url, status: 'failure' as const };
                }
            }

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

    return { successfulRelays, failedRelays, timedOutRelays };
}
