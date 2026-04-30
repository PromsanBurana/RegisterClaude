import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Badge from '../ui/Badge';

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
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
      <Container size="xl" className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand bg-[length:200%_200%] animate-gradient-shift shadow-soft">
                <span className="font-display text-[14px] font-extrabold text-white">
                  C
                </span>
              </span>
              <span className="text-sm font-bold text-ink hidden sm:inline">
                Claude Workshop
              </span>
            </Link>
            <span className="hidden sm:block w-px h-5 bg-line" />
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-ink tracking-tight truncate">
                Admin Dashboard
              </h1>
              {user && (
                <p className="text-xs text-fg-muted truncate">
                  Signed in as{' '}
                  <span className="text-fg-secondary font-medium">{user.username}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone="purple" size="md" className="hidden sm:inline-flex">
              {total} records
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              aria-label="Refresh"
            >
              {loading ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-fg-muted border-t-ink animate-spin" />
              ) : (
                <RefreshIcon />
              )}
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onExport}
              aria-label="Export"
            >
              <DownloadIcon />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogoutIcon />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8a6 6 0 1 1-1.8-4.3" />
      <polyline points="14 3 14 6 11 6" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v8M4 8l4 4 4-4M3 14h10" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H4v10h5M11 8H7M9 6l2 2-2 2" />
    </svg>
  );
}
