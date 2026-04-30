import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { findCourseById } from '../data/courses';
import type { RegistrationData } from './RegistrationForm';

type Props = {
  open: boolean;
  data: RegistrationData | null;
  onClose: () => void;
};

export default function SuccessModal({ open, data, onClose }: Props) {
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

  const course = data ? findCourseById(data.courseId) : null;
  const batch = course?.batches.find((b) => b.id === data?.batchId);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="relative w-full max-w-lg bg-paper border-3 border-ink shadow-[12px_12px_0_0_#0a0a0a]"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b-3 border-ink bg-ink text-cream">
              <span className="font-mono text-xs uppercase tracking-[0.25em]">
                / Application Received
              </span>
              <button
                onClick={onClose}
                className="font-display text-xl hover:scale-110 transition-transform"
                aria-label="close"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', damping: 12 }}
                className="mx-auto h-24 w-24 bg-ink text-cream border-3 border-ink flex items-center justify-center"
              >
                <svg
                  className="h-12 w-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    d="M5 12l4 4L19 7"
                  />
                </svg>
              </motion.div>

              <h3 className="mt-6 font-display text-4xl md:text-5xl uppercase leading-none tracking-tight">
                Application
                <br />
                Received.
              </h3>
              <p className="mt-4 text-sm md:text-base font-medium leading-snug">
                ขอบคุณที่สมัครเข้าคอร์สของเรา ทีมงานจะติดต่อกลับเพื่อยืนยันที่นั่ง
                <br />
                ภายใน <span className="font-bold">24 ชม.</span>
              </p>

              {course && batch && (
                <div className="mt-6 border-3 border-ink p-4 text-left bg-cream">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
                    / Course
                  </p>
                  <p className="mt-1 font-display text-base uppercase leading-tight">
                    {course.title}
                  </p>
                  <div className="mt-3 pt-3 border-t-2 border-ink/20">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60">
                      / Batch
                    </p>
                    <p className="mt-1 text-sm font-bold">
                      {batch.label} • {batch.date} • {batch.time}
                    </p>
                  </div>
                </div>
              )}

              <button onClick={onClose} className="mt-8 btn-ink w-full">
                เรียบร้อย ✦
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
