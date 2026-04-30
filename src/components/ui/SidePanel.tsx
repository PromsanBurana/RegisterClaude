import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

type Size = 'md' | 'lg';

const SIZE: Record<Size, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
};

type Props = {
  open: boolean;
  onClose: () => void;
  size?: Size;
  title?: string;
  children: ReactNode;
};

/**
 * Slide-in side panel from the right. Used for admin row detail views.
 */
export default function SidePanel({
  open,
  onClose,
  size = 'lg',
  title,
  children,
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
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-ink/30 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className={`fixed top-0 right-0 bottom-0 z-[91] w-full ${SIZE[size]} bg-surface border-l border-line shadow-elevated overflow-y-auto`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-6 py-4 border-b border-line bg-surface/95 backdrop-blur">
              {title ? (
                <h3 className="text-sm font-semibold text-ink">{title}</h3>
              ) : (
                <span aria-hidden />
              )}
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
            </div>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
