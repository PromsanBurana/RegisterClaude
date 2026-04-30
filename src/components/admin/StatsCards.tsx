import { motion } from 'framer-motion';

type Stat = {
  label: string;
  value: string;
  caption?: string;
};

const TONES = [
  'bg-ink text-sun',
  'bg-sun text-ink',
  'bg-paper text-ink',
  'bg-ink text-paper',
  'bg-sun text-ink',
] as const;

export default function StatsCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          whileHover={{
            x: -3,
            y: -3,
            boxShadow: '8px 8px 0 0 #050505',
          }}
          className={`${TONES[i % TONES.length]} border-3 border-ink p-5 transition-shadow`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
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
                  : 'text-display-stat'
              }`}
            >
              {s.value}
            </span>
          </p>
          {s.caption && (
            <p className="mt-2 text-[11px] opacity-70 leading-snug">
              {s.caption}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
