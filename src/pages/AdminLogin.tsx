import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api';
import BoldButton from '../components/ui/BoldButton';
import MarqueeText from '../components/ui/MarqueeText';

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
    <div className="min-h-screen bg-sun text-ink flex flex-col">
      <header className="border-b-3 border-ink bg-ink text-paper">
        <div className="container-narrow section-padding py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center bg-sun text-ink font-display text-xl">
              ✦
            </span>
            <span className="font-display text-base uppercase tracking-tight">
              Bold/Disruption
            </span>
          </Link>
          <Link
            to="/"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/70 hover:text-paper transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <MarqueeText
        items={['ADMIN ACCESS', 'AUTHORIZED ONLY', 'BOLD DISRUPTION']}
        tone="paper-on-ink"
        speed="fast"
      />

      <main className="flex-1 flex items-center justify-center p-5 md:p-10 grid-lines">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-paper border-3 border-ink shadow-offset-lg"
        >
          <div className="px-5 py-3 border-b-3 border-ink bg-ink text-paper flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.25em]">
              / Admin Login
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">
              v1
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            <div>
              <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.9] tracking-tight">
                Sign In
              </h1>
              <p className="mt-2 text-sm text-ink/70">
                เข้าสู่ระบบเพื่อใช้งาน Admin Dashboard
              </p>
            </div>

            <div>
              <label htmlFor="username" className="label-bw">
                / Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                className="input-bw"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="label-bw">
                / Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input-bw"
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

            <BoldButton
              type="submit"
              variant="ink"
              size="lg"
              fullWidth
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-paper/40 border-t-paper rounded-full animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  เข้าสู่ระบบ <span aria-hidden>→</span>
                </>
              )}
            </BoldButton>

            <div className="border-t-3 border-ink/20 pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/50 mb-1">
                / Default Credentials
              </p>
              <p className="text-xs text-ink/65">
                username:{' '}
                <code className="font-mono font-bold bg-sun px-1.5 py-0.5 border border-ink/30">
                  admin
                </code>{' '}
                · password:{' '}
                <code className="font-mono font-bold bg-sun px-1.5 py-0.5 border border-ink/30">
                  admin
                </code>
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
