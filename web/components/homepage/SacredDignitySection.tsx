'use client';

import React from 'react';

export function SacredDignitySection() {
  return (
    <section className="py-20 bg-[#fdfbf7] text-[#1e1b18] relative overflow-hidden border-t border-[#ece2d1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Reverence, Privacy &amp; Family Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-brand">
            Protecting the Sanctity of Your Matrimonial Journey
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            We honor your family’s privacy with sacred discretion. Your personal details are never treated casually or exposed publicly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-white border border-[#ece2d1] hover:border-burgundy-200 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center font-mono text-xs font-bold text-burgundy-800">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 font-brand">Private &amp; Confidential</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Profiles are protected behind secure member access. Contact numbers and sensitive personal data are never displayed to casual visitors.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#ece2d1] hover:border-burgundy-200 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center font-mono text-xs font-bold text-gold-800">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 font-brand">Family &amp; Guardian Driven</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Parents and guardians can actively support and manage profiles with full transparency, fostering respectful conversations between families.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white border border-[#ece2d1] hover:border-burgundy-200 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-mono text-xs font-bold text-emerald-800">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 font-brand">Dedicated Solely to Marriage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our platform is purpose-built exclusively for holy Christian matrimony. We do not support casual dating, maintaining an atmosphere of solemn purpose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SacredDignitySection;
