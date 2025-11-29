import { createClient } from 'redis';

const redis = await createClient({ url: process.env.REDIS_URL }).connect();

export interface UrlMapping {
    url: string;
    createdAt: string;
    clicks?: number;
}

/**
 * Saves a URL mapping to Vercel KV.
 * Key: short:<shortId>
 * Value: JSON object
 */
export async function saveUrlMapping(shortId: string, url: string): Promise<void> {
    const mapping: UrlMapping = {
        url,
        createdAt: new Date().toISOString(),
        clicks: 0,
    };
    // Store the mapping
    await redis.set(`short:${shortId}`, JSON.stringify(mapping));
}

/**
 * Retrieves a URL mapping from Vercel KV.
 */
export async function getUrlMapping(shortId: string): Promise<UrlMapping | null> {
    const mapping = await redis.get(`short:${shortId}`);
    return mapping ? JSON.parse(mapping) as UrlMapping : null;
}

/**
 * Checks if a short ID already exists.
 */
export async function shortIdExists(shortId: string): Promise<boolean> {
    const exists = await redis.exists(`short:${shortId}`);
    return exists === 1;
}

// Re-export kv for direct access if needed
export { redis };
