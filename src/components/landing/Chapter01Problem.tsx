import { motion } from 'framer-motion';
import Container from '../ui/Container';
import ChapterMarker from './ChapterMarker';

export default function Chapter01Problem() {
  return (
    <section className="relative overflow-hidden bg-bg py-28 sm:py-36 lg:py-44">
      {/* Subtle warm tint blob */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="glow-orb absolute top-1/3 -left-32 h-[440px] w-[440px] rounded-full opacity-50"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255, 122, 0, 0.45), transparent 70%)',
          }}
        />
        <div
          className="glow-orb absolute bottom-0 right-[-10%] h-[360px] w-[360px] rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255, 78, 205, 0.40), transparent 70%)',
          }}
        />
      </div>

      <Container className="relative">
        <ChapterMarker number="01" label="The Problem" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-display-1 font-extrabold text-ink text-balance leading-[1.05]"
        >
          Ideas are <span className="text-gradient-warm">easy.</span>
          <br />
          Shipping is{' '}
          <span className="relative inline-block text-fg-muted">
            <span>hard.</span>
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
              className="absolute left-0 right-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full bg-brand-orange/70"
            />
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 max-w-2xl text-lg sm:text-xl text-fg-secondary leading-relaxed"
        >
          มีไอเดียอยู่ในหัวมาเป็นปี — เปิด Figma ก็ออกแบบเสร็จแล้ว
          จดใน Notion ก็ครบ แต่ระบบจริง
          <span className="text-ink font-semibold"> ยังไม่เคย ship.</span>
        </motion.p>

        {/* Scattered "stuck idea" chips */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08, delayChildren: 0.4 },
            },
          }}
          className="mt-16 flex flex-wrap gap-3"
        >
          {STUCK_ITEMS.map((it, i) => (
            <motion.div
              key={it.label}
              variants={{
                hidden: { opacity: 0, y: 16, rotate: it.rotate },
                show: { opacity: 1, y: 0, rotate: it.rotate },
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, rotate: 0 }}
              className="rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft"
              style={{ marginLeft: i % 3 === 1 ? 12 : 0 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fg-muted">
                {it.tag}
              </p>
              <p className="mt-1 text-sm font-medium text-ink">{it.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

const STUCK_ITEMS = [
  { tag: 'Figma file', label: 'dashboard-v3-final.fig', rotate: -2 },
  { tag: 'Notion doc', label: 'product spec — week 14', rotate: 1.5 },
  { tag: 'Stuck idea', label: 'a workshop sign-up site', rotate: -1 },
  { tag: 'Github repo', label: 'private · 0 commits', rotate: 2 },
  { tag: 'TODO', label: 'set up auth, deploy, etc.', rotate: -1.5 },
];
