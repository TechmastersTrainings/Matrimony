'use client';

import React from 'react';
import Link from 'next/link';

export function TechmastersBottomBanner() {
  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-300 text-xs font-bold uppercase tracking-wider">
          Begin Your Matrimonial Journey
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Your Soulmate Story Begins With Faith &amp; Family
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Create a free matrimonial account today. Connect with verified Christian brides, grooms, and parents in Bidar, Bengaluru, and across India.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-950/40 transition-all transform hover:-translate-y-0.5"
          >
            Register Free Account →
          </Link>

          <Link
            href="/discover"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 transition-all"
          >
            Explore Profiles
          </Link>
        </div>

        <p className="text-[11px] text-slate-500 pt-2">
          Methodist (MCI) • Church of South India (CSI) • Roman Catholic • Baptist • Pentecostal • Protestant
        </p>
      </div>
    </section>
  );
}
