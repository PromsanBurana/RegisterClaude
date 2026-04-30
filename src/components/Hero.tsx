import { motion } from 'framer-motion';
import Marquee from './Marquee';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-28 md:pt-32 bg-cream overflow-hidden"
    >
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      {/* Star ornament */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-32 right-6 md:top-40 md:right-16 font-display text-7xl md:text-9xl pointer-events-none select-none"
      >
        ✦
      </motion.div>

      <div className="relative container-narrow section-padding pt-12 md:pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="tag bg-ink text-cream border-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-sun animate-blink" />
            Now Enrolling — May 2025
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest hidden sm:inline">
            / 02 Courses / 04 Batches
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-display-1 uppercase text-balance"
        >
          เปลี่ยนไอเดีย<br />
          <span className="text-stroke">ให้เป็น</span> ระบบจริง
          <span className="inline-block ml-2 align-top text-3xl md:text-5xl">®</span>
        </motion.h1>

        <div className="mt-10 grid md:grid-cols-12 gap-6 md:gap-10 items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-7 text-lg md:text-2xl font-medium leading-snug max-w-2xl"
          >
            คอร์สเวิร์กช็อปสำหรับคนที่อยากใช้{' '}
            <span className="bg-ink text-cream px-2">AI ทำงานจริง</span> —
            สร้างเว็บด้วย Claude Code และออกแบบ workflow อัตโนมัติด้วย Claude
            Cowork
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3"
          >
            <a href="#register" className="btn-ink group w-full sm:w-auto md:w-full">
              ลงทะเบียนเลย
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a href="#courses" className="btn-outline w-full sm:w-auto md:w-full">
              ดูคอร์สทั้งหมด
            </a>
          </motion.div>
        </div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 border-3 border-ink bg-ink"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`bg-paper p-5 md:p-7 hover:bg-sun transition-colors duration-300 ${
                i < 3 ? 'border-b-3 md:border-b-0 md:border-r-3 border-ink' : ''
              } ${i < 2 && 'border-r-3 md:border-r-3'} ${
                i === 2 && 'md:border-r-3 border-ink'
              }`}
            >
              <p className="number-display text-5xl md:text-7xl">{s.value}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em]">
                / {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <Marquee
        text="WE ARE THE AI DISRUPTION COURSE"
        className="bg-ink text-cream !border-ink"
      />
    </section>
  );
}

const stats = [
  { value: '02', label: 'Courses' },
  { value: '04', label: 'Batches' },
  { value: '2.5h', label: 'Per Class' },
  { value: '30m', label: 'To Ship' },
];
