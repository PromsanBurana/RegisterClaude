import 'dotenv/config';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, initSchema } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json({ limit: '64kb' }));

const COURSE_BATCHES: Record<string, string[]> = {
  'vibe-coding': ['vibe-2', 'vibe-3'],
  'cowork-automation': ['cowork-1', 'cowork-2'],
};

const PHONE_RE = /^[0-9\-+\s()]{8,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trim(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/register', async (req, res) => {
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
    if (!courseId || !COURSE_BATCHES[courseId]) errors.courseId = 'invalid';
    if (!batchId || !COURSE_BATCHES[courseId]?.includes(batchId))
      errors.batchId = 'invalid';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ ok: false, errors });
    }

    const { rows } = await pool.query(
      `INSERT INTO registrations
        (full_name, phone, email, company, position, course_id, batch_id, expectation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, created_at`,
      [
        fullName,
        phone,
        email,
        company || null,
        position || null,
        courseId,
        batchId,
        expectation || null,
      ],
    );

    res.status(201).json({
      ok: true,
      id: rows[0].id,
      createdAt: rows[0].created_at,
    });
  } catch (err) {
    console.error('[register] Error:', err);
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

app.get('/api/registrations', async (req, res) => {
  try {
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken || req.header('x-admin-token') !== adminToken) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }
    const { rows } = await pool.query(
      `SELECT id, full_name, phone, email, company, position, course_id, batch_id, expectation, created_at
         FROM registrations
         ORDER BY created_at DESC
         LIMIT 500`,
    );
    res.json({ ok: true, count: rows.length, rows });
  } catch (err) {
    console.error('[list] Error:', err);
    res.status(500).json({ ok: false, error: 'internal_error' });
  }
});

// Serve built frontend in production
if (process.env.NODE_ENV !== 'development') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[unhandled]', err);
  res.status(500).json({ ok: false, error: 'internal_error' });
});

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

initSchema()
  .catch((e) => console.error('[init] Schema init failed:', e))
  .finally(() => {
    app.listen(PORT, HOST, () => {
      console.log(`[server] Listening on http://${HOST}:${PORT}`);
    });
  });
