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
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Sacred Pillars of Holy Matrimony</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Walking Together in Grace, Devotion &amp; Faith
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Christian marriage is more than a ceremony; it is a sacred covenant instituted by God to reflect His everlasting love.
          </p>
        </div>

        {/* 4 Marriage Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-800/60 flex items-center justify-center font-mono text-sm font-bold text-amber-400 group-hover:scale-105 transition-transform">
                  {pillar.num}
                </div>
                <span className="text-xs font-serif italic text-amber-400/80 bg-amber-950/30 border border-amber-900/40 px-3 py-1 rounded-full">
                  {pillar.verse}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                {pillar.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
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
