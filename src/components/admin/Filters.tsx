import { courses } from '../../data/courses';
import { STATUS_LABEL, STATUS_ORDER } from '../../types';
import type { RegistrationStatus } from '../../types';
import { Input, Select } from '../ui/Input';

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
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-soft">
      <div className="grid lg:grid-cols-12 gap-3">
        <div className="lg:col-span-5">
          <label className="label" htmlFor="filter-search">
            Search
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none">
              <SearchIcon />
            </span>
            <Input
              id="filter-search"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="ชื่อ, เบอร์, อีเมล, บริษัท..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <label className="label">Course</label>
          <Select
            value={courseId}
            onChange={(e) => {
              onCourse(e.target.value);
              onBatch('');
            }}
          >
            <option value="">ทุกคอร์ส</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortTitle}
              </option>
            ))}
          </Select>
        </div>

        <div className="lg:col-span-2">
          <label className="label">Batch</label>
          <Select
            value={batchId}
            onChange={(e) => onBatch(e.target.value)}
            disabled={!selectedCourse}
          >
            <option value="">ทุกรุ่น</option>
            {selectedCourse?.batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="lg:col-span-2">
          <label className="label">Status</label>
          <Select value={status} onChange={(e) => onStatus(e.target.value)}>
            <option value="">ทุกสถานะ</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s as RegistrationStatus]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {hasFilter && (
        <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
          <p className="text-xs text-fg-muted">Filters active</p>
          <button
            onClick={onClear}
            className="text-xs font-semibold text-brand-purple hover:text-brand-pink transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="m13 13-2.6-2.6" />
    </svg>
  );
}
