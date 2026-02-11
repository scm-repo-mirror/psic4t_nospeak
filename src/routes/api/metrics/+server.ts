import { json, error } from '@sveltejs/kit';
import { getMetrics } from '$lib/server/metrics.server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
    const token = process.env.METRICS_TOKEN;

    if (!token) {
        throw error(503, 'Metrics not configured');
    }

    const authorization = request.headers.get('authorization');

    if (!authorization || authorization !== `Bearer ${token}`) {
        throw error(401, 'Unauthorized');
    }

    return json(getMetrics());
};
