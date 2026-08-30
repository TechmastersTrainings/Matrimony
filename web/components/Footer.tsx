import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#17202A] text-stone-300 border-t border-[#172554] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#172554] text-[#C9A227] flex items-center justify-center font-serif text-sm font-bold border border-[#C9A227]/40">
                ✝
              </div>
              <span className="font-serif-heading text-lg font-bold text-white tracking-tight">
                Christian Matrimony
              </span>
            </div>

            <p className="text-stone-400 max-w-sm leading-relaxed text-xs">
              A trusted, faith-centered matrimonial platform dedicated to connecting Christian brides, grooms, and families with prayer, integrity, and privacy.
            </p>

            <p className="text-[11px] text-stone-500">
              Initially serving <strong>Bidar, Karnataka</strong> and extending across Christian communities in India.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#C9A227]">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#success-stories" className="hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="hover:text-white transition-colors">
                  Membership Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Safety */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#C9A227]">
              Support & Safety
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-stone-400">Help Center (Bidar)</span>
              </li>
              <li>
                <span className="text-stone-400">Pastoral Support</span>
              </li>
              <li>
                <span className="text-stone-400">Safety & Trust Guidelines</span>
              </li>
              <li>
                <Link href="/verification-status" className="hover:text-white transition-colors">
                  Verification Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#C9A227]">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-stone-400">Terms of Service</span>
              </li>
              <li>
                <span className="text-stone-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-stone-400">Contact Reveal Policy</span>
              </li>
              <li>
                <span className="text-stone-400">Refund Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© 2026 Christian Matrimony. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Faith • Love • Commitment</span>
            <span>Made with Prayer for Christian Families</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
