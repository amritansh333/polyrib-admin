import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const { sendReset } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const ok = await sendReset(email.trim());
      setSent(ok);
      if (!ok) setError('No account found with that email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Forgot password</h2>
        {sent ? (
          <div>
            <p className="mb-4 text-slate-600">
              If that account exists, a reset email was sent (mock).
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded border" onClick={() => navigate('/login')}>
                Back to login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="block mb-2">
              <span className="text-sm text-slate-600">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2"
                type="email"
                required
              />
            </label>
            {error && <div className="text-red-600 mt-3">{error}</div>}
            <div className="mt-6">
              <button className="w-full bg-brand-600 text-white py-2 rounded" disabled={loading}>
                Send reset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
