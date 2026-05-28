import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  STORE_PATH,
  listAll,
  create,
  updateStatus,
  updateBatch,
  remove,
  type RegistrationStatus,
} from './store.js';
import {
  getCoursesSync,
  findCourse,
  findBatch,
  batchDisplayName,
  isBatchPast,
  addBatch,
  removeBatch,
  updateBatchInfo,
  COURSES_PATH,
} from './courseStore.js';
import {
  attachUser,
  requireAuth,
  requireRole,
  verifyPassword,
  createSessionToken,
  cookieOptions,
  SESSION_COOKIE,
  type AuthedRequest,
} from './auth.js';
import {
  findUserByUsername,
  USERS_PATH,
} from './userStore.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());

const PHONE_RE = /^[0-9\-+\s()]{8,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_STATUSES: ReadonlyArray<RegistrationStatus> = [
  'new',
  'contacted',
  'confirmed',
  'cancelled',
] as const;

const BATCH_CAPACITY = 15;

/** Counts active (non-cancelled) registrations per courseId::batchId. */
async function getBatchCounts(): Promise<Map<string, number>> {
  const all = await listAll();
  const counts = new Map<string, number>();
  for (const r of all) {
    if (r.status === 'cancelled') continue;
    const key = `${r.courseId}::${r.batchId}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function trim(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

function publicUser(u: {
  id: string;
  username: string;
  role: 'admin' | 'viewer';
}) {
  return { id: u.id, username: u.username, role: u.role };
}

console.log(`[server] Registrations: ${STORE_PATH}`);
console.log(`[server] Users:         ${USERS_PATH}`);
console.log(`[server] Courses:       ${COURSES_PATH}`);

// ---------- Auth ----------

app.post('/api/auth/login', (req, res) => {
  const username = trim(req.body?.username, 100);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: 'invalid_credentials' });
  }
  const user = findUserByUsername(username);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ ok: false, error: 'invalid_credentials' });
  }
  const { token, maxAgeMs } = createSessionToken(user.id);
  res.cookie(SESSION_COOKIE, token, cookieOptions(maxAgeMs));
  res.json({ ok: true, user: publicUser(user) });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/auth/me', attachUser, (req, res) => {
  const user = (req as AuthedRequest).user;
  if (!user) return res.status(401).json({ ok: false, error: 'unauthorized' });
  res.json({ ok: true, user: publicUser(user) });
});

// ---------- Courses (public read + admin write) ----------

app.get('/api/courses', (_req, res) => {
  res.json(getCoursesSync());
});

app.post(
  '/api/courses/:courseId/batches',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const courseId = trim(req.params.courseId, 60);
      const dateISO = trim(req.body?.dateISO, 10);
      const label = trim(req.body?.label, 60);
      const time = trim(req.body?.time, 60);
      const date = trim(req.body?.date, 80);
      if (!findCourse(courseId)) {
        return res.status(400).json({ ok: false, error: 'invalid_course' });
      }
      const batch = await addBatch(courseId, { label, dateISO, time, date });
      res.status(201).json(batch);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'invalid_date' || msg === 'invalid_course') {
        return res.status(400).json({ ok: false, error: msg });
      }
      console.error('[POST batch]', err);
      res.status(500).json({ ok: false, error: 'internal_error' });
    }
  },
);

app.patch(
  '/api/courses/:courseId/batches/:batchId',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const courseId = trim(req.params.courseId, 60);
      const batchId = trim(req.params.batchId, 100);
      const patch = {
        label: req.body?.label !== undefined ? trim(req.body.label, 60) : undefined,
        date: req.body?.date !== undefined ? trim(req.body.date, 80) : undefined,
        time: req.body?.time !== undefined ? trim(req.body.time, 60) : undefined,
        dateISO:
          req.body?.dateISO !== undefined ? trim(req.body.dateISO, 10) : undefined,
      };
      const updated = await updateBatchInfo(courseId, batchId, patch);
      if (!updated) return res.status(404).json({ ok: false, error: 'not_found' });
      res.json(updated);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'invalid_date') {
        return res.status(400).json({ ok: false, error: msg });
      }
      console.error('[PATCH batch]', err);
      res.status(500).json({ ok: false, error: 'internal_error' });
    }
  },
);

app.delete(
  '/api/courses/:courseId/batches/:batchId',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const courseId = trim(req.params.courseId, 60);
      const batchId = trim(req.params.batchId, 100);
      const ok = await removeBatch(courseId, batchId);
      if (!ok) return res.status(404).json({ ok: false, error: 'not_found' });
      res.json({ ok: true });
    } catch (err) {
      console.error('[DELETE batch]', err);
      res.status(500).json({ ok: false, error: 'internal_error' });
    }
  },
);

// ---------- Batch availability (public) ----------

app.get('/api/batches', async (_req, res) => {
  try {
    const counts = await getBatchCounts();
    const result: Array<{
      courseId: string;
      batchId: string;
      capacity: number;
      count: number;
      available: number;
      isFull: boolean;
    }> = [];
    for (const c of getCoursesSync()) {
      for (const b of c.batches) {
        // Hide past batches from the public availability feed entirely
        if (isBatchPast(b)) continue;
        const count = counts.get(`${c.id}::${b.id}`) || 0;
        result.push({
          courseId: c.id,
          batchId: b.id,
          capacity: BATCH_CAPACITY,
          count,
          available: Math.max(0, BATCH_CAPACITY - count),
          isFull: count >= BATCH_CAPACITY,
        });
      }
    }
    res.json(result);
  } catch (err) {
    console.error('[GET /api/batches]', err);
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

// ---------- Health ----------

app.get('/api/health', async (_req, res) => {
  const all = await listAll();
  res.json({
    ok: true,
    time: new Date().toISOString(),
    registrations: all.length,
  });
});

// ---------- Public registration (form submission) ----------

app.post('/api/registrations', async (req, res) => {
  try {
    const fullName = trim(req.body?.fullName, 200);
    const phone = trim(req.body?.phone, 50);
    const email = trim(req.body?.email, 200).toLowerCase();
    const company = trim(req.body?.company, 200);
    const position = trim(req.body?.position, 200);
    const courseId = trim(req.body?.courseId, 60);
    const batchId = trim(req.body?.batchId, 60);
    const expectation = trim(req.body?.expectation, 2000);

    const errors: Record<string, string> = {};
    if (!fullName) errors.fullName = 'required';
    if (!phone) errors.phone = 'required';
    else if (!PHONE_RE.test(phone)) errors.phone = 'invalid';
    if (!email) errors.email = 'required';
    else if (!EMAIL_RE.test(email)) errors.email = 'invalid';

    const course = findCourse(courseId);
    if (!course) errors.courseId = 'invalid';
    const batch = findBatch(courseId, batchId);
    if (!batch) errors.batchId = 'invalid';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    // Reject past batches — they shouldn't be in the dropdown anyway
    if (batch && isBatchPast(batch)) {
      return res.status(410).json({
        ok: false,
        error: 'batch_past',
        errors: { batchId: 'batch_past' },
      });
    }

    // Capacity check — block if the chosen batch is already at the cap
    const counts = await getBatchCounts();
    const currentCount = counts.get(`${courseId}::${batchId}`) || 0;
    if (currentCount >= BATCH_CAPACITY) {
      return res.status(409).json({
        ok: false,
        error: 'batch_full',
        errors: { batchId: 'batch_full' },
      });
    }

    const reg = await create({
      fullName,
      phone,
      email,
      company,
      position,
      courseId,
      courseName: course!.title,
      batchId,
      batchName: batchDisplayName(courseId, batchId)!,
      expectation,
    });

    res.status(201).json(reg);
  } catch (err) {
    console.error('[POST /api/registrations]', err);
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

// ---------- Admin-only registration management ----------

app.get(
  '/api/registrations',
  requireAuth,
  requireRole('admin'),
  async (_req, res) => {
    try {
      const rows = await listAll();
      res.json(rows);
    } catch (err) {
      console.error('[GET /api/registrations]', err);
      res.status(500).json({ ok: false, error: 'internal_error' });
    }
  },
);

app.patch(
  '/api/registrations/:id/batch',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const id = trim(req.params.id, 100);
      const newCourseId = trim(req.body?.courseId, 60);
      const newBatchId = trim(req.body?.batchId, 60);

      const course = findCourse(newCourseId);
      if (!course) {
        return res.status(400).json({ ok: false, error: 'invalid_course' });
      }
      const batch = findBatch(newCourseId, newBatchId);
      if (!batch) {
        return res.status(400).json({ ok: false, error: 'invalid_batch' });
      }
      if (isBatchPast(batch)) {
        return res.status(410).json({
          ok: false,
          error: 'target_batch_past',
        });
      }

      const all = await listAll();
      const reg = all.find((r) => r.id === id);
      if (!reg) {
        return res.status(404).json({ ok: false, error: 'not_found' });
      }

      // No-op if already in the target batch
      if (reg.courseId === newCourseId && reg.batchId === newBatchId) {
        return res.json(reg);
      }

      // Capacity guard on the destination — exclude this registration in case
      // it's already counted there (defensive; the no-op above already handles
      // the same-batch case).
      const counts = await getBatchCounts();
      let targetCount = counts.get(`${newCourseId}::${newBatchId}`) || 0;
      if (
        reg.courseId === newCourseId &&
        reg.batchId === newBatchId &&
        reg.status !== 'cancelled'
      ) {
        targetCount -= 1;
      }
      if (targetCount >= BATCH_CAPACITY) {
        return res.status(409).json({
          ok: false,
          error: 'target_batch_full',
        });
      }

      const updated = await updateBatch(id, {
        courseId: newCourseId,
        courseName: course.title,
        batchId: newBatchId,
        batchName: batchDisplayName(newCourseId, newBatchId)!,
      });
      if (!updated) {
        return res.status(404).json({ ok: false, error: 'not_found' });
      }
      res.json(updated);
    } catch (err) {
      console.error('[PATCH /api/registrations/:id/batch]', err);
      res.status(500).json({ ok: false, error: 'internal_error' });
    }
  },
);

app.patch(
  '/api/registrations/:id/status',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const id = trim(req.params.id, 100);
      const status = trim(req.body?.status, 20) as RegistrationStatus;
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({ ok: false, error: 'invalid_status' });
      }
      const updated = await updateStatus(id, status);
      if (!updated) return res.status(404).json({ ok: false, error: 'not_found' });
      res.json(updated);
    } catch (err) {
      console.error('[PATCH /api/registrations/:id/status]', err);
      res.status(500).json({ ok: false, error: 'internal_error' });
    }
  },
);

app.delete(
  '/api/registrations/:id',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    try {
      const id = trim(req.params.id, 100);
      const ok = await remove(id);
      if (!ok) return res.status(404).json({ ok: false, error: 'not_found' });
      res.json({ ok: true });
    } catch (err) {
      console.error('[DELETE /api/registrations/:id]', err);
      res.status(500).json({ ok: false, error: 'internal_error' });
    }
  },
);

// ---------- Static frontend (production) ----------

if (process.env.NODE_ENV !== 'development') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ---------- Error handler ----------

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[unhandled]', err);
  res.status(500).json({ ok: false, error: 'internal_error' });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] Listening on http://0.0.0.0:${PORT}`);
});
