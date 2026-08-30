'use client';

import React from 'react';
import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="py-24 bg-[#172554] text-white relative overflow-hidden">
      {/* Background radial gold aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="w-12 h-12 rounded-full bg-[#C9A227] text-[#172554] flex items-center justify-center font-serif text-2xl font-bold mx-auto shadow-lg">
          ✝
        </div>

        <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
          Your Story Could Begin Here
        </h2>

        <p className="text-base sm:text-lg text-stone-300 max-w-xl mx-auto font-normal leading-relaxed">
          Create your profile today and take the first prayerful step toward a meaningful Christian marriage built on love and commitment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-[#C9A227] hover:bg-[#d4af37] text-[#172554] font-bold text-base px-8 py-4 rounded-full shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Your Profile Free</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            href="/discover"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-semibold text-base px-8 py-4 rounded-full border border-white/20 transition-all text-center"
          >
            Explore Profiles
          </Link>
        </div>

        <p className="text-xs text-stone-400 pt-4">
          Serving Methodist, CSI, Roman Catholic, Baptist, Pentecostal & Protestant families across Bidar & India.
        </p>
      </div>
    </section>
  );
}
