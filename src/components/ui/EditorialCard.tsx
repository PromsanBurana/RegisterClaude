import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Tone = 'paper' | 'ink' | 'sun' | 'cream' | 'bone';

type Props = {
  tone?: Tone;
  hoverable?: boolean;
  className?: string;
  children: ReactNode;
  delay?: number;
};

const TONE: Record<Tone, string> = {
  paper: 'bg-paper text-ink',
  ink: 'bg-ink text-paper',
  sun: 'bg-sun text-ink',
  cream: 'bg-cream text-ink',
  bone: 'bg-bone text-ink',
};

export default function EditorialCard({
  tone = 'paper',
  hoverable = false,
  className = '',
  children,
  delay = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      whileHover={
        hoverable
          ? { x: -3, y: -3, boxShadow: '8px 8px 0 0 #050505' }
          : undefined
      }
      className={`relative border-3 border-ink ${TONE[tone]} transition-shadow ${className}`}
    >
      {children}
    </motion.div>
  );
}
