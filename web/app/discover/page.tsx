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
  const [denomination, setDenomination] = useState('');
  const [district, setDistrict] = useState('Bidar');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.searchProfiles({
        denominations: denomination ? [denomination] : undefined,
        district: district || undefined,
        age_min: ageMin ? parseInt(ageMin) : undefined,
        age_max: ageMax ? parseInt(ageMax) : undefined,
      });
      setCandidates(data.profiles);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSendInterest = async (userId: number) => {
    try {
      await apiClient.sendInterest(userId);
      alert('✓ Matrimonial interest sent successfully!');
    } catch (err: any) {
      alert(`Notice: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-stone-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Bidar & Karnataka Christian Matrimony</span>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-1">Discover Verified Profiles</h1>
          <p className="text-sm text-stone-600 mt-1">
            Browse genuine, church-verified Christian brides and grooms with mutual faith alignment.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Link href="/interests" className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-4 py-2.5 rounded-xl">
            View My Interests & Matches
          </Link>
          <Link href="/chat" className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl">
            Open Chat
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="font-bold text-stone-900 text-base mb-4 flex items-center justify-between">
            <span>Filter Search</span>
            <button
              onClick={() => {
                setDenomination('');
                setDistrict('Bidar');
                setAgeMin('');
                setAgeMax('');
                fetchProfiles();
              }}
              className="text-xs text-amber-700 font-medium hover:underline"
            >
              Reset
            </button>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Denomination</label>
              <select
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-stone-50"
              >
                <option value="">All Christian Denominations</option>
                <option value="METHODIST">Methodist</option>
                <option value="CSI">CSI</option>
                <option value="CATHOLIC">Roman Catholic</option>
                <option value="BAPTIST">Baptist</option>
                <option value="PENTECOSTAL">Pentecostal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">District / Region</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Bidar, Gulbarga"
                className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-stone-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Min Age</label>
                <input
                  type="number"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  placeholder="21"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-stone-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Max Age</label>
                <input
                  type="number"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  placeholder="35"
                  className="w-full text-xs rounded-lg border border-stone-300 p-2.5 bg-stone-50"
                />
              </div>
            </div>

            <button
              onClick={fetchProfiles}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-3 rounded-xl mt-2 shadow"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="lg:col-span-3">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-stone-500 text-sm">
              <div className="animate-spin h-8 w-8 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-3" />
              Loading verified Christian profiles...
            </div>
          ) : candidates.length === 0 ? (
            <div className="py-16 text-center bg-stone-50 border border-stone-200 rounded-2xl p-8">
              <span className="text-4xl">✝</span>
              <h3 className="font-bold text-stone-800 text-base mt-2">No Profiles Found</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                No profiles matched your filter criteria. Try adjusting your denomination or age filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 bg-stone-100">
                    <img
                      src={c.primary_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                      alt={c.first_name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {c.denomination}
                    </span>
                    {c.match_score && (
                      <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {c.match_score}% Match
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg">
                        {c.first_name} {c.last_name}
                        {c.age && <span className="text-sm font-normal text-stone-500 ml-1.5">({c.age} yrs)</span>}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1">
                        📍 {c.district}, {c.state}
                      </p>
                      <p className="text-xs text-stone-600 mt-0.5">
                        ⛪ {c.church_name || 'Christian Church'}
                      </p>
                      {c.occupation_title && (
                        <p className="text-xs text-stone-600 mt-0.5">
                          💼 {c.occupation_title} {c.highest_education && `(${c.highest_education})`}
                        </p>
                      )}
                      {c.bio && (
                        <p className="text-xs text-stone-500 line-clamp-2 mt-3 italic">
                          &quot;{c.bio}&quot;
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex gap-2">
                      <Link
                        href={`/profile/${c.id}`}
                        className="flex-1 text-center bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2.5 rounded-xl"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleSendInterest(c.user_id)}
                        className="flex-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs"
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
  );
}
