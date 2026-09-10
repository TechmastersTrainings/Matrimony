'use client';

import React from 'react';
import Link from 'next/link';

export function MatrimonyHeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] pt-24 pb-16 border-b border-[#ece2d1]">
      {/* Background Subtle Warm Matrimonial Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Golden Sunset Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-200/25 via-rose-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
        {/* Sacred Matrimony Badge with Fresh Colors */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-50 via-orange-50 to-emerald-50 border border-cyan-200/80 text-charcoal-900 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-xs mb-8 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="tracking-wide font-extrabold text-cyan-950">Holy Christian Matrimony</span>
          <span className="text-orange-400 font-bold">•</span>
          <span className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">Bidar &amp; Karnataka</span>
        </div>

        {/* Majestic Matrimonial Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.14] max-w-4xl text-slate-900 font-brand">
          Where Two Faithful Souls Begin Their{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-cyan-700">
            Sacred Covenant
          </span>
        </h1>

        {/* Sacred Scripture Quote with Light Orange accent frame */}
        <div className="my-6 max-w-2xl mx-auto bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-cyan-50/50 border-l-4 border-orange-500 py-3.5 px-5 rounded-r-2xl shadow-2xs">
          <p className="text-base sm:text-lg md:text-xl font-serif italic text-charcoal-900 leading-relaxed">
            &ldquo;Therefore what God has joined together, let no one separate.&rdquo;
          </p>
          <span className="block text-xs uppercase tracking-widest text-orange-800 font-bold mt-1.5">
            — Mark 10:9
          </span>
        </div>

        {/* Matrimony Emotion & Theme Narrative */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal mb-8">
          A reverent matrimonial sanctuary bringing together Christian brides, bridegrooms, and prayerful families across Methodist, CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships in lifelong faith and love.
        </p>

        {/* Emotion-driven Matrimony Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-orange-950/15 border border-orange-400/40 transition-all transform hover:-translate-y-0.5"
          >
            <span>Begin Your Matrimony Journey</span>
            <span>→</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-cyan-50/70 text-cyan-950 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base border border-cyan-200 shadow-xs transition-all transform hover:-translate-y-0.5"
          >
            <span>Sign In to Member Portal</span>
            <span>→</span>
          </Link>
        </div>

        {/* Four Sacred Hallmarks of Christian Marriage - Distinct Colorful Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl mt-14 pt-8 border-t border-charcoal-100 text-left">
          {/* Card 01 - Cyan Accent */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50/90 to-cyan-100/30 border border-cyan-200 hover:border-cyan-400 transition-all shadow-xs">
            <span className="text-xs font-mono font-bold text-cyan-700 tracking-wider mb-1 block">01 • PRAYER</span>
            <h4 className="text-xs sm:text-sm font-bold text-cyan-950">Rooted in Prayer</h4>
            <p className="text-[11px] text-cyan-900/80 mt-1 leading-snug">
              Every holy union begins in prayer and divine guidance.
            </p>
          </div>

          {/* Card 02 - Light Orange Accent */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50/90 to-amber-100/30 border border-orange-200 hover:border-orange-400 transition-all shadow-xs">
            <span className="text-xs font-mono font-bold text-orange-700 tracking-wider mb-1 block">02 • COVENANT</span>
            <h4 className="text-xs sm:text-sm font-bold text-orange-950">Holy Covenant</h4>
            <p className="text-[11px] text-orange-900/80 mt-1 leading-snug">
              A sacred lifelong promise of love, grace, and fidelity.
            </p>
          </div>

          {/* Card 03 - Light Green Accent */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-green-100/30 border border-emerald-200 hover:border-emerald-400 transition-all shadow-xs">
            <span className="text-xs font-mono font-bold text-emerald-700 tracking-wider mb-1 block">03 • BLESSING</span>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-950">Family Blessing</h4>
            <p className="text-[11px] text-emerald-900/80 mt-1 leading-snug">
              Honoring parents, church elders, and community traditions.
            </p>
          </div>

          {/* Card 04 - Rose & Amethyst Accent */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/90 to-pink-100/30 border border-rose-200 hover:border-rose-400 transition-all shadow-xs">
            <span className="text-xs font-mono font-bold text-rose-700 tracking-wider mb-1 block">04 • GRACE</span>
            <h4 className="text-xs sm:text-sm font-bold text-rose-950">Lifelong Fellowship</h4>
            <p className="text-[11px] text-rose-900/80 mt-1 leading-snug">
              Walking together under Christ’s unconditional grace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
