import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SCRYPT_KEY_LEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT_KEY_LEN);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  let salt: Buffer;
  let storedHash: Buffer;
  try {
    salt = Buffer.from(parts[1], 'hex');
    storedHash = Buffer.from(parts[2], 'hex');
  } catch {
    return false;
  }
  if (storedHash.length !== SCRYPT_KEY_LEN) return false;
  const candidate = scryptSync(password, salt, SCRYPT_KEY_LEN);
  return timingSafeEqual(storedHash, candidate);
}
