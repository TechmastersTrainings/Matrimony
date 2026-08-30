'use client';

import React from 'react';
import Link from 'next/link';

export function DenominationsGrid() {
  const denominations = [
    {
      name: 'Methodist Church in India (MCI)',
      code: 'METHODIST',
      badge: 'Bidar & Hyderabad-Karnataka',
      desc: 'Methodist church communities and regional family alliances.',
    },
    {
      name: 'Church of South India (CSI)',
      code: 'CSI',
      badge: 'Karnataka & South India',
      desc: 'Protestant fellowship across Karnataka and South India dioceses.',
    },
    {
      name: 'Roman Catholic (RC)',
      code: 'CATHOLIC',
      badge: 'Parish Verified',
      desc: 'Catholic brides and grooms across Karnataka dioceses.',
    },
    {
      name: 'Baptist Fellowship',
      code: 'BAPTIST',
      badge: 'Convention & Independent',
      desc: 'Baptist Christian family alliances and church fellowships.',
    },
    {
      name: 'Pentecostal Assembly',
      code: 'PENTECOSTAL',
      badge: 'Assemblies & IPC',
      desc: 'Assemblies of God, IPC, Church of God and Spirit-led fellowships.',
    },
    {
      name: 'Protestant & Other Fellowships',
      code: 'PROTESTANT',
      badge: 'Pan India',
      desc: 'Mar Thoma, Orthodox, Brethren and independent evangelical believers.',
    },
  ];

  return (
    <section id="denominations" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Christian Communities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Browse Profiles by Denomination
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search candidates who share your specific church traditions and family background.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {denominations.map((d) => (
            <Link
              key={d.code}
              href={`/discover?denomination=${d.code}`}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 group card-hover-pro flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                    {d.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {d.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {d.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                <span>View {d.code} Profiles</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
