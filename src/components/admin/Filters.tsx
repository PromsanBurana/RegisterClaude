import { courses } from '../../data/courses';
import { STATUS_LABEL, STATUS_ORDER } from '../../types';
import type { RegistrationStatus } from '../../types';

type Props = {
  search: string;
  courseId: string;
  batchId: string;
  status: string;
  onSearch: (v: string) => void;
  onCourse: (v: string) => void;
  onBatch: (v: string) => void;
  onStatus: (v: string) => void;
  onClear: () => void;
};

export default function Filters({
  search,
  courseId,
  batchId,
  status,
  onSearch,
  onCourse,
  onBatch,
  onStatus,
  onClear,
}: Props) {
  const selectedCourse = courses.find((c) => c.id === courseId);
  const hasFilter = !!(search || courseId || batchId || status);

  return (
    <div className="border-3 border-ink bg-paper p-4 md:p-6">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b-3 border-ink">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em]">
          / Filter
        </span>
        <span className="flex-1 h-px bg-ink/20" />
        {hasFilter && (
          <button
            onClick={onClear}
            className="px-3 py-1 border-2 border-ink text-xs font-bold uppercase tracking-wider hover:bg-ink hover:text-sun transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5">
          <label className="label-bw">/ Search</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50 pointer-events-none">
              ⌕
            </span>
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="ชื่อ, เบอร์, อีเมล, บริษัท..."
              className="input-bw pl-9 bg-cream"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <label className="label-bw">/ Course</label>
          <select
            value={courseId}
            onChange={(e) => {
              onCourse(e.target.value);
              onBatch('');
            }}
            className="input-bw bg-cream cursor-pointer"
          >
            <option value="">ทุกคอร์ส</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="label-bw">/ Batch</label>
          <select
            value={batchId}
            onChange={(e) => onBatch(e.target.value)}
            disabled={!selectedCourse}
            className="input-bw bg-cream cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">ทุกรุ่น</option>
            {selectedCourse?.batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="label-bw">/ Status</label>
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value)}
            className="input-bw bg-cream cursor-pointer"
          >
            <option value="">ทุกสถานะ</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s as RegistrationStatus]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
