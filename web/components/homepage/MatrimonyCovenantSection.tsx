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

  return (
    <section className="py-20 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] relative overflow-hidden border-t border-[#ece2d1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-burgundy-200 text-burgundy-800 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-burgundy-700" />
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
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-[#ece2d1] hover:border-burgundy-300 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center font-mono text-sm font-bold text-burgundy-800 group-hover:scale-105 transition-transform">
                  {pillar.num}
                </div>
                <span className="text-xs font-serif italic text-gold-800 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full font-bold">
                  {pillar.verse}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-burgundy-800 transition-colors font-brand">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MatrimonyCovenantSection;
