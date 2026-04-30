import { motion } from 'framer-motion';

type Props = {
  className?: string;
  /** Lower number = more subtle */
  intensity?: 'subtle' | 'normal' | 'strong';
};

const INTENSITY = {
  subtle: { opacity: 0.45, blur: 'blur(80px)' },
  normal: { opacity: 0.75, blur: 'blur(70px)' },
  strong: { opacity: 0.95, blur: 'blur(60px)' },
};

/**
 * Animated multi-color gradient blobs that drift around the screen.
 * Place behind a section with `relative overflow-hidden` and put it
 * inside as the first child.
 */
export default function MeshBackdrop({
  className = '',
  intensity = 'normal',
}: Props) {
  const { opacity, blur } = INTENSITY[intensity];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <motion.div
        animate={{
          x: ['0%', '6%', '-3%', '0%'],
          y: ['0%', '-4%', '6%', '0%'],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full"
        style={{
          background: 'radial-gradient(closest-side, #7B61FF, transparent 70%)',
          filter: blur,
        }}
      />
      <motion.div
        animate={{
          x: ['0%', '-5%', '4%', '0%'],
          y: ['0%', '5%', '-3%', '0%'],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 right-[-10%] h-[460px] w-[460px] rounded-full"
        style={{
          background: 'radial-gradient(closest-side, #00C2FF, transparent 70%)',
          filter: blur,
        }}
      />
      <motion.div
        animate={{
          x: ['0%', '4%', '-4%', '0%'],
          y: ['0%', '-6%', '4%', '0%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-15%] left-[15%] h-[420px] w-[420px] rounded-full"
        style={{
          background: 'radial-gradient(closest-side, #FF4ECD, transparent 70%)',
          filter: blur,
        }}
      />
      <motion.div
        animate={{
          x: ['0%', '-4%', '5%', '0%'],
          y: ['0%', '4%', '-5%', '0%'],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10%] right-[5%] h-[360px] w-[360px] rounded-full"
        style={{
          background: 'radial-gradient(closest-side, #FF7A00, transparent 70%)',
          filter: blur,
        }}
      />
    </div>
  );
}
