import Container from './ui/Container';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import Card from './ui/Card';

const reasons = [
  {
    icon: BoltIcon,
    title: 'Ship 10× faster',
    desc: 'ใช้ AI ช่วยร่นเวลา จากชั่วโมงเป็นนาที ขจัด overhead ที่ไม่จำเป็น',
  },
  {
    icon: TargetIcon,
    title: 'Hands-on, not theory',
    desc: 'ลงมือทำจริงตลอดคลาส ออกจากห้องด้วยผลงานที่ใช้ได้',
  },
  {
    icon: SparkleIcon,
    title: 'Templates included',
    desc: 'มี template และ prompt ที่ผ่านการทดสอบแล้ว นำกลับไปใช้ต่อได้ทันที',
  },
  {
    icon: BrainIcon,
    title: 'Systems mindset',
    desc: 'เข้าใจ workflow แบบมืออาชีพ ไม่ใช่ prompt แบบสุ่ม',
  },
  {
    icon: UsersIcon,
    title: 'Small cohorts',
    desc: 'กลุ่มเล็ก ผู้สอนตอบทุกคำถาม ปรึกษาเป็นรายบุคคลได้',
  },
  {
    icon: InfinityIcon,
    title: 'Compounds over time',
    desc: 'เทคนิคที่นำไปต่อยอดได้ ใช้ในงานจริงระยะยาว ไม่ใช่แค่คลาสนี้',
  },
];

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
              <span className="text-fg-secondary">Only output.</span>
            </>
          }
          description="เราโฟกัสที่ผลลัพธ์ — ออกจากคลาสพร้อมผลงานและทักษะที่ใช้ได้จริงในงานของคุณ"
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasons.map((r, i) => (
            <Card
              key={r.title}
              tone="surface"
              hoverable
              size="md"
              delay={i * 0.05}
            >
              <r.icon />
              <h3 className="mt-6 text-lg font-semibold text-fg">{r.title}</h3>
              <p className="mt-2 text-sm text-fg-secondary leading-relaxed">
                {r.desc}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function IconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-elevated text-accent">
      {children}
    </div>
  );
}

function BoltIcon() {
  return (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    </IconWrapper>
  );
}

function TargetIcon() {
  return (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </IconWrapper>
  );
}

function SparkleIcon() {
  return (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
      </svg>
    </IconWrapper>
  );
}

function BrainIcon() {
  return (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-3 3 3 3 0 0 0 1.5 2.6A3 3 0 0 0 6 17a3 3 0 0 0 3 3V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 3 3 3 3 0 0 1-1.5 2.6A3 3 0 0 1 18 17a3 3 0 0 1-3 3V4z" />
      </svg>
    </IconWrapper>
  );
}

function UsersIcon() {
  return (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <path d="M16 11a3.2 3.2 0 0 0 0-6.4M21.5 20a5.6 5.6 0 0 0-4-5.4" />
      </svg>
    </IconWrapper>
  );
}

function InfinityIcon() {
  return (
    <IconWrapper>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12c0-2.5 2-4.5 4.5-4.5S14 9.5 14.5 12c.5 2.5 2.5 4.5 5 4.5S24 14.5 24 12s-2-4.5-4.5-4.5S15 9.5 14.5 12c-.5 2.5-2.5 4.5-5 4.5S5 14.5 5 12z" />
      </svg>
    </IconWrapper>
  );
}
