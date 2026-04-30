import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...rest }, ref) {
    return <input ref={ref} className={`field ${className}`} {...rest} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className = '', ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={`field min-h-[120px] resize-y leading-relaxed ${className}`}
      {...rest}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = '', children, ...rest }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`field cursor-pointer pr-10 appearance-none ${className}`}
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden
        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted pointer-events-none"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 6 8 10 12 6" />
      </svg>
    </div>
  );
});

type FormFieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  full?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
};

export function FormField({
  label,
  required,
  error,
  hint,
  full,
  children,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="ml-1 text-status-red">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-fg-muted">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-status-red">{error}</p>
      )}
    </div>
  );
}
