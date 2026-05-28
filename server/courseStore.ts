import fs from 'node:fs';
import path from 'node:path';
import { COURSES, type ServerBatch, type ServerCourse } from './courses.js';

/**
 * Admin-editable course data store.
 *
 * Only the per-course `batches` array is mutable at runtime; course-level
 * metadata (id, title) is owned by the static COURSES code so it stays in
 * sync with frontend identifiers and copy.
 *
 * Storage shape: `{ [courseId]: ServerBatch[] }` persisted as JSON on the
 * Railway volume. On first boot the file is seeded from the static COURSES
 * batches so behavior is unchanged out of the box.
 */

type CoursesData = Record<string, ServerBatch[]>;

function resolvePath(): string {
  if (process.env.COURSES_DATA_PATH) return process.env.COURSES_DATA_PATH;
  const dir =
    process.env.DATA_DIR ||
    (process.env.RAILWAY_ENVIRONMENT ? '/data' : path.resolve('./data'));
  return path.join(dir, 'courses.json');
}

export const COURSES_PATH = resolvePath();
const COURSES_DIR = path.dirname(COURSES_PATH);

if (!fs.existsSync(COURSES_DIR)) {
  fs.mkdirSync(COURSES_DIR, { recursive: true });
}

function buildSeed(): CoursesData {
  const seed: CoursesData = {};
  for (const c of COURSES) seed[c.id] = [...c.batches];
  return seed;
}

if (!fs.existsSync(COURSES_PATH)) {
  fs.writeFileSync(COURSES_PATH, JSON.stringify(buildSeed(), null, 2), 'utf8');
  console.log(`[courseStore] Seeded course data → ${COURSES_PATH}`);
}

console.log(`[courseStore] Loaded: ${COURSES_PATH}`);

let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T> | T): Promise<T> {
  const next = queue.then(() => task());
  queue = next.catch(() => undefined);
  return next as Promise<T>;
}

function readSafe(): CoursesData {
  try {
    const raw = fs.readFileSync(COURSES_PATH, 'utf8');
    if (!raw.trim()) return buildSeed();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('not an object');
    }
    return parsed as CoursesData;
  } catch (err) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = COURSES_PATH.replace(/\.json$/i, `.corrupt.${ts}.json`);
    try {
      fs.copyFileSync(COURSES_PATH, backup);
    } catch {
      /* ignore */
    }
    const seed = buildSeed();
    fs.writeFileSync(COURSES_PATH, JSON.stringify(seed, null, 2), 'utf8');
    console.error(`[courseStore] Corrupt JSON. Backed up → ${backup}`, err);
    return seed;
  }
}

let cache: CoursesData = readSafe();

