'use client';

import React from 'react';
import Link from 'next/link';

export function MatrimonyHeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950 text-white pt-24 pb-16">
      {/* Background Cinematic Silhouette with Ambient Sunset Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* The Bride & Groom Sunset Silhouette Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 mix-blend-lighten scale-105"
          style={{ backgroundImage: "url('/images/christian-wedding-sunset.png')" }}
        />

        {/* Gradient overlays to blend into deep twilight & warm sunset amber */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />

        {/* Soft Golden Sunset Glows */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-amber-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
        {/* Sacred Matrimony Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/80 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-xl shadow-amber-950/20 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="tracking-wide">Holy Christian Matrimony</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Bidar &amp; Karnataka</span>
        </div>

        {/* Majestic Matrimonial Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] max-w-4xl">
          Where Two Faithful Souls Begin Their{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
            Sacred Covenant
          </span>
        </h1>

        {/* Sacred Scripture Quote */}
        <div className="my-6 max-w-2xl mx-auto">
          <p className="text-base sm:text-lg md:text-xl font-serif italic text-amber-200/90 leading-relaxed">
            &ldquo;Therefore what God has joined together, let no one separate.&rdquo;
          </p>
          <span className="block text-xs uppercase tracking-widest text-amber-400/70 font-semibold mt-1.5">
            — Mark 10:9
          </span>
        </div>

        {/* Matrimony Emotion & Theme Narrative */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal mb-8">
          A reverent matrimonial sanctuary bringing together Christian brides, bridegrooms, and prayerful families across Methodist, CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships in lifelong faith and love.
        </p>

        {/* Emotion-driven Matrimony Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-2xl shadow-amber-950/50 border border-amber-300 transition-all transform hover:-translate-y-1 hover:shadow-amber-500/20"
          >
            <span>Begin Your Matrimony Journey</span>
            <span>→</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white px-8 py-4 rounded-2xl font-bold text-sm sm:text-base border border-slate-700/80 backdrop-blur-md transition-all transform hover:-translate-y-1"
          >
            <span>Sign In to Member Portal</span>
            <span>→</span>
          </Link>
        </div>

        {/* Four Sacred Hallmarks of Christian Marriage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl mt-14 pt-8 border-t border-slate-800/80 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider mb-1 block">01</span>
            <h4 className="text-xs sm:text-sm font-bold text-white">Rooted in Prayer</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Every holy union begins in prayer and divine guidance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider mb-1 block">02</span>
            <h4 className="text-xs sm:text-sm font-bold text-white">Holy Covenant</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              A sacred lifelong promise of love, grace, and fidelity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider mb-1 block">03</span>
            <h4 className="text-xs sm:text-sm font-bold text-white">Family Blessing</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Honoring parents, church elders, and community traditions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs font-mono font-bold text-amber-400 tracking-wider mb-1 block">04</span>
            <h4 className="text-xs sm:text-sm font-bold text-white">Sacred Dignity</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Zero public exposure. Protected exclusively for members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
