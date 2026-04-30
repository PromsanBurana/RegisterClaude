import { motion } from 'framer-motion';
import MarqueeText from './ui/MarqueeText';
import { BoldAnchor } from './ui/BoldButton';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-20 md:pt-24 bg-sun overflow-hidden"
    >
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      {/* Asterisk ornament */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        aria-hidden
        className="absolute top-28 right-4 md:top-32 md:right-12 font-display text-7xl md:text-[9rem] pointer-events-none select-none leading-none"
      >
        ✦
      </motion.div>

      <div className="relative container-narrow section-padding pt-12 md:pt-20 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-10"
        >
          <span className="tag-pill bg-ink text-sun border-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-sun animate-blink" />
            Bold Disruption Workshop · 2025
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest hidden sm:inline">
            / 02 Courses · 04 Batches · เริ่ม พ.ค.
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-display-mega uppercase text-balance"
        >
          Build
          <br />
          <span className="text-stroke">Real</span> Systems
          <br />
          With AI
          <span className="inline-block ml-2 align-top text-3xl md:text-6xl">®</span>
        </motion.h1>

        <div className="mt-12 grid md:grid-cols-12 gap-8 md:gap-10 items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-7"
          >
            <p className="text-lg md:text-2xl font-medium leading-snug max-w-2xl">
              เปลี่ยนไอเดียให้กลายเป็น{' '}
              <span className="bg-ink text-sun px-2">ระบบใช้งานจริง</span>{' '}
              ภายในครึ่งชั่วโมง — เวิร์กช็อปสำหรับคนที่ใช้{' '}
              <span className="underline decoration-4 underline-offset-4">
                Claude
              </span>{' '}
              อย่างจริงจัง ไม่ใช่แค่ลอง prompt
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3"
          >
            <BoldAnchor href="#register" variant="ink" size="lg" fullWidth>
              ลงทะเบียนเลย
              <span aria-hidden>→</span>
            </BoldAnchor>
            <BoldAnchor href="#courses" variant="outline-ink" size="lg" fullWidth>
              ดูคอร์สทั้งหมด
            </BoldAnchor>
          </motion.div>
        </div>

        {/* Stats slab */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 border-3 border-ink"
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`bg-paper p-5 md:p-7 hover:bg-ink hover:text-sun transition-colors duration-300 cursor-default ${
                i < 3
                  ? 'border-b-3 md:border-b-0 md:border-r-3 border-ink'
                  : ''
              } ${i % 2 === 0 ? 'border-r-3 md:border-r-3 border-ink' : ''} ${
                i === 1 ? 'border-r-0 md:border-r-3' : ''
              }`}
            >
              <p className="font-display text-display-stat leading-none tracking-tight">
                {s.value}
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                / {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <MarqueeText
        items={[
          'VIBE CODING',
          'CLAUDE CODE',
          'AUTOMATION',
          'CLAUDE COWORK',
          'BUILD REAL THINGS',
        ]}
        tone="paper-on-ink"
      />
    </section>
  );
}

const STATS = [
  { value: '02', label: 'Courses' },
  { value: '04', label: 'Batches' },
  { value: '2.5h', label: 'Per Class' },
  { value: '30m', label: 'To Ship' },
];
