import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Input, FormField } from '../components/ui/Input';

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
    <div className="min-h-screen relative bg-bg text-fg flex flex-col">
      {/* Subtle indigo glow */}
      <div
        aria-hidden
        className="glow-orb absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[680px] opacity-50"
        style={{
          background:
            'radial-gradient(closest-side, rgba(99,102,241,0.4), rgba(99,102,241,0) 70%)',
        }}
      />

      <header className="relative border-b border-line">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-cyan">
              <span className="absolute inset-[1px] rounded-[5px] bg-bg/40" />
              <span className="relative font-display text-[13px] font-semibold text-fg">
                C
              </span>
            </span>
            <span className="text-sm font-semibold text-fg">Claude Workshop</span>
          </Link>
          <Link
            to="/"
            className="text-sm text-fg-secondary hover:text-fg transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <Card tone="surface" size="lg" className="!p-7 sm:!p-9">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-fg">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-fg-secondary">
                เข้าใช้ Admin Dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FormField label="Username" required htmlFor="username">
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={submitting}
                />
              </FormField>

              <FormField label="Password" required htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                />
              </FormField>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-status-red/40 bg-status-red/10 px-3.5 py-2.5 text-sm text-status-red"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 inline-block rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    เข้าสู่ระบบ <span aria-hidden>→</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-7 pt-5 border-t border-line">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-muted mb-2">
                Default credentials
              </p>
              <p className="text-xs text-fg-secondary leading-relaxed">
                username:{' '}
                <code className="font-mono text-fg bg-elevated px-1.5 py-0.5 rounded border border-line">
                  admin
                </code>{' '}
                · password:{' '}
                <code className="font-mono text-fg bg-elevated px-1.5 py-0.5 rounded border border-line">
                  admin
                </code>
                <br />
                <span className="text-status-red">
                  เปลี่ยน password ทันทีหลังเข้าใช้ครั้งแรก
                </span>
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
