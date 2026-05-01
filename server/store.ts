import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export type RegistrationStatus =
  | 'new'
  | 'contacted'
  | 'confirmed'
  | 'cancelled';

export type Registration = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  courseId: string;
  courseName: string;
  batchId: string;
  batchName: string;
  expectation: string;
  status: RegistrationStatus;
};

function resolveStorePath(): string {
  if (process.env.REGISTRATION_DATA_PATH) {
    return process.env.REGISTRATION_DATA_PATH;
  }
  const dir =
    process.env.DATA_DIR ||
    (process.env.RAILWAY_ENVIRONMENT ? '/data' : path.resolve('./data'));
  return path.join(dir, 'registrations.json');
}

export const STORE_PATH = resolveStorePath();
const STORE_DIR = path.dirname(STORE_PATH);

if (!fs.existsSync(STORE_DIR)) {
  fs.mkdirSync(STORE_DIR, { recursive: true });
}

if (!fs.existsSync(STORE_PATH)) {
  fs.writeFileSync(STORE_PATH, '[]', 'utf8');
}

console.log(`[store] JSON file: ${STORE_PATH}`);

// ---- write queue: serialize all read+write ops to avoid races ----
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T> | T): Promise<T> {
  const next = queue.then(() => task());
  queue = next.catch(() => undefined);
  return next as Promise<T>;
}

function readSafe(): Registration[] {
  let raw = '';
  try {
    raw = fs.readFileSync(STORE_PATH, 'utf8');
  } catch (err) {
    console.error('[store] read failed:', err);
    return [];
  }
  if (!raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Top-level JSON is not an array');
    }
    return parsed as Registration[];
  } catch (err) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = STORE_PATH.replace(
      /\.json$/i,
      `.corrupt.${ts}.json`,
    );
    try {
      fs.copyFileSync(STORE_PATH, backupPath);
      console.error(
        `[store] Corrupt JSON detected. Backed up original → ${backupPath}`,
        err,
      );
    } catch (copyErr) {
      console.error('[store] Failed to back up corrupt JSON:', copyErr);
    }
    fs.writeFileSync(STORE_PATH, '[]', 'utf8');
    return [];
  }
}

async function writeAtomic(rows: Registration[]): Promise<void> {
  const tmp = `${STORE_PATH}.${process.pid}.${Date.now()}.tmp`;
  const json = JSON.stringify(rows, null, 2);
  await fs.promises.writeFile(tmp, json, 'utf8');
  await fs.promises.rename(tmp, STORE_PATH);
}

export function listAll(): Promise<Registration[]> {
  return enqueue(() => readSafe());
}

export function create(
  payload: Omit<Registration, 'id' | 'createdAt' | 'status'>,
): Promise<Registration> {
  return enqueue(async () => {
    const all = readSafe();
    const reg: Registration = {
      ...payload,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    all.push(reg);
    await writeAtomic(all);
    return reg;
  });
}

export function updateStatus(
  id: string,
  status: RegistrationStatus,
): Promise<Registration | null> {
  return enqueue(async () => {
    const all = readSafe();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], status };
    await writeAtomic(all);
    return all[idx];
  });
}

export type BatchPatch = Pick<
  Registration,
  'courseId' | 'courseName' | 'batchId' | 'batchName'
>;

export function updateBatch(
  id: string,
  patch: BatchPatch,
): Promise<Registration | null> {
  return enqueue(async () => {
    const all = readSafe();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch };
    await writeAtomic(all);
    return all[idx];
  });
}

export function remove(id: string): Promise<boolean> {
  return enqueue(async () => {
    const all = readSafe();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    all.splice(idx, 1);
    await writeAtomic(all);
    return true;
  });
}
