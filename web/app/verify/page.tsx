'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetParam = searchParams.get('target') || '';

  const [target, setTarget] = useState(targetParam);
  const [otpCode, setOtpCode] = useState('');
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!target.trim()) return;
    setResending(true);
    setError(null);
    try {
      const res = await apiClient.sendOtp(target.trim(), 'REGISTRATION');
      if (res.debug_otp) setDebugOtp(res.debug_otp);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    if (targetParam) {
      handleSendOtp();
    }
  }, [targetParam]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.verifyOtp(target.trim(), otpCode.trim(), 'REGISTRATION');
      router.push('/profile/create');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-14 flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-xs">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center text-sm mx-auto mb-3 shadow-xs">
            CM
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Verify Mobile Number
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter the 6-digit OTP code sent to your mobile
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        {debugOtp && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">
            Test Mode OTP: <strong>{debugOtp}</strong>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Number
            </label>
            <input
              type="text"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              6-Digit OTP Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full text-center text-lg tracking-widest font-bold border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-all shadow-xs"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP & Continue'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={resending}
            className="text-blue-700 font-semibold hover:underline"
          >
            {resending ? 'Sending...' : 'Resend OTP Code'}
          </button>
          <Link href="/login" className="text-slate-500 hover:text-slate-800">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading verification...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
