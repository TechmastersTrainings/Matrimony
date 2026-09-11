'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { CandidateCard } from '../../types';
import { getPhotoUrl, getDefaultAvatarSvg } from '../../lib/utils';

export function FeaturedProfiles() {
  const [profiles, setProfiles] = useState<CandidateCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRealProfiles() {
      try {
        const res = await apiClient.searchProfiles({ limit: 12, gender: 'ALL' });
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
    <section className="py-10 sm:py-12 bg-[#fdfbf7] border-t border-[#ece2d1] text-[#1e1b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Increased Font Hierarchy */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-800 block mb-1">
              Verified Profiles
            </span>
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Meet People Who Share Your Faith &amp; Values
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Browse genuine Christian brides and bridegrooms verified with church and family credentials.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-cyan-900 hover:text-cyan-700 group bg-cyan-50/70 border border-cyan-200 px-5 py-2.5 rounded-full hover:bg-cyan-100 transition-all shadow-2xs"
            >
              <span>Search All Profiles</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Profile Cards Grid */}
        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm font-medium">
            Loading real candidate profiles...
          </div>
        ) : profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {profiles.map((p) => {
              const photoUrl = getPhotoUrl(
                typeof p.primary_photo === 'string'
                  ? p.primary_photo
                  : (p.primary_photo as any)?.photo_url
              );
              const candidateCode = `CN-${p.id || 1}`;

              return (
                <div
                  key={p.id}
                  className="bg-white border border-charcoal-200/80 hover:border-cyan-400 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  {/* Centered Profile Image Container with Badges ON the Image */}
                  <div className="relative my-2 sm:my-3 flex justify-center">
                    {/* Main Avatar Container */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-cyan-400/30 group-hover:ring-orange-400/60 shadow-md overflow-hidden bg-gradient-to-tr from-[#0f172a] to-[#1e293b] transition-all duration-300 relative flex items-center justify-center shrink-0">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={`${p.first_name} ${p.last_name || ''}`}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = getDefaultAvatarSvg(candidateCode);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-amber-400 p-2 select-none">
                          <span className="font-mono font-black text-base sm:text-lg tracking-wider text-amber-400">
                            {candidateCode}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest mt-0.5">
                            Profile
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Top Identifier Badge on the Image (CN-1) */}
                    <div className="absolute -top-1.5 right-1/2 translate-x-12 sm:translate-x-14 pointer-events-none">
                      <span className="bg-slate-900/95 text-amber-300 border border-amber-400/60 text-xs font-mono font-black px-2 py-0.5 rounded-full shadow-sm">
                        {candidateCode}
                      </span>
                    </div>

                    {/* Verified Badge ON the Image (Centered on bottom curve) */}
                    <div className="absolute -bottom-2 inset-x-0 flex justify-center pointer-events-none">
                      <span className="bg-emerald-600 text-white border-2 border-white text-xs font-extrabold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <span className="text-white font-black">✓</span>
                        <span>Verified</span>
                      </span>
                    </div>
                  </div>

                  {/* Candidate Details with Increased Font Sizes */}
                  <div className="text-center space-y-1.5 flex-1 flex flex-col justify-center pt-2">
                    <h3 className="font-brand text-lg sm:text-xl font-bold text-slate-900 group-hover:text-cyan-800 transition-colors truncate">
                      {p.first_name} {p.last_name?.charAt(0) ? `${p.last_name.charAt(0)}.` : ''}
                    </h3>

                    {/* Location Hidden & Protected */}
                    <div className="flex justify-center">
                      <span className="text-xs sm:text-sm text-slate-600 font-semibold inline-flex items-center gap-1.5 bg-slate-100/90 border border-slate-200/90 px-3 py-0.5 rounded-full shadow-2xs">
                        <span>🔒</span>
                        <span>Location Protected</span>
                      </span>
                    </div>

                    <div className="pt-2 border-t border-charcoal-100 space-y-1 text-xs sm:text-sm">
                      <p className="font-medium text-slate-800 truncate" title={p.highest_education || 'Christian Graduate'}>
                        🎓 {p.highest_education || 'Christian Graduate'}
                      </p>
                      <p className="text-slate-600 truncate" title={p.occupation_title || p.church_name || 'Verified Member'}>
                        💼 {p.occupation_title || p.church_name || 'Verified Member'}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-3.5 pt-1.5">
                    <Link
                      href={`/profile/${p.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-50/80 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-teal-600 text-cyan-950 hover:text-white border border-cyan-200 hover:border-cyan-600 text-sm sm:text-base font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs"
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
          <div className="py-8 px-6 rounded-2xl bg-gradient-to-br from-white via-orange-50/20 to-cyan-50/20 border border-cyan-200/80 text-center max-w-xl mx-auto space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-cyan-100/60 text-cyan-900 border border-cyan-200 flex items-center justify-center mx-auto text-xl font-bold shadow-2xs">
              ✝️
            </div>
            <h3 className="font-brand text-xl font-bold text-slate-900">No Profiles Registered Yet</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We maintain a genuine database created solely by real candidates. Be among the first to register your profile.
            </p>
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white px-6 py-2.5 rounded-xl font-extrabold text-sm sm:text-base shadow-sm transition-all"
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
