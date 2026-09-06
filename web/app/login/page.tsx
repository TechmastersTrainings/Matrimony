'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInactiveLogout = searchParams.get('reason') === 'inactivity';

  const [loginType, setLoginType] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      setError('Please enter your mobile number or email address.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.sendOtp(identifier.trim(), 'LOGIN');
      setOtpSent(true);
      if (res.debug_otp) setDebugOtp(res.debug_otp);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered mobile number or email address.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiClient.login({
        identifier: identifier.trim(),
        password: loginType === 'password' ? password : undefined,
        otp_code: loginType === 'otp' ? otpCode : undefined,
        login_type: loginType,
      });

      // If candidate has not finished their profile details (education, faith, family), take them to profile builder
      if (res && res.profile_status === 'DRAFT') {
        router.push('/profile/create');
      } else {
        router.push('/discover');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4 bg-slate-950 overflow-hidden font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Branding Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-700/50 text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            Secure Member Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Back</span>
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your matrimony matches and chat
          </p>
        </div>

        {/* Inactivity Notice Banner */}
        {isInactiveLogout && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs font-medium flex items-start gap-3 shadow-xl backdrop-blur-md">
            <span className="text-lg leading-none">⏰</span>
            <div>
              <strong className="block font-bold text-amber-300 mb-0.5">Session Timed Out</strong>
              <span>For your privacy and security, your account was automatically logged out due to 10 minutes of inactivity. Please sign in again.</span>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-blue-950/30">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginType('password');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                loginType === 'password'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('otp');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                loginType === 'otp'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OTP Login
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {debugOtp && (
            <div className="mb-4 p-3 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-300 text-xs font-medium">
              Test Mode OTP: <strong className="text-amber-200">{debugOtp}</strong>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Mobile Number or Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your registered mobile number or email address"
                className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-600"
              />
            </div>

            {loginType === 'password' ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-bold text-amber-400 hover:text-amber-300">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-600"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  OTP Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="flex-1 text-xs font-medium border border-slate-800 rounded-xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 shrink-0"
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-950/40 transition-all transform hover:-translate-y-0.5 mt-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Account →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-amber-400 hover:text-amber-300 transition-colors">
                Register Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <LoginFormContent />
    </Suspense>
  );
}
