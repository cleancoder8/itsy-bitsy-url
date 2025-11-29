import { NextRequest, NextResponse } from 'next/server';
import { generateShortId } from '@/lib/shortId';
import { saveUrlMapping, shortIdExists } from '@/lib/kv';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url } = body;

        // 1. Validate URL
        if (!url || typeof url !== 'string') {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        try {
            // Check if it's a valid URL
            new URL(url);
        } catch (e) {
            return NextResponse.json({ error: 'Invalid URL format. Please include http:// or https://' }, { status: 400 });
        }

        // 2. Generate unique ID with collision handling
        let shortId = generateShortId();
        let retries = 3;
        let isUnique = false;

        while (retries > 0) {
            const exists = await shortIdExists(shortId);
            if (!exists) {
                isUnique = true;
                break;
            }
            // Collision found, regenerate
            shortId = generateShortId();
            retries--;
        }

        if (!isUnique) {
            return NextResponse.json(
                { error: 'Failed to generate a unique ID. Please try again.' },
                { status: 503 } // Service Unavailable or 500
            );
        }

        // 3. Store mapping in Vercel KV
        await saveUrlMapping(shortId, url);

        // 4. Construct the short URL
        // Use the host from the request to build the full URL
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const shortUrl = `${protocol}://${host}/${shortId}`;

        return NextResponse.json({
            shortId,
            shortUrl,
            originalUrl: url,
        });

    } catch (error) {
        console.error('Error processing shorten request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
