'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const [profileCreatedFor, setProfileCreatedFor] = useState('SELF');
  const [managerRelation, setManagerRelation] = useState('');
  const [managerName, setManagerName] = useState('');

  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.register({
        mobile_number: mobileNumber.trim(),
        email: email.trim(),
        password: password,
        role: profileCreatedFor === 'SELF' ? 'CANDIDATE' : 'MANAGER',
        profile_created_by: profileCreatedFor,
        manager_name: managerName || undefined,
        manager_relation: managerRelation || undefined,
      });

      router.push(`/verify?target=${encodeURIComponent(mobileNumber.trim())}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-12 flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg w-full shadow-xs">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-bold flex items-center justify-center text-sm mx-auto mb-3 shadow-xs">
            CM
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Create Free Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join the Christian Matrimony community in Bidar and across India
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Profile Created By */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Profile Created By
            </label>
            <select
              value={profileCreatedFor}
              onChange={(e) => setProfileCreatedFor(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="SELF">Self (Candidate)</option>
              <option value="PARENT">Parent (Father / Mother)</option>
              <option value="SIBLING">Sibling (Brother / Sister)</option>
              <option value="RELATIVE">Relative / Guardian</option>
            </select>
          </div>

          {profileCreatedFor !== 'SELF' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="Manager / Parent Name"
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Relation to Candidate
                </label>
                <input
                  type="text"
                  required
                  value={managerRelation}
                  onChange={(e) => setManagerRelation(e.target.value)}
                  placeholder="e.g. Father, Sister"
                  className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Contact details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Number (10 Digits)
            </label>
            <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:border-blue-600">
              <span className="bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 border-r border-slate-300 flex items-center">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="9876543210"
                className="w-full text-xs font-medium p-2.5 bg-slate-50 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars"
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-all shadow-xs mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Continue to OTP Verification'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already registered?{' '}
            <Link href="/login" className="font-semibold text-blue-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
