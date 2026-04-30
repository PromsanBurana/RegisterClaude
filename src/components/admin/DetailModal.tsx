import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Registration } from '../../types';
import StatusBadge from './StatusBadge';

type Props = {
  registration: Registration | null;
  onClose: () => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('th-TH', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export default function DetailModal({ registration, onClose }: Props) {
  useEffect(() => {
    if (!registration) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [registration, onClose]);

  return (
    <AnimatePresence>
      {registration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-paper border-3 border-ink shadow-[12px_12px_0_0_#0a0a0a]"
          >
            <div className="sticky top-0 flex items-center justify-between px-5 py-3 border-b-3 border-ink bg-ink text-cream z-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em]">
                / Registration Detail
              </span>
              <button
                onClick={onClose}
                aria-label="ปิด"
                className="font-display text-xl hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
                    / ID
                  </p>
                  <p className="mt-1 font-mono text-xs break-all">
                    {registration.id}
                  </p>
                </div>
                <StatusBadge status={registration.status} />
              </div>

              <Field label="ชื่อ-นามสกุล" value={registration.fullName} />

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="เบอร์โทร" value={registration.phone} mono />
                <Field label="อีเมล" value={registration.email} mono />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="บริษัท / หน่วยงาน" value={registration.company || '—'} />
                <Field label="ตำแหน่ง" value={registration.position || '—'} />
              </div>

              <div className="border-t-3 border-ink pt-5">
                <Field label="คอร์ส" value={registration.courseName} />
                <div className="mt-4">
                  <Field label="รุ่นเรียน" value={registration.batchName} />
                </div>
              </div>

              <div className="border-t-3 border-ink pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
                  / ความคาดหวัง
                </p>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                  {registration.expectation || '—'}
                </p>
              </div>

              <div className="border-t-3 border-ink pt-5">
                <Field
                  label="วันที่ลงทะเบียน"
                  value={formatDate(registration.createdAt)}
                  mono
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50">
        / {label}
      </p>
      <p
        className={`mt-1 ${mono ? 'font-mono text-sm' : 'text-base font-medium'}`}
      >
        {value}
      </p>
    </div>
  );
}
