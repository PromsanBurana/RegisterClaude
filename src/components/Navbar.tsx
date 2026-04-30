import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './ui/Container';
import { ButtonAnchor } from './ui/Button';

const links = [
  { href: '#courses', label: 'Courses' },
  { href: '#work', label: 'Work' },
  { href: '#why', label: 'Why us' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line bg-bg/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <Container size="xl" className="flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand bg-[length:200%_200%] animate-gradient-shift shadow-soft">
            <span className="font-display text-[14px] font-extrabold text-white">
              C
            </span>
          </span>
          <span className="text-[15px] font-bold tracking-tight text-ink">
            Claude Workshop
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm font-medium text-fg-secondary hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ButtonAnchor href="#register" variant="primary" size="sm">
            Apply now
            <span aria-hidden>→</span>
          </ButtonAnchor>
        </div>

        <button
          aria-label="menu"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden h-9 w-9 rounded-xl border border-line bg-surface flex items-center justify-center text-ink shadow-soft"
        >
          <div className="space-y-1">
            <span
              className={`block h-0.5 w-4 bg-current transition-transform ${
                open ? 'translate-y-[5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-current transition-opacity ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-current transition-transform ${
                open ? '-translate-y-[5px] -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-line bg-surface/95 backdrop-blur-xl"
          >
            <Container size="xl" className="py-4 space-y-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-3 text-sm font-medium text-fg-secondary hover:text-ink rounded-lg hover:bg-elevated"
                >
                  {l.label}
                </a>
              ))}
              <ButtonAnchor
                href="#register"
                onClick={() => setOpen(false)}
                variant="primary"
                size="md"
                fullWidth
                className="mt-2"
              >
                Apply now
              </ButtonAnchor>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
