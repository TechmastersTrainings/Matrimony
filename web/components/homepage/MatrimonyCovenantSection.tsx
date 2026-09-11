'use client';

import React from 'react';

export function MatrimonyCovenantSection() {
  const pillars = [
    {
      num: '01',
      badge: 'FAITH & COVENANT',
      title: 'Rooted in Christ & Prayer',
      description:
        'Christian marriage is a solemn, lifelong covenant. We connect prayerful brides, grooms, and families across Methodist, CSI, Roman Catholic, Baptist, and Pentecostal fellowships.',
      bg: 'bg-gradient-to-br from-cyan-50/90 to-cyan-100/30',
      border: 'border-cyan-200 hover:border-cyan-400',
      numBadge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      titleColor: 'text-cyan-950',
    },
    {
      num: '02',
      badge: 'STRICT PRIVACY',
      title: 'Protected Family Discretion',
      description:
        'Your sacred dignity is guarded. Full candidate profiles, family backgrounds, and direct phone contacts are unlocked only through mutual consent—never leaked to the public internet.',
      bg: 'bg-gradient-to-br from-emerald-50/90 to-emerald-100/30',
      border: 'border-emerald-200 hover:border-emerald-400',
      numBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      titleColor: 'text-emerald-950',
    },
    {
      num: '03',
      badge: 'HOLY MATRIMONY ONLY',
      title: 'Honoring Families & Pastors',
      description:
        'Solely designed for holy matrimony—zero casual dating. We encourage parental guidance and church endorsements, fostering transparent, reverent conversations between families.',
      bg: 'bg-gradient-to-br from-orange-50/90 to-amber-100/30',
      border: 'border-orange-200 hover:border-orange-400',
      numBadge: 'bg-orange-100 text-orange-900 border-orange-300',
      titleColor: 'text-orange-950',
    },
  ];

  return (
    <section className="py-8 sm:py-10 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] border-t border-charcoal-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-7 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-50 via-orange-50 to-emerald-50 border border-cyan-200 text-charcoal-900 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>Sacred Covenant &amp; Discretion</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
            Built on Faith, Protected by Reverence
          </h2>

          {/* Integrated Scripture Ribbon (No bloated standalone section) */}
          <div className="pt-1">
            <blockquote className="text-xs sm:text-sm font-serif italic text-charcoal-700 max-w-xl mx-auto leading-relaxed bg-white/80 border border-orange-200/80 py-2 px-4 rounded-xl shadow-2xs">
              &ldquo;Love is patient, love is kind... It always protects, always trusts, always hopes, always perseveres. Love never fails.&rdquo;
              <span className="block not-italic font-sans text-[10px] font-bold text-orange-800 uppercase tracking-widest mt-0.5">
                — 1 Corinthians 13:4, 7–8
              </span>
            </blockquote>
          </div>
        </div>

        {/* 3 Pillars Grid - Single Compact Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl ${p.bg} border ${p.border} transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`w-7 h-7 rounded-lg ${p.numBadge} border flex items-center justify-center font-mono text-xs font-black shadow-2xs`}>
                    {p.num}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-600 bg-white/90 border border-slate-200/80 px-2 py-0.5 rounded-md">
                    {p.badge}
                  </span>
                </div>

                <h3 className={`text-sm sm:text-base font-bold ${p.titleColor} font-brand mb-1.5`}>
                  {p.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MatrimonyCovenantSection;
