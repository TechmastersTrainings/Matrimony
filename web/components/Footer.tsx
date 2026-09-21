'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#080d19] via-[#050811] to-[#020307] text-slate-300 relative overflow-hidden border-t-2 border-slate-800 font-sans">
      {/* Top Colorful Accent Ribbon to Clearly Differentiate the Footer */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 w-full" />

      {/* Warm Ambient Radial Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[220px] bg-gradient-to-b from-amber-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />


      {/* 2. Main Multi-Column Structured Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand, Mission & Corporate Attribution (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-block group">
              <Logo size="md" lightText={true} showTechmastersTag={true} />
            </Link>

            <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed max-w-sm">
              A sacred initiative by <strong className="text-amber-200">Techmasters Innovations Private Limited</strong>, headquartered in Bidar. Safeguarding candidate dignity, pastoral honor, and family privacy at every step.
            </p>

            <div className="space-y-1 text-[11px] text-slate-400 pt-1 break-words">
              <p className="text-slate-300">
                Director: <span className="font-semibold text-white">Mrs. Rekha Sachin Themgyale</span>
              </p>
              <p className="text-slate-300">
                Managing Director: <span className="font-semibold text-white">Mr. Sachin Anil Themgyale</span>
              </p>
            </div>
          </div>

          {/* Column 2: Christian Denominations & Corporate Address / Contacts (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-brand text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800/80 pb-2.5">
              Christian Denominations
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300">
              <li>
                <Link
                  href="/discover?denomination=METHODIST"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Methodist Matrimony (MCI)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?denomination=CSI"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>CSI Christian Matrimony</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?denomination=CATHOLIC"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Roman Catholic Matrimony</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?denomination=BAPTIST"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Baptist Christian Matrimony</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover?denomination=PENTECOSTAL"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Pentecostal &amp; Assemblies</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Mar Thoma &amp; Orthodox Brides/Grooms</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>All Verified Christian Marriages</span>
                </Link>
              </li>
            </ul>

            {/* Shifted toward center below Christian Denominations */}
            <div className="pt-3 mt-3 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400 break-words">
              <p className="text-slate-300 font-medium">
                Corporate Office: Mailoor Road, Bidar, Karnataka - 585403.
              </p>
              <p className="pt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="text-slate-400">Contact:</span>
                <a href="mailto:info@techmastersinnovations.in" className="hover:text-amber-300 transition-colors underline break-all">
                  info@techmastersinnovations.in
                </a>
                <span className="text-slate-500">|</span>
                <a href="mailto:techmastersinnovations@gmail.com" className="hover:text-amber-300 transition-colors underline break-all">
                  techmastersinnovations@gmail.com
                </a>
              </p>
              <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <span className="text-slate-400">Support:</span>
                <a href="mailto:support@techmastersinnovations.in" className="hover:text-amber-300 transition-colors underline break-all">
                  support@techmastersinnovations.in
                </a>
              </p>
            </div>
          </div>

          {/* Column 3: Quick Navigation (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-brand text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800/80 pb-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300">
              <li>
                <Link
                  href="/discover"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Search Profiles</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-amber-400 hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2 font-bold"
                >
                  <span className="text-orange-400 text-xs font-bold">›</span>
                  <span>Register Free</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/subscriptions"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Membership Plans</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/verification-status"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Verification Status</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/interests"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Interests &amp; Matches</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Member Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>About Shalom</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Family FAQs</span>
                </Link>
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
                <Link
                  href="/subscriptions"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2 text-slate-200 font-medium"
                >
                  <span className="text-emerald-400 text-xs font-bold">✓</span>
                  <span>Mutual Consent Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profile/photos"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-emerald-400 text-xs font-bold">✓</span>
                  <span>Photo Privacy &amp; Discretion</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Refund &amp; Cancellation Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/verification-status"
                  className="hover:text-amber-300 hover:translate-x-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="text-amber-400 text-xs font-bold">›</span>
                  <span>Church &amp; Pastoral Verification</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal, Copyright & Regional Reach */}
      <div
        className="border-t border-rose-950/60 relative z-10 py-5 sm:py-6 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: "url('/images/footer-bottom-bg.png')" }}
      >
        {/* Subtle dark tint overlay for enhanced text readability */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-200 text-center md:text-left relative z-10">
          <div className="space-y-1">
            <p className="leading-relaxed">
              © 2026 <strong className="text-amber-300 font-bold">Techmasters Innovations Pvt. Ltd.</strong> All rights reserved.
            </p>
            <p className="text-[11px] text-rose-100/80">
              Shalom • A sacred initiative headquartered in Bidar.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-slate-200">
            <Link href="/privacy" className="hover:text-amber-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-rose-300/40">|</span>
            <Link href="/terms" className="hover:text-amber-300 transition-colors">
              Terms of Service
            </Link>
            <span className="text-rose-300/40">|</span>
            <Link href="/refund-policy" className="hover:text-amber-300 transition-colors">
              Refund &amp; Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
