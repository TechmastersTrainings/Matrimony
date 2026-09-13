'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { CandidateCard } from '../../types';
import { getPhotoUrl, getDefaultAvatarSvg } from '../../lib/utils';

export function FeaturedProfiles() {
  const [profiles, setProfiles] = useState<CandidateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    async function loadRealProfiles() {
      try {
        const res = await apiClient.searchProfiles({ limit: 20, gender: 'ALL' });
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

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [profiles]);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-7 sm:py-9 bg-[#fdfbf7] border-t border-[#ece2d1] text-[#1e1b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-800 block mb-0.5">
              Verified Profiles
            </span>
            <h2 className="font-brand text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Meet People Who Share Your Faith &amp; Values
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Browse genuine Christian brides and bridegrooms verified with church and family credentials.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Carousel Arrow Controls */}
            {profiles.length > 0 && (
              <div className="flex items-center gap-1.5 bg-white border border-[#ece2d1] p-1 rounded-full shadow-2xs">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-cyan-900 hover:bg-cyan-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
                  aria-label="Scroll carousel left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-cyan-900 hover:bg-cyan-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-bold"
                  aria-label="Scroll carousel right"
                >
                  →
                </button>
              </div>
            )}

            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-900 hover:text-cyan-700 group bg-cyan-50/80 border border-cyan-200 px-3.5 py-2 rounded-full hover:bg-cyan-100 transition-all shadow-2xs"
            >
              <span>Search All</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Profile Cards Carousel (Left-to-Right Horizontal Scrolling) */}
        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium">
            Loading real candidate profiles...
          </div>
        ) : profiles.length > 0 ? (
          <div className="relative group/carousel">
            {/* Left Edge Fade Effect */}
            {canScrollLeft && (
              <div className="hidden sm:block absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-[#fdfbf7] to-transparent z-10 pointer-events-none" />
            )}

            {/* Scrollable Container */}
            <div
              ref={carouselRef}
              onScroll={checkScroll}
              className="flex items-stretch gap-3 sm:gap-3.5 overflow-x-auto scrollbar-none scroll-smooth pb-3 pt-1 px-1 snap-x snap-mandatory"
            >
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
                    className="w-[205px] sm:w-[220px] md:w-[235px] shrink-0 snap-start bg-white border border-[#ece2d1] hover:border-cyan-400 rounded-2xl p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Centered Profile Image Container with Verified Badge */}
                      <div className="relative my-1.5 flex justify-center">
                        {/* Avatar Circle */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full ring-3 ring-cyan-400/30 group-hover:ring-orange-400/60 shadow-sm overflow-hidden bg-gradient-to-tr from-[#0f172a] to-[#1e293b] transition-all duration-300 relative flex items-center justify-center shrink-0">
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
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-amber-400 p-1 select-none">
                              <span className="font-mono font-black text-sm tracking-wider text-amber-400">
                                {candidateCode}
                              </span>
                              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                Profile
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Verified Badge ON the Image (Centered on bottom curve) */}
                        <div className="absolute -bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
                          <span className="bg-emerald-600 text-white border border-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                            <span>✓</span>
                            <span>Verified</span>
                          </span>
                        </div>
                      </div>

                      {/* Candidate Details */}
                      <div className="text-center space-y-1 pt-1.5">
                        <h3 className="font-brand text-sm sm:text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors truncate">
                          {p.first_name} {p.last_name?.charAt(0) ? `${p.last_name.charAt(0)}.` : ''}
                        </h3>

                        {/* Location Hidden & Protected */}
                        <div className="flex justify-center">
                          <span className="text-[10px] text-slate-500 font-semibold inline-flex items-center gap-1 bg-slate-100/90 border border-slate-200/80 px-2 py-0.5 rounded-full">
                            <span>🔒</span>
                            <span>Location Protected</span>
                          </span>
                        </div>

                        <div className="pt-1.5 border-t border-charcoal-100/80 space-y-0.5 text-[11px]">
                          <p className="font-medium text-slate-800 truncate" title={p.highest_education || 'Christian Graduate'}>
                            🎓 {p.highest_education || 'Christian Graduate'}
                          </p>
                          <p className="text-slate-500 truncate" title={p.occupation_title || p.church_name || 'Verified Member'}>
                            💼 {p.occupation_title || p.church_name || 'Verified Member'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-2.5 pt-1">
                      <Link
                        href={`/profile/${p.id}`}
                        className="w-full py-1.5 px-3 rounded-xl bg-cyan-50/80 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-teal-600 text-cyan-950 hover:text-white border border-cyan-200 hover:border-cyan-600 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>View Profile</span>
                        <span className="transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Edge Fade Effect */}
            {canScrollRight && (
              <div className="hidden sm:block absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[#fdfbf7] to-transparent z-10 pointer-events-none" />
            )}
          </div>
        ) : (
          <div className="py-7 px-5 rounded-2xl bg-gradient-to-br from-white via-orange-50/20 to-cyan-50/20 border border-cyan-200/80 text-center max-w-lg mx-auto space-y-2.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-cyan-100/60 text-cyan-900 border border-cyan-200 flex items-center justify-center mx-auto text-lg font-bold shadow-2xs">
              ✝️
            </div>
            <h3 className="font-brand text-base font-bold text-slate-900">No Profiles Registered Yet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We maintain a genuine database created solely by real candidates. Be among the first to register your profile.
            </p>
            <Link
              href="/register"
              className="inline-block bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white px-4 py-2 rounded-xl font-extrabold text-xs shadow-sm transition-all"
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
