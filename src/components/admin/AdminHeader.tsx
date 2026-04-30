import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

type Props = {
  total: number;
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
};

export default function AdminHeader({
  total,
  loading,
  onRefresh,
  onExport,
}: Props) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (!confirm('ออกจากระบบ?')) return;
    await logout();
  };

  return (
    <header className="border-b-3 border-ink bg-ink text-cream">
      <div className="container-narrow section-padding py-6">
        <div className="flex flex-wrap items-start gap-6 justify-between">
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to="/"
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream/60 hover:text-cream transition-colors"
              >
                ← Back to site
              </Link>
              {user && (
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream/60">
                  · signed in as{' '}
                  <span className="text-cream font-bold">{user.username}</span>{' '}
                  <span className="text-sun">[{user.role}]</span>
                </span>
              )}
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-3 font-display text-4xl md:text-6xl uppercase tracking-tight leading-[0.95]"
            >
              Admin Dashboard
            </motion.h1>
            <p className="mt-3 text-sm md:text-base text-cream/65 max-w-xl">
              ข้อมูลผู้ลงทะเบียนคอร์ส — อ่านสดจาก Railway Volume
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <span className="hidden sm:inline-flex tag border-cream text-cream">
              <span className="font-mono">/ {total} records</span>
            </span>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-3 border-3 border-cream text-cream font-bold uppercase text-sm tracking-tight hover:bg-cream hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {loading ? (
                <span className="h-3.5 w-3.5 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
              ) : (
                <span>↻</span>
              )}
              Refresh
            </button>
            <button
              onClick={onExport}
              className="inline-flex items-center gap-2 px-5 py-3 bg-cream text-ink border-3 border-cream font-bold uppercase text-sm tracking-tight hover:bg-sun hover:border-sun transition-colors"
            >
              ↓ Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-3 border-3 border-signal text-signal font-bold uppercase text-sm tracking-tight hover:bg-signal hover:text-cream transition-colors"
            >
              ↩ Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
