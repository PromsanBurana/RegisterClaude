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

export default function RegistrationsTable({
  rows,
  onView,
  onChangeStatus,
  onDelete,
  pendingId,
}: Props) {
  return (
    <div className="border-3 border-ink bg-paper overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[1100px]">
        <thead>
          <tr className="bg-ink text-paper">
            {[
              '#',
              'วันที่ลงทะเบียน',
              'ชื่อ-นามสกุล',
              'เบอร์โทร',
              'อีเมล',
              'บริษัท',
              'ตำแหน่ง',
              'คอร์ส',
              'รุ่นเรียน',
              'สถานะ',
              'Action',
            ].map((h) => (
              <th
                key={h}
                className="px-3 py-3 text-left font-mono text-[10px] uppercase tracking-[0.2em] font-bold border-r border-paper/20 last:border-r-0 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const pending = pendingId === r.id;
            return (
              <tr
                key={r.id}
                className={`border-t-2 border-ink/15 hover:bg-sun/30 transition-colors ${
                  pending ? 'opacity-50' : ''
                }`}
              >
                <td className="px-3 py-3 font-mono text-xs text-ink/60">
                  {String(i + 1).padStart(3, '0')}
                </td>
                <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">
                  {formatDate(r.createdAt)}
                </td>
                <td className="px-3 py-3 font-bold whitespace-nowrap">
                  {r.fullName}
                </td>
                <td className="px-3 py-3 font-mono text-xs whitespace-nowrap">
                  {r.phone}
                </td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">
                  {r.email}
                </td>
                <td className="px-3 py-3 text-xs">{truncate(r.company || '—', 24)}</td>
                <td className="px-3 py-3 text-xs">{truncate(r.position || '—', 24)}</td>
                <td className="px-3 py-3 text-xs">{truncate(r.courseName, 28)}</td>
                <td className="px-3 py-3 text-xs whitespace-nowrap">
                  {r.batchName.split(' • ')[0]}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <StatusBadge status={r.status} size="sm" />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onView(r)}
                      title="ดูรายละเอียด"
                      className="px-2 py-1 border-2 border-ink hover:bg-ink hover:text-sun transition-colors text-xs font-bold"
                    >
                      View
                    </button>
                    <select
                      value={r.status}
                      onChange={(e) =>
                        onChangeStatus(r.id, e.target.value as RegistrationStatus)
                      }
                      disabled={pending}
                      className="px-1.5 py-1 border-2 border-ink bg-paper text-xs font-bold cursor-pointer disabled:opacity-50"
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
                      title="ลบ"
                      className="px-2 py-1 border-2 border-signal text-signal hover:bg-signal hover:text-paper transition-colors text-xs font-bold disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
