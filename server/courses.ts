// Source of truth for the server: course/batch IDs allowed in submissions
// and human-readable names that get persisted alongside each registration.
// Mirrored by src/data/courses.ts on the frontend.

export type ServerBatch = {
  id: string;
  label: string;
  date: string;
  time: string;
  /** ISO date (YYYY-MM-DD, Asia/Bangkok). Used to gate registrations. */
  dateISO: string;
};

export type ServerCourse = {
  id: string;
  title: string;
  batches: ServerBatch[];
};

export const COURSES: ServerCourse[] = [
  {
    id: 'vibe-coding',
    title: 'Vibe Coding (เขียนโค้ดด้วยความรู้สึก) by Claude Code',
    batches: [
      {
        id: 'vibe-2',
        label: 'รุ่น 2',
        date: 'วันพุธที่ 6 พ.ค.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-05-06',
      },
      {
        id: 'vibe-3',
        label: 'รุ่น 3',
        date: 'วันพุธที่ 13 พ.ค.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-05-13',
      },
      {
        id: 'vibe-4',
        label: 'รุ่น 4',
        date: 'วันพุธที่ 27 พ.ค.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-05-27',
      },
      {
        id: 'vibe-5',
        label: 'รุ่น 5',
        date: 'วันพุธที่ 3 มิ.ย.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-06-03',
      },
      {
        id: 'vibe-6',
        label: 'รุ่น 6',
        date: 'วันพุธที่ 10 มิ.ย.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-06-10',
      },
      {
        id: 'vibe-7',
        label: 'รุ่น 7',
        date: 'วันพุธที่ 24 มิ.ย.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-06-24',
      },
    ],
  },
  {
    id: 'cowork-automation',
    title: 'ระบบงานอัตโนมัติ ด้วย Claude Cowork',
    batches: [
      {
        id: 'cowork-1',
        label: 'รุ่น 1',
        date: 'วันพฤหัสที่ 7 พ.ค.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-05-07',
      },
      {
        id: 'cowork-2',
        label: 'รุ่น 2',
        date: 'วันพฤหัสที่ 14 พ.ค.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-05-14',
      },
      {
        id: 'cowork-3',
        label: 'รุ่น 3',
        date: 'วันพฤหัสที่ 28 พ.ค.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-05-28',
      },
      {
        id: 'cowork-4',
        label: 'รุ่น 4',
        date: 'วันพฤหัสที่ 4 มิ.ย.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-06-04',
      },
      {
        id: 'cowork-5',
        label: 'รุ่น 5',
        date: 'วันพฤหัสที่ 11 มิ.ย.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-06-11',
      },
      {
        id: 'cowork-6',
        label: 'รุ่น 6',
        date: 'วันพฤหัสที่ 25 มิ.ย.',
        time: '09.30 - 12.00 น.',
        dateISO: '2026-06-25',
      },
    ],
  },
];

export function findCourse(id: string): ServerCourse | undefined {
  return COURSES.find((c) => c.id === id);
}

export function findBatch(courseId: string, batchId: string): ServerBatch | undefined {
  return findCourse(courseId)?.batches.find((b) => b.id === batchId);
}

export function batchDisplayName(courseId: string, batchId: string): string | null {
  const b = findBatch(courseId, batchId);
  return b ? `${b.label} • ${b.date} • ${b.time}` : null;
}

// -----------------------------------------------------------------------------
// Date helpers (Asia/Bangkok)
// -----------------------------------------------------------------------------

const BKK_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Today's date in Asia/Bangkok as YYYY-MM-DD (independent of host TZ). */
export function bangkokToday(now: Date = new Date()): string {
  return new Date(now.getTime() + BKK_OFFSET_MS).toISOString().slice(0, 10);
}

/** True if the batch's class date has strictly passed (Bangkok time). */
export function isBatchPast(b: Pick<ServerBatch, 'dateISO'>, now?: Date): boolean {
  return b.dateISO < bangkokToday(now);
}
