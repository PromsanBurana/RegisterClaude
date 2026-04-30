import { motion } from 'framer-motion';
import { courses, type Course } from '../data/courses';

type Props = {
  onSelect: (courseId: string) => void;
};

export default function Courses({ onSelect }: Props) {
  return (
    <section id="courses" className="relative bg-paper border-b-3 border-ink">
      <div className="container-narrow section-padding py-20 md:py-28">
        <SectionHeader
          number="01"
          eyebrow="The Lineup"
          title="Two Courses. Zero Fluff."
          subtitle="คอร์สเวิร์กช็อปที่ออกแบบมาให้คุณใช้ AI ทำงานจริงได้ทันทีหลังจบคลาส"
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
  );
}

export function SectionHeader({
  number,
  eyebrow,
  title,
  subtitle,
  invert = false,
}: {
  number: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  invert?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="grid md:grid-cols-12 gap-6 items-end"
    >
      <div className="md:col-span-7">
        <div className="flex items-center gap-4">
          <span
            className={`font-mono text-sm font-bold ${
              invert ? 'text-sun' : 'text-ink'
            }`}
          >
            [{number}]
          </span>
          <span
            className={`flex-1 h-px ${invert ? 'bg-sun' : 'bg-ink'} opacity-30`}
          />
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.25em] ${
              invert ? 'text-sun' : 'text-ink'
            }`}
          >
            {eyebrow}
          </span>
        </div>
        <h2 className="mt-6 font-display text-display-2 uppercase tracking-tight text-balance leading-[0.9]">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="md:col-span-5 text-base md:text-lg leading-snug font-medium max-w-md md:ml-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
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
  const isFirst = index === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative bg-paper p-6 md:p-10 ${
        isFirst ? 'md:border-r-3 border-ink' : ''
      } hover:bg-cream transition-colors duration-300`}
    >
      {/* Course number */}
      <div className="flex items-center justify-between mb-8">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">
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

      <p className="font-mono text-sm uppercase tracking-widest mb-2">
        {course.subtitle}
      </p>
      <h3 className="font-display text-display-3 uppercase leading-[0.9] tracking-tight mb-6">
        {course.title}
      </h3>

      <p className="text-base md:text-lg leading-snug font-medium max-w-md">
        {course.description}
      </p>

      <div className="mt-8 pt-6 border-t-3 border-ink">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] mb-4">
          / Highlights
        </p>
        <ul className="space-y-2">
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
          <span key={a} className="tag">
            {a}
          </span>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t-3 border-ink">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] mb-4">
          / Schedule
        </p>
        <div className="grid grid-cols-2 gap-3">
          {course.batches.map((b) => (
            <div
              key={b.id}
              className="border-3 border-ink p-3 bg-cream group-hover:bg-sun/60 transition-colors"
            >
              <p className="font-display text-2xl uppercase">{b.label}</p>
              <p className="text-xs font-bold mt-1">{b.date}</p>
              <p className="text-xs">{b.time}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onSelect} className="mt-8 btn-ink w-full group/btn">
        เลือกคอร์สนี้
        <span className="transition-transform group-hover/btn:translate-x-1">
          →
        </span>
      </button>
    </motion.div>
  );
}
