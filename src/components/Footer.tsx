import Container from './ui/Container';
import { ButtonAnchor } from './ui/Button';

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg overflow-hidden">
      {/* Subtle bottom glow */}
      <div
        aria-hidden
        className="glow-orb absolute -top-20 left-1/2 -translate-x-1/2 h-[280px] w-[640px] opacity-30"
        style={{
          background:
            'radial-gradient(closest-side, rgba(99,102,241,0.4), rgba(99,102,241,0) 70%)',
        }}
      />

      <Container size="xl" className="relative pt-20 pb-12 sm:pt-24 sm:pb-14">
        {/* CTA */}
        <div className="grid lg:grid-cols-12 gap-10 items-end pb-14 sm:pb-16 border-b border-line">
          <div className="lg:col-span-7">
            <h2 className="text-display-2 font-semibold text-fg text-balance">
              Ready to build
              <br />
              <span className="text-fg-secondary">something real?</span>
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
              <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-cyan">
                <span className="absolute inset-[1px] rounded-[5px] bg-bg/40" />
                <span className="relative font-display text-[13px] font-semibold text-fg">
                  C
                </span>
              </span>
              <span className="text-sm font-semibold text-fg">
                Claude Workshop
              </span>
            </div>
            <p className="mt-4 text-sm text-fg-muted leading-relaxed max-w-xs">
              คอร์สเวิร์กช็อปสำหรับคนที่อยากใช้ AI ทำงานจริง — ไม่ใช่แค่ลอง prompt
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
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-muted mb-4">
        {heading}
      </p>
      <ul className="space-y-2.5 text-sm">
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              className="text-fg-secondary hover:text-fg transition-colors"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
