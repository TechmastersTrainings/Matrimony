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
      const res = await apiClient.verifyOtp(target.trim(), otpCode.trim(), 'REGISTRATION');
      // If candidate has not finished their bio details (education, faith, family), always open profile builder wizard
      if (res && res.profile_status === 'APPROVED') {
        router.push('/dashboard');
      } else {
        router.push('/profile/create');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#fdfbf7] min-h-[calc(100vh-140px)] py-14 flex items-center justify-center px-4">
      <div className="bg-white border border-[#ece2d1] rounded-3xl p-8 max-w-md w-full shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-burgundy-700 to-burgundy-900 text-gold-300 font-bold flex items-center justify-center text-sm mx-auto mb-3 shadow-sm border border-gold-500/30">
            ✝
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-charcoal-900">
            Verify Mobile Number
          </h1>
          <p className="text-xs text-charcoal-600 mt-1">
            Enter the 6-digit OTP code sent to your mobile
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {debugOtp && (
          <div className="mb-4 p-3 rounded-xl bg-gold-50 border border-gold-300 text-gold-900 text-xs font-semibold">
            Test Mode OTP: <strong>{debugOtp}</strong>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              Mobile Number / Email
            </label>
            <input
              type="text"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full text-sm font-semibold text-charcoal-900 border border-[#ded0ba] rounded-xl p-3 bg-[#faf6ee] focus:bg-white focus:outline-none focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-600/15 placeholder:text-charcoal-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
              6-Digit OTP Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full text-center text-2xl tracking-[0.35em] font-extrabold text-charcoal-900 border border-[#ded0ba] rounded-xl p-3.5 bg-[#faf6ee] focus:bg-white focus:outline-none focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-600/15 placeholder:text-charcoal-300 transition-all"
            />
            <p className="text-[11px] text-charcoal-500 mt-1.5 text-center">
              Enter the 6-digit verification code sent to your mobile
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP & Continue →'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#ece2d1] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={resending}
            className="text-burgundy-700 font-bold hover:text-burgundy-900 hover:underline"
          >
            {resending ? 'Sending...' : 'Resend OTP Code'}
          </button>
          <Link href="/login" className="text-charcoal-600 hover:text-burgundy-700 font-medium">
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
