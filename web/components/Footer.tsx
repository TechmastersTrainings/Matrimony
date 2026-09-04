'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-[#f5efe6] text-slate-700 border-t border-[#e2d5c0] pt-7 pb-5 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* Top Header Bar: Logo, Regional Identity & Trust Badges */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-[#ded3be]">
          {/* Brand & Product Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="inline-block group shrink-0">
              <Logo size="sm" lightText={false} showTechmastersTag={false} />
            </Link>

            <span className="hidden sm:inline text-[#c7b9a2]">|</span>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fffdf9] border border-[#d8cab3] text-[11px] text-slate-800 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>
                A <strong className="text-slate-950 font-bold">Techmasters Innovations</strong> Product
              </span>
            </div>

            <span className="hidden sm:inline text-[#c7b9a2]">•</span>

            <div className="text-[11px] text-slate-700 font-medium bg-[#fffdf9] border border-[#d8cab3] px-3 py-1 rounded-full shadow-xs">
              <span>Mailoor Road, Bidar, Karnataka - 585403</span>
            </div>
          </div>

          {/* Trust Value Badges (Zero Emojis, Clean Typography) */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#eaf4ec] border border-[#b8dfbe] text-emerald-900 font-semibold shadow-xs">
              Verified Profiles
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#ebf2f8] border border-[#b9d3eb] text-blue-900 font-semibold shadow-xs">
              Confidential &amp; Safe
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#fbf2e3] border border-[#ecd0a2] text-amber-950 font-semibold shadow-xs">
              Pastoral &amp; Community Verified
            </span>
          </div>
        </div>

        {/* Middle Section: Compact Inline Navigation Bars */}
        <div className="space-y-2.5 py-0.5">
          {/* 1. Denominations (Inline) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs">
            <span className="font-extrabold text-amber-900 uppercase text-[11px] tracking-wider shrink-0 min-w-[130px]">
              Denominations:
            </span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700 font-medium">
              <Link href="/discover?denomination=METHODIST" className="hover:text-amber-900 hover:underline transition-colors">
                Methodist Matrimony (MCI)
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/discover?denomination=CSI" className="hover:text-amber-900 hover:underline transition-colors">
                CSI Christian Matrimony
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/discover?denomination=CATHOLIC" className="hover:text-amber-900 hover:underline transition-colors">
                Roman Catholic Matrimony
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/discover?denomination=BAPTIST" className="hover:text-amber-900 hover:underline transition-colors">
                Baptist Matrimony
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/discover?denomination=PENTECOSTAL" className="hover:text-amber-900 hover:underline transition-colors">
                Pentecostal Matrimony
              </Link>
            </div>
          </div>

          {/* 2. Navigation (Inline) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs">
            <span className="font-extrabold text-blue-950 uppercase text-[11px] tracking-wider shrink-0 min-w-[130px]">
              Navigation:
            </span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700 font-medium">
              <Link href="/about" className="hover:text-blue-900 hover:underline transition-colors font-bold text-slate-900">
                About Us
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/discover" className="hover:text-blue-900 hover:underline transition-colors">
                Search Profiles
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/register" className="hover:text-blue-900 hover:underline transition-colors">
                Register Free
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/subscriptions" className="hover:text-blue-900 hover:underline transition-colors">
                Membership Plans
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/verification-status" className="hover:text-blue-900 hover:underline transition-colors">
                Verification Status
              </Link>
            </div>
          </div>

          {/* 3. Privacy & Support (Inline) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs">
            <span className="font-extrabold text-emerald-950 uppercase text-[11px] tracking-wider shrink-0 min-w-[130px]">
              Privacy &amp; Trust:
            </span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700 font-medium">
              <Link href="/subscriptions" className="hover:text-emerald-900 hover:underline transition-colors">
                Controlled Contact Reveal Policy
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <Link href="/profile/photos" className="hover:text-emerald-900 hover:underline transition-colors">
                Photo Privacy Guidelines
              </Link>
              <span className="text-[#c7b9a2]">•</span>
              <span className="hover:text-emerald-900 hover:underline cursor-pointer transition-colors">
                Terms of Service
              </span>
              <span className="text-[#c7b9a2]">•</span>
              <span className="hover:text-emerald-900 hover:underline cursor-pointer transition-colors">
                Privacy Policy
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Regional Reach */}
        <div className="pt-3.5 border-t border-[#ded3be] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
          <p>
            © 2026 Christian Matrimony • <span className="text-slate-900 font-bold">Techmasters Innovations Private Limited</span>. All rights reserved.
          </p>
          <p className="text-slate-700 font-medium">
            Corporate Office: Mailoor Road, Bidar, Karnataka - 585403
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
