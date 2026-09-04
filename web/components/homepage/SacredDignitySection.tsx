'use client';

import React from 'react';

export function SacredDignitySection() {
  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Reverence, Privacy &amp; Family Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Protecting the Sanctity of Your Matrimonial Journey
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            We honor your family’s privacy with sacred discretion. Your personal details are never treated casually or exposed publicly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center font-mono text-xs font-bold text-emerald-400">
              01
            </div>
            <h3 className="text-base font-bold text-white">Private &amp; Confidential</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Profiles are protected behind secure member access. Contact numbers and sensitive personal data are never displayed to casual visitors.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center font-mono text-xs font-bold text-blue-400">
              02
            </div>
            <h3 className="text-base font-bold text-white">Family &amp; Guardian Driven</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Parents and guardians can actively support and manage profiles with full transparency, fostering respectful conversations between families.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center font-mono text-xs font-bold text-amber-400">
              03
            </div>
            <h3 className="text-base font-bold text-white">Dedicated Solely to Marriage</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our platform is purpose-built exclusively for holy Christian matrimony. We do not support casual dating, maintaining an atmosphere of solemn purpose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SacredDignitySection;
