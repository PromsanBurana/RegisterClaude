import { motion } from 'framer-motion';

/**
 * Subtle "scroll" indicator at hero bottom — animated line that grows + dot
 * that drifts down. Quiet enough to not steal focus.
 */
export default function ScrollCue({ label = 'Scroll' }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      className="flex flex-col items-center gap-3 text-fg-muted"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
        {label}
      </span>
      <div className="relative h-12 w-px overflow-hidden">
        <span className="absolute inset-0 bg-line-strong" />
        <motion.span
          aria-hidden
          animate={{ y: ['-100%', '100%'] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-brand-purple to-transparent"
        />
      </div>
    </motion.div>
  );
}
