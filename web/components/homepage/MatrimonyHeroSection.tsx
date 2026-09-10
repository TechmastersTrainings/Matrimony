'use client';

import React from 'react';
import Link from 'next/link';

export function MatrimonyHeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#fdfbf7] text-[#1e1b18] pt-24 pb-16 border-b border-charcoal-100">
      {/* Background Light Atmospheric Matrimonial View (Shaadi & Jeevansathi style) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Sun-kissed light background image layer */}
        <div
          className="absolute inset-0 bg-cover bg-right lg:bg-center bg-no-repeat opacity-30 filter saturate-125 contrast-105"
          style={{ backgroundImage: "url('/images/covenant-wedding-couple.jpg')" }}
        />
        {/* Directional gradient ensuring crisp text readability on the left while revealing the bright couple */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/80 to-transparent lg:to-[#fdfbf7]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/70 via-transparent to-[#fdfbf7]" />
        <div className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-200/20 via-orange-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
        {/* Top: 2-Column Split Hero (Shaadi & Jeevansathi Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Narrative & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Sacred Matrimony Badge with Fresh Colors */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-50 via-orange-50 to-emerald-50 border border-cyan-200/90 text-charcoal-900 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-xs animate-fade-in">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="tracking-wide font-extrabold text-cyan-950">CovenantNest • Christian Matrimony</span>
              <span className="text-orange-400 font-bold">•</span>
              <span className="text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md text-[11px]">Bidar &amp; Pan-India</span>
            </div>

            {/* Majestic Matrimonial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-slate-900 font-brand">
              Where Holy Covenants Build{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-cyan-700">
                Blessed Homes
              </span>
            </h1>

            {/* Sacred Scripture Quote with Light Orange accent frame */}
            <div className="w-full max-w-xl bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-cyan-50/50 border-l-4 border-orange-500 py-3 px-4 rounded-r-2xl shadow-2xs text-left">
              <p className="text-sm sm:text-base font-serif italic text-charcoal-900 leading-relaxed">
                &ldquo;Therefore what God has joined together, let no one separate.&rdquo;
              </p>
              <span className="block text-[11px] uppercase tracking-widest text-orange-800 font-bold mt-1">
                — Mark 10:9
              </span>
            </div>

            {/* Matrimony Emotion & Theme Narrative */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
              A reverent Christian matrimonial sanctuary where faithful brides, bridegrooms, and prayerful families across Methodist, CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships build blessed, lifelong homes in Christ.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto pt-2">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-orange-950/15 border border-orange-400/40 transition-all transform hover:-translate-y-0.5"
              >
                <span>Begin Your Journey Free</span>
                <span>→</span>
              </Link>

              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-cyan-50/80 text-cyan-950 px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base border border-cyan-200 shadow-xs transition-all transform hover:-translate-y-0.5"
              >
                <span>Search Profiles</span>
                <span>→</span>
              </Link>
            </div>

            {/* Trust Checklist Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-900">
                <span className="text-emerald-600 font-black">✓</span>
                <span>100% Genuine Profiles</span>
              </div>
              <div className="flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full text-cyan-900">
                <span>⛪</span>
                <span>Church Endorsements</span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-orange-900">
                <span>🔒</span>
                <span>Strict Family Privacy</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Resolution Couple Showcase Card (Shaadi/Jeevansathi Hero Style) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-4/5 sm:aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 ring-1 ring-cyan-500/30 group">
              {/* Image */}
              <img
                src="/images/covenant-wedding-couple.jpg"
                alt="Blessed Christian Matrimony Couple"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gentle Light Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Floating Top-Right Pill */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-cyan-950 border border-cyan-200/80 shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Verified Profiles</span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-extrabold text-charcoal-900">
                    CovenantNest Matrimony
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                    Holy Union
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-600 font-medium">
                  Connecting blessed Christian brides &amp; bridegrooms across Bidar, Karnataka &amp; Pan-India.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Four Sacred Hallmarks of Christian Marriage - Distinct Colorful Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full pt-6 border-t border-charcoal-100 text-left">
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
