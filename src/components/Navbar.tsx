import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '#courses', label: 'Courses' },
  { href: '#example', label: 'Work' },
  { href: '#why', label: 'Why' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm} BKK`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-cream/95 backdrop-blur-md border-b-3 border-ink transition-all ${
        scrolled ? 'py-2' : 'py-3'
      }`}
    >
      <div className="container-narrow section-padding flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 group">
          <span className="flex h-10 w-10 items-center justify-center bg-ink text-cream font-display text-2xl">
            ✦
          </span>
          <div className="leading-none">
            <p className="font-display text-base md:text-lg uppercase tracking-tight">
              Claude/Workshop
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] mt-1 text-ink/60">
              EST. 2025 — BKK
            </p>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm font-bold uppercase tracking-wide hover:bg-ink hover:text-cream transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-widest">
            {time}
          </span>
          <a href="#register" className="btn-ink !py-2.5 !px-5 text-xs">
            Apply →
          </a>
        </div>

        <button
          aria-label="menu"
          onClick={() => setOpen((s) => !s)}
          className="md:hidden h-10 w-10 bg-ink text-cream flex items-center justify-center"
        >
          <div className="space-y-1">
            <span
              className={`block h-0.5 w-5 bg-cream transition-transform ${
                open ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-cream transition-opacity ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-cream transition-transform ${
                open ? '-translate-y-1.5 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden border-t-3 border-ink"
          >
            <div className="container-narrow section-padding py-4 space-y-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-3 font-bold uppercase tracking-wide border-b-2 border-ink/20 hover:bg-ink hover:text-cream"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#register"
                onClick={() => setOpen(false)}
                className="btn-ink w-full mt-3"
              >
                Apply →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
