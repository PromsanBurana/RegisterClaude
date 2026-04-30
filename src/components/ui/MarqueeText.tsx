type Tone = 'ink-on-sun' | 'paper-on-ink' | 'ink-on-paper' | 'sun-on-ink';
type Speed = 'slow' | 'normal' | 'fast';

type Props = {
  items: string[];
  tone?: Tone;
  speed?: Speed;
  separator?: string;
  className?: string;
  reverse?: boolean;
};

const TONE: Record<Tone, string> = {
  'ink-on-sun': 'bg-sun text-ink border-y-3 border-ink',
  'paper-on-ink': 'bg-ink text-paper border-y-3 border-ink',
  'ink-on-paper': 'bg-paper text-ink border-y-3 border-ink',
  'sun-on-ink': 'bg-ink text-sun border-y-3 border-sun',
};

const SPEED: Record<Speed, string> = {
  slow: 'animate-marquee-slow',
  normal: 'animate-marquee',
  fast: 'animate-marquee-fast',
};

export default function MarqueeText({
  items,
  tone = 'paper-on-ink',
  speed = 'normal',
  separator = '✦',
  className = '',
  reverse = false,
}: Props) {
  // Repeat items enough to fill widescreen
  const repeated = Array.from({ length: 6 }, () => items).flat();
  return (
    <div
      className={`overflow-hidden whitespace-nowrap select-none ${TONE[tone]} ${className}`}
    >
      <div
        className={`inline-flex ${SPEED[speed]} ${
          reverse ? '[animation-direction:reverse]' : ''
        }`}
      >
        {[...repeated, ...repeated].map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 py-3 md:py-4 font-display text-2xl md:text-4xl uppercase tracking-tight"
          >
            {t}
            <span aria-hidden className="text-xl md:text-3xl opacity-70">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
