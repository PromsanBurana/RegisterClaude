import { motion } from 'framer-motion';
import Container from './ui/Container';
import { ButtonAnchor } from './ui/Button';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-bg pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36"
    >
      {/* Subtle indigo glow */}
      <div
        aria-hidden
        className="glow-orb absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full opacity-60 animate-glow-pulse"
        style={{
          background:
            'radial-gradient(closest-side, rgba(99,102,241,0.45), rgba(99,102,241,0) 70%)',
        }}
      />
      <div
        aria-hidden
        className="glow-orb absolute -top-20 right-0 h-[360px] w-[420px] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(closest-side, rgba(34,211,238,0.35), rgba(34,211,238,0) 70%)',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 grid-pattern opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]"
      />

      <Container size="xl" className="relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Now enrolling — May 2025
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-7 text-display-1 font-semibold text-fg text-balance"
          >
            Build real systems
            <br className="hidden sm:block" />{' '}
            <span className="bg-gradient-to-br from-fg via-fg to-fg/60 bg-clip-text text-transparent">
              with AI.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-fg-secondary leading-relaxed text-balance"
          >
            คอร์สเวิร์กช็อปที่สอนใช้{' '}
            <span className="text-fg font-medium">Claude Code</span> และ{' '}
            <span className="text-fg font-medium">Claude Cowork</span>{' '}
            สำหรับคนที่อยากเปลี่ยนไอเดียให้เป็นระบบใช้งานจริง — ไม่ใช่แค่ลอง prompt
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <ButtonAnchor href="#register" variant="primary" size="lg">
              ลงทะเบียนเลย
              <span aria-hidden>→</span>
            </ButtonAnchor>
            <ButtonAnchor href="#courses" variant="secondary" size="lg">
              ดูคอร์สทั้งหมด
            </ButtonAnchor>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-fg-muted"
          >
            <Trust label="Workshop format" value="Live, hands-on" />
            <span className="hidden sm:inline-block w-px h-3 bg-line" />
            <Trust label="Class size" value="Small group" />
            <span className="hidden sm:inline-block w-px h-3 bg-line" />
            <Trust label="Outcome" value="Ship in 30 minutes" />
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-20 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl border border-line bg-line/60 overflow-hidden"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-surface px-6 py-7 transition-colors hover:bg-elevated"
            >
              <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg">
                {s.value}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-fg-muted">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function Trust({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-fg-muted">{label}</span>
      <span className="text-fg-secondary font-medium">{value}</span>
    </div>
  );
}

const STATS = [
  { value: '02', label: 'Courses' },
  { value: '04', label: 'Cohorts' },
  { value: '2.5h', label: 'Per session' },
  { value: '30m', label: 'To shipped' },
];
