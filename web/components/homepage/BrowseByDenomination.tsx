'use client';

import React from 'react';
import Link from 'next/link';

export function BrowseByDenomination() {
  const denominations = [
    {
      name: 'Methodist (MCI)',
      tag: 'Bidar Stronghold',
      desc: 'Karnataka & Hyderabad conferences',
      param: 'Methodist (MCI)',
      border: 'border-orange-200 hover:border-orange-500',
      bg: 'bg-orange-50/50 hover:bg-orange-50',
      tagColor: 'text-orange-800 bg-orange-100/80',
    },
    {
      name: 'CSI Church',
      tag: 'South India',
      desc: 'United liturgical fellowships',
      param: 'CSI',
      border: 'border-cyan-200 hover:border-cyan-500',
      bg: 'bg-cyan-50/50 hover:bg-cyan-50',
      tagColor: 'text-cyan-800 bg-cyan-100/80',
    },
    {
      name: 'Roman Catholic',
      tag: 'Parish & Diocese',
      desc: 'Sacred Catholic sacraments',
      param: 'Roman Catholic',
      border: 'border-rose-200 hover:border-rose-500',
      bg: 'bg-rose-50/50 hover:bg-rose-50',
      tagColor: 'text-rose-800 bg-rose-100/80',
    },
    {
      name: 'Baptist Church',
      tag: 'Biblical Faith',
      desc: "Believer's baptism traditions",
      param: 'Baptist',
      border: 'border-emerald-200 hover:border-emerald-500',
      bg: 'bg-emerald-50/50 hover:bg-emerald-50',
      tagColor: 'text-emerald-800 bg-emerald-100/80',
    },
    {
      name: 'Pentecostal',
      tag: 'Born-Again',
      desc: 'Assemblies of God & Believers',
      param: 'Pentecostal',
      border: 'border-amber-200 hover:border-amber-500',
      bg: 'bg-amber-50/50 hover:bg-amber-50',
      tagColor: 'text-amber-800 bg-amber-100/80',
    },
    {
      name: 'Protestant',
      tag: 'Evangelical',
      desc: 'Independent Christian fellowships',
      param: 'Protestant',
      border: 'border-slate-200 hover:border-slate-500',
      bg: 'bg-slate-50/50 hover:bg-slate-100/60',
      tagColor: 'text-slate-800 bg-slate-200/80',
    },
  ];

  return (
    <section className="py-8 sm:py-10 bg-[#fdfbf7] text-[#1e1b18] border-b border-charcoal-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-950">
            <span>⛪</span>
            <span>Browse by Fellowship</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
            Explore Christian Matches by Denomination
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Connect with verified brides and bridegrooms whose faith, church traditions, and pastoral values mirror your own.
          </p>
        </div>

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {denominations.map((d, idx) => (
            <Link
              key={idx}
              href={`/discover?denomination=${encodeURIComponent(d.param)}`}
              className={`p-3.5 sm:p-4 rounded-xl border ${d.border} ${d.bg} transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:-translate-y-0.5 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">⛪</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${d.tagColor}`}>
                    {d.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-900 font-brand">
                  {d.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                  {d.desc}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] font-bold text-cyan-900">
                <span>View Profiles</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrowseByDenomination;
