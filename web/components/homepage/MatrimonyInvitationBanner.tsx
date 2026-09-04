'use client';

import React from 'react';
import Link from 'next/link';

export function MatrimonyInvitationBanner() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      {/* Warm Ambient Golden Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-t from-amber-600/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-semibold uppercase tracking-wider mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Christian Holy Matrimony</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Your Story of Faith &amp; Love Begins Here
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Take the first step in prayer and faith. Join hundreds of Christian brides, grooms, and families seeking God&apos;s ordained blessing in holy matrimony.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-2xl shadow-amber-950/50 border border-amber-300 transition-all transform hover:-translate-y-1 hover:shadow-amber-500/20"
          >
            <span>Register Your Profile</span>
            <span>→</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white px-8 py-4 rounded-2xl font-bold text-sm sm:text-base border border-slate-700/80 backdrop-blur-md transition-all transform hover:-translate-y-1"
          >
            <span>Sign In to Member Portal</span>
            <span>→</span>
          </Link>
        </div>

        <p className="text-[11px] text-slate-400">
          Serving Christian families across Bidar, Bengaluru, Kalaburagi, Hyderabad &amp; Pan-India.
        </p>
      </div>
    </section>
  );
}

export default MatrimonyInvitationBanner;
