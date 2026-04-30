import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Tone = 'ink' | 'paper' | 'sun';

type Props = {
  number: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: Tone;
  align?: 'left' | 'center';
};

const COLOR: Record<Tone, { line: string; text: string }> = {
  ink: { line: 'bg-ink', text: 'text-ink' },
  paper: { line: 'bg-paper', text: 'text-paper' },
  sun: { line: 'bg-sun', text: 'text-sun' },
};

export default function SectionTitle({
  number,
  eyebrow,
  title,
  subtitle,
  tone = 'ink',
  align = 'left',
}: Props) {
  const c = COLOR[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`grid md:grid-cols-12 gap-6 items-end ${
        align === 'center' ? 'text-center md:text-left' : ''
      }`}
    >
      <div className="md:col-span-7 lg:col-span-8">
        <div className="flex items-center gap-4">
          <span className={`font-mono text-sm font-bold ${c.text}`}>
            [{number}]
          </span>
          <span className={`flex-1 h-px ${c.line} opacity-30`} />
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.25em] ${c.text}`}
          >
            {eyebrow}
          </span>
        </div>
        <h2
          className={`mt-6 font-display text-display-2 uppercase tracking-tight text-balance leading-[0.88] ${c.text}`}
        >
          {title}
        </h2>
      </div>
      {subtitle && (
        <p
          className={`md:col-span-5 lg:col-span-4 text-base md:text-lg leading-snug font-medium max-w-md md:ml-auto ${c.text} ${
            tone === 'ink' ? 'text-ink/80' : 'opacity-80'
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
