import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
  /** How much the inner content follows the cursor (0-1). */
  strength?: number;
};

/**
 * Adds a soft magnetic pull on the inner content based on cursor position.
 * Wrap a Button or anchor to give it tactile feel.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.25,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block ${className}`}
    >
      <motion.div style={{ x: sx, y: sy }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
