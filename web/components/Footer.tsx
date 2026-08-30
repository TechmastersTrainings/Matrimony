import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-red-950 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-800 text-amber-300 flex items-center justify-center font-serif text-lg font-bold border border-amber-400/40">
                ✝
              </div>
              <span className="font-playfair text-xl font-extrabold text-white tracking-tight">
                Christian<span className="text-amber-500">Matrimony</span>
              </span>
            </div>

            <p className="text-slate-400 max-w-sm leading-relaxed text-xs font-medium">
              India&apos;s dedicated matrimonial portal connecting Christian brides, grooms and families with faith, privacy, and prayer.
            </p>

            <div className="text-[11px] text-slate-500 space-y-1">
              <p>📍 Regional Head Office: <strong>Bidar, Karnataka - 585401</strong></p>
              <p>Serving: <strong>Bidar • Bengaluru • Kalaburagi • Hyderabad • South India</strong></p>
            </div>
          </div>

          {/* Denominations */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-amber-400">
              Denominations
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <Link href="/discover?denomination=METHODIST" className="hover:text-amber-300 transition-colors">
                  Methodist Matrimony (MCI)
                </Link>
              </li>
              <li>
                <Link href="/discover?denomination=CSI" className="hover:text-amber-300 transition-colors">
                  CSI Christian Matrimony
                </Link>
              </li>
              <li>
                <Link href="/discover?denomination=CATHOLIC" className="hover:text-amber-300 transition-colors">
                  Roman Catholic Matrimony
                </Link>
              </li>
              <li>
                <Link href="/discover?denomination=BAPTIST" className="hover:text-amber-300 transition-colors">
                  Baptist Matrimony
                </Link>
              </li>
              <li>
                <Link href="/discover?denomination=PENTECOSTAL" className="hover:text-amber-300 transition-colors">
                  Pentecostal Matrimony
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-amber-400">
              Explore
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <Link href="/discover" className="hover:text-amber-300 transition-colors">
                  Search Matches
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-amber-300 transition-colors">
                  Register Free
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="hover:text-amber-300 transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/verification-status" className="hover:text-amber-300 transition-colors">
                  Verification Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white uppercase text-[11px] tracking-wider text-amber-400">
              Help & Trust
            </h4>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <span>Controlled Contact Reveal Policy</span>
              </li>
              <li>
                <span>Photo Privacy Guidelines</span>
              </li>
              <li>
                <span>Terms of Service</span>
              </li>
              <li>
                <span>Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>© 2026 Christian Matrimony. Built for Christian Families across India.</p>
          <div className="flex items-center gap-4 text-amber-400/80">
            <span>✝ Faith • Family • Commitment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