async function writeAtomic(data: CoursesData): Promise<void> {
  const tmp = `${COURSES_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.promises.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.promises.rename(tmp, COURSES_PATH);
  cache = data;
}

// ---------- Read API (sync, off the cache) ----------

export function getCoursesSync(): ServerCourse[] {
  return COURSES.map((c) => ({
    ...c,
    batches: (cache[c.id] || []).slice(),
  }));
}

export function findCourse(id: string): ServerCourse | undefined {
  return getCoursesSync().find((c) => c.id === id);
}

export function findBatch(
  courseId: string,
  batchId: string,
): ServerBatch | undefined {
  return findCourse(courseId)?.batches.find((b) => b.id === batchId);
}

export function batchDisplayName(
  courseId: string,
  batchId: string,
): string | null {
  const b = findBatch(courseId, batchId);
  return b ? `${b.label} • ${b.date} • ${b.time}` : null;
}

// ---------- Date helpers (Asia/Bangkok) ----------

const BKK_OFFSET_MS = 7 * 60 * 60 * 1000;

export function bangkokToday(now: Date = new Date()): string {
  return new Date(now.getTime() + BKK_OFFSET_MS).toISOString().slice(0, 10);
}

export function isBatchPast(
  b: Pick<ServerBatch, 'dateISO'>,
  now?: Date,
): boolean {
  return b.dateISO < bangkokToday(now);
}

// ---------- Mutations ----------

const THAI_DAYS = [
  'วันอาทิตย์',
  'วันจันทร์',
  'วันอังคาร',
  'วันพุธ',
  'วันพฤหัส',
  'วันศุกร์',
  'วันเสาร์',
];
const THAI_MONTHS = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

function thaiDateString(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return `${THAI_DAYS[d.getDay()]}ที่ ${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`;
}

const DEFAULT_TIME = '09.30 - 12.00 น.';
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export type AddBatchInput = {
  label?: string;
  dateISO: string;
  time?: string;
  date?: string;
  id?: string;
};

export function addBatch(
  courseId: string,
  input: AddBatchInput,
): Promise<ServerBatch> {
  return enqueue(async () => {
    if (!COURSES.find((c) => c.id === courseId)) {
      throw new Error('invalid_course');
    }
    if (!ISO_RE.test(input.dateISO)) {
      throw new Error('invalid_date');
    }

    const data: CoursesData = {};
    for (const key of Object.keys(cache)) data[key] = cache[key].slice();

    const existing = data[courseId] || [];

    // Generate id if not provided. Default pattern: `${courseId}-${counter}`.
    let id = input.id?.trim() || autoId(courseId, existing);
    if (existing.find((b) => b.id === id)) {
      // collision — append timestamp
      id = `${id}-${Date.now().toString(36)}`;
    }

    const batch: ServerBatch = {
      id,
      label: (input.label?.trim() || autoLabel(existing)) as string,
      date: input.date?.trim() || thaiDateString(input.dateISO),
      time: input.time?.trim() || DEFAULT_TIME,
      dateISO: input.dateISO,
    };

    const updated = [...existing, batch].sort((a, b) =>
      a.dateISO.localeCompare(b.dateISO),
    );
    data[courseId] = updated;
    await writeAtomic(data);
    return batch;
  });
}

function autoId(courseId: string, existing: ServerBatch[]): string {
  // Use the same `${prefix}-${n}` pattern as the seed data when possible.
  const prefix = courseId === 'vibe-coding' ? 'vibe' : courseId.split('-')[0];
  const nums = existing
    .map((b) => {
      const m = b.id.match(new RegExp(`^${prefix}-(\\d+)$`));
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const next = (Math.max(0, ...nums) || 0) + 1;
  return `${prefix}-${next}`;
}

function autoLabel(existing: ServerBatch[]): string {
  const nums = existing
    .map((b) => {
      const m = b.label.match(/รุ่น\s*(\d+)/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const next = (Math.max(0, ...nums) || 0) + 1;
  return `รุ่น ${next}`;
}

export function removeBatch(
  courseId: string,
  batchId: string,
): Promise<boolean> {
  return enqueue(async () => {
    const data: CoursesData = {};
    for (const key of Object.keys(cache)) data[key] = cache[key].slice();
    const existing = data[courseId] || [];
    if (!existing.find((b) => b.id === batchId)) return false;
    data[courseId] = existing.filter((b) => b.id !== batchId);
    await writeAtomic(data);
    return true;
  });
}

export type BatchUpdate = Partial<
  Pick<ServerBatch, 'label' | 'date' | 'time' | 'dateISO'>
>;

export function updateBatchInfo(
  courseId: string,
  batchId: string,
  patch: BatchUpdate,
): Promise<ServerBatch | null> {
  return enqueue(async () => {
    const data: CoursesData = {};
    for (const key of Object.keys(cache)) data[key] = cache[key].slice();
    const existing = data[courseId] || [];
    const idx = existing.findIndex((b) => b.id === batchId);
    if (idx === -1) return null;

    if (patch.dateISO && !ISO_RE.test(patch.dateISO)) {
      throw new Error('invalid_date');
    }

    const current = existing[idx];
    const next: ServerBatch = {
      ...current,
      label: patch.label?.trim() || current.label,
      date:
        patch.date?.trim() ||
        (patch.dateISO ? thaiDateString(patch.dateISO) : current.date),
      time: patch.time?.trim() || current.time,
      dateISO: patch.dateISO || current.dateISO,
    };

    const updated = existing.slice();
    updated[idx] = next;
    data[courseId] = updated.sort((a, b) =>
      a.dateISO.localeCompare(b.dateISO),
    );
    await writeAtomic(data);
    return next;
  });
}
