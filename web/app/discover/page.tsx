'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { CandidateCard } from '../../types';

export default function DiscoverPage() {
  const [candidates, setCandidates] = useState<CandidateCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [gender, setGender] = useState('');
  const [denomination, setDenomination] = useState('');
  const [district, setDistrict] = useState('Bidar');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.searchProfiles({
        gender: gender || undefined,
        denominations: denomination ? [denomination] : undefined,
        district: district === 'ALL' ? undefined : district,
        age_min: ageMin ? parseInt(ageMin) : undefined,
        age_max: ageMax ? parseInt(ageMax) : undefined,
      });
      setCandidates(data.profiles || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [gender, denomination, district]);

  const handleSendInterest = async (userId: number) => {
    try {
      await apiClient.sendInterest(userId);
      alert('Matrimonial interest sent successfully.');
    } catch (err: any) {
      alert(`Notice: ${err.message}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Matrimonial Match Search
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Verified Candidate Profiles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search Christian brides and grooms in Bidar, Karnataka, and across India.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/interests"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              My Interests & Matches
            </Link>
            <Link
              href="/chat"
              className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
            >
              Messages
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-xs h-fit space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm">
                Filter Search
              </h2>
              <button
                onClick={() => {
                  setGender('');
                  setDenomination('');
                  setDistrict('Bidar');
                  setAgeMin('');
                  setAgeMax('');
                  fetchProfiles();
                }}
                className="text-xs text-blue-700 font-semibold hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-4">
              {/* Looking for */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Looking For</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-300 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="">All Profiles</option>
                  <option value="FEMALE">Female (Bride)</option>
                  <option value="MALE">Male (Groom)</option>
                </select>
              </div>

              {/* Denomination */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Denomination</label>
                <select
                  value={denomination}
                  onChange={(e) => setDenomination(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-300 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="">All Denominations</option>
                  <option value="METHODIST">Methodist (MCI)</option>
                  <option value="CSI">Church of South India (CSI)</option>
                  <option value="CATHOLIC">Roman Catholic (RC)</option>
                  <option value="BAPTIST">Baptist</option>
                  <option value="PENTECOSTAL">Pentecostal</option>
                  <option value="PROTESTANT">Protestant</option>
                  <option value="MAR_THOMA">Mar Thoma / Orthodox</option>
                </select>
              </div>

              {/* City / District */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs font-medium rounded-lg border border-slate-300 p-2.5 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Bidar">Bidar (Karnataka)</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Kalaburagi">Kalaburagi / Gulbarga</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="ALL">All India</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age Range</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="w-1/2 text-xs font-medium rounded-lg border border-slate-300 p-2 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="w-1/2 text-xs font-medium rounded-lg border border-slate-300 p-2 bg-slate-50 text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                onClick={fetchProfiles}
                className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-600">
                Showing <strong className="text-slate-900">{candidates.length}</strong> of <strong className="text-slate-900">{total}</strong> verified profiles
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-white border border-red-200 rounded-xl p-8 text-center text-red-600 text-xs">
                {error}
              </div>
            ) : candidates.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  No matching profiles found
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Try broadening your search filters or clear location filters to view more candidates.
                </p>
                <button
                  onClick={() => {
                    setGender('');
                    setDenomination('');
                    setDistrict('ALL');
                    fetchProfiles();
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-semibold"
                >
                  View All India Profiles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    {/* Portrait Photo */}
                    <div className="relative aspect-4/5 bg-slate-100 overflow-hidden">
                      {c.primary_photo ? (
                        <img
                          src={c.primary_photo}
                          alt={`${c.first_name} ${c.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                          <span className="text-xs font-medium">Photo Protected</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute top-2.5 left-2.5">
                        <span className="bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {c.denomination}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          Verified
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <h3 className="text-base font-bold">
                          {c.first_name} {c.last_name}, {c.age || '—'}
                        </h3>
                        <p className="text-[11px] text-slate-200 truncate">
                          {c.district}, {c.state}
                        </p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1 text-xs text-slate-600">
                        <p className="font-semibold text-slate-800 truncate">
                          {c.occupation_title || c.highest_education || 'Professional'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {c.church_name || `${c.denomination} Church`}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <Link
                          href={`/profile/${c.id}`}
                          className="text-center py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => handleSendInterest(c.user_id)}
                          className="text-center py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors shadow-2xs"
                        >
                          Send Interest
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
