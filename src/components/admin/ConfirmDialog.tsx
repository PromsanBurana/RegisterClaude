import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'ยืนยัน',
  destructive,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="w-full max-w-md bg-paper border-3 border-ink shadow-[10px_10px_0_0_#0a0a0a]"
          >
            <div className="px-5 py-3 border-b-3 border-ink bg-ink text-cream font-mono text-xs uppercase tracking-[0.25em]">
              / {destructive ? 'Confirm Delete' : 'Confirm'}
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl uppercase leading-tight tracking-tight">
                {title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ink/75">
                {message}
              </p>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 border-3 border-ink font-bold uppercase text-sm tracking-tight hover:bg-ink hover:text-cream transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-5 py-2.5 border-3 font-bold uppercase text-sm tracking-tight transition-colors ${
                    destructive
                      ? 'bg-signal text-cream border-signal hover:bg-ink hover:border-ink'
                      : 'bg-ink text-cream border-ink hover:bg-sun hover:text-ink hover:border-ink'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
