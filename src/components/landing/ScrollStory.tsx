import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Container from '../ui/Container';
import ChapterMarker from './ChapterMarker';

type StepKey = 'idea' | 'prompt' | 'system' | 'automation' | 'launch';

type Step = {
  key: StepKey;
  kicker: string;
  label: string;
  title: string;
  desc: string;
  accent: 'purple' | 'cyan' | 'pink' | 'orange';
};

const STEPS: Step[] = [
  {
    key: 'idea',
    kicker: '01',
    label: 'Idea',
    title: 'It starts in your head',
    desc: 'ไอเดียที่อยากทำ ไอเดียที่ไม่อยากปล่อยให้ผ่าน — คือจุดเริ่มต้นของทุกอย่าง',
    accent: 'purple',
  },
  {
    key: 'prompt',
    kicker: '02',
    label: 'Prompt',
    title: 'You direct, Claude builds',
    desc: 'แทนที่จะเขียน UI ทุก component คุณบอก Claude ว่าต้องการอะไร แล้วมันสร้างให้',
    accent: 'cyan',
  },
  {
    key: 'system',
    kicker: '03',
    label: 'System',
    title: 'Real, working code',
    desc: 'ได้ระบบจริงที่รันได้ ไม่ใช่แค่ snippet ตัวอย่าง — production-ready ตั้งแต่ commit แรก',
    accent: 'pink',
  },
  {
    key: 'automation',
    kicker: '04',
    label: 'Automation',
    title: 'Hands-free workflows',
    desc: 'ขยายผลด้วย Claude Cowork — งานซ้ำๆ ที่เคยทำเอง ตอนนี้ทำงานอัตโนมัติทั้งหมด',
    accent: 'purple',
  },
  {
    key: 'launch',
    kicker: '05',
    label: 'Launch',
    title: 'Ship in 30 minutes',
    desc: 'จากศูนย์สู่ production deploy ภายในคลาสเดียว — ผลงานรุ่น 1 ก็เริ่มแบบนี้',
    accent: 'orange',
  },
];

