import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    mass: 0.4,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 z-[9997] h-[2px] bg-gradient-brand bg-[length:200%_200%] animate-gradient-shift"
    />
  );
}
