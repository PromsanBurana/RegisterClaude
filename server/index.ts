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
  remove,
  type RegistrationStatus,
} from './store.js';
import { findCourse, findBatch, batchDisplayName } from './courses.js';
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
