'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your admin email address and password.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const apiBase = (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        'https://matrimony-hxs5.onrender.com/api/v1'
      ).replace(/\/+$/, '');

      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password,
          login_type: 'password',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.detail || 'Invalid administrator credentials.');
      }

      if (data.role !== 'ADMIN' && data.role !== 'SUPER_ADMIN') {
        throw new Error('Access denied. Only platform administrators can log in here.');
      }

      localStorage.setItem('admin_access_token', data.access_token);
      localStorage.setItem('admin_role', data.role);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-950 text-white font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-xl flex items-center justify-center mx-auto shadow-xl shadow-amber-950/40">
            CM
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console Login</h1>
          <p className="text-xs text-slate-400">Christian Matrimony Platform • Moderation &amp; Management</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email / Mobile
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter admin email address"
                className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Authenticating Admin...' : 'Sign In as Administrator →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
