import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  deleteRegistration,
  getRegistrations,
  updateRegistrationStatus,
} from '../api';
import type { Registration, RegistrationStatus } from '../types';
import { courses } from '../data/courses';
import AdminHeader from '../components/admin/AdminHeader';
import StatsCards from '../components/admin/StatsCards';
import Filters from '../components/admin/Filters';
import RegistrationsTable from '../components/admin/RegistrationsTable';
import DetailModal from '../components/admin/DetailModal';
import ConfirmDialog from '../components/admin/ConfirmDialog';

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
        err instanceof Error
          ? err.message
          : 'ไม่สามารถโหลดข้อมูลได้',
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
        const haystack = `${r.fullName} ${r.phone} ${r.email} ${r.company}`.toLowerCase();
        if (!haystack.includes(q)) return false;
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
    {
      label: 'Total',
      value: String(stats.total),
      caption: 'จำนวนผู้ลงทะเบียนทั้งหมด',
    },
    {
      label: 'Vibe Coding',
      value: String(stats.vibe),
      caption: 'ผู้สมัครคอร์ส Vibe Coding',
    },
    {
      label: 'Cowork',
      value: String(stats.cowork),
      caption: 'ผู้สมัครคอร์ส Claude Cowork',
    },
    {
      label: 'Today',
      value: String(stats.today),
      caption: 'ลงทะเบียนวันนี้',
    },
    {
      label: 'Top Batch',
      value: stats.topBatch.label,
      caption: stats.topBatch.count
        ? `${stats.topBatch.count} คน`
        : 'ยังไม่มีข้อมูล',
    },
  ];

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AdminHeader
        total={data.length}
        loading={loading}
        onRefresh={load}
        onExport={handleExport}
      />

      <main className="container-narrow section-padding py-8 md:py-10 space-y-6">
        <SecurityNotice />

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
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-ink/60 px-1">
              <span>
                / Showing {filtered.length} of {data.length}
              </span>
              <span>/ Live data from Volume</span>
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
      </main>

      <DetailModal
        registration={detailReg}
        onClose={() => setDetailReg(null)}
      />
      <ConfirmDialog
        open={!!confirmDelete}
        destructive
        title="ยืนยันการลบ?"
        message={`ต้องการลบรายการของ "${confirmDelete?.fullName ?? ''}" หรือไม่ — การลบนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบ"
        onConfirm={performDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

function SecurityNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-3 border-signal bg-signal/10 px-4 py-3 flex items-start gap-3"
    >
      <span className="font-display text-xl text-signal leading-none mt-0.5">
        ⚠
      </span>
      <p className="text-sm font-medium leading-snug">
        <span className="font-bold uppercase tracking-wider text-signal mr-1.5">
          หมายเหตุ:
        </span>
        หน้านี้ควรเพิ่มระบบ Login และ Role-based access control ก่อนใช้งานจริง
      </p>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="border-3 border-ink bg-paper p-12 flex items-center justify-center gap-3 font-mono text-sm uppercase tracking-widest">
      <span className="h-3 w-3 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
      Loading...
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="border-3 border-signal bg-paper p-8 text-center space-y-3">
      <p className="font-display text-3xl uppercase text-signal">Error</p>
      <p className="text-sm font-mono">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-5 py-2.5 border-3 border-signal text-signal font-bold uppercase text-sm hover:bg-signal hover:text-cream transition-colors"
      >
        ลองอีกครั้ง
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-3 border-ink bg-paper p-12 text-center">
      <p className="font-display text-4xl md:text-5xl uppercase">
        ยังไม่มี<br />
        ผู้ลงทะเบียน
      </p>
      <p className="mt-3 text-sm text-ink/60">
        ลองส่งใบสมัครจากหน้า landing page เพื่อเริ่มต้น
      </p>
    </div>
  );
}

function NoMatchState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-3 border-ink bg-paper p-10 text-center">
      <p className="font-display text-3xl uppercase">No matches</p>
      <p className="mt-2 text-sm text-ink/60">
        ไม่มีรายการที่ตรงกับเงื่อนไขที่ค้นหา
      </p>
      <button
        onClick={onClear}
        className="mt-5 px-5 py-2.5 border-3 border-ink font-bold uppercase text-sm hover:bg-ink hover:text-cream transition-colors"
      >
        Clear filters
      </button>
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
