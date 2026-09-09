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

      // If super_admin or admin, or candidate has finished profile, take them to discover
      if (res?.role === 'SUPER_ADMIN' || res?.role === 'ADMIN') {
        router.push('/discover');
      } else if (res && res.profile_status === 'DRAFT') {
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
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-16 px-4 bg-[#fdfbf7] overflow-hidden font-sans text-charcoal-900">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-burgundy-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Branding Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-burgundy-50 border border-burgundy-200 text-burgundy-800 text-xs font-bold uppercase tracking-wider">
            Secure Member Portal
          </div>
          <h1 className="text-3xl font-serif font-extrabold text-charcoal-900 tracking-tight">
            Welcome <span className="text-burgundy-700">Back</span>
          </h1>
          <p className="text-xs text-charcoal-600">
            Sign in to access your matrimony matches and chat
          </p>
        </div>

        {/* Inactivity Notice Banner */}
        {isInactiveLogout && (
          <div className="mb-6 p-4 rounded-2xl bg-gold-50 border border-gold-300 text-gold-900 text-xs font-medium flex items-start gap-3 shadow-xs">
            <span className="text-lg leading-none">⏰</span>
            <div>
              <strong className="block font-bold text-burgundy-900 mb-0.5">Session Timed Out</strong>
              <span>For your privacy and security, your account was automatically logged out due to 10 minutes of inactivity. Please sign in again.</span>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-8 shadow-sm">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-2 bg-[#faf6ee] p-1.5 rounded-2xl border border-[#ece2d1] mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginType('password');
                setError(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                loginType === 'password'
                  ? 'bg-burgundy-700 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-burgundy-800'
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
                  ? 'bg-burgundy-700 text-white shadow-sm'
                  : 'text-charcoal-600 hover:text-burgundy-800'
              }`}
            >
              OTP Login
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {debugOtp && (
            <div className="mb-4 p-3 rounded-xl bg-gold-50 border border-gold-200 text-gold-900 text-xs font-medium">
              Test Mode OTP: <strong className="text-burgundy-800">{debugOtp}</strong>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Mobile Number or Email
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your registered mobile number or email address"
                className="w-full text-xs font-medium border border-[#ded0ba] rounded-xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-600/10 shadow-xs transition-all placeholder:text-charcoal-400"
              />
            </div>

            {loginType === 'password' ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-bold text-burgundy-700 hover:text-burgundy-800">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-xs font-medium border border-[#ded0ba] rounded-xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-600/10 shadow-xs transition-all placeholder:text-charcoal-400"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  OTP Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP code"
                    className="flex-1 text-xs font-medium border border-[#ded0ba] rounded-xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-600/10 shadow-xs transition-all placeholder:text-charcoal-400"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="px-4 py-3.5 rounded-xl bg-white hover:bg-[#faf6ee] text-charcoal-700 text-xs font-bold transition-all border border-[#ece2d1] shrink-0"
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs shadow-md transition-all transform hover:-translate-y-0.5 mt-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Account →'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#ece2d1] text-center">
            <p className="text-xs text-charcoal-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-burgundy-700 hover:text-burgundy-800 transition-colors">
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
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <LoginFormContent />
    </Suspense>
  );
}
