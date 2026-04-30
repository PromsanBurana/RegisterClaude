import { motion } from 'framer-motion';

type Props = {
  number: string;
  label: string;
  tone?: 'ink' | 'subtle';
};

export default function ChapterMarker({ number, label, tone = 'ink' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em]"
    >
      {number && (
        <span className="font-mono text-fg-muted tabular-nums">{number}</span>
      )}
      {number && <span className="h-px w-10 bg-line-strong" />}
      <span className={tone === 'ink' ? 'text-ink' : 'text-fg-secondary'}>
        {label}
      </span>
    </motion.div>
  );
}
