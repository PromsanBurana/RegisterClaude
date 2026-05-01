import { useEffect, useMemo, useState } from 'react';
import type { Registration } from '../../types';
import StatusBadge from './StatusBadge';
import SidePanel from '../ui/SidePanel';
import Button from '../ui/Button';
import { Select } from '../ui/Input';
import { courses } from '../../data/courses';
import {
  describeAvailability,
  type AvailabilityHelper,
} from '../../hooks/useBatchAvailability';

type Props = {
  registration: Registration | null;
  onClose: () => void;
  availability: AvailabilityHelper;
  onMove: (
    id: string,
    courseId: string,
    batchId: string,
  ) => Promise<void>;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('th-TH', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
}

export default function DetailPanel({
  registration,
  onClose,
  availability,
  onMove,
}: Props) {
  return (
    <SidePanel
      open={!!registration}
      onClose={onClose}
      size="lg"
      title="Registration detail"
    >
      {registration && (
        <div className="px-6 py-7 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
                ID
              </p>
              <p className="mt-1 font-mono text-xs text-fg-secondary break-all">
                {registration.id}
              </p>
            </div>
            <StatusBadge status={registration.status} />
          </div>

          <Field label="ชื่อ-นามสกุล" value={registration.fullName} />

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="เบอร์โทร" value={registration.phone} mono />
            <Field label="อีเมล" value={registration.email} mono />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field
              label="บริษัท / หน่วยงาน"
              value={registration.company || '—'}
            />
            <Field label="ตำแหน่ง" value={registration.position || '—'} />
          </div>

          <div className="border-t border-line pt-5">
            <Field label="คอร์ส" value={registration.courseName} />
            <div className="mt-4">
              <Field label="รุ่นเรียน" value={registration.batchName} />
            </div>
          </div>

          <MoveBatchPanel
            registration={registration}
            availability={availability}
            onMove={onMove}
          />

          <div className="border-t border-line pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
              ความคาดหวัง
            </p>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-fg-secondary">
              {registration.expectation || '—'}
            </p>
          </div>

          <div className="border-t border-line pt-5">
            <Field
              label="วันที่ลงทะเบียน"
              value={formatDate(registration.createdAt)}
              mono
            />
          </div>
        </div>
      )}
    </SidePanel>
  );
}

// -----------------------------------------------------------------------------
// Move batch
// -----------------------------------------------------------------------------

type Option = {
  courseId: string;
  batchId: string;
  optionLabel: string;
  isFull: boolean;
  isCurrent: boolean;
  helper: string;
};

function MoveBatchPanel({
  registration,
  availability,
  onMove,
}: {
  registration: Registration;
  availability: AvailabilityHelper;
  onMove: Props['onMove'];
}) {
  const options = useMemo<Option[]>(() => {
    const list: Option[] = [];
    for (const c of courses) {
      for (const b of c.batches) {
        const avail = availability.lookup(c.id, b.id);
        const desc = describeAvailability(avail);
        const isCurrent =
          registration.courseId === c.id && registration.batchId === b.id;
        list.push({
          courseId: c.id,
          batchId: b.id,
          optionLabel: `${c.shortTitle} • ${b.label} • ${b.date}${
            isCurrent ? ' (รุ่นปัจจุบัน)' : ''
          }`,
          isFull: !!avail?.isFull,
          isCurrent,
          helper: desc.label,
        });
      }
    }
    return list;
  }, [availability, registration]);

  const [target, setTarget] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset selection whenever the open registration changes
  useEffect(() => {
    setTarget('');
    setError(null);
  }, [registration.id]);

  const targetOption = options.find(
    (o) => `${o.courseId}::${o.batchId}` === target,
  );
  const canMove = !!target && !targetOption?.isCurrent && !targetOption?.isFull;

  const handleMove = async () => {
    if (!targetOption) return;
    if (
      !confirm(
        `ย้ายผู้สมัคร "${registration.fullName}"\nจาก: ${registration.batchName}\nไปยัง: ${targetOption.optionLabel}\n\nยืนยัน?`,
      )
    ) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onMove(registration.id, targetOption.courseId, targetOption.batchId);
      setTarget('');
    } catch (err) {
      setError((err as Error).message || 'ย้ายไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-line pt-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
        Move to another batch
      </p>
      <div className="mt-3 rounded-xl border border-line bg-elevated p-4 space-y-3">
        <Select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          disabled={submitting}
        >
          <option value="">— เลือกรุ่นใหม่ —</option>
          {options.map((o) => {
            const key = `${o.courseId}::${o.batchId}`;
            const suffix = o.isFull ? ' — เต็ม' : o.helper ? ` — ${o.helper}` : '';
            return (
              <option
                key={key}
                value={key}
                disabled={o.isFull || o.isCurrent}
              >
                {o.optionLabel}
                {suffix}
              </option>
            );
          })}
        </Select>

        {error && (
          <p className="text-xs font-medium text-status-red">↳ {error}</p>
        )}

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={handleMove}
            disabled={!canMove || submitting}
          >
            {submitting ? 'กำลังย้าย...' : 'ย้ายรุ่น'}
            {!submitting && <span aria-hidden>→</span>}
          </Button>
        </div>
      </div>
    </div>
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fg-muted">
        {label}
      </p>
      <p
        className={`mt-1 text-ink ${
          mono ? 'font-mono text-sm' : 'text-base font-medium'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
