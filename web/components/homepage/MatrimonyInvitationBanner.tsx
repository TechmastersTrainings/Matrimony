'use client';

import React from 'react';
import Link from 'next/link';

export function MatrimonyInvitationBanner() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#fdfbf7] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Luxury Island CTA Card */}
        <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-[#520d20] via-[#741630] to-[#0a2936] text-white p-8 sm:p-12 md:p-14 shadow-2xl border border-rose-700/30 ring-1 ring-white/10 text-center">
          {/* Background Sun-Kissed Matrimonial Couple Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 filter brightness-110"
              style={{ backgroundImage: "url('/images/covenant-wedding-couple.jpg')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#520d20]/95 via-[#741630]/90 to-[#0a2936]/95" />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-5">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-cyan-300/40 text-cyan-100 text-xs sm:text-sm font-semibold uppercase tracking-wider mx-auto backdrop-blur-sm shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>CovenantNest • Holy Matrimony</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-brand">
                Your Story of Faith &amp; Love Begins Here
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-cyan-50/95 leading-relaxed">
                Take the first step in prayer and faith. Join Christian brides, grooms, and prayerful families seeking God&apos;s ordained blessing in holy matrimony.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 hover:from-orange-300 hover:to-amber-300 text-orange-950 px-7 py-3 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-orange-950/20 border border-orange-300 transition-all transform hover:-translate-y-0.5"
              >
                <span>Register Your Profile Free</span>
                <span>→</span>
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-3 rounded-xl font-bold text-xs sm:text-sm border border-white/25 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
              >
                <span>Sign In to Member Portal</span>
                <span>→</span>
              </Link>
            </div>

            <p className="text-[11px] sm:text-xs text-cyan-200/90 pt-1">
              Serving Christian families across Bidar, Bengaluru, Kalaburagi, Hyderabad &amp; Pan-India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyInvitationBanner;
