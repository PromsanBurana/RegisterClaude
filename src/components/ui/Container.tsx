import type { ElementType, HTMLAttributes, ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<Size, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[1200px]',
};

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  size?: Size;
  children: ReactNode;
};

export default function Container({
  as: Tag = 'div',
  size = 'xl',
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <Tag
      className={`mx-auto w-full px-5 sm:px-8 ${SIZE[size]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
