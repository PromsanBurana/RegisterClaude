import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'ink' | 'sun' | 'paper' | 'outline-ink' | 'outline-sun' | 'signal';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

const VARIANT_CLASS: Record<Variant, string> = {
  ink: 'bg-ink text-paper border-ink hover:bg-sun hover:text-ink',
  sun: 'bg-sun text-ink border-ink hover:bg-ink hover:text-sun',
  paper: 'bg-paper text-ink border-ink hover:bg-sun hover:text-ink',
  'outline-ink': 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
  'outline-sun': 'bg-transparent text-sun border-sun hover:bg-sun hover:text-ink',
  signal: 'bg-signal text-paper border-signal hover:bg-ink hover:border-ink',
};

const SIZE_CLASS: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3.5 text-sm',
  lg: 'px-8 py-5 text-base',
};

const BASE =
  'inline-flex items-center justify-center gap-2 border-3 font-bold uppercase tracking-tight transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-offset active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none';

function buildClass({
  variant = 'ink',
  size = 'md',
  fullWidth,
  className,
}: CommonProps) {
  return [
    BASE,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

const BoldButton = forwardRef<HTMLButtonElement, ButtonProps>(function BoldButton(
  { variant, size, fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buildClass({ variant, size, fullWidth, className, children })}
      {...rest}
    >
      {children}
    </button>
  );
});

export default BoldButton;

type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const BoldAnchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  function BoldAnchor({ variant, size, fullWidth, className, children, ...rest }, ref) {
    return (
      <a
        ref={ref}
        className={buildClass({ variant, size, fullWidth, className, children })}
        {...rest}
      >
        {children}
      </a>
    );
  },
);
