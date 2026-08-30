'use client';

import React from 'react';
import Link from 'next/link';

export function IndianMatchProcess() {
  const steps = [
    {
      num: '1',
      title: 'Register Free & Add Photos',
      desc: 'Fill basic details, Christian denomination, church background, and upload 5+ photos.',
      badge: 'Step 1',
    },
    {
      num: '2',
      title: 'Find Matches & Send Interest',
      desc: 'Filter by age, city, and denomination. Express interest with mutual respect.',
      badge: 'Step 2',
    },
    {
      num: '3',
      title: 'Connect & Involve Families',
      desc: 'Chat in-app, reveal verified contact details with mutual consent, and arrange family meetings.',
      badge: 'Step 3',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-b from-white to-amber-50/50 border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-700 bg-red-100 px-3.5 py-1 rounded-full">
            Simple 3-Step Journey
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-extrabold text-red-950 mt-3 tracking-tight">
            How Christian Matrimony Works
          </h2>
          <p className="text-sm text-slate-600 mt-2 font-medium">
            Designed for ease of use by candidates, parents, and elder relatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border-2 border-rose-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 card-hover-indian relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-700 to-rose-900 text-amber-300 flex items-center justify-center font-playfair text-xl font-bold shadow-md">
                    {s.num}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {s.badge}
                  </span>
                </div>

                <h3 className="font-playfair text-lg font-bold text-red-950 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-red-800">
                <span>Free & Safe</span>
              </div>
            </div>
          ))}
        </div>

        {/* Large Indian Matrimonial Bottom Callout Banner */}
        <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center border-2 border-amber-400/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="text-4xl block">✝</span>
            <h3 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Soulmate Could Be Waiting
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 font-medium leading-relaxed">
              Join Christian Matrimony today. Free registration for Christian candidates & families in Bidar, Karnataka, and across India.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-sm shadow-lg transition-all"
              >
                Register Free Today →
              </Link>
              <Link
                href="/discover"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
              >
                Browse Matches
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
