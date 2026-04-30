import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

type Props = {
  /** Display value e.g. "30", "2.5h", "100%", "30m". */
  value: string;
  /** Animation duration in seconds. */
  duration?: number;
  /** Pad numeric portion to this min length (e.g. 2 → "07"). */
  padStart?: number;
  className?: string;
};

/**
 * Animates the numeric prefix of a value upward when scrolled into view.
 * Non-numeric suffix (e.g. "h", "m", "%") is appended verbatim.
 */
export default function CountUp({
  value,
  duration = 1.4,
  padStart = 0,
  className = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const match = value.match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const decimals = match ? (match[1].split('.')[1] || '').length : 0;

  const [display, setDisplay] = useState(match ? '0' : value);

  useEffect(() => {
    if (!inView || !match) return;
    let raf = 0;
    let startTs: number | null = null;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = (ts - startTs) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, decimals, duration, match]);

  const padded = padStart > 0 ? display.padStart(padStart, '0') : display;
  return (
    <span ref={ref} className={className}>
      {padded}
      {suffix}
    </span>
  );
}
