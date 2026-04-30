import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import BoldButton from '../ui/BoldButton';

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
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="w-full max-w-md bg-paper border-3 border-ink shadow-offset-lg"
          >
            <div className="px-5 py-3 border-b-3 border-ink bg-ink text-sun font-mono text-xs uppercase tracking-[0.25em]">
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
                <BoldButton variant="outline-ink" size="md" onClick={onCancel}>
                  ยกเลิก
                </BoldButton>
                <BoldButton
                  variant={destructive ? 'signal' : 'ink'}
                  size="md"
                  onClick={onConfirm}
                >
                  {confirmLabel}
                </BoldButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
