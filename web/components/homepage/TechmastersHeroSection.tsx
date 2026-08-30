'use client';

import React from 'react';
import Link from 'next/link';

export function TechmastersHeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[88vh] flex items-center justify-center text-center px-4 pt-32 pb-20 overflow-hidden bg-slate-950 text-white"
    >
      {/* Ambient Lighting Background Orbs (Techmasters Innovations style) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-blue-900/90" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500 rounded-full mix-blend-screen filter blur-3xl opacity-15" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Centered Top Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-900/40 border border-blue-700/50 rounded-full text-xs sm:text-sm font-semibold text-blue-200 backdrop-blur-md shadow-lg">
          <span className="text-amber-400 font-bold">Trusted Christian Matrimony</span>
          <span className="text-slate-500">|</span>
          <span className="text-blue-300">Bidar &amp; Karnataka</span>
        </div>

        {/* Majestic Heading with Gradient Accent */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.15] tracking-tight">
          Connecting Faithful Christian Souls for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
            Lifelong Marriage
          </span>
        </h1>

        {/* Supporting Subtext */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          A dedicated matrimonial platform connecting Christian brides, grooms, and families across Methodist, CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships with 100% verified credentials and complete privacy.
        </p>

        {/* Dual High-Impact Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-4 rounded-full font-bold text-base shadow-xl shadow-blue-950 border border-blue-600/50 transition-all transform hover:-translate-y-1"
          >
            <span>Explore Matrimony Profiles</span>
            <span>→</span>
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-8 py-4 rounded-full font-bold text-base shadow-xl shadow-amber-950/40 transition-all transform hover:-translate-y-1"
          >
            <span>Create Free Account</span>
            <span>→</span>
          </Link>
        </div>

        {/* 3-Column Glassmorphic Live Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left pt-6">
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-900/60 rounded-xl text-amber-400 shrink-0 font-extrabold text-lg">
              100%
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">Church Verified</p>
              <p className="text-xs text-slate-400">Pastoral &amp; Contact Authentication</p>
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-900/60 rounded-xl text-amber-400 shrink-0 font-extrabold text-lg">
              0%
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">Spam &amp; Public Leaks</p>
              <p className="text-xs text-slate-400">Controlled Contact Reveal</p>
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-900/60 rounded-xl text-emerald-400 shrink-0 font-extrabold text-lg">
              Bidar
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">&amp; Karnataka</p>
              <p className="text-xs text-slate-400">Deep Regional Family Alliances</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
