import { motion } from 'framer-motion';
import { findCourseById } from '../data/courses';
import type { RegistrationData } from './RegistrationForm';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Confetti from './ui/Confetti';

type Props = {
  open: boolean;
  data: RegistrationData | null;
  onClose: () => void;
};

export default function SuccessModal({ open, data, onClose }: Props) {
  const course = data ? findCourseById(data.courseId) : null;
  const batch = course?.batches.find((b) => b.id === data?.batchId);

  return (
    <Modal open={open} onClose={onClose} size="md" showClose>
      <div className="relative px-7 pt-7 pb-8 text-center">
        <Confetti active={open} />
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, type: 'spring', damping: 16, stiffness: 220 }}
          className="mx-auto h-16 w-16 rounded-2xl bg-gradient-brand bg-[length:200%_200%] animate-gradient-shift flex items-center justify-center shadow-glow"
        >
          <motion.svg
            className="h-8 w-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              d="M5 12l4 4L19 7"
            />
          </motion.svg>
        </motion.div>

        <h3 className="mt-6 text-2xl font-bold text-ink tracking-tight">
          You're in!
        </h3>
        <p className="mt-3 text-sm text-fg-secondary leading-relaxed">
          ขอบคุณที่สมัครเข้าคอร์สของเรา
          <br />
          ทีมงานจะติดต่อกลับเพื่อยืนยันที่นั่งภายใน{' '}
          <span className="text-ink font-semibold">24 ชั่วโมง</span>
        </p>

        {course && batch && (
          <div className="mt-6 text-left rounded-2xl border border-line bg-elevated p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-muted">
              Course
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{course.title}</p>
            <div className="mt-3 pt-3 border-t border-line">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-muted">
                Batch
              </p>
              <p className="mt-1 text-sm text-ink">
                {batch.label} · {batch.date} · {batch.time}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          size="md"
          fullWidth
          className="mt-7"
          onClick={onClose}
        >
          เรียบร้อย
        </Button>
      </div>
    </Modal>
  );
}
