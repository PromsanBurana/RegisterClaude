import { motion } from 'framer-motion';
import { courses, type Course } from '../data/courses';
import Container from './ui/Container';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';

type Props = {
  onSelect: (courseId: string) => void;
};

export default function Courses({ onSelect }: Props) {
  return (
    <Section id="courses" tone="bg">
      <Container>
        <SectionHeader
          eyebrow="The lineup"
          title={
            <>
              Two courses.
              <br />
              <span className="text-fg-secondary">No fluff.</span>
            </>
          }
          description="ออกแบบมาให้คุณใช้ AI ทำงานจริงได้ทันทีหลังจบคลาส ไม่ใช่แค่ทำตามตัวอย่างในวิดีโอ"
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-5">
          {courses.map((c, idx) => (
            <CourseCard
              key={c.id}
              course={c}
              index={idx}
              onSelect={() => onSelect(c.id)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function CourseCard({
  course,
  index,
  onSelect,
}: {
  course: Course;
  index: number;
  onSelect: () => void;
}) {
  return (
    <Card
      tone="surface"
      hoverable
      glow
      size="lg"
      delay={index * 0.08}
      className="flex flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <Badge tone={index === 0 ? 'accent' : 'cyan'} size="md">
          Course 0{index + 1}
        </Badge>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
          {course.subtitle}
        </span>
      </div>

      <h3 className="mt-7 text-display-3 font-semibold text-fg text-balance">
        {course.title}
      </h3>
      <p className="mt-4 text-base text-fg-secondary leading-relaxed">
        {course.description}
      </p>

      <div className="mt-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-fg-muted">
          Highlights
        </p>
        <ul className="mt-4 space-y-2.5">
          {course.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-sm text-fg">
              <CheckIcon />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {course.audience.map((a) => (
          <span
            key={a}
            className="text-[11px] font-medium text-fg-secondary border border-line rounded-full px-2.5 py-0.5"
          >
            {a}
          </span>
        ))}
      </div>

      <div className="mt-8 pt-7 border-t border-line">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-fg-muted">
          Schedule
        </p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {course.batches.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-line bg-elevated p-3.5 hover:border-line-strong transition-colors"
            >
              <p className="text-xs font-medium text-fg-muted">{b.label}</p>
              <p className="mt-1 text-sm font-medium text-fg">{b.date}</p>
              <p className="text-xs text-fg-secondary">{b.time}</p>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        fullWidth
        className="mt-7 group"
        onClick={onSelect}
      >
        เลือกคอร์สนี้
        <motion.span
          aria-hidden
          className="inline-block"
          whileHover={{ x: 2 }}
        >
          →
        </motion.span>
      </Button>
    </Card>
  );
}

function CheckIcon() {
  return (
    <span className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md bg-accent/12 text-accent mt-0.5">
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 8 6.5 11.5 13 4.5" />
      </svg>
    </span>
  );
}
