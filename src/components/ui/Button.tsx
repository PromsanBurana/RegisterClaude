import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-soft hover:bg-accent-hover hover:shadow-glow',
  secondary:
    'bg-surface text-fg border border-line hover:border-line-strong hover:bg-elevated',
  ghost: 'bg-transparent text-fg-secondary hover:text-fg hover:bg-surface',
  danger:
    'bg-transparent text-status-red border border-status-red/40 hover:bg-status-red/10 hover:border-status-red',
};

const SIZE: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
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
