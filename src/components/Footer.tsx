import MarqueeText from './ui/MarqueeText';
import { BoldAnchor } from './ui/BoldButton';

export default function Footer() {
  return (
    <>
      <MarqueeText
        items={[
          'LET\'S BUILD',
          'SOMETHING REAL',
          'APPLY NOW',
          'BANGKOK / 2025',
        ]}
        tone="ink-on-sun"
      />
      <footer className="relative bg-ink text-paper">
        <div className="container-narrow section-padding py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-10 md:gap-6">
            <div className="md:col-span-7">
              <h2 className="font-display text-display-2 uppercase leading-[0.88] tracking-tight">
                พร้อมเริ่ม<br />
                <span className="text-stroke" style={{ WebkitTextStrokeColor: '#FFD400' }}>
                  สร้าง
                </span>{' '}
                ของจริง?
              </h2>
              <BoldAnchor href="#register" variant="sun" size="lg" className="mt-8">
                Apply Now <span aria-hidden>→</span>
              </BoldAnchor>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mb-4">
                  / Courses
                </p>
                <ul className="space-y-2 text-sm font-medium">
                  <li><a href="#courses" className="hover:underline">Vibe Coding</a></li>
                  <li><a href="#courses" className="hover:underline">Claude Cowork</a></li>
                  <li><a href="#register" className="hover:underline">Register</a></li>
                </ul>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50 mb-4">
                  / Contact
                </p>
                <ul className="space-y-2 text-sm font-medium">
                  <li>contact@bold-disruption.example</li>
                  <li>02-XXX-XXXX</li>
                  <li className="opacity-60">Online via Video Conf.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-6 border-t border-paper/20 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs font-mono uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl text-sun">✦</span>
              <span>Bold/Disruption Workshop — Series 2025</span>
            </div>
            <p className="opacity-60">© 2025 / All Rights Reserved / BKK</p>
          </div>
        </div>
      </footer>
    </>
  );
}
