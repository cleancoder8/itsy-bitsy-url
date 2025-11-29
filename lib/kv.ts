import { kv } from '@vercel/kv';

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
    await kv.set(`short:${shortId}`, mapping);
}

/**
 * Retrieves a URL mapping from Vercel KV.
 */
export async function getUrlMapping(shortId: string): Promise<UrlMapping | null> {
    return await kv.get<UrlMapping>(`short:${shortId}`);
}

/**
 * Checks if a short ID already exists.
 */
export async function shortIdExists(shortId: string): Promise<boolean> {
    const exists = await kv.exists(`short:${shortId}`);
    return exists === 1;
}

// Re-export kv for direct access if needed
export { kv };
