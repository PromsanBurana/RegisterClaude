import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    '[db] DATABASE_URL is not set — registration endpoint will fail until it is configured.',
  );
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err);
});

export async function initSchema() {
  if (!connectionString) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id SERIAL PRIMARY KEY,
      full_name   TEXT NOT NULL,
      phone       TEXT NOT NULL,
      email       TEXT NOT NULL,
      company     TEXT,
      position    TEXT,
      course_id   TEXT NOT NULL,
      batch_id    TEXT NOT NULL,
      expectation TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_registrations_course_batch ON registrations(course_id, batch_id);`,
  );
  console.log('[db] Schema ready.');
}
