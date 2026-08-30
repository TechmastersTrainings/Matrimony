'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TechmastersSearchSection() {
  const router = useRouter();

  const [lookingFor, setLookingFor] = useState<'FEMALE' | 'MALE'>('FEMALE');
  const [ageFrom, setAgeFrom] = useState('21');
  const [ageTo, setAgeTo] = useState('29');
  const [denomination, setDenomination] = useState('ALL');
  const [district, setDistrict] = useState('Bidar');

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

  return (
    <section className="relative z-20 -mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Quick Matrimonial Search
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Find your ideal match by criteria</span>
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Looking For
            </label>
            <select
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value as any)}
              className="w-full p-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="FEMALE">Bride (Female)</option>
              <option value="MALE">Groom (Male)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Age Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="18"
                max="70"
                value={ageFrom}
                onChange={(e) => setAgeFrom(e.target.value)}
                className="w-1/2 p-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <span className="text-xs text-slate-400 font-bold">to</span>
              <input
                type="number"
                min="18"
                max="70"
                value={ageTo}
                onChange={(e) => setAgeTo(e.target.value)}
                className="w-1/2 p-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Denomination
            </label>
            <select
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
              className="w-full p-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              City / Region
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-2.5 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="Bidar">Bidar (Karnataka)</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Kalaburagi">Kalaburagi / Gulbarga</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="ALL">All India</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Search Profiles</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
