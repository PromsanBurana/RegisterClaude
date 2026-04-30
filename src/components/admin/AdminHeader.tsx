import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import BoldButton from '../ui/BoldButton';

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
    <header className="relative bg-sun text-ink border-b-3 border-ink overflow-hidden">
      <div className="absolute inset-0 grid-lines pointer-events-none" />
      <div className="relative container-narrow section-padding py-8 md:py-10">
        <div className="flex flex-wrap items-start gap-6 justify-between">
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-3 flex-wrap text-ink">
              <Link
                to="/"
                className="font-mono text-[11px] uppercase tracking-[0.25em] hover:underline"
              >
                ← Back to site
              </Link>
              {user && (
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
                  · signed in as{' '}
                  <span className="text-ink font-bold">{user.username}</span>{' '}
                  <span className="bg-ink text-sun px-1.5 py-0.5 ml-1">
                    {user.role}
                  </span>
                </span>
              )}
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-3 font-display text-display-2 uppercase tracking-tight leading-[0.9]"
            >
              Admin<br />
              <span className="text-stroke">Control</span> /
            </motion.h1>
            <p className="mt-3 text-sm md:text-base font-medium max-w-xl">
              ข้อมูลผู้ลงทะเบียนคอร์ส — อ่านสดจาก Railway Volume
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <span className="hidden sm:inline-flex tag-pill bg-ink text-sun border-ink">
              <span className="font-mono">/ {total} records</span>
            </span>
            <BoldButton
              variant="outline-ink"
              size="md"
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? (
                <span className="h-3.5 w-3.5 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
              ) : (
                <span aria-hidden>↻</span>
              )}
              Refresh
            </BoldButton>
            <BoldButton variant="ink" size="md" onClick={onExport}>
              <span aria-hidden>↓</span> Export CSV
            </BoldButton>
            <BoldButton variant="signal" size="md" onClick={handleLogout}>
              <span aria-hidden>↩</span> Logout
            </BoldButton>
          </div>
        </div>
      </div>
    </header>
  );
}
