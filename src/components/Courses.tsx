import { motion } from 'framer-motion';
import { courses, type Course } from '../data/courses';
import SectionTitle from './ui/SectionTitle';
import BoldButton from './ui/BoldButton';
import MarqueeText from './ui/MarqueeText';

type Props = {
  onSelect: (courseId: string) => void;
};

export default function Courses({ onSelect }: Props) {
  return (
    <>
      <MarqueeText
        items={['TWO COURSES', 'ZERO FLUFF', 'SHIP REAL WORK']}
        tone="ink-on-sun"
        speed="slow"
      />

      <section id="courses" className="relative bg-paper border-b-3 border-ink">
        <div className="container-narrow section-padding py-20 md:py-28">
          <SectionTitle
            number="01"
            eyebrow="The Lineup"
            title={<>Two Courses.<br />Zero Fluff.</>}
            subtitle="คอร์สเวิร์กช็อปออกแบบมาให้คุณใช้ AI ทำงานจริงได้ทันทีหลังจบคลาส — ไม่ใช่แค่ทำตามตัวอย่าง"
          />

          <div className="mt-14 grid md:grid-cols-2 gap-0 border-3 border-ink">
            {courses.map((c, idx) => (
              <CourseCard
                key={c.id}
                course={c}
                index={idx}
                onSelect={() => onSelect(c.id)}
              />
            ))}
          </div>
        </div>
      </section>
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
  // Card 1 = ink (dark), Card 2 = sun (yellow). Maximum contrast pair.
  const dark = index === 0;
  const wrapper = dark
    ? 'bg-ink text-paper md:border-r-3 border-ink'
    : 'bg-sun text-ink';
  const subText = dark ? 'text-paper/65' : 'text-ink/75';
  const dividerBorder = dark ? 'border-paper/25' : 'border-ink';
  const tagClass = dark
    ? 'inline-flex items-center gap-2 px-2.5 py-1 border-2 border-paper text-[11px] font-bold uppercase tracking-[0.18em] text-paper'
    : 'inline-flex items-center gap-2 px-2.5 py-1 border-2 border-ink text-[11px] font-bold uppercase tracking-[0.18em] text-ink';
  const batchBox = dark
    ? 'border-3 border-paper bg-graphite p-3 hover:bg-sun hover:text-ink hover:border-sun transition-colors'
    : 'border-3 border-ink bg-paper p-3 hover:bg-ink hover:text-sun transition-colors';
  const buttonVariant = dark ? 'sun' : 'ink';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className={`group relative p-6 md:p-10 ${wrapper} transition-colors`}
    >
      <div className="flex items-center justify-between mb-8">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em]">
          / Course 0{index + 1}
        </span>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="font-display text-3xl select-none"
        >
          ✦
        </motion.span>
      </div>

      <p className="font-mono text-sm uppercase tracking-widest mb-2 opacity-80">
        {course.subtitle}
      </p>
      <h3 className="font-display text-display-3 uppercase leading-[0.9] tracking-tight mb-6">
        {course.title}
      </h3>

      <p className={`text-base md:text-lg leading-snug font-medium max-w-md ${subText}`}>
        {course.description}
      </p>

      <div className={`mt-8 pt-6 border-t-3 ${dividerBorder}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] mb-4 opacity-80">
          / Highlights
        </p>
        <ul className="space-y-2.5">
          {course.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-3 text-[15px] font-medium"
            >
              <span className="font-display mt-0.5">→</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {course.audience.map((a) => (
          <span key={a} className={tagClass}>
            {a}
          </span>
        ))}
      </div>

      <div className={`mt-8 pt-6 border-t-3 ${dividerBorder}`}>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] mb-4 opacity-80">
          / Schedule
        </p>
        <div className="grid grid-cols-2 gap-3">
          {course.batches.map((b) => (
            <div key={b.id} className={batchBox}>
              <p className="font-display text-2xl uppercase">{b.label}</p>
              <p className="text-xs font-bold mt-1">{b.date}</p>
              <p className="text-xs">{b.time}</p>
            </div>
          ))}
        </div>
      </div>

      <BoldButton
        variant={buttonVariant}
        size="lg"
        fullWidth
        className="mt-8 group/btn"
        onClick={onSelect}
      >
        เลือกคอร์สนี้
        <span className="transition-transform group-hover/btn:translate-x-1">→</span>
      </BoldButton>
    </motion.div>
  );
}
