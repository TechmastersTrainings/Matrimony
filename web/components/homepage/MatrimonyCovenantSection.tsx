'use client';

import React from 'react';

export function MatrimonyCovenantSection() {
  const pillars = [
    {
      num: '01',
      title: 'Prayer & Divine Timing',
      verse: 'Ecclesiastes 3:11',
      description:
        'We believe that God makes all things beautiful in His time. A Christian marriage begins when two hearts seek God first in prayer, trusting His divine providence and guidance.',
    },
    {
      num: '02',
      title: 'Built Upon the Rock of Christ',
      verse: 'Matthew 7:24',
      description:
        'A blessed home is established on shared faith, mutual respect, and Christian values. When husband and wife walk together with Christ, their bond stands firm through every season.',
    },
    {
      num: '03',
      title: 'Family Honor & Parental Blessings',
      verse: 'Exodus 20:12',
      description:
        'In Christian tradition, marriage unites two families in grace. We honor the prayers of mothers, fathers, and church pastors, creating a joyful, transparent atmosphere for families.',
    },
    {
      num: '04',
      title: 'The Sacred Altar Vow',
      verse: 'Colossians 3:14',
      description:
        'Above all, put on love, which binds everything together in perfect harmony. Marriage is a solemn, lifelong covenant of unconditional forgiveness, kindness, and devotion.',
    },
  ];

  const colorThemes = [
    {
      cardBg: 'bg-gradient-to-br from-cyan-50/80 to-white hover:border-cyan-400',
      border: 'border-cyan-200',
      numBg: 'bg-cyan-100/80 text-cyan-900 border-cyan-300',
      verseBadge: 'text-cyan-900 bg-cyan-100/60 border-cyan-200',
      hoverTitle: 'group-hover:text-cyan-800',
    },
    {
      cardBg: 'bg-gradient-to-br from-orange-50/80 to-white hover:border-orange-400',
      border: 'border-orange-200',
      numBg: 'bg-orange-100/80 text-orange-900 border-orange-300',
      verseBadge: 'text-orange-900 bg-orange-100/60 border-orange-200',
      hoverTitle: 'group-hover:text-orange-800',
    },
    {
      cardBg: 'bg-gradient-to-br from-emerald-50/80 to-white hover:border-emerald-400',
      border: 'border-emerald-200',
      numBg: 'bg-emerald-100/80 text-emerald-900 border-emerald-300',
      verseBadge: 'text-emerald-900 bg-emerald-100/60 border-emerald-200',
      hoverTitle: 'group-hover:text-emerald-800',
    },
    {
      cardBg: 'bg-gradient-to-br from-rose-50/80 to-white hover:border-rose-400',
      border: 'border-rose-200',
      numBg: 'bg-rose-100/80 text-rose-900 border-rose-300',
      verseBadge: 'text-rose-900 bg-rose-100/60 border-rose-200',
      hoverTitle: 'group-hover:text-rose-800',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] relative overflow-hidden border-t border-charcoal-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-50 via-orange-50 to-emerald-50 border border-cyan-200 text-charcoal-900 text-xs font-bold uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Sacred Pillars of Holy Matrimony</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-brand">
            Walking Together in Grace, Devotion &amp; Faith
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Christian marriage is more than a ceremony; it is a sacred covenant instituted by God to reflect His everlasting love.
          </p>
        </div>

        {/* 4 Marriage Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const theme = colorThemes[idx % colorThemes.length];
            return (
              <div
                key={idx}
                className={`p-8 rounded-3xl ${theme.cardBg} border ${theme.border} transition-all duration-300 shadow-sm hover:shadow-md group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${theme.numBg} border flex items-center justify-center font-mono text-sm font-extrabold group-hover:scale-105 transition-transform shadow-2xs`}>
                    {pillar.num}
                  </div>
                  <span className={`text-xs font-serif italic ${theme.verseBadge} border px-3 py-1 rounded-full font-bold shadow-2xs`}>
                    {pillar.verse}
                  </span>
                </div>
                <h3 className={`text-lg sm:text-xl font-bold text-slate-900 mb-2 ${theme.hoverTitle} transition-colors font-brand`}>
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MatrimonyCovenantSection;
