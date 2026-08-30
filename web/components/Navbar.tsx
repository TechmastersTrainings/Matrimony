'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-3'
          : 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-4 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-md shadow-blue-950/20 border border-blue-700/50">
            <span className="font-extrabold text-amber-400 text-sm tracking-wider">CM</span>
          </div>
          <div className="flex flex-col">
            <span
              className={`font-black text-xl tracking-tight leading-tight transition-colors ${
                scrolled ? 'text-blue-950' : 'text-white'
              }`}
            >
              Christian<span className="text-amber-500">Matrimony</span>
            </span>
            <span className="text-[9px] text-amber-600 font-extrabold tracking-[0.16em] uppercase">
              BIDAR • KARNATAKA • ALL INDIA
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
          <Link
            href="/"
            className={`font-bold text-sm tracking-wide transition-colors duration-200 ${
              scrolled
                ? 'text-slate-700 hover:text-blue-950'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            href="/discover"
            className={`font-bold text-sm tracking-wide transition-colors duration-200 flex items-center gap-1.5 ${
              scrolled
                ? 'text-slate-700 hover:text-blue-950'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            <span>Search Profiles</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              LIVE
            </span>
          </Link>
          <Link
            href="/#denominations"
            className={`font-bold text-sm tracking-wide transition-colors duration-200 ${
              scrolled
                ? 'text-slate-700 hover:text-blue-950'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            Denominations
          </Link>
          <Link
            href="/#journey"
            className={`font-bold text-sm tracking-wide transition-colors duration-200 ${
              scrolled
                ? 'text-slate-700 hover:text-blue-950'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            How It Works
          </Link>
          <Link
            href="/subscriptions"
            className={`font-bold text-sm tracking-wide transition-colors duration-200 ${
              scrolled
                ? 'text-slate-700 hover:text-blue-950'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            Plans
          </Link>
        </nav>

        {/* Right CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/verification-status"
                className={`text-xs font-bold px-4 py-2 rounded-full border transition-all ${
                  scrolled
                    ? 'border-slate-300 text-slate-800 hover:bg-slate-100'
                    : 'border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
              >
                Profile Status
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`font-bold text-sm tracking-wide transition-colors px-3 py-2 ${
                  scrolled
                    ? 'text-slate-700 hover:text-blue-950'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white px-7 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-blue-600/40"
              >
                Register Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className={`p-2 rounded-xl ${scrolled ? 'text-slate-800' : 'text-white'}`}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-4 shadow-2xl text-white">
          <nav className="flex flex-col space-y-3 text-sm font-bold">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
              Home
            </Link>
            <Link href="/discover" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
              Search Profiles
            </Link>
            <Link href="/#denominations" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
              Denominations
            </Link>
            <Link href="/#journey" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
              How It Works
            </Link>
            <Link href="/subscriptions" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
              Plans
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  href="/verification-status"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold py-2.5 rounded-full bg-slate-800 text-white"
                >
                  My Verification Status
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-xs font-bold py-2.5 rounded-full text-red-400 bg-red-950/40"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold py-2.5 rounded-full border border-slate-700 text-slate-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold py-2.5 rounded-full bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md"
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
