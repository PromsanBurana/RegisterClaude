import { motion } from 'framer-motion';
import { courses, type Course } from '../data/courses';
import Container from './ui/Container';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import Button from './ui/Button';
import Badge from './ui/Badge';
import TiltCard from './ui/TiltCard';
import MarqueeText from './ui/MarqueeText';
import ChapterMarker from './landing/ChapterMarker';

type Props = {
  onSelect: (courseId: string) => void;
};

const ACCENTS = [
  {
    badge: 'purple' as const,
    glow: 'rgba(123, 97, 255, 0.22)',
    barGradient: 'linear-gradient(110deg, #7B61FF 0%, #00C2FF 100%)',
  },
  {
    badge: 'pink' as const,
    glow: 'rgba(255, 78, 205, 0.20)',
    barGradient: 'linear-gradient(110deg, #FF7A00 0%, #FF4ECD 100%)',
  },
];

export default function Courses({ onSelect }: Props) {
  return (
    <>
      <MarqueeText
        items={[
          'AI',
          'VIBE CODING',
          'AUTOMATION',
          'BUILD FAST',
          'CREATE REAL',
          'CLAUDE COWORK',
        ]}
        tone="gradient"
        speed="slow"
      />
      <Section id="courses" tone="bg">
        <Container>
          <div className="mb-6">
            <ChapterMarker number="03" label="The Workshops" />
          </div>
          <SectionHeader
            eyebrow="Choose your track"
            title={
              <>
                Two courses,
                <br />
                <span className="text-gradient-cool">one playground.</span>
              </>
            }
            description="ออกแบบมาให้คุณใช้ AI ทำงานจริงได้ทันทีหลังจบคลาส ไม่ใช่แค่ทำตามตัวอย่างในวิดีโอ"
          />

          <div className="mt-14 grid lg:grid-cols-2 gap-6">
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
    </>
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
  const accent = ACCENTS[index % ACCENTS.length];
  const lift = index === 0 ? 'lg:translate-y-0' : 'lg:translate-y-6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${lift}`}
    >
      <TiltCard max={5}>
        <div className="group relative rounded-3xl border border-line bg-surface shadow-card overflow-hidden transition-shadow hover:shadow-elevated">
          {/* Top gradient bar */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1.5"
            style={{ background: accent.barGradient }}
          />
          {/* Glow on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(60% 50% at 50% 0%, ${accent.glow}, transparent 70%)`,
            }}
          />

          <div className="relative p-7 sm:p-9 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <Badge tone={accent.badge} size="md">
                Course 0{index + 1}
              </Badge>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
                {course.subtitle}
              </span>
            </div>

            <h3 className="mt-7 text-display-3 font-bold text-ink text-balance">
              {course.title}
            </h3>
            <p className="mt-4 text-base text-fg-secondary leading-relaxed">
              {course.description}
            </p>

            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
                Highlights
              </p>
              <ul className="mt-4 space-y-2.5">
                {course.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-3 text-sm text-ink"
                  >
                    <CheckIcon tone={accent.badge} />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {course.audience.map((a) => (
                <span
                  key={a}
                  className="text-[11px] font-medium text-fg-secondary bg-elevated border border-line rounded-full px-2.5 py-0.5"
                >
                  {a}
                </span>
              ))}
            </div>

            <div className="mt-8 pt-7 border-t border-line">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
                Schedule
              </p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {course.batches.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-xl border border-line bg-elevated p-3.5 hover:border-line-strong transition-colors"
                  >
                    <p className="text-xs font-semibold text-fg-muted">
                      {b.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">
                      {b.date}
                    </p>
                    <p className="text-xs text-fg-secondary">{b.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              className="mt-7 group/btn"
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
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function CheckIcon({ tone }: { tone: 'purple' | 'pink' }) {
  const color = tone === 'purple' ? 'text-brand-purple' : 'text-brand-pink';
  const bg = tone === 'purple' ? 'bg-brand-purple/12' : 'bg-brand-pink/12';
  return (
    <span
      className={`inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md ${bg} ${color} mt-0.5`}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 8 6.5 11.5 13 4.5" />
      </svg>
    </span>
  );
}
