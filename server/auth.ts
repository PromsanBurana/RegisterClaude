import {
  randomBytes,
  timingSafeEqual,
  createHmac,
} from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { findUserById } from './userStore.js';
import type { User, UserRole } from './userStore.js';

export { hashPassword, verifyPassword } from './passwords.js';

// ---------- Session token (HMAC-signed cookie value) ----------

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const SESSION_SECRET = (() => {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16) {
    return process.env.SESSION_SECRET;
  }
  const random = randomBytes(32).toString('hex');
  console.warn(
    '[auth] SESSION_SECRET is not set (or too short). Using an in-memory random secret — sessions will reset on each restart.',
  );
  return random;
})();

function sign(payload: string): string {
  return createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
}

export function createSessionToken(userId: string): {
  token: string;
  maxAgeMs: number;
} {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${userId}.${expires}`;
  const sig = sign(payload);
  return { token: `${payload}.${sig}`, maxAgeMs: SESSION_TTL_MS };
}

export function verifySessionToken(token?: string | null): { userId: string } | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, expiresStr, sig] = parts;
  if (!userId || !expiresStr || !sig) return null;
  const expectedSig = sign(`${userId}.${expiresStr}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return null;
  return { userId };
}

// ---------- Cookie helper ----------

export const SESSION_COOKIE = 'auth';

export function cookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: maxAgeMs,
    path: '/',
  };
}

// ---------- Middleware ----------

export interface AuthedRequest extends Request {
  user?: User;
}

function getCurrentUser(req: Request): User | null {
  const cookies = (req as AuthedRequest & { cookies?: Record<string, string> }).cookies || {};
  const token = cookies[SESSION_COOKIE];
  const session = verifySessionToken(token);
  if (!session) return null;
  return findUserById(session.userId);
}

export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const user = getCurrentUser(req);
  if (user) (req as AuthedRequest).user = user;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getCurrentUser(req);
  if (!user) return res.status(401).json({ ok: false, error: 'unauthorized' });
  (req as AuthedRequest).user = user;
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthedRequest).user;
    if (!user) return res.status(401).json({ ok: false, error: 'unauthorized' });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ ok: false, error: 'forbidden' });
    }
    next();
  };
}
