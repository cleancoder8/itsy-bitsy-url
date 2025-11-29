import { put, list } from '@vercel/blob';

export interface UrlMapping {
    url: string;
    createdAt: string;
    clicks?: number;
}

/**
 * Saves a URL mapping to Vercel Blob.
 * We store the JSON object as a file at 'short-ids/<shortId>'.
 * We use `addRandomSuffix: false` to ensure the path is predictable/overwritable.
 */
export async function saveUrlMapping(shortId: string, url: string): Promise<void> {
    const mapping: UrlMapping = {
        url,
        createdAt: new Date().toISOString(),
        clicks: 0,
    };

    await put(`short-ids/${shortId}`, JSON.stringify(mapping), {
        access: 'public',
        addRandomSuffix: false, // Allows us to overwrite/predict the path
        contentType: 'application/json',
    });
}

/**
 * Retrieves a URL mapping from Vercel Blob.
 * Since we don't know the full random URL, we list blobs with the prefix.
 * Note: This is slower than KV.
 */
export async function getUrlMapping(shortId: string): Promise<UrlMapping | null> {
    // 1. List blobs with the prefix 'short-ids/<shortId>'
    // We expect exactly one match if it exists.
    const { blobs } = await list({
        prefix: `short-ids/${shortId}`,
        limit: 1,
    });

    if (blobs.length === 0) {
        return null;
    }

    // 2. Fetch the content of the blob
    const blobUrl = blobs[0].url;
    try {
        const res = await fetch(blobUrl);
        if (!res.ok) {
            return null;
        }
        const data = await res.json();
        return data as UrlMapping;
    } catch (error) {
        console.error('Error fetching blob content:', error);
        return null;
    }
}

/**
 * Checks if a short ID already exists.
 */
export async function shortIdExists(shortId: string): Promise<boolean> {
    const { blobs } = await list({
        prefix: `short-ids/${shortId}`,
        limit: 1,
    });
    return blobs.length > 0;
}
