'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '../../components/Logo';

function AdminLoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInactiveLogout = searchParams.get('reason') === 'inactivity';

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#fdfbf7] text-[#1e1b18] font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Header with CovenantNest Logo */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo size="lg" showTechmastersTag={false} lightText={false} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs font-bold uppercase tracking-wider shadow-2xs mt-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Administrative Command Center</span>
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            Authorized church moderators &amp; platform administrators only
          </p>
        </div>

        {/* Inactivity Warning Banner */}
        {isInactiveLogout && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-medium flex items-start gap-3 shadow-xs">
            <span className="text-lg leading-none">⏰</span>
            <div>
              <strong className="block font-bold text-amber-900 mb-0.5">Session Terminated</strong>
              <span>For administrative security compliance, your session was automatically logged out due to 10 minutes of inactivity. Please sign in again.</span>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Email / Mobile
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@techmasters.space"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-cyan-600 focus:bg-white text-slate-900 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-cyan-600 focus:bg-white text-slate-900 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-60"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Command Center →'}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            A Techmasters Innovations Product • Confidential Access
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] text-slate-800">
          Loading Command Center...
        </div>
      }
    >
      <AdminLoginFormContent />
    </Suspense>
  );
}
