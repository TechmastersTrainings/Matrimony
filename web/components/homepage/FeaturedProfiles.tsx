'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { CandidateCard } from '../../types';
import { getPhotoUrl, DEFAULT_AVATAR_SVG } from '../../lib/utils';

export function FeaturedProfiles() {
  const [profiles, setProfiles] = useState<CandidateCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRealProfiles() {
      try {
        const res = await apiClient.searchProfiles({ page_size: 4 });
        if (res && Array.isArray(res.profiles)) {
          setProfiles(res.profiles);
        }
      } catch {
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    }
    loadRealProfiles();
  }, []);

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Verified User Profiles
            </span>
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-white mt-2 tracking-tight">
              Meet People Who Share Your Values
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Browse genuine, registered Christian brides and grooms with spiritual and family alignment.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-amber-400 group bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all"
            >
              <span>Search All Profiles</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Profile Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            Loading real candidate profiles...
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
              >
                {/* Photo Area */}
                <div className="relative aspect-4/5 bg-slate-950 overflow-hidden flex items-center justify-center">
                  {p.primary_photo ? (
                    <img
                      src={getPhotoUrl(typeof p.primary_photo === 'string' ? p.primary_photo : (p.primary_photo as any)?.photo_url) || DEFAULT_AVATAR_SVG}
                      alt={`${p.first_name} ${p.last_name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR_SVG;
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600 gap-2">
                      <span className="text-4xl">👤</span>
                      <span className="text-xs font-semibold text-slate-400">Photo Confidential</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-90" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-slate-900/90 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                      {p.denomination || 'Christian'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>✓</span>
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Text inside overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-brand text-lg font-bold text-white">
                      {p.first_name} {p.last_name?.charAt(0)}.
                    </h3>
                    <p className="text-[11px] text-slate-300 truncate">
                      📍 {p.district || 'Bidar'}, {p.state || 'Karnataka'}
                    </p>
                  </div>
                </div>

                {/* Card Footer Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <p className="font-medium text-slate-200 truncate">
                      {p.occupation_title || p.highest_education || 'Professional'}
                    </p>
                    <p className="text-[11px] truncate">
                      {p.church_name || 'Verified Member'}
                    </p>
                  </div>

                  <Link
                    href={`/discover`}
                    className="w-full text-center py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-700 text-xs font-bold transition-all block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
              ✝️
            </div>
            <h3 className="font-brand text-xl font-bold text-white">No Profiles Registered Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We maintain a 100% genuine database created solely by real users. Be among the first Christian candidates in Bidar and surrounding regions to create your verified profile.
            </p>
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-lg"
            >
              Register Your Profile Free
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProfiles;
