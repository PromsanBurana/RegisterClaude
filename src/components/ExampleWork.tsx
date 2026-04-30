import { motion } from 'framer-motion';
import Container from './ui/Container';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import Badge from './ui/Badge';
import { ButtonAnchor } from './ui/Button';

const EXAMPLE_URL = 'https://p-oil-project-production.up.railway.app/';

export default function ExampleWork() {
  return (
    <Section id="work" tone="surface">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <SectionHeader
              eyebrow="Receipt · Cohort 01"
              title={
                <>
                  Idea to shipped.
                  <br />
                  <span className="text-gradient-warm">In thirty minutes.</span>
                </>
              }
              description="ผลงานจริงจากผู้เรียนรุ่น 1 ของ Vibe Coding ใช้ Claude Code สร้างเว็บไซต์เต็มรูปแบบและ deploy ใช้งานได้จริง ภายในครึ่งชั่วโมงของคลาส"
            />

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-line bg-elevated p-4 transition-shadow hover:shadow-soft"
                  style={{
                    transform: `rotate(${[(-1), 0, 1][i] ?? 0}deg)`,
                  }}
                >
                  <p className="text-2xl font-bold text-ink tracking-tight">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] text-fg-muted">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <ButtonAnchor
                href={EXAMPLE_URL}
                target="_blank"
                rel="noreferrer"
                variant="primary"
                size="md"
              >
                ดูตัวอย่างผลงาน
                <ArrowExternal />
              </ButtonAnchor>
              <ButtonAnchor href="#register" variant="secondary" size="md">
                สมัครคอร์สนี้
              </ButtonAnchor>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <BrowserMockup url={EXAMPLE_URL} />
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}

const STATS = [
  { value: '30', label: 'นาที จาก idea' },
  { value: '0', label: 'บรรทัดที่เริ่ม' },
  { value: '100%', label: 'Live & shippable' },
];

function ArrowExternal() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 9l5-5M5 4h5v5" />
    </svg>
  );
}

function BrowserMockup({ url }: { url: string }) {
  return (
    <div className="relative">
      {/* Soft gradient blob behind */}
      <div
        aria-hidden
        className="glow-orb absolute -inset-x-10 top-1/2 -translate-y-1/2 h-[60%] rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(123,97,255,0.25), rgba(255,78,205,0.15) 50%, transparent 80%)',
        }}
      />
      <div className="relative rounded-3xl overflow-hidden border border-line bg-surface shadow-card">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-elevated">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-orange" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-purple" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-cyan" />
          <div className="ml-3 flex-1 truncate text-[11px] font-mono text-fg-muted bg-surface rounded-md px-3 py-1.5 border border-line">
            {url.replace('https://', '')}
          </div>
          <Badge tone="green" size="sm">
            <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
            Live
          </Badge>
        </div>

        <div className="relative aspect-[16/10] flex items-center justify-center p-8 bg-bg">
          <div
            aria-hidden
            className="absolute inset-0 bg-mesh-hero opacity-50"
          />
          <div className="relative text-center max-w-xs">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-fg-muted">
              Live preview
            </p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              ผลงาน<span className="text-gradient-brand">รุ่น 01</span>
            </p>
            <p className="mt-3 text-sm text-fg-secondary leading-relaxed">
              เว็บใช้งานจริงที่สร้างขึ้นใน 30 นาที
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-purple hover:text-brand-pink transition-colors"
            >
              เปิดในแท็บใหม่
              <ArrowExternal />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
