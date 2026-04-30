type Props = {
  text: string;
  className?: string;
  reverse?: boolean;
  speed?: 'normal' | 'slow';
};

export default function Marquee({
  text,
  className = '',
  reverse = false,
  speed = 'normal',
}: Props) {
  const items = Array(8).fill(text);
  return (
    <div
      className={`overflow-hidden whitespace-nowrap border-y-3 border-ink ${className}`}
    >
      <div
        className={`inline-flex ${
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee'
        } ${reverse ? '[animation-direction:reverse]' : ''}`}
      >
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 py-4 font-display text-3xl md:text-5xl uppercase tracking-tight"
          >
            {t}
            <span className="text-2xl md:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
