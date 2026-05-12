export type Batch = {
  id: string;
  label: string;
  date: string;
  time: string;
  /** ISO date (YYYY-MM-DD, Asia/Bangkok). Used to hide past batches. */
  dateISO: string;
};

export type Course = {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  highlights: string[];
  audience: string[];
  batches: Batch[];
  accent: 'purple' | 'cyan';
  icon: string;
  exampleUrl?: string;
};

export const courses: Course[] = [
  {
    id: 'vibe-coding',
    title: 'Vibe Coding (เขียนโค้ดด้วยความรู้สึก)',
    shortTitle: 'Vibe Coding',
    subtitle: 'by Claude Code',
    description:
      'เรียนรู้การสร้างเว็บไซต์และระบบจริงด้วย Claude Code โดยไม่ต้องเริ่มจากศูนย์ เหมาะสำหรับคนที่อยากเปลี่ยนไอเดียให้เป็นผลงานจริงอย่างรวดเร็ว',
    highlights: [
      'เขียนโค้ดด้วย AI แบบเป็นขั้นตอน',
      'สร้างเว็บหรือระบบต้นแบบได้เร็ว',
      'เริ่มจากไอเดียจนถึงผลงานใช้งานจริง',
      'ตัวอย่างผลงานรุ่น 1 สร้างเสร็จในครึ่งชั่วโมง',
    ],
    audience: ['Developer', 'Designer', 'Business Owner', 'AI Enthusiast'],
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
    ],
    accent: 'purple',
    icon: '⚡',
    exampleUrl: 'https://p-oil-project-production.up.railway.app/',
  },
  {
    id: 'cowork-automation',
    title: 'ระบบงานอัตโนมัติ ด้วย Claude Cowork',
    shortTitle: 'Claude Cowork',
    subtitle: 'Workflow Automation',
    description:
      'เรียนรู้การออกแบบระบบงานอัตโนมัติด้วย Claude Cowork เพื่อช่วยลดงานซ้ำ ๆ เพิ่มประสิทธิภาพ และทำให้ทีมทำงานเร็วขึ้น',
    highlights: [
      'ออกแบบ workflow อัตโนมัติ',
      'ใช้ AI เป็นผู้ช่วยทำงานร่วมกับทีม',
      'ลดงาน manual และงานซ้ำ',
      'ขยายผลใช้งานได้กับหลายแผนก',
    ],
    audience: ['ทีมธุรกิจ', 'Project Manager', 'Developer', 'Operations'],
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
    ],
    accent: 'cyan',
    icon: '🤖',
  },
];

export const findCourseById = (id: string) =>
  courses.find((c) => c.id === id);

// -----------------------------------------------------------------------------
// Date helpers (Asia/Bangkok)
// -----------------------------------------------------------------------------

const BKK_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Today's date in Asia/Bangkok as YYYY-MM-DD (independent of server TZ). */
export function bangkokToday(now: Date = new Date()): string {
  return new Date(now.getTime() + BKK_OFFSET_MS).toISOString().slice(0, 10);
}

/** True if the batch's class date has strictly passed (Bangkok time). */
export function isBatchPast(b: Pick<Batch, 'dateISO'>, now?: Date): boolean {
  return b.dateISO < bangkokToday(now);
}

/** Returns only batches whose date is today or in the future. */
export function upcomingBatches(course: Course, now?: Date): Batch[] {
  return course.batches.filter((b) => !isBatchPast(b, now));
}
