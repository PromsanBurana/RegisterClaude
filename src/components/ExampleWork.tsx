import { motion } from 'framer-motion';
import MarqueeText from './ui/MarqueeText';
import SectionTitle from './ui/SectionTitle';
import { BoldAnchor } from './ui/BoldButton';

const EXAMPLE_URL = 'https://p-oil-project-production.up.railway.app/';

export default function ExampleWork() {
  return (
    <>
      <MarqueeText
        items={[
          '30 MINUTES',
          'IDEA → SHIPPED',
          'BATCH 01 RECEIPT',
          'POWERED BY CLAUDE CODE',
        ]}
        tone="paper-on-ink"
        speed="slow"
      />

      <section id="example" className="relative bg-ink text-paper border-b-3 border-ink">
        <div className="container-narrow section-padding py-20 md:py-28">
          <SectionTitle
            number="02"
            eyebrow="The Receipt"
            title={
              <>
                Idea → Shipped.<br />
                <span className="text-sun">30 Minutes.</span>
              </>
            }
            subtitle="ผลงานจริงจากผู้เรียนรุ่น 1 ของ Vibe Coding ใช้ Claude Code สร้างเว็บไซต์เต็มรูปแบบและ deploy ใช้งานได้จริงภายในครึ่งชั่วโมง"
            tone="paper"
          />

          <div className="mt-14 grid lg:grid-cols-12 gap-0 border-3 border-paper">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 p-6 md:p-10 border-b-3 lg:border-b-0 lg:border-r-3 border-paper"
            >
              <p className="font-mono text-xs uppercase tracking-[0.25em] mb-6 opacity-70">
                / Live Demo · Batch 01
              </p>

              <div className="space-y-6">
                <Stat n="30" u="min" l="From idea to shipped" />
                <Stat n="0" u="lines" l="Lines of code written" />
                <Stat n="100" u="%" l="Production ready" />
              </div>

              <div className="mt-10 space-y-3">
                <BoldAnchor
                  href={EXAMPLE_URL}
                  target="_blank"
                  rel="noreferrer"
                  variant="sun"
                  size="lg"
                  fullWidth
                >
                  ดูตัวอย่างผลงาน <span aria-hidden>↗</span>
                </BoldAnchor>
                <BoldAnchor
                  href="#register"
                  variant="outline-sun"
                  size="lg"
                  fullWidth
                >
                  สมัครคอร์สนี้
                </BoldAnchor>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-7 relative bg-sun text-ink"
            >
              <BrowserMockup url={EXAMPLE_URL} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, u, l }: { n: string; u: string; l: string }) {
  return (
    <div className="border-b-3 border-paper/30 pb-5 last:border-b-0 last:pb-0">
      <p className="font-display leading-none text-display-stat tracking-tight">
        {n}
        <span className="text-2xl md:text-3xl ml-1 font-mono align-top mt-2 inline-block opacity-80">
          {u}
        </span>
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] opacity-70">
        / {l}
      </p>
    </div>
  );
}

function BrowserMockup({ url }: { url: string }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b-3 border-ink bg-paper">
        <span className="h-3 w-3 border-2 border-ink bg-signal" />
        <span className="h-3 w-3 border-2 border-ink bg-sun" />
        <span className="h-3 w-3 border-2 border-ink bg-electric" />
        <div className="ml-3 flex-1 truncate text-xs font-mono uppercase tracking-widest border-2 border-ink px-3 py-1.5 bg-cream">
          {url.replace('https://', '')}
        </div>
      </div>
      <div className="relative flex-1 bg-sun min-h-[420px] grid-lines flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">
            / Live Project
          </p>
          <p className="mt-3 font-display text-5xl md:text-6xl uppercase leading-none">
            ผลงาน<br />รุ่น 01
          </p>
          <p className="mt-4 text-sm font-medium leading-snug">
            เว็บใช้งานจริงที่สร้างขึ้นใน 30 นาที โดยผู้เรียนของรุ่นที่ 1
          </p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 border-3 border-ink bg-paper hover:bg-ink hover:text-sun font-bold uppercase text-sm transition-colors"
          >
            Open ↗
          </a>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-6 right-6 font-display text-4xl select-none"
        >
          ✦
        </motion.div>
        <span className="absolute bottom-6 left-6 font-mono text-xs uppercase tracking-widest opacity-60">
          / 30 minutes
        </span>
      </div>
    </div>
  );
}
