import { motion, AnimatePresence } from 'framer-motion';
import type { Registration, RegistrationStatus } from '../../types';
import { STATUS_ORDER, STATUS_LABEL } from '../../types';
import StatusBadge from './StatusBadge';

type Props = {
  rows: Registration[];
  onView: (r: Registration) => void;
  onChangeStatus: (id: string, status: RegistrationStatus) => void;
  onDelete: (id: string) => void;
  pendingId: string | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mn = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${mn}`;
}

function truncate(s: string, n = 40) {
  if (!s) return '—';
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

const HEADERS = [
  '#',
  'วันที่ลงทะเบียน',
  'ชื่อ',
  'เบอร์โทร',
  'อีเมล',
  'บริษัท',
  'ตำแหน่ง',
  'คอร์ส',
  'รุ่น',
  'สถานะ',
  '',
];

export default function RegistrationsTable({
  rows,
  onView,
  onChangeStatus,
  onDelete,
  pendingId,
}: Props) {
  return (
    <div className="rounded-2xl border border-line bg-surface overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[1100px]">
          <thead>
            <tr className="border-b border-line bg-elevated sticky top-0 z-[1]">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-muted whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((r, i) => {
                const pending = pendingId === r.id;
                return (
                  <motion.tr
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: pending ? 0.5 : 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onView(r)}
                    className="group border-b border-line last:border-b-0 hover:bg-brand-purple/5 cursor-pointer transition-colors"
                    data-cursor="hover"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-fg-muted">
                      {String(i + 1).padStart(3, '0')}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-fg-secondary whitespace-nowrap">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">
                      {r.fullName}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-fg-secondary whitespace-nowrap">
                      {r.phone}
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-secondary whitespace-nowrap">
                      {r.email}
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-secondary">
                      {truncate(r.company || '—', 24)}
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-secondary">
                      {truncate(r.position || '—', 24)}
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-secondary">
                      {truncate(r.courseName, 28)}
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-secondary whitespace-nowrap">
                      {r.batchName.split(' • ')[0]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5">
                        <select
                          value={r.status}
                          onChange={(e) =>
                            onChangeStatus(
                              r.id,
                              e.target.value as RegistrationStatus,
                            )
                          }
                          disabled={pending}
                          className="h-8 px-2 text-xs font-semibold text-fg-secondary bg-surface border border-line rounded-lg cursor-pointer hover:border-line-strong hover:text-ink disabled:opacity-50 focus:outline-none focus:border-brand-purple"
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onDelete(r.id)}
                          disabled={pending}
                          title="Delete"
                          className="h-8 w-8 inline-flex items-center justify-center text-status-red border border-status-red/30 rounded-lg hover:bg-status-red/10 hover:border-status-red transition-colors disabled:opacity-50"
                          aria-label="Delete"
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
                        <span
                          aria-hidden
                          className="ml-1 text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          →
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
