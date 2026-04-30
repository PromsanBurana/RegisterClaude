import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Tone = 'surface' | 'elevated' | 'transparent';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  tone?: Tone;
  hoverable?: boolean;
  glow?: boolean;
  className?: string;
  size?: Size;
  children: ReactNode;
  delay?: number;
};

const TONE: Record<Tone, string> = {
  surface: 'bg-surface',
  elevated: 'bg-elevated',
  transparent: 'bg-transparent',
};

const PADDING: Record<Size, string> = {
  sm: 'p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-7 sm:p-9',
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
          ? {
              y: -3,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      className={`relative rounded-2xl border border-line ${TONE[tone]} ${PADDING[size]} ${
        hoverable ? 'transition-shadow hover:border-line-strong hover:shadow-elevated' : ''
      } ${className}`}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.15), transparent 70%)',
          }}
        />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
