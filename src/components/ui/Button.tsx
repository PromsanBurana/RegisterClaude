import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gradient' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

const BASE =
  'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-purple/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.98]';

const VARIANT: Record<Variant, string> = {
  // Orange — main CTA per design spec
  primary:
    'bg-brand-orange text-white shadow-soft hover:shadow-glow-orange hover:-translate-y-0.5 hover:bg-brand-orange-soft',
  // Light surface with subtle border (neutral)
  secondary:
    'bg-surface text-ink border border-line hover:border-line-strong hover:bg-elevated hover:-translate-y-0.5 shadow-soft',
  // Transparent
  ghost: 'bg-transparent text-fg-secondary hover:text-ink hover:bg-elevated',
  // Brand gradient for special places
  gradient:
    'text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 bg-gradient-brand bg-[length:200%_200%] animate-gradient-shift',
  // Soft red for destructive
  danger:
    'bg-transparent text-status-red border border-status-red/40 hover:bg-status-red/10 hover:border-status-red',
};

const SIZE: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
};

function build({ variant = 'primary', size = 'md', fullWidth, className }: CommonProps) {
  return [
    BASE,
    VARIANT[variant],
    SIZE[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={build({ variant, size, fullWidth, className, children })}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;

type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const ButtonAnchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  function ButtonAnchor({ variant, size, fullWidth, className, children, ...rest }, ref) {
    return (
      <a
        ref={ref}
        className={build({ variant, size, fullWidth, className, children })}
        {...rest}
      >
        {children}
      </a>
    );
  },
);
