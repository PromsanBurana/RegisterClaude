import { motion } from 'framer-motion';

const COLORS = ['#7B61FF', '#FF7A00', '#00C2FF', '#FF4ECD'];

type Props = {
  active: boolean;
  count?: number;
};

/**
 * Lightweight confetti burst implemented with motion divs (no canvas dep).
 * Renders only when `active` is true. Pointer-events none so it never blocks UI.
 */
export default function Confetti({ active, count = 24 }: Props) {
  if (!active) return null;
  const particles = Array.from({ length: count });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible z-[60]">
      {particles.map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 110 + Math.random() * 90;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const color = COLORS[i % COLORS.length];
        const size = 6 + Math.random() * 6;
        const delay = Math.random() * 0.05;
        const isCircle = i % 3 === 0;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              x: dx,
              y: dy + 80,
              opacity: [0, 1, 1, 0],
              scale: 1,
              rotate: 360 + Math.random() * 360,
            }}
            transition={{
              duration: 1.3 + Math.random() * 0.6,
              delay,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 1.6, times: [0, 0.1, 0.7, 1] },
            }}
            className="absolute top-1/2 left-1/2"
            style={{
              width: size,
              height: size,
              borderRadius: isCircle ? '9999px' : '2px',
              background: color,
              boxShadow: `0 4px 12px ${color}66`,
            }}
          />
        );
      })}
    </div>
  );
}
