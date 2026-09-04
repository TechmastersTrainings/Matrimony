'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { TechmastersTopBanner } from './TechmastersTopBanner';

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
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {/* Top Banner: Techmasters Innovations Attribution */}
      <TechmastersTopBanner />

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-md shadow-xl border-b border-slate-800 py-3'
            : 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-3.5 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="group">
            <Logo size="md" showTechmastersTag={true} />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <Link
              href="/"
              className={`font-bold text-xs tracking-wide transition-colors ${
                pathname === '/' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              href="/discover"
              className={`font-bold text-xs tracking-wide transition-colors ${
                pathname === '/discover' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Search Profiles
            </Link>

            <Link
              href="/subscriptions"
              className={`font-bold text-xs tracking-wide transition-colors ${
                pathname === '/subscriptions' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
              }`}
            >
              Subscription Plans
            </Link>

            {isAuthenticated && (
              <Link
                href="/interests"
                className={`font-bold text-xs tracking-wide transition-colors ${
                  pathname === '/interests' ? 'text-amber-400' : 'text-slate-300 hover:text-white'
                }`}
              >
                Interests &amp; Matches
              </Link>
            )}
          </nav>

          {/* Right CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-xs font-extrabold px-4 py-2 rounded-xl transition-all border ${
                    pathname === '/dashboard'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-400'
                  }`}
                >
                  My Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-slate-400 hover:text-red-400 px-3 py-2 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-bold text-xs text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wider shadow-lg shadow-amber-950/40 transition-all transform hover:-translate-y-0.5"
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
              className="p-2 rounded-xl text-white hover:text-amber-400"
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
            <Link href="/subscriptions" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
              Subscription Plans
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
                  My Dashboard
                </Link>
                <Link href="/interests" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
                  Interests &amp; Matches
                </Link>
                <Link href="/profile/photos" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">
                  Manage Photos (5+)
                </Link>
              </>
            )}
          </nav>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center text-xs font-bold py-2.5 rounded-xl text-red-400 bg-red-950/40"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold py-2.5 rounded-xl border border-slate-700 text-slate-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md"
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
