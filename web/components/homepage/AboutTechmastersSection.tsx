'use client';

import React from 'react';
import Link from 'next/link';

export function AboutTechmastersSection() {
  return (
    <section id="about" className="py-8 sm:py-10 bg-[#fdfbf7] text-[#1e1b18] border-t border-charcoal-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
            <span>About Us &amp; Engineering Backbone</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-brand">
            Our Purpose &amp; Technology Partnership
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Dedicated Christian matrimony engineered with sacred reverence and enterprise data security.
          </p>
        </div>

        {/* 2-Column Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          {/* Column 1: The Christian Matrimony Mission */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-charcoal-200/80 flex flex-col justify-between space-y-4 shadow-2xs hover:border-cyan-300 transition-all">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-800 uppercase tracking-widest block">
                Matrimonial Sanctuary
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-brand">
                Faith-Centered Marriages for the Christian Community
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CovenantNest provides Christian brides, bridegrooms, and prayerful families with a safe, confidential, and honorable environment to seek God&apos;s ordained life partner across Methodist (MCI), CSI, Roman Catholic, Baptist, and Pentecostal fellowships.
              </p>
            </div>

            <div className="pt-3 border-t border-charcoal-100 grid grid-cols-2 gap-3 text-left">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
                <span className="block text-base font-extrabold text-emerald-950 font-brand">100% Private</span>
                <span className="text-xs text-emerald-800 font-medium">Zero public search leakage</span>
              </div>
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3">
                <span className="block text-base font-extrabold text-orange-950 font-brand">Family Reverence</span>
                <span className="text-xs text-orange-800 font-medium">Pastoral &amp; parental honor</span>
              </div>
            </div>
          </div>

          {/* Column 2: Techmasters Innovations Private Limited */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-charcoal-200/80 flex flex-col justify-between space-y-4 shadow-2xs hover:border-orange-300 transition-all">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-950">
                <span>Enterprise Engineering Backbone</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-brand">
                Techmasters Innovations Private Limited
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                This matrimonial platform is engineered, maintained, and secured by <strong>Techmasters Innovations Private Limited</strong>, a premier software engineering firm and advanced technology training institute headquartered in Bidar, Karnataka.
              </p>
            </div>

            {/* Corporate Details Box */}
            <div className="p-3.5 rounded-xl bg-orange-50/40 border border-orange-200/60 space-y-2 text-xs sm:text-sm">
              <div className="text-slate-700 leading-snug">
                <strong className="text-slate-950 font-bold block mb-0.5">Campus &amp; Registered Office:</strong>
                1st Floor, Near GNDEC, Mailoor Road, Bidar, Karnataka - 585403
              </div>
              <div className="pt-2 border-t border-orange-200/40 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-600">
                <a
                  href="https://techmastersinnovations.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-900 hover:text-cyan-950 font-bold underline"
                >
                  techmastersinnovations.in
                </a>
                <span>info@techmastersinnovations.in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutTechmastersSection;
