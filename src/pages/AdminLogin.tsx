import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api';

type LocationState = { from?: string };

export default function AdminLogin() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('กรุณากรอก username และ password');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('username หรือ password ไม่ถูกต้อง');
      } else {
        setError('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      <header className="border-b-3 border-ink bg-cream">
        <div className="container-narrow section-padding py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="กลับหน้าหลัก"
          >
            <span className="flex h-9 w-9 items-center justify-center bg-ink text-cream font-display text-xl">
              ✦
            </span>
            <span className="font-display text-base uppercase tracking-tight">
              Claude/Workshop
            </span>
          </Link>
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60 hover:text-ink transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md border-3 border-ink bg-paper shadow-[12px_12px_0_0_#0a0a0a]"
        >
          <div className="px-5 py-3 border-b-3 border-ink bg-ink text-cream flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.25em]">
              / Admin Login
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">
              v1
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            <div>
              <h1 className="font-display text-3xl md:text-4xl uppercase leading-[0.95] tracking-tight">
                Sign In
              </h1>
              <p className="mt-2 text-sm text-ink/70">
                เข้าสู่ระบบเพื่อใช้งาน Admin Dashboard
              </p>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1.5"
              >
                / Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                className="w-full px-4 py-3 border-3 border-ink bg-cream font-medium focus:outline-none focus:bg-paper transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-mono text-[10px] uppercase tracking-[0.25em] text-ink/60 mb-1.5"
              >
                / Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-3 border-3 border-ink bg-cream font-medium focus:outline-none focus:bg-paper transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-3 border-signal bg-signal/10 px-4 py-3 text-sm font-bold text-signal"
              >
                ↳ {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 bg-ink text-cream border-3 border-ink font-bold uppercase tracking-tight hover:bg-sun hover:text-ink transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  เข้าสู่ระบบ
                  <span>→</span>
                </>
              )}
            </button>

            <div className="border-t-3 border-ink/20 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50 mb-1">
                / Default Credentials
              </p>
              <p className="text-xs text-ink/60">
                username: <code className="font-mono font-bold">admin</code>{' '}
                · password:{' '}
                <code className="font-mono font-bold">admin</code>
                <br />
                <span className="text-signal">
                  เปลี่ยน password ทันทีหลังเข้าใช้ครั้งแรก
                </span>
              </p>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
