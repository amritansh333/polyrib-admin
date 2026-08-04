import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || undefined;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) return setError('Invalid token');
    if (password.length < 6) return setError('Password too short');
    if (password !== confirm) return setError("Passwords don't match");
    const ok = await resetPassword(token, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
    } else {
      setError('Failed to reset password');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Reset password</h2>
        {success ? (
          <div>Password reset. Redirecting to login...</div>
        ) : (
          <form onSubmit={submit}>
            <label className="block mb-2">
              <span className="text-sm text-slate-600">New password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                type="password"
                required
              />
            </label>
            <label className="block mb-2">
              <span className="text-sm text-slate-600">Confirm password</span>
              <input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                type="password"
                required
              />
            </label>
            {error && <div className="text-red-600 mt-3">{error}</div>}
            <div className="mt-6">
              <button className="w-full bg-brand-600 text-white py-2 rounded">
                Reset password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
