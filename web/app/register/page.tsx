'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Matrimonial looking for: BRIDE (Female partner) or BRIDEGROOM (Male partner)
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

  // Sync initial query params if user came from homepage quick-register
  useEffect(() => {
    const genderParam = searchParams.get('gender')?.toUpperCase();
    if (genderParam === 'MALE') {
      // Candidate is MALE -> looking for FEMALE (Bride)
      setLookingFor('FEMALE');
    } else if (genderParam === 'FEMALE') {
      // Candidate is FEMALE -> looking for MALE (Bridegroom)
      setLookingFor('MALE');
    }

    const createdByParam = searchParams.get('created_by')?.toUpperCase();
    if (createdByParam) {
      if (['SELF', 'PARENT', 'SIBLING', 'RELATIVE', 'FRIEND'].includes(createdByParam)) {
        setProfileCreatedBy(createdByParam);
      }
    }

    const mobileParam = searchParams.get('mobile');
    if (mobileParam) {
      setMobileNumber(mobileParam);
    }
  }, [searchParams]);

  // Core Flow Logic:
  // If looking for a Bride (Female partner) -> Candidate account being created is for Bridegroom (MALE).
  // If looking for a Bridegroom (Male partner) -> Candidate account being created is for Bride (FEMALE).
  const candidateGender: 'MALE' | 'FEMALE' = lookingFor === 'FEMALE' ? 'MALE' : 'FEMALE';
  const isSelf = profileCreatedBy === 'SELF';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide first and last name.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('profile_status');
      }
      await apiClient.register({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        gender: candidateGender, // Correct candidate gender: MALE for Bridegroom, FEMALE for Bride
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

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center py-14 px-4 bg-[#fdfbf7] text-charcoal-900 overflow-hidden font-sans">
      {/* Warm Ambient Matrimonial Glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-burgundy-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Warm Header Branding */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs font-semibold tracking-wide shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="font-extrabold">CovenantNest</span>
            <span className="text-orange-400">•</span>
            <span>Christian Matrimony</span>
            <span className="text-emerald-500">•</span>
            <span className="text-emerald-800 font-medium text-[11px]">Bidar &amp; Pan-India</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-charcoal-900 tracking-tight">
            Find Your <span className="text-burgundy-700">Life Partner</span>
          </h1>

          <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
            Begin your journey towards a holy, blessed marriage. 100% Free Registration for verified Christian families.
          </p>
        </div>

        {/* Matrimonial Card */}
        <div className="bg-white border border-[#ece2d1] rounded-3xl p-7 sm:p-10 shadow-sm">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* 1. I am Looking For: Bride vs Bridegroom */}
            <div>
              <label className="block text-xs font-serif font-bold uppercase tracking-wider text-burgundy-800 mb-2">
                I am Looking For
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLookingFor('FEMALE')}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${lookingFor === 'FEMALE'
                    ? 'bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white border-burgundy-600 shadow-md scale-[1.02]'
                    : 'bg-[#faf6ee] text-charcoal-700 border-[#ece2d1] hover:border-burgundy-300 hover:text-burgundy-800'
                    }`}
                >
                  Bride
                </button>

                <button
                  type="button"
                  onClick={() => setLookingFor('MALE')}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${lookingFor === 'MALE'
                    ? 'bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white border-burgundy-600 shadow-md scale-[1.02]'
                    : 'bg-[#faf6ee] text-charcoal-700 border-[#ece2d1] hover:border-burgundy-300 hover:text-burgundy-800'
                    }`}
                >
                  Bridegroom
                </button>
              </div>
            </div>

            {/* 2. Profile Created By Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                Profile Created By
              </label>
              <select
                value={profileCreatedBy}
                onChange={(e) => setProfileCreatedBy(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium border border-[#ded0ba] rounded-2xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 focus:ring-2 focus:ring-burgundy-600/10 shadow-xs transition-all cursor-pointer"
              >
                <option value="SELF">Self</option>
                <option value="PARENT">Parent (Father / Mother)</option>
                <option value="SIBLING">Sibling (Brother / Sister)</option>
                <option value="RELATIVE">Relative / Guardian</option>
                <option value="FRIEND">Friend / Well-wisher</option>
              </select>
            </div>

            {/* If Created By Parent / Sibling / Relative -> Ask for their details */}
            {!isSelf && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#faf6ee] border border-[#ece2d1]">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                    Your Name (Parent / Guardian)
                  </label>
                  <input
                    type="text"
                    required
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="e.g. Paul Fernandes"
                    className="w-full text-xs font-medium border border-[#ded0ba] rounded-xl p-3 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 placeholder:text-charcoal-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 mb-1.5">
                    Relationship to Candidate
                  </label>
                  <input
                    type="text"
                    required
                    value={managerRelation}
                    onChange={(e) => setManagerRelation(e.target.value)}
                    placeholder="e.g. Father, Mother, Brother"
                    className="w-full text-xs font-medium border border-[#ded0ba] rounded-xl p-3 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 placeholder:text-charcoal-400"
                  />
                </div>
              </div>
            )}

            {/* 3. Candidate Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="w-full text-xs sm:text-sm font-medium border border-[#ded0ba] rounded-2xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 placeholder:text-charcoal-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="w-full text-xs sm:text-sm font-medium border border-[#ded0ba] rounded-2xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 placeholder:text-charcoal-400"
                />
              </div>
            </div>

            {/* 4. Contact Details: Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Mobile Number
              </label>
              <div className="flex rounded-2xl border border-[#ded0ba] bg-white overflow-hidden focus-within:border-burgundy-600 transition-colors">
                <span className="bg-[#f5ebd7] px-4 py-3.5 text-xs font-bold text-burgundy-800 border-r border-[#ded0ba] flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full text-xs sm:text-sm font-medium p-3.5 bg-transparent text-charcoal-900 focus:outline-none placeholder:text-charcoal-400"
                />
              </div>
              <p className="text-[11px] text-charcoal-500 mt-1">
                Your contact number will remain confidential and is only revealed upon mutual acceptance.
              </p>
            </div>

            {/* 5. Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs sm:text-sm font-medium border border-[#ded0ba] rounded-2xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 placeholder:text-charcoal-400"
              />
            </div>

            {/* 6. Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Create Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full text-xs sm:text-sm font-medium border border-[#ded0ba] rounded-2xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 placeholder:text-charcoal-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full text-xs sm:text-sm font-medium border border-[#ded0ba] rounded-2xl p-3.5 bg-white text-charcoal-900 focus:outline-none focus:border-burgundy-600 placeholder:text-charcoal-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-sm shadow-md transition-all transform hover:-translate-y-0.5 mt-2"
            >
              {isLoading ? 'Creating Your Account...' : 'Register →'}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-[#ece2d1] text-center">
            <p className="text-xs text-charcoal-600">
              Already registered on CovenantNest?{' '}
              <Link href="/login" className="font-bold text-cyan-800 hover:text-cyan-900 transition-colors underline">
                Sign In to Your Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <RegisterFormContent />
    </Suspense>
  );
}
