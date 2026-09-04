'use client';

import React from 'react';
import Link from 'next/link';

export function AboutTechmastersSection() {
  return (
    <section id="about" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/50 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>About Us &amp; Organization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Our Purpose &amp; Technology Partnership
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            A dedicated matrimonial platform engineered with sacred reverence, modern data privacy, and community commitment.
          </p>
        </div>

        {/* Main Content: 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Column 1: The Christian Matrimony Mission */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                The Matrimonial Mission
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Dignified, Faith-Centered Marriages for the Christian Community
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Christian Matrimony was conceived to provide Christian brides, bridegrooms, and prayerful families with a safe, confidential, and honorable environment to seek God&apos;s ordained life partner.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Unlike generic matrimonial sites that expose personal profiles to the public internet, our platform operates with complete privacy. Profiles, contact numbers, and family backgrounds are safeguarded behind strict member verification, fostering solemn conversations between families across Methodist (MCI), CSI, Roman Catholic, Baptist, Pentecostal, and Christian evangelical fellowships.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-white">100% Private</span>
                <span className="text-[11px] text-slate-400">Zero public internet leakage</span>
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-extrabold text-white">Family-First</span>
                <span className="text-[11px] text-slate-400">Pastoral &amp; parental honor</span>
              </div>
            </div>
          </div>

          {/* Column 2: Techmasters Innovations Private Limited */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900/80 to-slate-900/60 border border-blue-900/50 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-[11px] font-bold text-blue-300">
                <span>Enterprise Engineering Backbone</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Techmasters Innovations Private Limited
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                This matrimonial platform is engineered, maintained, and secured by <strong>Techmasters Innovations Private Limited</strong>, a premier software engineering firm and advanced technology training institute headquartered in Bidar, Karnataka.
              </p>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Techmasters Innovations bridges the gap between enterprise software engineering and technical talent development, delivering custom web architectures, cloud DevOps, and artificial intelligence solutions for global businesses while nurturing engineering talent across Karnataka.
              </p>
            </div>

            {/* Corporate Details Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-300">
                <strong className="text-white block mb-0.5">Corporate Campus &amp; Registered Office:</strong>
                1st Floor, Near Guru Nanak Dev Engg College, Mailoor Road, Bidar, Karnataka - 585403
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>
                  Official Website:{' '}
                  <a
                    href="https://techmastersinnovations.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 font-semibold underline"
                  >
                    techmastersinnovations.in
                  </a>
                </span>
                <span>Inquiries: info@techmastersinnovations.in</span>
              </div>
            </div>

            {/* Action Link */}
            <div className="pt-2">
              <a
                href="https://techmastersinnovations.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Learn more about Techmasters Innovations</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutTechmastersSection;
