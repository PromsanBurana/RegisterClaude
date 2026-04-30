import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { hashPassword } from './passwords.js';

export type UserRole = 'admin' | 'viewer';

export type User = {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
};

function resolveStorePath(): string {
  if (process.env.USERS_DATA_PATH) return process.env.USERS_DATA_PATH;
  const dir =
    process.env.DATA_DIR ||
    (process.env.RAILWAY_ENVIRONMENT ? '/data' : path.resolve('./data'));
  return path.join(dir, 'users.json');
}

export const USERS_PATH = resolveStorePath();
const USERS_DIR = path.dirname(USERS_PATH);

if (!fs.existsSync(USERS_DIR)) {
  fs.mkdirSync(USERS_DIR, { recursive: true });
}

if (!fs.existsSync(USERS_PATH)) {
  fs.writeFileSync(USERS_PATH, '[]', 'utf8');
}

console.log(`[userStore] users file: ${USERS_PATH}`);

let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T> | T): Promise<T> {
  const next = queue.then(() => task());
  queue = next.catch(() => undefined);
  return next as Promise<T>;
}

function readSafe(): User[] {
  try {
    const raw = fs.readFileSync(USERS_PATH, 'utf8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('not an array');
    return parsed as User[];
  } catch (err) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = USERS_PATH.replace(/\.json$/i, `.corrupt.${ts}.json`);
    try {
      fs.copyFileSync(USERS_PATH, backup);
    } catch {
      /* ignore */
    }
    fs.writeFileSync(USERS_PATH, '[]', 'utf8');
    console.error(
      `[userStore] Corrupt users JSON detected. Backed up → ${backup}`,
      err,
    );
    return [];
  }
}

async function writeAtomic(rows: User[]): Promise<void> {
  const tmp = `${USERS_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.promises.writeFile(tmp, JSON.stringify(rows, null, 2), 'utf8');
  await fs.promises.rename(tmp, USERS_PATH);
}

// ---------- Public API ----------

export function findUserByUsername(username: string): User | null {
  const all = readSafe();
  const u = all.find((x) => x.username.toLowerCase() === username.toLowerCase());
  return u ?? null;
}

export function findUserById(id: string): User | null {
  const all = readSafe();
  return all.find((x) => x.id === id) ?? null;
}

export function listUsers(): User[] {
  return readSafe();
}

export function createUser(input: {
  username: string;
  password: string;
  role: UserRole;
}): Promise<User> {
  return enqueue(async () => {
    const all = readSafe();
    if (
      all.some(
        (u) => u.username.toLowerCase() === input.username.toLowerCase(),
      )
    ) {
      throw new Error('username_taken');
    }
    const user: User = {
      id: randomUUID(),
      username: input.username,
      passwordHash: hashPassword(input.password),
      role: input.role,
      createdAt: new Date().toISOString(),
    };
    all.push(user);
    await writeAtomic(all);
    return user;
  });
}

// ---------- Bootstrap default admin ----------

export function ensureDefaultAdmin() {
  const all = readSafe();
  if (all.length > 0) return;
  const admin: User = {
    id: randomUUID(),
    username: 'admin',
    passwordHash: hashPassword('admin'),
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(USERS_PATH, JSON.stringify([admin], null, 2), 'utf8');
  console.log(
    '[userStore] Seeded default admin user → username: "admin" / password: "admin". CHANGE THIS BEFORE PRODUCTION USE.',
  );
}

// Run seed at import time (after file is ensured to exist)
ensureDefaultAdmin();
