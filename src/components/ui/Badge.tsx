import type { ReactNode } from 'react';

type Tone =
  | 'gray'
  | 'blue'
  | 'green'
  | 'red'
  | 'purple'
  | 'orange'
  | 'cyan'
  | 'pink';
type Size = 'sm' | 'md';

const TONE: Record<Tone, string> = {
  gray: 'bg-line/40 text-fg-secondary border-line',
  blue: 'bg-status-blue/10 text-status-blue border-status-blue/25',
  green: 'bg-status-green/10 text-status-green border-status-green/25',
  red: 'bg-status-red/10 text-status-red border-status-red/25',
  purple: 'bg-brand-purple/10 text-brand-purple border-brand-purple/25',
  orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/25',
  cyan: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30',
  pink: 'bg-brand-pink/10 text-brand-pink border-brand-pink/25',
};

const SIZE: Record<Size, string> = {
  sm: 'text-[10.5px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-0.5',
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
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${TONE[tone]} ${SIZE[size]} ${className}`}
    >
      {children}
    </span>
  );
}
