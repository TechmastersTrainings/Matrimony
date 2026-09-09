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
        {/* Sacred Matrimony Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 border border-burgundy-200 text-burgundy-800 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-sm mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-burgundy-700" />
          <span className="tracking-wide font-bold">Holy Christian Matrimony</span>
          <span className="text-amber-400">•</span>
          <span className="text-slate-600">Bidar &amp; Karnataka</span>
        </div>

        {/* Majestic Matrimonial Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.14] max-w-4xl text-slate-900 font-brand">
          Where Two Faithful Souls Begin Their{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-burgundy-800 via-rose-700 to-amber-600">
            Sacred Covenant
          </span>
        </h1>

        {/* Sacred Scripture Quote */}
        <div className="my-6 max-w-2xl mx-auto">
          <p className="text-base sm:text-lg md:text-xl font-serif italic text-burgundy-950/90 leading-relaxed">
            &ldquo;Therefore what God has joined together, let no one separate.&rdquo;
          </p>
          <span className="block text-xs uppercase tracking-widest text-gold-700 font-bold mt-1.5">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-burgundy-950/20 border border-burgundy-600 transition-all transform hover:-translate-y-0.5"
          >
            <span>Begin Your Matrimony Journey</span>
            <span>→</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-rose-50 text-burgundy-900 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base border border-[#ded0ba] shadow-xs transition-all transform hover:-translate-y-0.5"
          >
            <span>Sign In to Member Portal</span>
            <span>→</span>
          </Link>
        </div>

        {/* Four Sacred Hallmarks of Christian Marriage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl mt-14 pt-8 border-t border-[#ece2d1] text-left">
          <div className="p-4 rounded-2xl bg-white border border-[#ece2d1] shadow-xs">
            <span className="text-xs font-mono font-bold text-gold-700 tracking-wider mb-1 block">01</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Rooted in Prayer</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Every holy union begins in prayer and divine guidance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#ece2d1] shadow-xs">
            <span className="text-xs font-mono font-bold text-gold-700 tracking-wider mb-1 block">02</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Holy Covenant</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              A sacred lifelong promise of love, grace, and fidelity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#ece2d1] shadow-xs">
            <span className="text-xs font-mono font-bold text-gold-700 tracking-wider mb-1 block">03</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Family Blessing</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Honoring parents, church elders, and community traditions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#ece2d1] shadow-xs">
            <span className="text-xs font-mono font-bold text-gold-700 tracking-wider mb-1 block">04</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Lifelong Fellowship</h4>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              Walking together under Christ’s unconditional grace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
