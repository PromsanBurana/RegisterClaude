import { motion } from 'framer-motion';
import Container from './ui/Container';
import { ButtonAnchor } from './ui/Button';
import MeshBackdrop from './ui/MeshBackdrop';
import FloatingShapes from './ui/FloatingShapes';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-bg pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-32"
    >
      <MeshBackdrop intensity="normal" />
      <FloatingShapes />

      <Container size="xl" className="relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-brand-orange animate-ping opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-brand-orange" />
            </span>
            Now enrolling — May 2025
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-7 text-display-1 font-extrabold text-ink text-balance"
          >
            Build cool stuff
            <br className="hidden sm:block" />{' '}
            <span className="text-gradient-brand bg-[length:200%_200%] animate-gradient-text">
              with AI.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-7 max-w-2xl text-base sm:text-lg lg:text-xl text-fg-secondary leading-relaxed text-balance"
          >
            เวิร์กช็อปสำหรับคนที่อยากเล่นกับ{' '}
            <span className="font-semibold text-ink">Claude Code</span> และ{' '}
            <span className="font-semibold text-ink">Claude Cowork</span> —
            เปลี่ยนไอเดียเป็นของจริงในคลาสเดียว
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
            <Trust label="Format" value="Live · hands-on" />
            <span className="hidden sm:inline-block w-px h-3 bg-line" />
            <Trust label="Class" value="Small group" />
            <span className="hidden sm:inline-block w-px h-3 bg-line" />
            <Trust label="Outcome" value="Ship in 30 min" />
          </motion.div>
        </div>

        {/* Floating product cards row — adds depth */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-20 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl border border-line bg-surface/80 backdrop-blur p-5 sm:p-6 shadow-soft hover:shadow-card transition-all hover:-translate-y-0.5"
              style={{
                transform: `rotate(${[(0), -1, 1, 0][i] ?? 0}deg)`,
              }}
            >
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
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
      <span className="text-ink font-medium">{value}</span>
    </div>
  );
}

const STATS = [
  { value: '02', label: 'Courses' },
  { value: '04', label: 'Cohorts' },
  { value: '2.5h', label: 'Per session' },
  { value: '30m', label: 'To shipped' },
];
