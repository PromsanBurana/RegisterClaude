import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteRegistration,
  getRegistrations,
  updateRegistrationStatus,
} from '../api';
import type { Registration, RegistrationStatus } from '../types';
import { courses } from '../data/courses';
import Container from '../components/ui/Container';
import AdminHeader from '../components/admin/AdminHeader';
import StatsCards from '../components/admin/StatsCards';
import Filters from '../components/admin/Filters';
import RegistrationsTable from '../components/admin/RegistrationsTable';
import DetailModal from '../components/admin/DetailModal';
import ConfirmDialog from '../components/admin/ConfirmDialog';
import Button from '../components/ui/Button';

export default function Admin() {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [detailReg, setDetailReg] = useState<Registration | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Registration | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getRegistrations();
      setData(rows);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลได้',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data.filter((r) => {
      if (q) {
        const hay = `${r.fullName} ${r.phone} ${r.email} ${r.company}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (courseFilter && r.courseId !== courseFilter) return false;
      if (batchFilter && r.batchId !== batchFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    });
  }, [data, search, courseFilter, batchFilter, statusFilter]);

  const stats = useMemo(() => computeStats(data), [data]);

  const handleChangeStatus = async (
    id: string,
    status: RegistrationStatus,
  ) => {
    setPendingId(id);
    try {
      const updated = await updateRegistrationStatus(id, status);
      setData((rows) => rows.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      alert('อัปเดตสถานะไม่สำเร็จ: ' + (err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const performDelete = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete.id;
    setPendingId(id);
    setConfirmDelete(null);
    try {
      await deleteRegistration(id);
      setData((rows) => rows.filter((r) => r.id !== id));
    } catch (err) {
      alert('ลบไม่สำเร็จ: ' + (err as Error).message);
    } finally {
      setPendingId(null);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCourseFilter('');
    setBatchFilter('');
    setStatusFilter('');
  };

  const handleExport = () => exportCsv(filtered);

  const statCards = [
    { label: 'Total', value: String(stats.total), caption: 'ผู้ลงทะเบียนทั้งหมด' },
    { label: 'Vibe Coding', value: String(stats.vibe), caption: 'คอร์ส Vibe Coding' },
    { label: 'Cowork', value: String(stats.cowork), caption: 'คอร์ส Claude Cowork' },
    { label: 'Today', value: String(stats.today), caption: 'ลงทะเบียนวันนี้' },
    {
      label: 'Top batch',
      value: stats.topBatch.label,
      caption: stats.topBatch.count
        ? `${stats.topBatch.count} คน`
        : 'ยังไม่มีข้อมูล',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink">
      <AdminHeader
        total={data.length}
        loading={loading}
        onRefresh={load}
        onExport={handleExport}
      />

      <Container size="xl" className="py-8 sm:py-10">
        <div className="space-y-6">
          <PageIntro />
          <StatsCards stats={statCards} />
          <Filters
            search={search}
            courseId={courseFilter}
            batchId={batchFilter}
            status={statusFilter}
            onSearch={setSearch}
            onCourse={setCourseFilter}
            onBatch={setBatchFilter}
            onStatus={setStatusFilter}
            onClear={handleClearFilters}
          />

          {loading && <LoadingState />}
          {!loading && error && <ErrorState message={error} onRetry={load} />}
          {!loading && !error && data.length === 0 && <EmptyState />}
          {!loading && !error && data.length > 0 && filtered.length === 0 && (
            <NoMatchState onClear={handleClearFilters} />
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="flex items-center justify-between text-xs text-fg-muted">
                <span>
                  Showing {filtered.length} of {data.length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
                  Live from Volume
                </span>
              </div>
              <RegistrationsTable
                rows={filtered}
                onView={setDetailReg}
                onChangeStatus={handleChangeStatus}
                onDelete={(id) => {
                  const reg = data.find((r) => r.id === id) || null;
                  setConfirmDelete(reg);
                }}
                pendingId={pendingId}
              />
            </>
          )}
        </div>
      </Container>

      <DetailModal
        registration={detailReg}
        onClose={() => setDetailReg(null)}
      />
      <ConfirmDialog
        open={!!confirmDelete}
        destructive
        title="ลบรายการนี้?"
        message={`รายการของ "${confirmDelete?.fullName ?? ''}" จะถูกลบถาวร — การลบนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบรายการ"
        onConfirm={performDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function PageIntro() {
  return (
    <div className="rounded-2xl border border-brand-purple/15 bg-gradient-to-br from-brand-purple/8 via-surface to-surface px-5 py-4 flex items-start gap-3 shadow-soft">
      <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand bg-[length:200%_200%] animate-gradient-shift text-white shadow-soft flex-shrink-0">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 5v3.5" />
          <circle cx="8" cy="11" r="0.5" fill="currentColor" />
        </svg>
      </div>
      <p className="text-sm text-fg-secondary leading-relaxed">
        <span className="text-ink font-semibold">Authenticated session.</span>{' '}
        การลบ/แก้สถานะถูกบันทึกลง Railway Volume ทันที — แนะนำให้เปลี่ยน password เริ่มต้นและตั้ง{' '}
        <code className="font-mono text-ink bg-surface px-1.5 py-0.5 rounded border border-line text-[11px]">
          SESSION_SECRET
        </code>{' '}
        ที่แข็งแรงก่อน production
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-12 flex items-center justify-center gap-3 text-sm text-fg-secondary shadow-soft">
      <span className="h-3.5 w-3.5 rounded-full border-2 border-fg-muted border-t-ink animate-spin" />
      Loading registrations...
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-status-red/30 bg-status-red/5 p-8 text-center space-y-3 shadow-soft">
      <p className="text-base font-bold text-status-red">Error</p>
      <p className="text-sm font-mono text-fg-secondary">{message}</p>
      <div className="pt-2">
        <Button variant="danger" size="sm" onClick={onRetry}>
          ลองอีกครั้ง
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-12 text-center shadow-soft">
      <p className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
        ยังไม่มีผู้ลงทะเบียน
      </p>
      <p className="mt-3 text-sm text-fg-secondary">
        ลองส่งใบสมัครจากหน้า landing page เพื่อเริ่มต้น
      </p>
    </div>
  );
}

function NoMatchState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-10 text-center shadow-soft">
      <p className="text-xl font-bold text-ink">No matches</p>
      <p className="mt-2 text-sm text-fg-secondary">
        ไม่มีรายการที่ตรงกับเงื่อนไขที่เลือก
      </p>
      <div className="mt-5">
        <Button variant="secondary" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}

// ---------- helpers ----------

function localDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function computeStats(data: Registration[]) {
  const today = localDate(new Date().toISOString());
  let vibe = 0;
  let cowork = 0;
  let todayCount = 0;
  const batchCount = new Map<string, { label: string; count: number }>();

  for (const r of data) {
    if (r.courseId === 'vibe-coding') vibe++;
    if (r.courseId === 'cowork-automation') cowork++;
    if (localDate(r.createdAt) === today) todayCount++;

    const course = courses.find((c) => c.id === r.courseId);
    const batch = course?.batches.find((b) => b.id === r.batchId);
    if (course && batch) {
      const key = `${r.courseId}::${r.batchId}`;
      const label = `${course.shortTitle} ${batch.label}`;
      const cur = batchCount.get(key);
      if (cur) cur.count++;
      else batchCount.set(key, { label, count: 1 });
    }
  }

  let topBatch: { label: string; count: number } = { label: '—', count: 0 };
  for (const v of batchCount.values()) {
    if (v.count > topBatch.count) topBatch = v;
  }

  return {
    total: data.length,
    vibe,
    cowork,
    today: todayCount,
    topBatch,
  };
}

function exportCsv(rows: Registration[]) {
  const headers = [
    'ลำดับ',
    'วันที่ลงทะเบียน',
    'ชื่อ-นามสกุล',
    'เบอร์โทร',
    'อีเมล',
    'บริษัท / หน่วยงาน',
    'ตำแหน่ง',
    'คอร์ส',
    'รุ่นเรียน',
    'ความคาดหวัง',
    'สถานะ',
  ];
  const escape = (v: string | number): string => {
    const s = String(v ?? '');
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = [
    headers.map((h) => escape(h)).join(','),
    ...rows.map((r, i) =>
      [
        i + 1,
        r.createdAt,
        r.fullName,
        r.phone,
        r.email,
        r.company,
        r.position,
        r.courseName,
        r.batchName,
        r.expectation,
        r.status,
      ]
        .map(escape)
        .join(','),
    ),
  ];
  // BOM ensures Excel opens UTF-8 correctly with Thai characters
  const csv = '﻿' + lines.join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'registrations-export.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
