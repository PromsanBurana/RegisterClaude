import type { Registration } from '../../types';
import StatusBadge from './StatusBadge';
import SidePanel from '../ui/SidePanel';

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

export default function DetailPanel({ registration, onClose }: Props) {
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
