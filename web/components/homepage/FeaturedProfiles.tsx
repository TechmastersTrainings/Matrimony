'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { apiClient } from '../../lib/api-client';
import { CandidateCard } from '../../types';
import { getPhotoUrl } from '../../lib/utils';

function ProfileCardItem({ profile: p }: { profile: CandidateCard }) {
  const [imageError, setImageError] = useState(false);
  const photoUrl = getPhotoUrl(
    typeof p.primary_photo === 'string'
      ? p.primary_photo
      : (p.primary_photo as any)?.photo_url
  );
  const candidateCode = `CN-${p.id || 1}`;
  const hasPhoto = !!photoUrl && !imageError;

  return (
    <div className="w-[240px] sm:w-[260px] md:w-[275px] shrink-0 snap-start bg-white border border-[#ece2d1] hover:border-cyan-500/80 rounded-2xl p-3 sm:p-3.5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        {/* Generous Portrait Photo Container (NOT a circle!) */}
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 shadow-xs mb-3">
          {hasPhoto ? (
            <img
              src={photoUrl}
              alt={`${p.first_name} ${p.last_name || ''}`}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-slate-300 p-4 select-none">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-2xl mb-2 text-slate-400 shadow-inner">
                👤
              </div>
              <span className="font-mono font-black text-sm tracking-wider text-amber-400">
                {candidateCode}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Photo on Request
              </span>
            </div>
          )}

          {/* Verified Badge on Photo */}
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-emerald-600/95 backdrop-blur-md text-white border border-white/30 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <span>✓</span>
              <span>Verified</span>
            </span>
          </div>

          {/* Candidate ID Tag */}
          <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
            <span className="bg-slate-950/75 backdrop-blur-md text-amber-300 font-mono font-black text-[10px] px-2 py-0.5 rounded-md border border-amber-400/30 shadow-xs">
              {candidateCode}
            </span>
          </div>
        </div>

        {/* Candidate Details */}
        <div className="space-y-2 px-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-brand text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-800 transition-colors truncate">
              {p.first_name} {p.last_name?.charAt(0) ? `${p.last_name.charAt(0)}.` : ''}
            </h3>

            {p.age && (
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                {p.age} yrs
              </span>
            )}
          </div>

          {/* Location Protected Badge */}
          <div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                alert('Payment Required: Please subscribe to an active plan to unlock full Location and Contact details.');
                window.location.href = '/subscriptions';
              }}
              className="text-[11px] text-slate-600 font-semibold inline-flex items-center gap-1 bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/80 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
            >
              <span>🔒</span>
              <span>Location Protected</span>
            </button>
          </div>

          {/* Education & Occupation */}
          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
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
      <div className="mt-3.5 pt-1 px-1">
        <button
          type="button"
          onClick={() => {
            const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('token')) : null;
            if (!token) {
              alert('Need to login: Please log in to your account to view candidate profiles.');
              window.location.href = `/login?redirect=/profile/${p.id}`;
              return;
            }
            window.location.href = `/profile/${p.id}`;
          }}
          className="w-full py-2 px-4 rounded-xl bg-cyan-50/90 hover:bg-gradient-to-r hover:from-cyan-700 hover:to-teal-700 text-cyan-950 hover:text-white border border-cyan-200 hover:border-cyan-700 text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs group/btn cursor-pointer"
        >
          <span>View Profile</span>
          <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
        </button>
      </div>
    </div>
  );
}

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-cyan-800 block mb-1">
              Verified Profiles
            </span>
            <h2 className="font-brand text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Meet People Who Share Your Faith &amp; Values
            </h2>
            <p className="text-xs sm:text-base text-slate-600 mt-1">
              Browse genuine Christian brides and bridegrooms verified with church and family credentials.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 pt-1 sm:pt-0">
            {/* Carousel Arrow Controls */}
            {profiles.length > 0 && (
              <div className="flex items-center gap-2 bg-white border border-[#ece2d1] p-1 sm:p-1.5 rounded-full shadow-2xs">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-cyan-900 hover:bg-cyan-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                  aria-label="Scroll carousel left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-700 hover:text-cyan-900 hover:bg-cyan-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-base font-bold"
                  aria-label="Scroll carousel right"
                >
                  →
                </button>
              </div>
            )}

            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 text-xs sm:text-base font-bold text-cyan-900 hover:text-cyan-700 group bg-cyan-50/80 border border-cyan-200 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-cyan-100 transition-all shadow-2xs"
            >
              <span>Search All Profiles</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Profile Cards Carousel */}
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
              {profiles.map((p) => (
                <ProfileCardItem key={p.id} profile={p} />
              ))}
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
