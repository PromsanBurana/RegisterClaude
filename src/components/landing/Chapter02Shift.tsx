import { motion } from 'framer-motion';
import Container from '../ui/Container';
import ChapterMarker from './ChapterMarker';

const BEFORE_LINES = [
  'const [data, setData] = useState();',
  'useEffect(() => {',
  '  fetch("/api/...")',
  '    .then((r) => r.json())',
  '    .then(setData);',
  '}, []);',
  'function Card({ item }) {',
  '  return <div className="...">...</div>;',
  '}',
];

const AFTER_PROMPT =
  '"Build me a registration dashboard with status filters, search, and CSV export. Use the JSON file in /data/registrations.json. Match our design tokens."';

export default function Chapter02Shift() {
  return (
    <section className="relative overflow-hidden bg-bg py-28 sm:py-36 lg:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="glow-orb absolute top-0 left-[10%] h-[440px] w-[440px] rounded-full opacity-45"
          style={{
            background:
              'radial-gradient(closest-side, rgba(123, 97, 255, 0.45), transparent 70%)',
          }}
        />
        <div
          className="glow-orb absolute bottom-[-10%] right-[-5%] h-[440px] w-[440px] rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(closest-side, rgba(0, 194, 255, 0.45), transparent 70%)',
          }}
        />
      </div>

      <Container className="relative">
        <ChapterMarker number="02" label="The Shift" />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-display-1 font-extrabold text-ink text-balance leading-[1.05]"
        >
          From writing every line.
          <br />
          To{' '}
          <span className="text-gradient-cool">directing AI.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 max-w-2xl text-lg sm:text-xl text-fg-secondary leading-relaxed"
        >
          คุณไม่ต้องท่อง syntax ไม่ต้องสู้กับ tooling — แค่บอก{' '}
          <span className="text-ink font-semibold">Claude</span> ว่าอยากได้อะไร
          แล้วมันสร้างให้
        </motion.p>

        {/* Before / After cards */}
        <div className="mt-16 grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-line bg-surface shadow-soft overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-line bg-elevated">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
                Before
              </span>
              <span className="text-[10px] font-mono text-fg-muted">
                writing every line
              </span>
            </div>
            <pre className="font-mono text-xs leading-relaxed text-fg-muted/80 p-5 overflow-hidden">
              {BEFORE_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 0.7, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                >
                  {line || ' '}
                </motion.div>
              ))}
              <motion.div
                aria-hidden
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/95"
              />
            </pre>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex md:flex-col items-center justify-center py-2 md:py-0"
          >
            <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-white shadow-glow">
              <svg
                viewBox="0 0 16 16"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
            <div className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-gradient-brand text-white shadow-glow rotate-90">
              <svg
                viewBox="0 0 16 16"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl border border-brand-purple/25 bg-gradient-to-br from-brand-purple/10 via-surface to-brand-pink/10 shadow-soft overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-line/70">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple">
                After
              </span>
              <span className="text-[10px] font-mono text-fg-muted">
                you · Claude
              </span>
            </div>
            <div className="p-5">
              <p className="text-base leading-relaxed text-ink font-medium">
                {AFTER_PROMPT}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-fg-muted">
                <span className="inline-flex h-2 w-2 rounded-full bg-status-green animate-pulse" />
                Claude is working —
                <span className="text-ink font-medium">~30 minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
