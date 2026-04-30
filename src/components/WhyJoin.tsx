import { motion } from 'framer-motion';
import Container from './ui/Container';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';

type Tone = 'purple' | 'orange' | 'cyan' | 'pink';

const reasons: Array<{
  icon: () => JSX.Element;
  tone: Tone;
  title: string;
  desc: string;
}> = [
  {
    icon: BoltIcon,
    tone: 'orange',
    title: 'Ship 10× faster',
    desc: 'ใช้ AI ช่วยร่นเวลา จากชั่วโมงเป็นนาที ขจัด overhead ที่ไม่จำเป็น',
  },
  {
    icon: TargetIcon,
    tone: 'purple',
    title: 'Hands-on, not theory',
    desc: 'ลงมือทำจริงตลอดคลาส ออกจากห้องด้วยผลงานที่ใช้ได้',
  },
  {
    icon: SparkleIcon,
    tone: 'pink',
    title: 'Templates included',
    desc: 'มี template และ prompt ที่ผ่านการทดสอบแล้ว นำกลับไปใช้ต่อได้ทันที',
  },
  {
    icon: BrainIcon,
    tone: 'cyan',
    title: 'Systems mindset',
    desc: 'เข้าใจ workflow แบบมืออาชีพ ไม่ใช่ prompt แบบสุ่ม',
  },
  {
    icon: UsersIcon,
    tone: 'purple',
    title: 'Small cohorts',
    desc: 'กลุ่มเล็ก ผู้สอนตอบทุกคำถาม ปรึกษาเป็นรายบุคคลได้',
  },
  {
    icon: InfinityIcon,
    tone: 'orange',
    title: 'Compounds over time',
    desc: 'เทคนิคที่นำไปต่อยอดได้ ใช้ในงานจริงระยะยาว ไม่ใช่แค่คลาสนี้',
  },
];

const TONE_BG: Record<Tone, string> = {
  purple: 'bg-gradient-to-br from-brand-purple to-brand-cyan',
  orange: 'bg-gradient-to-br from-brand-orange to-brand-pink',
  cyan: 'bg-gradient-to-br from-brand-cyan to-brand-purple',
  pink: 'bg-gradient-to-br from-brand-pink to-brand-orange',
};

const HOVER_GLOW: Record<Tone, string> = {
  purple:
    'after:[background:radial-gradient(60%_50%_at_50%_0%,rgba(123,97,255,0.18),transparent_70%)]',
  orange:
    'after:[background:radial-gradient(60%_50%_at_50%_0%,rgba(255,122,0,0.18),transparent_70%)]',
  cyan: 'after:[background:radial-gradient(60%_50%_at_50%_0%,rgba(0,194,255,0.18),transparent_70%)]',
  pink: 'after:[background:radial-gradient(60%_50%_at_50%_0%,rgba(255,78,205,0.18),transparent_70%)]',
};

export default function WhyJoin() {
  return (
    <Section id="why" tone="bg">
      <Container>
        <SectionHeader
          eyebrow="Why join"
          title={
            <>
              No theory.
              <br />
              <span className="text-gradient-warm">Only output.</span>
            </>
          }
          description="เราโฟกัสที่ผลลัพธ์ — ออกจากคลาสพร้อมผลงานและทักษะที่ใช้ได้จริงในงานของคุณ"
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className={`group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-7 shadow-soft transition-shadow hover:shadow-card after:absolute after:inset-0 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none ${HOVER_GLOW[r.tone]}`}
            >
              <div
                className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-soft ${TONE_BG[r.tone]}`}
              >
                <r.icon />
              </div>
              <h3 className="relative mt-6 text-lg font-bold text-ink">{r.title}</h3>
              <p className="relative mt-2 text-sm text-fg-secondary leading-relaxed">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-3 3 3 3 0 0 0 1.5 2.6A3 3 0 0 0 6 17a3 3 0 0 0 3 3V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 3 3 3 3 0 0 1-1.5 2.6A3 3 0 0 1 18 17a3 3 0 0 1-3 3V4z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 11a3.2 3.2 0 0 0 0-6.4M21.5 20a5.6 5.6 0 0 0-4-5.4" />
    </svg>
  );
}
function InfinityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12c0-2.5 2-4.5 4.5-4.5S14 9.5 14.5 12c.5 2.5 2.5 4.5 5 4.5S24 14.5 24 12s-2-4.5-4.5-4.5S15 9.5 14.5 12c-.5 2.5-2.5 4.5-5 4.5S5 14.5 5 12z" />
    </svg>
  );
}
