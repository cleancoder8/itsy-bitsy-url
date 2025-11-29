import { generateShortId } from './shortId';

describe('generateShortId', () => {
    it('should return a string of length 10', () => {
        const id = generateShortId();
        expect(id).toHaveLength(10);
    });

    it('should return a URL-safe string', () => {
        const id = generateShortId();
        // Should not contain +, /, or =
        expect(id).not.toMatch(/[+/=]/);
        // Should only contain URL-safe characters (alphanumeric, -, _)
        expect(id).toMatch(/^[a-zA-Z0-9-_]+$/);
    });

    it('should generate unique IDs', () => {
        const id1 = generateShortId();
        const id2 = generateShortId();
        expect(id1).not.toBe(id2);
    });
});
