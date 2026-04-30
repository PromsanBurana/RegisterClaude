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
    <div className="border-3 border-ink bg-paper p-4 md:p-5">
      <div className="grid lg:grid-cols-12 gap-3">
        <div className="lg:col-span-4">
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1.5">
            / Search
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50">⌕</span>
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="ชื่อ, เบอร์, อีเมล, บริษัท..."
              className="w-full pl-9 pr-3 py-3 border-3 border-ink bg-cream font-medium placeholder:text-ink/40 focus:outline-none focus:bg-paper transition-colors"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1.5">
            / Course
          </label>
          <select
            value={courseId}
            onChange={(e) => {
              onCourse(e.target.value);
              onBatch('');
            }}
            className="w-full px-3 py-3 border-3 border-ink bg-cream font-medium cursor-pointer focus:outline-none focus:bg-paper transition-colors"
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
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1.5">
            / Batch
          </label>
          <select
            value={batchId}
            onChange={(e) => onBatch(e.target.value)}
            disabled={!selectedCourse}
            className="w-full px-3 py-3 border-3 border-ink bg-cream font-medium cursor-pointer focus:outline-none focus:bg-paper transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1.5">
            / Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value)}
            className="w-full px-3 py-3 border-3 border-ink bg-cream font-medium cursor-pointer focus:outline-none focus:bg-paper transition-colors"
          >
            <option value="">ทุกสถานะ</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s as RegistrationStatus]}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-1 flex items-end">
          <button
            onClick={onClear}
            disabled={!hasFilter}
            className="w-full h-[50px] border-3 border-ink bg-paper font-bold uppercase text-xs tracking-wider hover:bg-ink hover:text-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
