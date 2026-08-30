'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { CandidateCard } from '../../types';

export function DynamicProfilesSection() {
  const [profiles, setProfiles] = useState<CandidateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadLiveProfiles() {
      try {
        const res = await apiClient.searchProfiles({ page_size: 6 });
        if (res && Array.isArray(res.profiles)) {
          setProfiles(res.profiles);
          setTotalCount(res.total || res.profiles.length);
        }
      } catch {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }
    loadLiveProfiles();
  }, []);

  return (
    <section className="py-16 bg-white border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Real & Verified Profiles</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-red-950 tracking-tight">
              Recently Joined Christian Brides & Grooms
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Discover active matrimonial profiles verified through church & contact authentication.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-xs font-extrabold text-red-900 hover:text-red-700 bg-rose-50 border border-rose-200 px-5 py-2.5 rounded-full hover:bg-rose-100 transition-all shadow-xs"
            >
              <span>View All Verified Profiles ({totalCount})</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Profile Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-rose-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-indian"
              >
                {/* Photo */}
                <div className="relative aspect-4/5 bg-slate-100 overflow-hidden">
                  {p.primary_photo ? (
                    <img
                      src={p.primary_photo}
                      alt={`${p.first_name} ${p.last_name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 to-amber-50 text-red-900">
                      <span className="text-4xl">✝</span>
                      <span className="text-xs font-bold mt-2 text-slate-500">Verified Photo</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-red-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs border border-amber-300">
                      {p.denomination || 'Christian'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <span>✓</span>
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Overlay Name */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-playfair text-lg font-bold">
                      {p.first_name} {p.last_name}, {p.age || '—'}
                    </h3>
                    <p className="text-[11px] text-amber-200 font-medium truncate">
                      📍 {p.district || 'Bidar'}, {p.state || 'Karnataka'}
                    </p>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-bold text-slate-900 truncate">
                      💼 {p.occupation_title || p.highest_education || 'Professional'}
                    </p>
                    <p className="text-[11px] truncate">
                      ⛪ {p.church_name || `${p.denomination} Fellowship`}
                    </p>
                  </div>

                  <Link
                    href={`/profile/${p.id}`}
                    className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-white text-xs font-bold transition-all shadow-xs block"
                  >
                    View Full Profile & Connect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Real Empty State Banner when database is new */
          <div className="rounded-3xl bg-gradient-to-br from-rose-50 via-amber-50 to-red-50 border-2 border-dashed border-red-300 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-800 text-amber-300 flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4 shadow-md">
              ✝
            </div>
            <h3 className="font-playfair text-2xl font-extrabold text-red-950 mb-2">
              Be Among the First Verified Brides & Grooms
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto mb-6">
              Create your profile today to get priority matchmaking across Christian families in Bidar, Bengaluru, and Karnataka.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-700 to-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Register Your Profile Free</span>
              <span className="text-amber-300">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
