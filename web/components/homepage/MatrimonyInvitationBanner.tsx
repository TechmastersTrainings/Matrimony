'use client';

import React from 'react';
import Link from 'next/link';

export function MatrimonyInvitationBanner() {
  return (
    <section className="py-8 sm:py-10 bg-gradient-to-r from-[#5a1024] via-[#771932] to-[#0c3944] text-white relative overflow-hidden border-t border-cyan-500/20 shadow-inner">
      {/* Background Sun-Kissed Matrimonial Couple Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 filter brightness-110"
          style={{ backgroundImage: "url('/images/covenant-wedding-couple.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5a1024]/90 via-[#771932]/85 to-[#0c3944]/90" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 sm:space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-cyan-300/40 text-cyan-100 text-xs sm:text-sm font-semibold uppercase tracking-wider mx-auto backdrop-blur-sm shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>CovenantNest • Holy Matrimony</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-brand">
            Your Story of Faith &amp; Love Begins Here
          </h2>
          <p className="text-sm sm:text-base text-cyan-50/95 max-w-xl mx-auto leading-relaxed">
            Take the first step in prayer and faith. Join Christian brides, grooms, and prayerful families seeking God&apos;s ordained blessing in holy matrimony.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-1">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 text-orange-950 px-7 py-3 rounded-xl font-black text-sm sm:text-base shadow-md border border-orange-300 transition-all transform hover:-translate-y-0.5"
          >
            <span>Register Your Profile Free</span>
            <span>→</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-3 rounded-xl font-bold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all transform hover:-translate-y-0.5"
          >
            <span>Sign In to Member Portal</span>
            <span>→</span>
          </Link>
        </div>

        <p className="text-xs sm:text-sm text-cyan-200/90 pt-1">
          Serving Christian families across Bidar, Bengaluru, Kalaburagi, Hyderabad &amp; Pan-India.
        </p>
      </div>
    </section>
  );
}

export default MatrimonyInvitationBanner;
