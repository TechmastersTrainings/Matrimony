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
        const res = await apiClient.searchProfiles({ limit: 8 });
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
    <section className="py-20 bg-[#fdfbf7] border-t border-[#ece2d1] text-[#1e1b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-burgundy-800 block mb-1">
              Verified User Profiles
            </span>
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-slate-900 mt-1 tracking-tight">
              Meet People Who Share Your Values
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Browse genuine, registered Christian brides and grooms with spiritual and family alignment.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-xs font-bold text-burgundy-900 hover:text-burgundy-700 group bg-white border border-[#ded0ba] px-5 py-2.5 rounded-full hover:bg-rose-50 transition-all shadow-xs"
            >
              <span>Search All Profiles</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Profile Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm font-medium">
            Loading real candidate profiles...
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {profiles.map((p) => {
              const photoUrl = getPhotoUrl(
                typeof p.primary_photo === 'string'
                  ? p.primary_photo
                  : (p.primary_photo as any)?.photo_url
              );

              return (
                <div
                  key={p.id}
                  className="bg-white border border-[#ece2d1] hover:border-burgundy-300 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  {/* Top Badges Row (Dedicated Non-Overlapping Header) */}
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <span className="bg-rose-50 text-burgundy-800 border border-burgundy-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider truncate max-w-[130px]">
                      {p.denomination || 'Christian'}
                    </span>

                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <span>✓</span>
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Centered Circular Profile Photo (Circle View with Gold Ring) */}
                  <div className="my-5 flex justify-center">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-gold-400/40 group-hover:ring-gold-500 shadow-md overflow-hidden bg-rose-50/40 transition-all duration-300 relative flex items-center justify-center shrink-0">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={`${p.first_name} ${p.last_name || ''}`}
                          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR_SVG;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-[#faf6ee] text-slate-500 p-2">
                          <span className="text-3xl">👤</span>
                          <span className="text-[10px] font-semibold text-slate-600 mt-1 text-center leading-tight">
                            Photo<br />Confidential
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Candidate Details */}
                  <div className="text-center space-y-1.5 flex-1 flex flex-col justify-center">
                    <h3 className="font-brand text-lg font-bold text-slate-900 group-hover:text-burgundy-800 transition-colors truncate">
                      {p.first_name} {p.last_name?.charAt(0) ? `${p.last_name.charAt(0)}.` : ''}
                    </h3>

                    <p className="text-xs text-gold-800 font-semibold flex items-center justify-center gap-1">
                      <span>📍</span>
                      <span className="truncate">{p.district || 'Bidar'}, {p.state || 'Karnataka'}</span>
                    </p>

                    <div className="pt-3 border-t border-[#ece2d1] space-y-1 text-xs">
                      <p className="font-medium text-slate-800 truncate" title={p.highest_education || 'Christian Graduate'}>
                        🎓 {p.highest_education || 'Christian Graduate'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate" title={p.occupation_title || p.church_name || 'Verified Member'}>
                        💼 {p.occupation_title || p.church_name || 'Verified Member'}
                      </p>
                    </div>
                  </div>

                  {/* Docked Action Button */}
                  <div className="mt-5 pt-2">
                    <Link
                      href={`/profile/${p.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-50/80 hover:bg-gradient-to-r hover:from-burgundy-700 hover:to-burgundy-800 text-burgundy-900 hover:text-white border border-burgundy-200 hover:border-burgundy-700 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>View Profile</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 px-6 rounded-3xl bg-white border border-[#ece2d1] text-center max-w-2xl mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-burgundy-800 border border-rose-200 flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
              ✝️
            </div>
            <h3 className="font-brand text-xl font-bold text-slate-900">No Profiles Registered Yet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We maintain a 100% genuine database created solely by real users. Be among the first Christian candidates in Bidar and surrounding regions to create your verified profile.
            </p>
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md shadow-burgundy-950/20 transition-all transform hover:-translate-y-0.5"
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
