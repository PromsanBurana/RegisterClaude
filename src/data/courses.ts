export type Batch = {
  id: string;
  label: string;
  date: string;
  time: string;
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
      },
      {
        id: 'vibe-3',
        label: 'รุ่น 3',
        date: 'วันพุธที่ 13 พ.ค.',
        time: '09.30 - 12.00 น.',
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
      },
      {
        id: 'cowork-2',
        label: 'รุ่น 2',
        date: 'วันพฤหัสที่ 14 พ.ค.',
        time: '09.30 - 12.00 น.',
      },
    ],
    accent: 'cyan',
    icon: '🤖',
  },
];

export const findCourseById = (id: string) =>
  courses.find((c) => c.id === id);
