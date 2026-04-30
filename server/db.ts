import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = process.env.DATA_DIR || (process.env.RAILWAY_ENVIRONMENT ? '/data' : path.resolve('./data'));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'registrations.db');
console.log(`[db] SQLite database file: ${DB_PATH}`);

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Run migrations immediately at import time so prepared statements below
// can be compiled against an existing schema.
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name   TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT NOT NULL,
    company     TEXT,
    position    TEXT,
    course_id   TEXT NOT NULL,
    batch_id    TEXT NOT NULL,
    expectation TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_registrations_email
    ON registrations(email);
  CREATE INDEX IF NOT EXISTS idx_registrations_course_batch
    ON registrations(course_id, batch_id);
`);
console.log('[db] Schema ready.');

export type Registration = {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  company: string | null;
  position: string | null;
  course_id: string;
  batch_id: string;
  expectation: string | null;
  created_at: string;
};

const insertStmt = db.prepare<unknown[], { id: number; created_at: string }>(`
  INSERT INTO registrations
    (full_name, phone, email, company, position, course_id, batch_id, expectation)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  RETURNING id, created_at
`);

export function insertRegistration(r: {
  fullName: string;
  phone: string;
  email: string;
  company: string;
  position: string;
  courseId: string;
  batchId: string;
  expectation: string;
}) {
  return insertStmt.get(
    r.fullName,
    r.phone,
    r.email,
    r.company || null,
    r.position || null,
    r.courseId,
    r.batchId,
    r.expectation || null,
  )!;
}

const listStmt = db.prepare<[], Registration>(`
  SELECT id, full_name, phone, email, company, position,
         course_id, batch_id, expectation, created_at
    FROM registrations
   ORDER BY created_at DESC
   LIMIT 500
`);

export function listRegistrations() {
  return listStmt.all();
}

const countStmt = db.prepare<[], { count: number }>(
  `SELECT COUNT(*) AS count FROM registrations`,
);
export function countRegistrations() {
  return countStmt.get()?.count ?? 0;
}
