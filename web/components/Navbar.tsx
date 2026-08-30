'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top micro-bar for trust */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 text-amber-200 text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span>✝ Dedicated to Christian Brides, Grooms & Families in Bidar & Karnataka</span>
        <span className="hidden md:inline text-amber-400">•</span>
        <span className="hidden md:inline">100% Verified Church Profiles</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-700 via-red-800 to-rose-900 text-amber-300 flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-red-900/20 group-hover:scale-105 transition-transform border border-amber-400/40">
            ✝
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-playfair text-xl sm:text-2xl font-extrabold tracking-tight text-red-900 block leading-none">
                Christian<span className="text-amber-600">Matrimony</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block mt-1">
              Bidar • Karnataka • All India
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-700">
          <Link href="/" className="hover:text-red-700 transition-colors">
            Home
          </Link>
          <Link href="/discover" className="hover:text-red-700 transition-colors flex items-center gap-1">
            <span>Search Matches</span>
            <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">LIVE</span>
          </Link>
          <Link href="/#denominations" className="hover:text-red-700 transition-colors">
            Denominations
          </Link>
          <Link href="/#how-it-works" className="hover:text-red-700 transition-colors">
            How It Works
          </Link>
          <Link href="/subscriptions" className="hover:text-red-700 transition-colors">
            Plans
          </Link>
        </nav>

        {/* Right CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/discover"
                className="text-xs font-bold text-red-900 hover:text-red-700 px-3 py-2"
              >
                Browse Matches
              </Link>
              <Link
                href="/verification-status"
                className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 px-3.5 py-2 rounded-full hover:bg-amber-100 transition-all"
              >
                My Profile Status
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 hover:text-red-800 px-3 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-red-900 hover:text-red-700 px-4 py-2 transition-colors"
              >
                Member Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-bold bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-white px-5 py-2.5 rounded-full shadow-md shadow-red-900/20 hover:shadow-lg transition-all flex items-center gap-1.5 border border-amber-300/40"
              >
                <span>Register Free</span>
                <span className="text-amber-300 font-extrabold">→</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            className="p-2 rounded-xl text-red-900 hover:bg-red-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-rose-100 px-6 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-800">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-red-700">
              Home
            </Link>
            <Link href="/discover" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-red-700">
              Search Matches (Live Profiles)
            </Link>
            <Link href="/#denominations" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-red-700">
              Denominations in Bidar & Karnataka
            </Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-red-700">
              How It Works
            </Link>
            <Link href="/subscriptions" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-red-700">
              Membership Plans
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/verification-status"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200"
                >
                  My Profile Status
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-xs font-bold py-2.5 rounded-xl text-red-600 bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold py-2.5 rounded-full border border-red-800 text-red-900"
                >
                  Member Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold py-2.5 rounded-full bg-gradient-to-r from-red-700 to-rose-700 text-white shadow-md"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
