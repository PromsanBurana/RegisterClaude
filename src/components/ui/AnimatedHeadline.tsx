import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type GradientName = 'brand' | 'warm' | 'cool' | 'rainbow';

type Word = string | { text: string; gradient?: GradientName };

type Props = {
  /**
   * Lines of words. Each line is an array of words; words can be plain strings
   * or { text, gradient } for highlighted entries.
   */
  lines: Word[][];
  className?: string;
  /** Delay before the first character starts animating (in seconds). */
  startDelay?: number;
  /** Delay between each character (in seconds). */
  charStagger?: number;
};

const GRADIENT_CLASS: Record<GradientName, string> = {
  brand: 'text-gradient-brand bg-[length:200%_200%] animate-gradient-text',
  warm: 'text-gradient-warm',
  cool: 'text-gradient-cool',
  rainbow: 'text-gradient-rainbow',
};

/**
 * Stagger-animated headline. Plain words split into chars for a per-character
 * reveal; gradient words animate as a single block because CSS
 * `background-clip: text` does not propagate through inline-block child spans
 * (splitting them would render the gradient text invisible).
 */
export default function AnimatedHeadline({
  lines,
  className = '',
  startDelay = 0,
  charStagger = 0.022,
}: Props) {
  let charIndex = 0;
  const renderWord = (word: Word, key: string): ReactNode => {
    const text = typeof word === 'string' ? word : word.text;
    const gradient = typeof word === 'string' ? undefined : word.gradient;

    if (gradient) {
      // Animate the whole gradient word as ONE block.
      const delay = startDelay + charIndex * charStagger;
      charIndex += text.length;
      return (
        <motion.span
          key={key}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block whitespace-nowrap will-change-transform ${GRADIENT_CLASS[gradient]}`}
        >
          {text}
        </motion.span>
      );
    }

    const chars = Array.from(text);
    return (
      <span key={key} className="inline-block whitespace-nowrap">
        {chars.map((c, i) => {
          const delay = startDelay + charIndex * charStagger;
          charIndex += 1;
          return (
            <motion.span
              key={`${key}-${i}`}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.55,
                delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block will-change-transform"
            >
              {c === ' ' ? ' ' : c}
            </motion.span>
          );
        })}
      </span>
    );
  };

  return (
    <h1 className={`flex flex-col gap-1 ${className}`}>
      {lines.map((line, li) => (
        <span key={li} className="overflow-hidden inline-block">
          <span className="inline-block">
            {line.map((word, wi) => (
              <span key={wi}>
                {renderWord(word, `${li}-${wi}`)}
                {wi < line.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}
