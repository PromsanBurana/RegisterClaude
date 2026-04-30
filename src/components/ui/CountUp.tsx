import { useEffect, useMemo, useRef, useState } from 'react';
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
 *
 * Note: parsed values are memoized so the count effect doesn't re-fire on
 * unrelated parent re-renders (which would otherwise reset the number to 0
 * and look like a flicker / blink).
 */
export default function CountUp({
  value,
  duration = 1.4,
  padStart = 0,
  className = '',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const parsed = useMemo(() => {
    const m = value.match(/^([\d.]+)(.*)$/);
    if (!m) {
      return { isNumeric: false, target: 0, suffix: value, decimals: 0 };
    }
    return {
      isNumeric: true,
      target: parseFloat(m[1]),
      suffix: m[2],
      decimals: (m[1].split('.')[1] || '').length,
    };
  }, [value]);

  const initialDisplay = useMemo(() => {
    if (!parsed.isNumeric) return value;
    const zero = (0).toFixed(parsed.decimals);
    return padStart > 0 ? zero.padStart(padStart, '0') : zero;
  }, [parsed.isNumeric, parsed.decimals, padStart, value]);

  const [display, setDisplay] = useState(initialDisplay);

  useEffect(() => {
    if (!inView || !parsed.isNumeric) return;
    let raf = 0;
    let startTs: number | null = null;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = (ts - startTs) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parsed.target * eased;
      const formatted = current.toFixed(parsed.decimals);
      setDisplay(padStart > 0 ? formatted.padStart(padStart, '0') : formatted);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, parsed.isNumeric, parsed.target, parsed.decimals, duration, padStart]);

  if (!parsed.isNumeric) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {display}
      {parsed.suffix}
    </span>
  );
}
