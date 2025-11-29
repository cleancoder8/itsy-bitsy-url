/**
 * @jest-environment node
 */
// Register mocks first
jest.mock('@/lib/kv');
jest.mock('@/lib/ratelimit');
jest.mock('@/lib/shortId');

import { POST } from './route';
import { NextRequest } from 'next/server';
import { saveUrlMapping, shortIdExists } from '@/lib/kv';
import { ratelimit } from '@/lib/ratelimit';
import { generateShortId } from '@/lib/shortId';

describe('POST /api/shorten (extra branches)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (generateShortId as jest.Mock).mockReturnValue('test-id');
        (shortIdExists as jest.Mock).mockResolvedValue(false);
        (saveUrlMapping as jest.Mock).mockResolvedValue(undefined);
        (ratelimit.limit as jest.Mock).mockResolvedValue({ success: true });
    });

    const createRequest = (body: any) => {
        return new NextRequest('http://localhost:3000/api/shorten', {
            method: 'POST',
            body: JSON.stringify(body),
        });
    };

    it('continues when ratelimit throws (logs error)', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        (ratelimit.limit as jest.Mock).mockRejectedValueOnce(new Error('boom'));

        const req = createRequest({ url: 'https://example.com' });
        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('returns 503 when unable to generate a unique id', async () => {
        // generateShortId always returns the same id and shortIdExists always true
        (generateShortId as jest.Mock).mockReturnValue('collision');
        (shortIdExists as jest.Mock).mockResolvedValue(true);

        const req = createRequest({ url: 'https://example.com' });
        const res = await POST(req);

        expect(res.status).toBe(503);
        const data = await res.json();
        expect(data.error).toMatch(/Failed to generate a unique ID/);
    });

    it('returns 500 when request.json throws', async () => {
        // Make a fake request whose json() throws
        const badReq: any = {
            json: async () => {
                throw new Error('boom');
            },
            headers: {
                get: () => null,
            },
        };

        const res = await POST(badReq as any);
        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data.error).toBe('Internal Server Error');
    });

    it('uses https protocol when NODE_ENV=production', async () => {
        const original = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        const req = createRequest({ url: 'https://example.com' });
        const res = await POST(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.shortUrl.startsWith('https://')).toBe(true);

        process.env.NODE_ENV = original;
    });
});
