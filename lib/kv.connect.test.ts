// Ensure the redis.connect path (non-test) is covered by mocking redis and
// importing the module with NODE_ENV set to 'production'. This exercise the
// connect() call that is skipped under Jest's default 'test' environment.
describe('kv connect branch', () => {
    const ORIGINAL_ENV = process.env.NODE_ENV;

    beforeEach(() => {
        jest.resetModules();
    });

    afterEach(() => {
        process.env.NODE_ENV = ORIGINAL_ENV;
        jest.clearAllMocks();
    });

    it('calls redis.connect when not in test env', async () => {
        // Mock redis before importing the module
        const connectMock = jest.fn().mockResolvedValue(undefined);
        const setMock = jest.fn();
        const getMock = jest.fn();
        const existsMock = jest.fn();

        jest.doMock('redis', () => ({
            createClient: jest.fn(() => ({
                connect: connectMock,
                set: setMock,
                get: getMock,
                exists: existsMock,
            })),
        }));

        // Simulate production runtime
        process.env.NODE_ENV = 'production';

        // Import the module which should call connect() during initialization
        const kv = await import('./kv');

        // The mocked connect should have been called
        expect(connectMock).toHaveBeenCalled();

        // Clean up the mock so other tests aren't affected
        jest.dontMock('redis');
    });
});
