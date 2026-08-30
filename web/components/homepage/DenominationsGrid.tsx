'use client';

import React from 'react';
import Link from 'next/link';

export function DenominationsGrid() {
  const denominations = [
    {
      name: 'Methodist Church in India (MCI)',
      code: 'METHODIST',
      badge: 'Popular in Bidar & Hyderabad-Karnataka',
      color: 'from-red-800 to-rose-900',
      icon: '⛪',
      desc: 'Centenary Methodist churches and historical community connections.',
    },
    {
      name: 'Church of South India (CSI)',
      code: 'CSI',
      badge: 'Karnataka & South India',
      color: 'from-blue-900 to-indigo-950',
      icon: '✝',
      desc: 'United Protestant fellowship across Karnataka & South India dioceses.',
    },
    {
      name: 'Roman Catholic (RC)',
      code: 'CATHOLIC',
      badge: 'Parish Verified',
      color: 'from-amber-700 to-amber-900',
      icon: '🕊️',
      desc: 'Parish-registered Catholic brides and grooms with baptism certificates.',
    },
    {
      name: 'Baptist Fellowship',
      code: 'BAPTIST',
      badge: 'Bible Centered',
      color: 'from-emerald-800 to-teal-950',
      icon: '📖',
      desc: 'Independent and Convention Baptist Christian family alliances.',
    },
    {
      name: 'Pentecostal Assembly',
      code: 'PENTECOSTAL',
      badge: 'Spirit Led',
      color: 'from-purple-800 to-purple-950',
      icon: '🔥',
      desc: 'Assemblies of God, IPC, Church of God & Spirit-filled believers.',
    },
    {
      name: 'Protestant & Other Fellowships',
      code: 'PROTESTANT',
      badge: 'All India',
      color: 'from-stone-800 to-stone-950',
      icon: '🌟',
      desc: 'Mar Thoma, Orthodox, Brethren & Independent Evangelical believers.',
    },
  ];

  return (
    <section id="denominations" className="py-16 bg-gradient-to-b from-rose-50/50 via-white to-amber-50/40 border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-700 px-3 py-1 bg-red-100 rounded-full">
            Christian Communities in India
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-red-950 mt-3 tracking-tight">
            Browse Matches by Christian Denomination
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Find candidates who share your specific church traditions, fellowship, and family beliefs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {denominations.map((d) => (
            <Link
              key={d.code}
              href={`/discover?denomination=${d.code}`}
              className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group card-hover-indian flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {d.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {d.badge}
                  </span>
                </div>

                <h3 className="font-playfair text-lg font-bold text-red-950 group-hover:text-red-700 transition-colors">
                  {d.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {d.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-red-900 group-hover:text-red-700">
                <span>Search {d.code} Profiles</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
