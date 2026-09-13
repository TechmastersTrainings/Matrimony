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
        const res = await apiClient.searchProfiles({ limit: 24, gender: 'ALL' });
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
    <section className="py-10 sm:py-12 bg-[#fdfbf7] border-t border-[#ece2d1] text-[#1e1b18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
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

          <div className="flex items-center gap-3 shrink-0">
            {/* Carousel Arrow Controls */}
            {profiles.length > 0 && (
              <div className="flex items-center gap-2 bg-white border border-[#ece2d1] p-1.5 rounded-full shadow-2xs">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-cyan-900 hover:bg-cyan-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                  aria-label="Scroll carousel left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-cyan-900 hover:bg-cyan-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                  aria-label="Scroll carousel right"
                >
                  →
                </button>
              </div>
            )}

            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-cyan-900 hover:text-cyan-700 group bg-cyan-50/80 border border-cyan-200 px-5 py-2.5 rounded-full hover:bg-cyan-100 transition-all shadow-2xs"
            >
              <span>Search All Profiles</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Profile Cards Carousel (Left-to-Right Horizontal Scrolling) */}
        {loading ? (
          <div className="py-10 text-center text-slate-400 text-sm font-medium">
            Loading real candidate profiles...
          </div>
        ) : profiles.length > 0 ? (
          <div className="relative group/carousel">
            {/* Left Edge Fade Effect */}
            {canScrollLeft && (
              <div className="hidden sm:block absolute left-0 top-0 bottom-4 w-10 bg-gradient-to-r from-[#fdfbf7] to-transparent z-10 pointer-events-none" />
            )}

            {/* Scrollable Container */}
            <div
              ref={carouselRef}
              onScroll={checkScroll}
              className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1 snap-x snap-mandatory"
            >
              {profiles.map((p) => {
                const photoUrl = getPhotoUrl(
                  typeof p.primary_photo === 'string'
                    ? p.primary_photo
                    : (p.primary_photo as any)?.photo_url
                );
                const candidateCode = `CN-${p.id || 1}`;

                return (
                  <Link
                    key={p.id}
                    href={`/profile/${p.id}`}
                    title={`View Profile of ${p.first_name}`}
                    className="w-[145px] sm:w-[160px] md:w-[175px] aspect-square shrink-0 snap-start bg-white border border-[#ece2d1] hover:border-cyan-400 rounded-2xl p-3 sm:p-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center group hover:-translate-y-1"
                  >
                    {/* Centered Profile Picture Circle */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full ring-3 ring-cyan-400/30 group-hover:ring-orange-400/60 shadow-md overflow-hidden bg-gradient-to-tr from-[#0f172a] to-[#1e293b] transition-all duration-300 relative flex items-center justify-center shrink-0 group-hover:scale-105">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={`${p.first_name} ${p.last_name || ''}`}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.src = getDefaultAvatarSvg(candidateCode);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-amber-400 p-2 select-none">
                          <span className="font-mono font-black text-sm sm:text-base tracking-wider text-amber-400">
                            {candidateCode}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">
                            Profile
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right Edge Fade Effect */}
            {canScrollRight && (
              <div className="hidden sm:block absolute right-0 top-0 bottom-4 w-10 bg-gradient-to-l from-[#fdfbf7] to-transparent z-10 pointer-events-none" />
            )}
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
