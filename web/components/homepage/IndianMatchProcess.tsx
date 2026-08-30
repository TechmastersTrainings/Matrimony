'use client';

import React from 'react';
import Link from 'next/link';

export function IndianMatchProcess() {
  const steps = [
    {
      num: '1',
      title: 'Register & Add Profile Details',
      desc: 'Provide education, career, denomination, and upload 5+ profile photos for moderation.',
      badge: 'Step 1',
    },
    {
      num: '2',
      title: 'Search & Express Interest',
      desc: 'Browse verified profiles by age, city, and denomination, and express interest.',
      badge: 'Step 2',
    },
    {
      num: '3',
      title: 'Connect with Mutual Consent',
      desc: 'Communicate via in-app chat and securely exchange verified contact numbers when mutually agreed.',
      badge: 'Step 3',
    },
  ];

  return (
    <section id="how-it-works" className="py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How Christian Matrimony Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            An intuitive and transparent workflow for candidates, parents, and families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 card-hover-pro flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    {s.num}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {s.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-700">
                <span>Free Registration</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-white shadow-xl text-center border border-slate-800">
          <div className="max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Begin Your Matrimonial Search Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join Christian Matrimony for verified matrimonial matchmaking across Bidar, Karnataka, and India.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-sm transition-all"
              >
                Register Free Profile
              </Link>
              <Link
                href="/discover"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
              >
                Browse Profiles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