export default function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      // Map [0.15, 0.85] → 0..N for a comfortable activation window
      const clamped = Math.min(1, Math.max(0, (v - 0.15) / 0.7));
      const idx = Math.min(STEPS.length - 1, Math.floor(clamped * STEPS.length));
      setActive(idx);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section
      ref={ref}
      className="relative bg-bg py-24 sm:py-32 overflow-hidden"
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <ChapterMarker number="" label="How it works" />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mt-6 text-display-2 font-bold text-ink text-balance"
          >
            From <span className="text-gradient-cool">idea</span> to{' '}
            <span className="text-gradient-warm">launch</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-base sm:text-lg text-fg-secondary"
          >
            5 ขั้น — แต่ละขั้นที่คุณจะลงมือทำในคลาส
          </motion.p>
        </div>

        {/* Step rail (desktop) */}
        <div className="hidden lg:flex justify-center mt-12">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface/80 backdrop-blur px-2 py-1.5 shadow-soft">
            {STEPS.map((s, i) => (
              <span
                key={s.key}
                className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-full transition-colors ${
                  active === i
                    ? 'bg-ink text-surface'
                    : active > i
                      ? 'text-fg-secondary'
                      : 'text-fg-muted'
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="lg:hidden mt-12 space-y-4">
          {STEPS.map((s) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-line bg-surface p-5 shadow-soft"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-fg-muted">
                  {s.kicker}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-secondary">
                  {s.label}
                </span>
              </div>
              <StepIllustration stepKey={s.key} compact />
              <h3 className="mt-5 text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-fg-secondary leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop: sticky split */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 mt-16">
          <div className="lg:col-span-6 lg:col-start-1">
            <ul className="space-y-[36vh] py-[20vh]">
              {STEPS.map((s, i) => (
                <li key={s.key} className="relative">
                  <motion.div
                    animate={{
                      opacity: active === i ? 1 : 0.35,
                      x: active === i ? 0 : -4,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm text-fg-muted tabular-nums">
                        / {s.kicker}
                      </span>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                          active === i ? 'text-ink' : 'text-fg-muted'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    <h3 className="mt-4 text-display-3 font-bold text-ink text-balance">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-md text-base text-fg-secondary leading-relaxed">
                      {s.desc}
                    </p>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="sticky top-1/2 -translate-y-1/2">
              <div className="relative aspect-[5/4] rounded-3xl border border-line bg-surface shadow-elevated overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={STEPS[active].key}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <StepIllustration stepKey={STEPS[active].key} />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">
                  <span>step · {STEPS[active].kicker}</span>
                  <span>{STEPS[active].label.toLowerCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Per-step illustrations — abstract, on-brand, light-touch
// -----------------------------------------------------------------------------

function StepIllustration({
  stepKey,
  compact,
}: {
  stepKey: StepKey;
  compact?: boolean;
}) {
  const wrap = compact
    ? 'relative w-full h-32 rounded-xl bg-bg/80 overflow-hidden'
    : 'relative h-full w-full bg-bg';
  return <div className={wrap}>{render(stepKey)}</div>;
}

function render(key: StepKey) {
  switch (key) {
    case 'idea':
      return <IdeaScene />;
    case 'prompt':
      return <PromptScene />;
    case 'system':
      return <SystemScene />;
    case 'automation':
      return <AutomationScene />;
    case 'launch':
      return <LaunchScene />;
  }
}

const Orb = ({
  className,
  color,
  size,
}: {
  className?: string;
  color: string;
  size: number;
}) => (
  <div
    aria-hidden
    className={`absolute rounded-full ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(closest-side, ${color}, transparent 70%)`,
      filter: 'blur(18px)',
    }}
  />
);

function IdeaScene() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <Orb className="top-1/4 left-1/3" color="#7B61FF" size={220} />
      <motion.div
        animate={{ scale: [1, 1.06, 1], rotate: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-[1] flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-brand text-white shadow-glow"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.8.8 1 1.6 1 2.3v1h6v-1c0-.7.2-1.5 1-2.3A7 7 0 0 0 12 2z" />
        </svg>
      </motion.div>
    </div>
  );
}

function PromptScene() {
  return (
    <div className="relative h-full w-full flex items-center justify-center px-6">
      <Orb className="top-0 right-1/4" color="#00C2FF" size={220} />
      <div className="relative z-[1] w-full max-w-sm rounded-2xl border border-line bg-surface shadow-card p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-muted">
          You · 14:02
        </div>
        <p className="mt-2 text-sm font-medium text-ink">
          "Build a registration dashboard with status filters and CSV export."
        </p>
        <div className="mt-3 pt-3 border-t border-line flex items-center gap-2 text-xs">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
          <span className="text-fg-secondary">Claude is thinking...</span>
        </div>
      </div>
    </div>
  );
}

function SystemScene() {
  const nodes = [
    { left: '20%', top: '30%', color: '#7B61FF' },
    { left: '70%', top: '22%', color: '#00C2FF' },
    { left: '50%', top: '60%', color: '#FF4ECD' },
    { left: '78%', top: '70%', color: '#FF7A00' },
  ];
  return (
    <div className="relative h-full w-full">
      <Orb className="top-1/3 left-1/2" color="#FF4ECD" size={240} />
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full text-line-strong"
      >
        <line x1="20%" y1="30%" x2="70%" y2="22%" stroke="currentColor" strokeWidth="1" />
        <line x1="20%" y1="30%" x2="50%" y2="60%" stroke="currentColor" strokeWidth="1" />
        <line x1="70%" y1="22%" x2="50%" y2="60%" stroke="currentColor" strokeWidth="1" />
        <line x1="50%" y1="60%" x2="78%" y2="70%" stroke="currentColor" strokeWidth="1" />
      </svg>
      {nodes.map((n, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: n.left, top: n.top, background: n.color, boxShadow: `0 8px 20px -4px ${n.color}80` }}
        />
      ))}
    </div>
  );
}

function AutomationScene() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <Orb className="top-1/3 left-1/3" color="#7B61FF" size={220} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="relative z-[1] h-40 w-40 rounded-full border-2 border-dashed border-brand-purple/40"
      >
        <span
          className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-brand-purple"
          style={{ boxShadow: '0 0 16px rgba(123,97,255,0.6)' }}
        />
        <span
          className="absolute top-1/2 -right-2 -translate-y-1/2 h-4 w-4 rounded-full bg-brand-cyan"
          style={{ boxShadow: '0 0 16px rgba(0,194,255,0.6)' }}
        />
        <span
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-brand-pink"
          style={{ boxShadow: '0 0 16px rgba(255,78,205,0.6)' }}
        />
        <span
          className="absolute top-1/2 -left-2 -translate-y-1/2 h-4 w-4 rounded-full bg-brand-orange"
          style={{ boxShadow: '0 0 16px rgba(255,122,0,0.6)' }}
        />
      </motion.div>
    </div>
  );
}

function LaunchScene() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <Orb className="bottom-1/3 left-1/2" color="#FF7A00" size={260} />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-[1]"
      >
        <div className="rounded-2xl border border-line bg-surface px-6 py-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-warm text-white">
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 13l3-3 4 4 3-3" />
                <path d="M10 7h3v3" />
              </svg>
            </span>
            <div className="text-left">
              <p className="text-sm font-bold text-ink">Live · production</p>
              <p className="text-[11px] font-mono text-fg-muted">
                yourapp.up.railway.app
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-status-green" />
            <span className="text-fg-secondary">Deployed in 30 min</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
