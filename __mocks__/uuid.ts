let count = 0;
export const v4 = jest.fn(() => {
    count++;
    // Return a valid UUID string with a changing part to ensure uniqueness
    return `7f8c432d-2e2e-4444-8888-${count.toString().padStart(12, '0')}`;
});

// Make parse return bytes that vary with the call count so generated IDs differ
export const parse = jest.fn(() => {
    // Use the current count to alter the first bytes for uniqueness so the
    // resulting Base64 differs in the first characters (we trim to 10 chars).
    const arr = new Uint8Array(16);
    // Base pattern
    arr.set([127, 140, 67, 45, 46, 46, 68, 68, 136, 136, 0, 0, 0, 0, 0, 0]);
    // Mix in the count into the early bytes to ensure the first 10 chars change
    arr[0] = (arr[0] ^ (count & 0xff)) & 0xff;
    arr[1] = (arr[1] ^ ((count >> 8) & 0xff)) & 0xff;
    arr[2] = (arr[2] ^ ((count >> 16) & 0xff)) & 0xff;
    return arr;
});
