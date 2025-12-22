import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import { getRuntimeConfig } from '$lib/server/runtimeConfig.server';

const NO_STORE_HEADERS = {
    'Cache-Control': 'no-store'
} as const;

export const GET: RequestHandler = async () => {
    const config = getRuntimeConfig();
    return json(config, { headers: NO_STORE_HEADERS });
};
