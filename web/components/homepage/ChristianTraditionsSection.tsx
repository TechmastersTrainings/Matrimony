'use client';

import React from 'react';
import Link from 'next/link';

export function ChristianTraditionsSection() {
  const denominations = [
    {
      code: 'METHODIST',
      name: 'Methodist Church in India (MCI)',
      region: 'Bidar, Hyderabad & Karnataka',
      desc: 'Wesleyan heritage celebrating devotion, prayerful service, and rich community ties.',
      symbol: '✝',
      badge: 'Active Fellowship',
    },
    {
      code: 'CSI',
      name: 'Church of South India (CSI)',
      region: 'Karnataka & Pan-India',
      desc: 'Ecumenical worship traditions, liturgical reverence, and dignified family values.',
      symbol: '⛪',
      badge: 'Historic Diocese',
    },
    {
      code: 'CATHOLIC',
      name: 'Roman Catholic (RC)',
      region: 'Karnataka & Pan-India',
      desc: 'The Holy Sacrament of Matrimony celebrated with solemn altar blessings and eternal vows.',
      symbol: '🕊️',
      badge: 'Holy Sacrament',
    },
    {
      code: 'BAPTIST',
      name: 'Baptist Fellowship',
      region: 'Deccan & South India',
      desc: 'Scripture-anchored faith, believer’s baptism, and close-knit congregational fellowship.',
      symbol: '📖',
      badge: 'Biblical Devotion',
    },
    {
      code: 'PENTECOSTAL',
      name: 'Pentecostal Assembly',
      region: 'Karnataka & Pan-India',
      desc: 'Spirit-filled prayer life, vibrant gospel worship, and heartfelt devotion to Jesus Christ.',
      symbol: '🔥',
      badge: 'Spirit-Filled',
    },
    {
      code: 'MAR_THOMA',
      name: 'Mar Thoma / Orthodox',
      region: 'South India & Pan-India',
      desc: 'Ancient apostolic prayers, reverent liturgical traditions, and respected heritage.',
      symbol: '🕯️',
      badge: 'Apostolic Heritage',
    },
  ];

  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <span>⛪</span>
            <span>Christian Denominational Traditions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Uniting Families in Sacred Christian Heritage
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Honoring distinct church fellowships while united in our common confession of Jesus Christ as Savior and Lord.
          </p>
        </div>

        {/* Denominations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {denominations.map((item) => (
            <div
              key={item.code}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg text-amber-400 group-hover:scale-110 transition-transform">
                    {item.symbol}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-950 text-amber-300/80 border border-slate-800">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-amber-400/80 font-medium mt-0.5 mb-2.5">
                  {item.region}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-amber-300 transition-colors">
                <span>Verified Christian Families</span>
                <span>✝</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ChristianTraditionsSection;
