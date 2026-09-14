'use client';

import React from 'react';
import Link from 'next/link';

export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Sacred Profile Free',
      subtitle: 'Faith, Parish & Family Values',
      description:
        'Share your testimony, baptism details, church parish, education, and career. Your phone number and sensitive contact details remain strictly locked under privacy protection.',
      image: '/images/christian-wedding-rings-bible.jpg',
      badge: 'Step 1 • Free Registration',
      badgeColor: 'text-orange-900 bg-orange-100 border-orange-200',
    },
    {
      num: '02',
      title: 'Discover & Express Holy Interest',
      subtitle: 'Denomination & Value Alignment',
      description:
        'Search genuine, verified Christian profiles filtered by denomination (Methodist, CSI, Catholic, Baptist, Pentecostal). Send prayerful matrimonial interests without awkwardness.',
      image: '/images/christian-wedding-vows-rings.jpg',
      badge: 'Step 2 • Prayerful Matching',
      badgeColor: 'text-cyan-900 bg-cyan-100 border-cyan-200',
    },
    {
      num: '03',
      title: 'Mutual Consent & Blessed Union',
      subtitle: 'Family & Pastoral Blessing',
      description:
        'When interest is mutually accepted, verified family phone numbers and complete background are unlocked. Families meet, pray together, and proceed toward holy matrimony.',
      image: '/images/christian-church-altar-wedding.jpg',
      badge: 'Step 3 • Holy Covenant',
      badgeColor: 'text-emerald-900 bg-emerald-100 border-emerald-200',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] border-b border-charcoal-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-950">
            <span>🕊️</span>
            <span>3 Simple, Reverent Steps</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-brand">
            How Covenant Nest Works
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            A dignified, faith-centered path connecting Christian brides, grooms, and prayerful families across India.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-charcoal-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Step Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Step Number Tag */}
                <div className="absolute top-3 left-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 font-mono font-black text-sm flex items-center justify-center border border-amber-400/40 shadow-xs">
                    {s.num}
                  </span>
                </div>

                {/* Badge Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${s.badgeColor} shadow-xs`}>
                    {s.badge}
                  </span>
                </div>
              </div>

              {/* Step Text Body */}
              <div className="p-5 sm:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {s.subtitle}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-brand mt-1 group-hover:text-cyan-900 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    {s.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="text-emerald-700">✓ 100% Family Safe</span>
                  <span className="text-slate-400 font-mono">Step {s.num} of 3</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Bar */}
        <div className="mt-10 sm:mt-12 bg-gradient-to-r from-orange-50 via-amber-50 to-cyan-50 border border-orange-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 font-brand">
              Ready to begin your prayerful matrimonial journey?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Create your profile in under 3 minutes. Zero registration fee.
            </p>
          </div>
          <Link
            href="/register"
            className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <span>Register Profile Free</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
