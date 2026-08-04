import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import LoadingScreen from '../components/LoadingScreen';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const ok = await login(email.trim(), password, remember);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900">
      {loading && <LoadingScreen />}

      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Khanna Polyrib</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Welcome to the internal admin dashboard. Manage catalog, leads and media with
            confidence.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Sign in to Admin</h2>
            <form onSubmit={submit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm text-brand-600 hover:underline">
                  Forgot?
                </a>
              </div>

              {error && <div className="text-red-600">{error}</div>}

              <div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </div>

              <div className="text-sm text-slate-500">
                Test users: super@polyrib.local / superpass
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
