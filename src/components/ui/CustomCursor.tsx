import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Variant = 'default' | 'hover' | 'text';

/**
 * Decorative custom cursor — draws on top of the native cursor (we don't hide
 * the native one, so accessibility is preserved). Hidden on touch devices.
 */
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 22, stiffness: 200, mass: 0.4 });
  const ringY = useSpring(y, { damping: 22, stiffness: 200, mass: 0.4 });
  const dotX = useSpring(x, { damping: 30, stiffness: 600 });
  const dotY = useSpring(y, { damping: 30, stiffness: 600 });

  const [variant, setVariant] = useState<Variant>('default');
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const isHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(isHover);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      if (!target) return setVariant('default');
      if (target.closest('input, textarea')) setVariant('text');
      else if (
        target.closest(
          'button, a, [role="button"], select, [data-cursor="hover"]',
        )
      )
        setVariant('hover');
      else setVariant('default');
    };
    const onLeave = () => setActive(false);
    const onEnter = () => setActive(true);
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize = variant === 'hover' ? 56 : variant === 'text' ? 4 : 36;
  const ringOpacity = active ? (variant === 'text' ? 0.8 : 0.45) : 0;
  const dotOpacity = active && variant !== 'text' ? 1 : 0;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998] mix-blend-multiply"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{
            width: ringSize,
            height: variant === 'text' ? 22 : ringSize,
            opacity: ringOpacity,
            borderRadius: variant === 'text' ? 2 : 9999,
          }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="border border-brand-purple/70 bg-brand-purple/5 backdrop-blur-[1px]"
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{ opacity: dotOpacity, scale: variant === 'hover' ? 0 : 1 }}
          transition={{ duration: 0.15 }}
          className="h-1.5 w-1.5 rounded-full bg-brand-purple"
        />
      </motion.div>
    </>
  );
}
