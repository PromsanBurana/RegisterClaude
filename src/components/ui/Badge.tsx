import type { ReactNode } from 'react';

type Tone = 'gray' | 'blue' | 'green' | 'red' | 'accent' | 'cyan';
type Size = 'sm' | 'md';

const TONE: Record<Tone, string> = {
  gray: 'bg-line/60 text-fg-secondary border-line',
  blue: 'bg-status-blue/10 text-status-blue border-status-blue/30',
  green: 'bg-status-green/10 text-status-green border-status-green/30',
  red: 'bg-status-red/10 text-status-red border-status-red/30',
  accent: 'bg-accent/10 text-accent border-accent/30',
  cyan: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30',
};

const SIZE: Record<Size, string> = {
  sm: 'text-[10.5px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
};

type Props = {
  tone?: Tone;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export default function Badge({
  tone = 'gray',
  size = 'md',
  className = '',
  children,
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium tracking-tight ${TONE[tone]} ${SIZE[size]} ${className}`}
    >
      {children}
    </span>
  );
}
