import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: Props) {
  const alignClass =
    align === 'center'
      ? 'text-center mx-auto items-center'
      : 'text-left';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col gap-5 max-w-2xl ${alignClass} ${className}`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-display-2 font-bold text-ink text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-fg-secondary leading-relaxed text-balance">
          {description}
        </p>
      )}
    </motion.div>
  );
}
