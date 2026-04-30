import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Container from './ui/Container';
import { ButtonAnchor } from './ui/Button';
import FloatingShapes from './ui/FloatingShapes';
import AnimatedHeadline from './ui/AnimatedHeadline';
import MagneticButton from './ui/MagneticButton';
import CountUp from './ui/CountUp';

const STATS: Array<{ value: string; label: string; padStart?: number }> = [
  { value: '02', label: 'Courses', padStart: 2 },
  { value: '04', label: 'Cohorts', padStart: 2 },
  { value: '2.5h', label: 'Per session' },
  { value: '30m', label: 'To shipped' },
];

export default function Hero() {
  // Mouse parallax for the gradient blobs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  const blob1X = useTransform(smx, [-1, 1], [-30, 30]);
  const blob1Y = useTransform(smy, [-1, 1], [-20, 20]);
  const blob2X = useTransform(smx, [-1, 1], [25, -25]);
  const blob2Y = useTransform(smy, [-1, 1], [15, -15]);
  const blob3X = useTransform(smx, [-1, 1], [-15, 15]);
  const blob3Y = useTransform(smy, [-1, 1], [20, -20]);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-bg pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-32"
    >
      {/* Mouse-parallax mesh */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={{ x: blob1X, y: blob1Y, filter: 'blur(70px)' }}
          className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full opacity-70"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: 'radial-gradient(closest-side, #7B61FF, transparent 70%)',
            }}
          />
        </motion.div>
        <motion.div
          style={{ x: blob2X, y: blob2Y, filter: 'blur(70px)' }}
          className="absolute -top-24 right-[-10%] h-[460px] w-[460px] rounded-full opacity-70"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: 'radial-gradient(closest-side, #00C2FF, transparent 70%)',
            }}
          />
        </motion.div>
        <motion.div
          style={{ x: blob3X, y: blob3Y, filter: 'blur(80px)' }}
          className="absolute bottom-[-15%] left-[15%] h-[420px] w-[420px] rounded-full opacity-65"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: 'radial-gradient(closest-side, #FF4ECD, transparent 70%)',
            }}
          />
        </motion.div>
      </div>
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

          <div className="mt-7">
            <AnimatedHeadline
              className="text-display-1 font-extrabold text-ink text-balance text-center items-center"
              startDelay={0.05}
              charStagger={0.022}
              lines={[
                ['Build', 'cool', 'stuff', 'with'],
                [{ text: 'Claude Code.', gradient: 'brand' }],
              ]}
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <MagneticButton strength={0.3}>
              <ButtonAnchor href="#register" variant="primary" size="lg">
                ลงทะเบียนเลย
                <span aria-hidden>→</span>
              </ButtonAnchor>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <ButtonAnchor href="#courses" variant="secondary" size="lg">
                ดูคอร์สทั้งหมด
              </ButtonAnchor>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-fg-muted"
          >
            <Trust label="Format" value="Live · hands-on" />
            <span className="hidden sm:inline-block w-px h-3 bg-line" />
            <Trust label="Class" value="Small group" />
            <span className="hidden sm:inline-block w-px h-3 bg-line" />
            <Trust label="Outcome" value="Ship in 30 min" />
          </motion.div>
        </div>

        {/* Stats with count-up + subtle stagger rotation */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08, delayChildren: 0.95 },
            },
          }}
          className="mt-20 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="rounded-2xl border border-line bg-surface/85 backdrop-blur p-5 sm:p-6 shadow-soft transition-shadow hover:shadow-card"
            >
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-ink tabular-nums">
                <CountUp value={s.value} padStart={s.padStart} duration={1.6} />
              </p>
              <p className="mt-2 text-xs sm:text-sm text-fg-muted">
                {s.label}
              </p>
            </motion.div>
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
