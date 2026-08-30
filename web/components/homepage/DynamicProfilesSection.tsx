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
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Active Member Profiles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Recently Joined Brides & Grooms
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse newly verified profiles from Christian communities across Karnataka and South India.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all"
            >
              <span>View All Profiles ({totalCount})</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Profile Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Photo */}
                <div className="relative aspect-4/5 bg-slate-100 overflow-hidden">
                  {p.primary_photo ? (
                    <img
                      src={p.primary_photo}
                      alt={`${p.first_name} ${p.last_name}`}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                      <span className="text-xs font-medium">Photo Protected</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {p.denomination || 'Christian'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                  </div>

                  {/* Overlay Name */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-bold">
                      {p.first_name} {p.last_name}, {p.age || '—'}
                    </h3>
                    <p className="text-[11px] text-slate-200 truncate">
                      {p.district || 'Bidar'}, {p.state || 'Karnataka'}
                    </p>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800 truncate">
                      {p.occupation_title || p.highest_education || 'Professional'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {p.church_name || `${p.denomination} Church`}
                    </p>
                  </div>

                  <Link
                    href={`/profile/${p.id}`}
                    className="w-full text-center py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-all block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state prompt */
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-8 text-center max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">
              Register as a Verified Member
            </h3>
            <p className="text-xs text-slate-600 mb-5">
              Create your profile today to connect with Christian brides and grooms in Bidar, Bengaluru, and across Karnataka.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-700 text-white font-semibold text-xs hover:bg-blue-800 transition-all"
            >
              <span>Register Free Profile</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
