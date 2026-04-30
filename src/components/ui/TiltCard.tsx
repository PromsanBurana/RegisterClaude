import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
  /** Max tilt angle in degrees. */
  max?: number;
  /** Optional shine layer (light reflection) following the cursor. */
  shine?: boolean;
};

/**
 * Wraps content with a subtle 3D tilt that follows the cursor on desktop.
 * Disabled (no tilt) on touch devices via mouse-only events.
 */
export default function TiltCard({
  children,
  className = '',
  max = 6,
  shine = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const srx = useSpring(rx, { stiffness: 180, damping: 20 });
  const sry = useSpring(ry, { stiffness: 180, damping: 20 });

  const shineX = useTransform(px, (v) => `${v * 100}%`);
  const shineY = useTransform(py, (v) => `${v * 100}%`);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    px.set(x);
    py.set(y);
    ry.set((x - 0.5) * max * 2);
    rx.set(-(y - 0.5) * max * 2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {shine && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 hover:opacity-100"
          style={{
            background: useTransform(
              [shineX, shineY] as never,
              ([sx, sy]: string[]) =>
                `radial-gradient(220px at ${sx} ${sy}, rgba(255,255,255,0.45), transparent 70%)`,
            ),
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  );
}
