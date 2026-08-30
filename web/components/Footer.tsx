import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-14 pb-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                CM
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Christian<span className="text-blue-500">Matrimony</span>
              </span>
            </div>

            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Dedicated matrimonial portal connecting Christian brides, grooms, and families with verified credentials and confidential communication.
            </p>

            <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
              <p>Regional Office: Bidar, Karnataka - 585401</p>
              <p>Serving: Bidar, Bengaluru, Kalaburagi, Hyderabad, and Pan India</p>
            </div>
          </div>

          {/* Denominations */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Denominations
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/discover?denomination=METHODIST" className="hover:text-white transition-colors">
                  Methodist Matrimony (MCI)
                </Link>
              </li>
              <li>
                <Link href="/discover?denomination=CSI" className="hover:text-white transition-colors">
                  CSI Christian Matrimony
                </Link>
              </li>
              <li>
                <Link href="/discover?denomination=CATHOLIC" className="hover:text-white transition-colors">
                  Roman Catholic Matrimony
                </Link>
              </li>
              <li>
                <Link href="/discover?denomination=BAPTIST" className="hover:text-white transition-colors">
                  Baptist Matrimony
                </Link>
              </li>
              <li>
                <Link href="/discover?denomination=PENTECOSTAL" className="hover:text-white transition-colors">
                  Pentecostal Matrimony
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Search Profiles
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Register Free
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="hover:text-white transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link href="/verification-status" className="hover:text-white transition-colors">
                  Verification Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Privacy & Support
            </h4>
            <ul className="space-y-1.5 text-slate-400">
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
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Christian Matrimony. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Verified • Confidential • Family Centered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
