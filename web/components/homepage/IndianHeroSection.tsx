'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function IndianHeroSection() {
  const router = useRouter();

  // Search State
  const [lookingFor, setLookingFor] = useState<'FEMALE' | 'MALE'>('FEMALE');
  const [ageFrom, setAgeFrom] = useState('21');
  const [ageTo, setAgeTo] = useState('29');
  const [denomination, setDenomination] = useState('ALL');
  const [district, setDistrict] = useState('Bidar');

  // Quick Register State
  const [profileFor, setProfileFor] = useState('Self');
  const [regGender, setRegGender] = useState('FEMALE');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('gender', lookingFor);
    params.set('age_min', ageFrom);
    params.set('age_max', ageTo);
    if (denomination !== 'ALL') params.set('denomination', denomination);
    if (district && district !== 'ALL') params.set('district', district);
    router.push(`/discover?${params.toString()}`);
  };

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/register?created_by=${profileFor}&gender=${regGender}&mobile=${mobileNumber}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-950 via-rose-950 to-slate-950 text-white pt-8 pb-16 lg:pt-12 lg:pb-24">
      {/* Warm Golden Decorative Lights Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Title & Description */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold tracking-wide uppercase">
              <span>✝ #1 Christian Matrimony Platform</span>
              <span className="text-amber-200">• Bidar & Karnataka</span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Find Your Soulmate <br className="hidden sm:inline" />
              Blessed in <span className="text-amber-400">Faith & Family</span>
            </h1>

            <p className="text-base sm:text-lg text-rose-100/90 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Connect with verified Christian brides and grooms across Methodist, CSI, Roman Catholic, Baptist, Pentecostal & Protestant families in Bidar, Bengaluru, Hyderabad and across India.
            </p>

            {/* Quick Benefits Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <span className="text-amber-400 text-lg block font-bold">100%</span>
                <span className="text-[11px] font-bold text-slate-200">Verified Profiles</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <span className="text-amber-400 text-lg block font-bold">🔒 Privacy</span>
                <span className="text-[11px] font-bold text-slate-200">Consent-First Reveal</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <span className="text-amber-400 text-lg block font-bold">⛪ Church</span>
                <span className="text-[11px] font-bold text-slate-200">Pastoral Trust</span>
              </div>
            </div>
          </div>

          {/* Right Quick Registration Card (Jeevansathi Style) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl shadow-black/40 border-2 border-amber-400/40 relative">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                100% Free Registration
              </div>

              <div className="mb-6">
                <h3 className="font-playfair text-2xl font-extrabold text-red-950">
                  Begin Your Search
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Create a profile in under 2 minutes
                </p>
              </div>

              <form onSubmit={handleQuickRegister} className="space-y-4">
                {/* Profile For */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Profile Created For
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setProfileFor(item);
                          if (item === 'Son' || item === 'Brother') setRegGender('MALE');
                          if (item === 'Daughter' || item === 'Sister') setRegGender('FEMALE');
                        }}
                        className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                          profileFor === item
                            ? 'bg-red-800 text-white border-red-800 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegGender('FEMALE')}
                      className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                        regGender === 'FEMALE'
                          ? 'bg-rose-100 border-rose-600 text-rose-900 font-extrabold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>👰 Female (Bride)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegGender('MALE')}
                      className={`py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 ${
                        regGender === 'MALE'
                          ? 'bg-blue-100 border-blue-600 text-blue-900 font-extrabold'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>🤵 Male (Groom)</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Number (for OTP verification)
                  </label>
                  <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-red-700 focus-within:ring-2 focus-within:ring-red-100">
                    <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 border-r border-slate-300 flex items-center">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Register CTA */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-red-700 via-red-800 to-rose-800 hover:from-red-800 hover:to-rose-900 text-white font-extrabold text-sm shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 border border-amber-300/40"
                >
                  <span>Register Free & Find Matches</span>
                  <span className="text-amber-300">→</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Jeevansathi-Style Match Search Bar */}
        <div className="mt-12 bg-white rounded-3xl p-5 sm:p-6 text-slate-900 shadow-2xl search-banner-shadow border-2 border-amber-400/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-900">
              Quick Matrimony Match Search
            </h4>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Looking for */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                I am looking for
              </label>
              <select
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value as any)}
                className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-red-700"
              >
                <option value="FEMALE">Bride (Female)</option>
                <option value="MALE">Groom (Male)</option>
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Age Range
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="18"
                  max="70"
                  value={ageFrom}
                  onChange={(e) => setAgeFrom(e.target.value)}
                  className="w-1/2 p-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-red-700"
                />
                <span className="text-xs text-slate-400 font-bold">to</span>
                <input
                  type="number"
                  min="18"
                  max="70"
                  value={ageTo}
                  onChange={(e) => setAgeTo(e.target.value)}
                  className="w-1/2 p-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-red-700"
                />
              </div>
            </div>

            {/* Denomination */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Denomination
              </label>
              <select
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-red-700"
              >
                <option value="ALL">All Christian Denominations</option>
                <option value="METHODIST">Methodist Church in India (MCI)</option>
                <option value="CSI">Church of South India (CSI)</option>
                <option value="CATHOLIC">Roman Catholic (RC)</option>
                <option value="BAPTIST">Baptist</option>
                <option value="PENTECOSTAL">Pentecostal</option>
                <option value="PROTESTANT">Protestant</option>
                <option value="MAR_THOMA">Mar Thoma / Orthodox</option>
              </select>
            </div>

            {/* District / Location */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                City / District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-red-700"
              >
                <option value="Bidar">Bidar (Karnataka)</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Kalaburagi">Kalaburagi / Gulbarga</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="ALL">All Across India</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Search Matches</span>
                <span>🔍</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
