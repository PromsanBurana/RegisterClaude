type Tone = 'light' | 'dark' | 'gradient';
type Speed = 'slow' | 'normal' | 'fast';

const TONE: Record<Tone, string> = {
  light: 'border-y border-line bg-surface text-ink',
  dark: 'border-y border-ink bg-ink text-surface',
  gradient:
    'text-white bg-gradient-brand bg-[length:200%_200%] animate-gradient-shift border-y border-line',
};

const SPEED: Record<Speed, string> = {
  slow: '50s',
  normal: '32s',
  fast: '20s',
};

type Props = {
  items: string[];
  tone?: Tone;
  speed?: Speed;
  separator?: string;
  className?: string;
  reverse?: boolean;
};

/**
 * Inline scrolling marquee. Items repeated to ensure seamless loop.
 */
export default function MarqueeText({
  items,
  tone = 'light',
  speed = 'normal',
  separator = '✦',
  className = '',
  reverse = false,
}: Props) {
  const repeated = Array.from({ length: 4 }, () => items).flat();
  const animation = reverse ? 'marquee-reverse' : 'marquee';
  return (
    <div
      className={`overflow-hidden whitespace-nowrap select-none ${TONE[tone]} ${className}`}
    >
      <div
        className="inline-flex"
        style={{
          animation: `${animation} ${SPEED[speed]} linear infinite`,
        }}
      >
        {[...repeated, ...repeated].map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-5 px-5 py-3 md:py-4 font-semibold uppercase tracking-tight text-base md:text-lg"
          >
            {t}
            <span aria-hidden className="opacity-50 text-sm">
              {separator}
            </span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
