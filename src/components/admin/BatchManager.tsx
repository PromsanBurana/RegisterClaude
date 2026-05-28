import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  addCourseBatch,
  deleteCourseBatch,
  type BatchInput,
} from '../../api';
import {
  isBatchPast,
  type Batch,
  type Course,
} from '../../data/courses';
import { useCourses } from '../../hooks/useCourses';
import { useBatchAvailability } from '../../hooks/useBatchAvailability';
import Button from '../ui/Button';
import { Input, FormField } from '../ui/Input';
import Badge from '../ui/Badge';
import ConfirmDialog from './ConfirmDialog';

/**
 * Admin section for managing course batches.
 *
 * Each course has its current batches listed (with past / full status
 * pills), plus an inline form to add a new batch. Removing a batch is
 * gated by a confirmation dialog.
 */
export default function BatchManager() {
  const { courses, refresh: refreshCourses } = useCourses();
  const availability = useBatchAvailability();
  const [confirmDelete, setConfirmDelete] = useState<{
    course: Course;
    batch: Batch;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteCourseBatch(confirmDelete.course.id, confirmDelete.batch.id);
      await Promise.all([refreshCourses(), availability.refresh()]);
      setConfirmDelete(null);
    } catch (err) {
      alert('ลบไม่สำเร็จ: ' + (err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-surface shadow-soft">
      <header className="flex items-start justify-between gap-4 flex-wrap px-5 py-4 border-b border-line">
        <div>
          <h2 className="text-base font-bold text-ink tracking-tight">
            Manage batches
          </h2>
          <p className="mt-1 text-xs text-fg-secondary">
            เพิ่ม / ลบรุ่นเรียนของแต่ละคอร์ส — บันทึกลง Railway Volume ทันที
          </p>
        </div>
      </header>

      <div className="divide-y divide-line">
        {courses.map((course) => (
          <CourseSection
            key={course.id}
            course={course}
            onAdded={async () => {
              await Promise.all([refreshCourses(), availability.refresh()]);
            }}
            onAskDelete={(batch) => setConfirmDelete({ course, batch })}
          />
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        destructive
        title="ลบรุ่นนี้?"
        message={
          confirmDelete
            ? `รุ่นเรียน "${confirmDelete.batch.label} • ${confirmDelete.batch.date}" จะถูกลบ — ผู้ที่ลงทะเบียนไว้ในรุ่นนี้จะยังอยู่ในระบบ แต่จะอ้างถึงรุ่นที่ไม่มีอยู่แล้ว`
            : ''
        }
        confirmLabel={deleting ? 'กำลังลบ...' : 'ลบรุ่นเรียน'}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </section>
  );
}

function CourseSection({
  course,
  onAdded,
  onAskDelete,
}: {
  course: Course;
  onAdded: () => Promise<void>;
  onAskDelete: (b: Batch) => void;
}) {
  const availability = useBatchAvailability();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="px-5 py-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
            {course.subtitle || 'Course'}
          </p>
          <h3 className="mt-0.5 text-sm font-bold text-ink">{course.title}</h3>
        </div>
        <Button
          variant={showForm ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? 'ยกเลิก' : '+ เพิ่มรุ่นใหม่'}
        </Button>
      </div>

      <ul className="mt-3 space-y-2">
        {course.batches.length === 0 && (
          <li className="text-xs text-fg-muted italic">— ยังไม่มีรุ่น —</li>
        )}
        {course.batches.map((b) => {
          const past = isBatchPast(b);
          const avail = availability.lookup(course.id, b.id);
          return (
            <li
              key={b.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-elevated px-3.5 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">
                  {b.label} • {b.date} • {b.time}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-fg-muted">
                  id: {b.id} · ISO: {b.dateISO}
                </p>
              </div>
              {past && (
                <Badge tone="gray" size="sm">
                  อดีต
                </Badge>
              )}
              {!past && avail?.isFull && (
                <Badge tone="red" size="sm">
                  เต็ม
                </Badge>
              )}
              {!past && avail && !avail.isFull && (
                <Badge tone="green" size="sm">
                  {avail.count}/{avail.capacity}
                </Badge>
              )}
              <button
                onClick={() => onAskDelete(b)}
                title="ลบรุ่นนี้"
                aria-label="ลบรุ่นนี้"
                className="h-8 w-8 inline-flex items-center justify-center text-status-red border border-status-red/30 rounded-lg hover:bg-status-red/10 hover:border-status-red transition-colors"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 4h10M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 4l.5 9a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1L11 4" />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence initial={false}>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <AddBatchForm
              courseId={course.id}
              onClose={() => setShowForm(false)}
              onAdded={async () => {
                setShowForm(false);
                await onAdded();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddBatchForm({
  courseId,
  onClose,
  onAdded,
}: {
  courseId: string;
  onClose: () => void;
  onAdded: () => Promise<void>;
}) {
  const [label, setLabel] = useState('');
  const [dateISO, setDateISO] = useState('');
  const [time, setTime] = useState('09.30 - 12.00 น.');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isoPattern.test(dateISO)) {
      setError('กรุณาเลือกวันที่ในรูปแบบ YYYY-MM-DD');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload: BatchInput = {
        dateISO,
        ...(label.trim() ? { label: label.trim() } : {}),
        ...(time.trim() ? { time: time.trim() } : {}),
        ...(date.trim() ? { date: date.trim() } : {}),
      };
      await addCourseBatch(courseId, payload);
      setLabel('');
      setDateISO('');
      setDate('');
      await onAdded();
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'invalid_date') setError('วันที่ไม่ถูกต้อง');
      else if (msg === 'invalid_course') setError('คอร์สไม่ถูกต้อง');
      else setError('เพิ่มรุ่นไม่สำเร็จ: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl border border-brand-purple/25 bg-gradient-to-br from-brand-purple/8 via-surface to-surface p-4"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-purple mb-3">
        เพิ่มรุ่นใหม่
      </p>
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-3">
        <FormField label="วันที่ (ISO)" required>
          <Input
            type="date"
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
            required
          />
        </FormField>
        <FormField
          label="Label (ปล่อยว่างได้)"
          hint="ระบบจะตั้งให้อัตโนมัติเช่น 'รุ่น 8'"
        >
          <Input
            type="text"
            placeholder="รุ่น 8"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </FormField>
        <FormField label="เวลา">
          <Input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </FormField>
        <FormField
          label="ข้อความวันที่ (ปล่อยว่างได้)"
          hint="เช่น วันพุธที่ 10 มิ.ย. — ไม่ใส่ระบบจะ generate ให้จาก ISO date"
        >
          <Input
            type="text"
            placeholder="(auto)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormField>
      </div>
      {error && (
        <p className="mt-3 text-xs font-medium text-status-red">↳ {error}</p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={submitting}
        >
          ยกเลิก
        </Button>
        <Button type="submit" variant="primary" size="sm" disabled={submitting}>
          {submitting ? 'กำลังเพิ่ม...' : 'เพิ่มรุ่น'}
        </Button>
      </div>
    </form>
  );
}
