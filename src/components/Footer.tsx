import Container from './ui/Container';
import { ButtonAnchor } from './ui/Button';
import MeshBackdrop from './ui/MeshBackdrop';
import MarqueeText from './ui/MarqueeText';

export default function Footer() {
  return (
    <>
    <MarqueeText
      items={[
        'BUILD COOL STUFF',
        'WITH AI',
        'CLAUDE CODE',
        'CLAUDE COWORK',
        'BANGKOK 2025',
      ]}
      tone="light"
      speed="slow"
      reverse
    />
    <footer className="relative overflow-hidden border-t border-line bg-bg">
      <MeshBackdrop intensity="subtle" />

      <Container size="xl" className="relative pt-20 pb-12 sm:pt-24 sm:pb-14">
        {/* CTA */}
        <div className="grid lg:grid-cols-12 gap-10 items-end pb-14 sm:pb-16 border-b border-line">
          <div className="lg:col-span-7">
            <h2 className="text-display-2 font-bold text-ink text-balance">
              Ready to build
              <br />
              <span className="text-gradient-warm">something cool?</span>
            </h2>
            <p className="mt-4 text-base text-fg-secondary max-w-md">
              เปลี่ยนจาก "ลอง prompt" → "ทำของจริง" ภายในคลาสเดียว
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
            <ButtonAnchor href="#register" variant="primary" size="lg">
              Apply now <span aria-hidden>→</span>
            </ButtonAnchor>
            <ButtonAnchor href="#courses" variant="secondary" size="lg">
              View courses
            </ButtonAnchor>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-14 sm:mt-16">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand bg-[length:200%_200%] animate-gradient-shift">
                <span className="font-display text-[13px] font-extrabold text-white">
                  C
                </span>
              </span>
              <span className="text-sm font-bold text-ink">
                Claude Workshop
              </span>
            </div>
            <p className="mt-4 text-sm text-fg-secondary leading-relaxed max-w-xs">
              เวิร์กช็อปสำหรับคนที่อยากเล่นกับ AI และทำของจริง
            </p>
          </div>

          <FooterCol
            heading="Courses"
            items={[
              { label: 'Vibe Coding', href: '#courses' },
              { label: 'Claude Cowork', href: '#courses' },
              { label: 'Apply', href: '#register' },
            ]}
          />
          <FooterCol
            heading="Company"
            items={[
              { label: 'About', href: '#why' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Contact', href: 'mailto:contact@claude-workshop.example' },
            ]}
          />
          <FooterCol
            heading="Resources"
            items={[
              { label: 'Privacy', href: '#' },
              { label: 'Terms', href: '#' },
              { label: 'Status', href: '#' },
            ]}
          />
        </div>

        {/* Bottom row */}
        <div className="mt-14 pt-6 border-t border-line flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-fg-muted">
          <p>© 2025 Claude Workshop. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-status-green" />
            All systems operational
          </p>
        </div>
      </Container>
    </footer>
    </>
  );
}

function FooterCol({
  heading,
  items,
}: {
  heading: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted mb-4">
        {heading}
      </p>
      <ul className="space-y-2.5 text-sm">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              className="text-fg-secondary hover:text-ink transition-colors"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
