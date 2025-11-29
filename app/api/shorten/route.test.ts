/**
 * @jest-environment node
 */
// Mock dependencies BEFORE importing modules that use them to avoid real side-effects
jest.mock('@/lib/kv');
jest.mock('@/lib/ratelimit');
jest.mock('@/lib/shortId');

import { POST } from './route';
import { NextRequest } from 'next/server';
import { saveUrlMapping, shortIdExists } from '@/lib/kv';
import { ratelimit } from '@/lib/ratelimit';
import { generateShortId } from '@/lib/shortId';

describe('POST /api/shorten', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default mocks
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

    it('should return 400 if URL is missing', async () => {
        const req = createRequest({});
        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('URL is required');
    });

    it('should return 400 if URL is invalid', async () => {
        const req = createRequest({ url: 'not-a-url' });
        const res = await POST(req);
        expect(res.status).toBe(400);
    });

    it('should return 429 if rate limit exceeded', async () => {
        (ratelimit.limit as jest.Mock).mockResolvedValue({ success: false });
        const req = createRequest({ url: 'https://example.com' });
        const res = await POST(req);
        expect(res.status).toBe(429);
    });

    it('should create a short URL successfully', async () => {
        const req = createRequest({ url: 'https://example.com' });
        const res = await POST(req);

        expect(res.status).toBe(200);
        const data = await res.json();

        expect(data).toEqual({
            shortId: 'test-id',
            shortUrl: expect.stringContaining('test-id'),
            originalUrl: 'https://example.com',
        });

        expect(saveUrlMapping).toHaveBeenCalledWith('test-id', 'https://example.com');
    });

    it('should handle collisions by regenerating ID', async () => {
        // First ID exists, second one is unique
        (shortIdExists as jest.Mock)
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false);

        (generateShortId as jest.Mock)
            .mockReturnValueOnce('collision')
            .mockReturnValueOnce('unique');

        const req = createRequest({ url: 'https://example.com' });
        await POST(req);

        expect(generateShortId).toHaveBeenCalledTimes(2);
        expect(saveUrlMapping).toHaveBeenCalledWith('unique', 'https://example.com');
    });
});
