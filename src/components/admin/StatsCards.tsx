import { motion } from 'framer-motion';

type Stat = {
  label: string;
  value: string;
  caption?: string;
};

export default function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="rounded-xl border border-line bg-surface p-5 hover:border-line-strong hover:bg-elevated transition-colors"
        >
          <p className="text-xs font-medium text-fg-muted">{s.label}</p>
          <p
            className={`mt-3 font-semibold text-fg tracking-tight ${
              s.value.length > 12 ? 'text-lg' : 'text-3xl sm:text-4xl'
            }`}
          >
            {s.value}
          </p>
          {s.caption && (
            <p className="mt-2 text-[11px] text-fg-muted leading-snug">
              {s.caption}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
