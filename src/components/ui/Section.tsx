import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

type Tone = 'bg' | 'surface' | 'gradient-soft';

type Props = HTMLAttributes<HTMLElement> & {
  id?: string;
  tone?: Tone;
  spacing?: 'md' | 'lg';
  children: ReactNode;
};

const TONE: Record<Tone, string> = {
  bg: 'bg-bg',
  surface: 'bg-surface',
  'gradient-soft':
    'bg-gradient-to-b from-bg via-surface to-bg',
};

const Section = forwardRef<HTMLElement, Props>(function Section(
  { id, tone = 'bg', spacing = 'lg', className = '', children, ...rest },
  ref,
) {
  const py = spacing === 'lg' ? 'py-24 sm:py-28 lg:py-32' : 'py-16 sm:py-20';
  return (
    <section
      ref={ref}
      id={id}
      className={`relative ${TONE[tone]} ${py} ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
});

export default Section;
