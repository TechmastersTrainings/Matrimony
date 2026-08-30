'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <section className="relative overflow-hidden bg-slate-900 text-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800">
      {/* Background subtle gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 opacity-90 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Title & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 text-xs font-semibold tracking-wide">
              <span>Verified Matrimonial Service</span>
              <span>•</span>
              <span>Serving Bidar & Karnataka</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Connecting Christian Brides & Grooms Across India
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Find compatible life partners across Methodist, CSI, Roman Catholic, Baptist, Pentecostal and Protestant families with verified church credentials and complete privacy.
            </p>

            {/* Professional Value Pillars */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700">
                <span className="text-blue-400 text-base block font-bold">100%</span>
                <span className="text-xs font-medium text-slate-300">Verified Profiles</span>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700">
                <span className="text-blue-400 text-base block font-bold">Privacy First</span>
                <span className="text-xs font-medium text-slate-300">Controlled Contact</span>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700">
                <span className="text-blue-400 text-base block font-bold">Family Focus</span>
                <span className="text-xs font-medium text-slate-300">Parent Managed</span>
              </div>
            </div>
          </div>

          {/* Right Quick Registration Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 text-slate-900 shadow-xl border border-slate-200">
              <div className="mb-5 pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Create Profile
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Free registration in less than 2 minutes
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Free
                </span>
              </div>

              <form onSubmit={handleQuickRegister} className="space-y-4">
                {/* Profile For */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                        className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          profileFor === item
                            ? 'bg-blue-900 text-white border-blue-900 font-semibold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegGender('FEMALE')}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        regGender === 'FEMALE'
                          ? 'bg-blue-50 border-blue-600 text-blue-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      Female (Bride)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegGender('MALE')}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        regGender === 'MALE'
                          ? 'bg-blue-50 border-blue-600 text-blue-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      Male (Groom)
                    </button>
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                    <span className="bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 border-r border-slate-300 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Register Free
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-12 bg-white rounded-2xl p-5 sm:p-6 text-slate-900 shadow-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Quick Profile Search
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Looking for */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Looking For
              </label>
              <select
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value as any)}
                className="w-full p-2 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="FEMALE">Bride (Female)</option>
                <option value="MALE">Groom (Male)</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Age Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="18"
                  max="70"
                  value={ageFrom}
                  onChange={(e) => setAgeFrom(e.target.value)}
                  className="w-1/2 p-2 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="number"
                  min="18"
                  max="70"
                  value={ageTo}
                  onChange={(e) => setAgeTo(e.target.value)}
                  className="w-1/2 p-2 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Denomination */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Denomination
              </label>
              <select
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                className="w-full p-2 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">All Denominations</option>
                <option value="METHODIST">Methodist (MCI)</option>
                <option value="CSI">Church of South India (CSI)</option>
                <option value="CATHOLIC">Roman Catholic (RC)</option>
                <option value="BAPTIST">Baptist</option>
                <option value="PENTECOSTAL">Pentecostal</option>
                <option value="PROTESTANT">Protestant</option>
                <option value="MAR_THOMA">Mar Thoma / Orthodox</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                City / Region
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Bidar">Bidar (Karnataka)</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Kalaburagi">Kalaburagi / Gulbarga</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="ALL">All India</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                Search Matches
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
