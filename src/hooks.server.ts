import { sequence } from '@sveltejs/kit/hooks';
import { recordRequest } from '$lib/server/metrics.server';

export const handle = sequence(async ({ event, resolve }) => {
    recordRequest(event);
    return resolve(event);
});
