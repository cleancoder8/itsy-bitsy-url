import { v4 as uuidv4, parse as uuidParse } from "uuid";

/**
 * Generates a short ID based on a UUID v4.
 * Algorithm:
 * 1. Generate UUID v4
 * 2. Convert to byte array
 * 3. Convert to Base64
 * 4. Make URL-safe (+ -> -, / -> _, remove =)
 * 5. Trim to first 10 characters
 */
export function generateShortId(): string {
  // 1. Generate UUID
  const uuid = uuidv4();

  // 2. Convert to bytes
  const bytes = uuidParse(uuid);

  // 3. Convert to Base64
  // Buffer is available in Node.js environment (Next.js server side)
  const base64 = Buffer.from(bytes).toString("base64");

  // 4. Make URL safe
  const urlSafe = base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  // 5. Trim to 10 chars
  return urlSafe.substring(0, 10);
}
