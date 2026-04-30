import { motion } from 'framer-motion';

type Stat = {
  label: string;
  value: string;
  caption?: string;
};

export default function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-0 border-3 border-ink bg-ink">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className={`bg-paper p-5 ${
            i < stats.length - 1
              ? 'border-b-3 lg:border-b-0 lg:border-r-3 sm:border-r-3 sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r-3'
              : ''
          } border-ink`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60">
            / {s.label}
          </p>
          <p
            className="mt-3 font-display leading-none tracking-tight"
            title={s.value}
          >
            <span
              className={`block ${
                s.value.length > 12
                  ? 'text-xl md:text-2xl'
                  : 'text-4xl md:text-5xl'
              }`}
            >
              {s.value}
            </span>
          </p>
          {s.caption && (
            <p className="mt-2 text-[11px] text-ink/55 leading-snug">
              {s.caption}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
