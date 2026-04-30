import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg';

const SIZE: Record<Size, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

type Props = {
  open: boolean;
  onClose: () => void;
  size?: Size;
  title?: string;
  showClose?: boolean;
  children: ReactNode;
  contentClassName?: string;
};

export default function Modal({
  open,
  onClose,
  size = 'md',
  title,
  showClose = true,
  children,
  contentClassName = '',
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-md"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${SIZE[size]} max-h-[88vh] overflow-y-auto rounded-2xl border border-line bg-surface shadow-elevated ${contentClassName}`}
          >
            {(title || showClose) && (
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-line bg-surface/95 backdrop-blur">
                {title ? (
                  <h3 className="text-sm font-semibold text-ink">{title}</h3>
                ) : (
                  <span aria-hidden />
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-fg-secondary hover:text-ink hover:bg-elevated transition-colors"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M3 3l10 10M13 3l-10 10" />
                    </svg>
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
