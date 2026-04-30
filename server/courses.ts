// Source of truth for the server: course/batch IDs allowed in submissions
// and human-readable names that get persisted alongside each registration.
// Mirrored by src/data/courses.ts on the frontend.

export type ServerBatch = {
  id: string;
  label: string;
  date: string;
  time: string;
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
      },
      {
        id: 'vibe-3',
        label: 'รุ่น 3',
        date: 'วันพุธที่ 13 พ.ค.',
        time: '09.30 - 12.00 น.',
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
      },
      {
        id: 'cowork-2',
        label: 'รุ่น 2',
        date: 'วันพฤหัสที่ 14 พ.ค.',
        time: '09.30 - 12.00 น.',
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
