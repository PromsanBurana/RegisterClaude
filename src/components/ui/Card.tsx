import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Tone = 'surface' | 'elevated' | 'gradient-border' | 'tinted-purple' | 'tinted-orange' | 'tinted-cyan' | 'tinted-pink';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  tone?: Tone;
  hoverable?: boolean;
  glow?: 'purple' | 'orange' | 'cyan' | 'pink' | false;
  className?: string;
  size?: Size;
  children: ReactNode;
  delay?: number;
};

const TONE: Record<Tone, string> = {
  surface: 'bg-surface border border-line shadow-soft',
  elevated: 'bg-surface border border-line shadow-card',
  'gradient-border': 'border-gradient shadow-soft',
  'tinted-purple':
    'bg-gradient-to-br from-brand-purple/8 via-surface to-surface border border-brand-purple/15 shadow-soft',
  'tinted-orange':
    'bg-gradient-to-br from-brand-orange/8 via-surface to-surface border border-brand-orange/15 shadow-soft',
  'tinted-cyan':
    'bg-gradient-to-br from-brand-cyan/8 via-surface to-surface border border-brand-cyan/15 shadow-soft',
  'tinted-pink':
    'bg-gradient-to-br from-brand-pink/8 via-surface to-surface border border-brand-pink/15 shadow-soft',
};

const PADDING: Record<Size, string> = {
  sm: 'p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-7 sm:p-9',
};

const GLOW_CLASS: Record<NonNullable<Props['glow']> extends infer X ? Exclude<X, false> : never, string> = {
  purple:
    'after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none after:[background:radial-gradient(60%_50%_at_50%_0%,rgba(123,97,255,0.18),transparent_70%)]',
  orange:
    'after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none after:[background:radial-gradient(60%_50%_at_50%_0%,rgba(255,122,0,0.16),transparent_70%)]',
  cyan:
    'after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none after:[background:radial-gradient(60%_50%_at_50%_0%,rgba(0,194,255,0.18),transparent_70%)]',
  pink:
    'after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none after:[background:radial-gradient(60%_50%_at_50%_0%,rgba(255,78,205,0.18),transparent_70%)]',
};

export default function Card({
  tone = 'surface',
  hoverable,
  glow,
  size = 'md',
  className = '',
  children,
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={
        hoverable
          ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }
          : undefined
      }
      className={`relative overflow-hidden rounded-2xl ${TONE[tone]} ${PADDING[size]} ${
        hoverable ? 'transition-shadow hover:shadow-elevated' : ''
      } ${glow ? GLOW_CLASS[glow] : ''} ${className}`}
    >
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
