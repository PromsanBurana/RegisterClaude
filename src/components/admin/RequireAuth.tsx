import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';

type Props = {
  children: React.ReactNode;
  role?: UserRole;
};

export default function RequireAuth({ children, role }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="font-mono text-sm uppercase tracking-widest flex items-center gap-3">
          <span className="h-3 w-3 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
          Verifying session...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (role && user.role !== role) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="border-3 border-signal bg-paper p-8 max-w-md text-center shadow-[10px_10px_0_0_#0a0a0a]">
          <p className="font-display text-3xl uppercase text-signal">403</p>
          <p className="mt-2 font-bold uppercase tracking-wide">Forbidden</p>
          <p className="mt-3 text-sm text-ink/70">
            บัญชีนี้ไม่มีสิทธิ์เข้าถึงหน้านี้ ต้องเป็น role{' '}
            <code className="font-mono">{role}</code> เท่านั้น
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
