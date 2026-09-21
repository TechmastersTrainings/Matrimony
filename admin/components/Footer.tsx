'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  const mainSiteUrl = 'https://covenantnest.techmaster.space';

  return (
    <footer className="bg-gradient-to-b from-[#080d19] via-[#050811] to-[#020307] text-slate-300 relative overflow-hidden border-t-2 border-slate-800 font-sans">
      {/* Top Colorful Accent Ribbon to Clearly Differentiate the Footer */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 w-full" />

      {/* Warm Ambient Radial Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[220px] bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 2. Main Multi-Column Structured Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand, Mission & Corporate Attribution (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/dashboard" className="inline-block group">
              <Logo size="md" lightText={true} showTechmastersTag={true} />
            </Link>

            <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed max-w-sm">
              Administrative Command Center &amp; Pastoral Moderation Gateway for Shalom Christian Matrimony. Dedicated to candidate dignity, church verification, and family privacy.
            </p>

            <p className="text-[11px] text-slate-400 pt-1">
              Headquartered in Bidar, Karnataka • Techmasters Innovations Enterprise Infrastructure.
            </p>
          </div>

          {/* Column 2: Christian Denominations (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-brand text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800/80 pb-2.5">
              Christian Denominations
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300">
              <li>
                <a
                  href={`${mainSiteUrl}/discover?denomination=METHODIST`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Methodist Matrimony (MCI)</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/discover?denomination=CSI`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>CSI Christian Matrimony</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/discover?denomination=CATHOLIC`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Roman Catholic Matrimony</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/discover?denomination=BAPTIST`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Baptist Christian Matrimony</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/discover?denomination=PENTECOSTAL`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Pentecostal &amp; Assemblies</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/discover`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Mar Thoma &amp; Orthodox Brides/Grooms</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/discover`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>All Verified Christian Marriages</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-brand text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800/80 pb-2.5">
              Admin &amp; Portal Nav
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Admin Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profiles"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Candidate Moderation</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/users"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>User Directory</span>
                </Link>
              </li>
              <li>
                <a
                  href={mainSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2 font-bold"
                >
                  <span className="text-orange-400 text-xs font-bold">›</span>
                  <span>Main Web Portal</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/subscriptions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Subscription Plans</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/about`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>About Shalom</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Privacy, Trust & Legal (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-brand text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800/80 pb-2.5">
              Privacy, Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300">
              <li>
                <a
                  href={`${mainSiteUrl}/subscriptions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2 text-slate-200 font-medium"
                >
                  <span className="text-emerald-400 text-xs font-bold">✓</span>
                  <span>Mutual Consent Policy</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/profile/photos`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-emerald-400 text-xs font-bold">✓</span>
                  <span>Photo Privacy &amp; Discretion</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/terms`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Terms of Service</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/privacy`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href={`${mainSiteUrl}/verification-status`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Church Verification Policy</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal, Copyright & Regional Reach */}
      <div className="border-t border-slate-800/80 bg-[#03060d] py-5 sm:py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-400 text-center md:text-left">
          <p className="leading-relaxed">
            © 2026 Shalom • Official Product of{' '}
            <strong className="text-amber-300 font-bold">Techmasters Innovations Private Limited</strong>. All rights reserved.
          </p>

          <p className="text-slate-400 font-medium leading-relaxed">
            Serving Christian Families across Bidar, Bengaluru, Kalaburagi, Hyderabad &amp; beyond.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
