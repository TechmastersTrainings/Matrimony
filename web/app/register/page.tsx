'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';

export default function RegisterPage() {
  const router = useRouter();

  // Matrimonial looking for: BRIDE (Female) or GROOM (Male)
  const [lookingFor, setLookingFor] = useState<'FEMALE' | 'MALE'>('FEMALE');
  const [profileCreatedBy, setProfileCreatedBy] = useState('SELF');
  const [managerName, setManagerName] = useState('');
  const [managerRelation, setManagerRelation] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError(`Please provide the ${lookingFor === 'FEMALE' ? "Bride's" : "Groom's"} first and last name.`);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        gender: lookingFor,
        mobile_number: mobileNumber.trim(),
        email: email.trim(),
        password: password,
        role: profileCreatedBy === 'SELF' ? 'CANDIDATE' : 'MANAGER',
        profile_created_by: profileCreatedBy,
        manager_name: managerName || undefined,
        manager_relation: managerRelation || undefined,
      });

      router.push(`/verify?target=${encodeURIComponent(mobileNumber.trim())}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSelf = profileCreatedBy === 'SELF';
  const personTitle = lookingFor === 'FEMALE' ? 'Bride' : 'Bridegroom';

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-14 px-4 bg-slate-950 text-white overflow-hidden font-sans">
      {/* Warm Ambient Matrimonial Glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Warm Header Branding */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide backdrop-blur-md">
            <span>Blessed Christian Matrimony</span>
            <span>•</span>
            <span>Bidar &amp; Karnataka</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Life Partner</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Begin your journey towards a holy, blessed marriage. 100% Free Registration for verified Christian families.
          </p>
        </div>

        {/* Matrimonial Glassmorphic Card */}
        <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-blue-950/40">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* 1. I am Looking For: Bride vs Bridegroom */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                I am Looking For
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLookingFor('FEMALE')}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${lookingFor === 'FEMALE'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/40 scale-[1.02]'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                >
                  Bride (Female)
                </button>

                <button
                  type="button"
                  onClick={() => setLookingFor('MALE')}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${lookingFor === 'MALE'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/40 scale-[1.02]'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                >
                  Bridegroom (Male)
                </button>
              </div>
            </div>

            {/* 2. Profile Created By Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Profile Created By
              </label>
              <select
                value={profileCreatedBy}
                onChange={(e) => setProfileCreatedBy(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium border border-slate-800 rounded-2xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 transition-all cursor-pointer"
              >
                <option value="SELF">Self (I am the {personTitle})</option>
                <option value="PARENT">Parent (Father / Mother)</option>
                <option value="SIBLING">Sibling (Brother / Sister)</option>
                <option value="RELATIVE">Relative / Guardian</option>
                <option value="FRIEND">Friend / Well-wisher</option>
              </select>
            </div>

            {/* If Created By Parent / Sibling / Relative -> Ask for their details */}
            {!isSelf && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Your Name (Parent / Guardian)
                  </label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. Mr. Paul Fernandes"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-900 text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Your Relationship to {personTitle}
                  </label>
                  <input
                    type="text"
                    required
                    value={managerRelation}
                    onChange={(e) => setManagerRelation(e.target.value)}
                    placeholder="e.g. Father, Mother, Brother"
                    className="w-full text-xs font-medium border border-slate-800 rounded-xl p-3 bg-slate-900 text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            {/* 3. Bride's / Groom's Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {personTitle}&apos;s First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={`e.g. ${lookingFor === 'FEMALE' ? 'Grace' : 'Joshua'}`}
                  className="w-full text-xs sm:text-sm font-medium border border-slate-800 rounded-2xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {personTitle}&apos;s Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Joseph / Kumar"
                  className="w-full text-xs sm:text-sm font-medium border border-slate-800 rounded-2xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* 4. Contact Details: Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <div className="flex rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden focus-within:border-amber-400 transition-colors">
                <span className="bg-slate-900 px-4 py-3.5 text-xs font-bold text-amber-400 border-r border-slate-800 flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full text-xs sm:text-sm font-medium p-3.5 bg-transparent text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Your contact number will remain confidential and is only revealed upon mutual acceptance.
              </p>
            </div>

            {/* 5. Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs sm:text-sm font-medium border border-slate-800 rounded-2xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
              />
            </div>

            {/* 6. Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full text-xs sm:text-sm font-medium border border-slate-800 rounded-2xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full text-xs sm:text-sm font-medium border border-slate-800 rounded-2xl p-3.5 bg-slate-950 text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-950/40 transition-all transform hover:-translate-y-0.5 mt-2"
            >
              {isLoading ? 'Creating Your Account...' : 'Register →'}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Already registered on Christian Matrimony?{' '}
              <Link href="/login" className="font-bold text-amber-400 hover:text-amber-300 transition-colors">
                Sign In to Your Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
