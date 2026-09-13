'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#faf6ee] via-[#f7f2e7] to-[#ede4d3] text-slate-700 border-t border-[#ded3be] text-xs font-sans">
      {/* 1. Main Multi-Column Structured Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          {/* Column 1: Brand, Purpose & Corporate Identity (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <Logo size="md" lightText={false} showTechmastersTag={true} />
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              A reverent Christian matrimonial sanctuary where holy covenants build blessed homes. Safeguarding candidate dignity, pastoral honor, and family privacy at every step.
            </p>

            {/* Corporate Attribution Card */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#e2d5c0] space-y-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  Enterprise Engineering Backbone
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Engineered and maintained by <strong className="text-slate-900 font-bold">Techmasters Innovations Private Limited</strong>.
              </p>
              <div className="pt-1.5 border-t border-[#ece2d1] text-[11px] text-slate-500 space-y-0.5">
                <p>📍 Mailoor Road, Bidar, Karnataka - 585403</p>
                <p>
                  ✉️{' '}
                  <a
                    href="mailto:info@techmastersinnovations.in"
                    className="text-cyan-900 hover:underline font-semibold"
                  >
                    info@techmastersinnovations.in
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: Christian Denominations (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-brand text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-[#e2d5c0] pb-2">
              Christian Denominations
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link
                  href="/discover?denomination=METHODIST"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Methodist Matrimony (MCI)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?denomination=CSI"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>CSI Christian Matrimony</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?denomination=CATHOLIC"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Roman Catholic Matrimony</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?denomination=BAPTIST"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Baptist Christian Matrimony</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?denomination=PENTECOSTAL"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Pentecostal &amp; Fellowships</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Mar Thoma &amp; Orthodox Brides/Grooms</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>All Pan-India Christian Marriages</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-brand text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-[#e2d5c0] pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link
                  href="/discover"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Search Profiles</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5 font-bold text-slate-900"
                >
                  <span className="text-orange-600 text-[10px]">›</span>
                  <span>Register Free</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/subscriptions"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Membership Plans</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/verification-status"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Verification Status</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/interests"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Interests &amp; Matches</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Member Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>About CovenantNest</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Privacy, Trust & Legal (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-brand text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-[#e2d5c0] pb-2">
              Privacy, Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link
                  href="/subscriptions"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5 font-semibold text-slate-800"
                >
                  <span className="text-emerald-700 text-[10px]">✓</span>
                  <span>Mutual Consent Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/photos"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-emerald-700 text-[10px]">✓</span>
                  <span>Photo Privacy &amp; Discretion</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-cyan-900 hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-cyan-700 text-[10px]">›</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Bottom Legal, Copyright & Regional Reach */}
      <div className="border-t border-[#ded3be] bg-[#f2e9db]/90 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] text-slate-600 text-center sm:text-left">
          <p>
            © 2026 CovenantNest • Official Product of{' '}
            <strong className="text-slate-900 font-bold">Techmasters Innovations Private Limited</strong>. All rights reserved.
          </p>

          <p className="text-slate-600 font-medium">
            Serving Christian Families across Bidar, Bengaluru, Kalaburagi, Hyderabad &amp; Pan-India.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
