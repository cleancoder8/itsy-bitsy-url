// Mock the redis module BEFORE importing the code that uses it to avoid
// creating a real client / connecting during module import.
jest.mock('redis', () => {
    const mRedis = {
        connect: jest.fn().mockResolvedValue(undefined),
        set: jest.fn(),
        get: jest.fn(),
        exists: jest.fn(),
    };
    return {
        createClient: jest.fn(() => mRedis),
    };
});

import { saveUrlMapping, getUrlMapping, shortIdExists } from './kv';

// Get the mocked redis client instance from the mock factory
const { createClient } = require('redis');
const mRedis = createClient();
describe('KV Storage', () => {
    let client: any; // Declare client here to be accessible in beforeEach and tests

    beforeEach(() => {
        jest.clearAllMocks();
        // Get a fresh mocked redis client instance for each test
        client = require('redis').createClient();
    });

    describe('saveUrlMapping', () => {
        it('should save mapping to redis', async () => {
            const shortId = 'test-id';
            const url = 'https://example.com';

            await saveUrlMapping(shortId, url);

            expect(client.set).toHaveBeenCalledWith(
                `short:${shortId}`,
                expect.stringContaining(url)
            );
        });
    });

    describe('getUrlMapping', () => {
        it('should return mapping if exists', async () => {
            const shortId = 'test-id';
            const mockMapping = { url: 'https://example.com', createdAt: '2023-01-01' };

            const client = require('redis').createClient();
            client.get.mockResolvedValue(JSON.stringify(mockMapping));

            const result = await getUrlMapping(shortId);
            expect(result).toEqual(mockMapping);
            expect(client.get).toHaveBeenCalledWith(`short:${shortId}`);
        });

        it('should return null if not exists', async () => {
            const client = require('redis').createClient();
            client.get.mockResolvedValue(null);
            const result = await getUrlMapping('non-existent');
            expect(result).toBeNull();
        });
    });

    describe('shortIdExists', () => {
        it('should return true if exists', async () => {
            const client = require('redis').createClient();
            client.exists.mockResolvedValue(1);
            const result = await shortIdExists('exists');
            expect(result).toBe(true);
        });

        it('should return false if not exists', async () => {
            const client = require('redis').createClient();
            client.exists.mockResolvedValue(0);
            const result = await shortIdExists('not-exists');
            expect(result).toBe(false);
        });
    });
});
