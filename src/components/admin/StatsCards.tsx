import { motion } from 'framer-motion';

type Stat = {
  label: string;
  value: string;
  caption?: string;
};

const TINTS = [
  {
    bg: 'bg-gradient-to-br from-brand-purple/12 via-surface to-surface',
    border: 'border-brand-purple/15',
    accent: 'bg-brand-purple',
  },
  {
    bg: 'bg-gradient-to-br from-brand-orange/12 via-surface to-surface',
    border: 'border-brand-orange/15',
    accent: 'bg-brand-orange',
  },
  {
    bg: 'bg-gradient-to-br from-brand-cyan/12 via-surface to-surface',
    border: 'border-brand-cyan/15',
    accent: 'bg-brand-cyan',
  },
  {
    bg: 'bg-gradient-to-br from-brand-pink/12 via-surface to-surface',
    border: 'border-brand-pink/15',
    accent: 'bg-brand-pink',
  },
  {
    bg: 'bg-gradient-to-br from-brand-purple/12 via-surface to-surface',
    border: 'border-brand-purple/15',
    accent: 'bg-brand-purple',
  },
];

export default function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {stats.map((s, i) => {
        const tint = TINTS[i % TINTS.length];
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`relative rounded-2xl border ${tint.border} ${tint.bg} p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all`}
          >
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${tint.accent}`} />
              <p className="text-xs font-semibold text-fg-secondary">
                {s.label}
              </p>
            </div>
            <p
              className={`mt-3 font-bold text-ink tracking-tight ${
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
        );
      })}
    </div>
  );
}
