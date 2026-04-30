import { motion } from 'framer-motion';

type Shape = {
  type: 'circle' | 'square' | 'pill' | 'donut';
  gradient: string;
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay?: number;
  rotate?: number;
};

const DEFAULT_SHAPES: Shape[] = [
  {
    type: 'circle',
    gradient: 'linear-gradient(135deg, #7B61FF, #00C2FF)',
    size: 64,
    top: '15%',
    left: '8%',
    delay: 0,
  },
  {
    type: 'donut',
    gradient: 'linear-gradient(135deg, #FF4ECD, #FF7A00)',
    size: 88,
    top: '8%',
    right: '12%',
    delay: 1,
    rotate: -8,
  },
  {
    type: 'square',
    gradient: 'linear-gradient(135deg, #FF7A00, #FF4ECD)',
    size: 56,
    bottom: '18%',
    left: '12%',
    delay: 2,
    rotate: 12,
  },
  {
    type: 'pill',
    gradient: 'linear-gradient(135deg, #00C2FF, #7B61FF)',
    size: 76,
    bottom: '8%',
    right: '6%',
    delay: 1.5,
    rotate: -16,
  },
];

type Props = {
  shapes?: Shape[];
};

/**
 * Decorative floating shapes for hero / playful sections.
 */
export default function FloatingShapes({ shapes = DEFAULT_SHAPES }: Props) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 0.85,
            scale: 1,
            y: [0, -16, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: s.delay ?? 0 },
            scale: { duration: 0.8, delay: s.delay ?? 0 },
            y: {
              duration: 6 + i * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: s.delay ?? 0,
            },
          }}
          className="absolute will-change-transform"
          style={{
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            width: s.size,
            height: s.size,
            transform: s.rotate ? `rotate(${s.rotate}deg)` : undefined,
          }}
        >
          <ShapeBody type={s.type} gradient={s.gradient} />
        </motion.div>
      ))}
    </div>
  );
}

function ShapeBody({ type, gradient }: { type: Shape['type']; gradient: string }) {
  const baseStyle: React.CSSProperties = {
    background: gradient,
    boxShadow: '0 18px 40px -10px rgba(123, 97, 255, 0.35)',
  };
  if (type === 'circle') {
    return <div className="h-full w-full rounded-full" style={baseStyle} />;
  }
  if (type === 'square') {
    return <div className="h-full w-full rounded-2xl" style={baseStyle} />;
  }
  if (type === 'pill') {
    return (
      <div
        className="h-1/2 w-full rounded-full"
        style={{ ...baseStyle, marginTop: '25%' }}
      />
    );
  }
  // donut
  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        background: gradient,
        boxShadow:
          'inset 0 0 0 12px rgba(255,255,255,0.85), 0 18px 40px -10px rgba(123, 97, 255, 0.35)',
      }}
    />
  );
}
