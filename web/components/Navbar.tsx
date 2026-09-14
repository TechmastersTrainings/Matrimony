'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(!!token);
      const role = localStorage.getItem('user_role');
      setIsAdmin(role === 'SUPER_ADMIN' || role === 'ADMIN');
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
    <header className="fixed top-0 w-full z-50 transition-all duration-300 font-sans">
      {/* Top Hairline Accent Ribbon */}
      <div className="h-[2px] bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 w-full" />

      {/* Main Navbar Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#fdfbf7]/95 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-b border-[#e8dfd3] py-2.5 sm:py-3'
            : 'bg-[#fdfbf7]/85 backdrop-blur-lg border-b border-[#ece2d1]/80 py-3 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="group shrink-0">
            <Logo size="md" showTechmastersTag={true} lightText={false} />
          </Link>

          {/* Center Navigation Links - Floating Glassmorphic Pill Cluster */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 px-2.5 xl:px-3 py-1.5 rounded-full bg-stone-100/70 border border-stone-200/60 backdrop-blur-md shadow-2xs">
            <Link
              href="/"
              className={`text-[11px] xl:text-xs font-semibold px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-white text-burgundy-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              Home
            </Link>

            <Link
              href="/discover"
              className={`text-[11px] xl:text-xs font-semibold px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                pathname === '/discover'
                  ? 'bg-white text-burgundy-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Profiles</span>
            </Link>

            <Link
              href="/subscriptions"
              className={`text-[11px] xl:text-xs font-semibold px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 ${
                pathname === '/subscriptions'
                  ? 'bg-white text-burgundy-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              Subscription Plans
            </Link>

            <Link
              href="/about"
              className={`text-[11px] xl:text-xs font-semibold px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 ${
                pathname === '/about'
                  ? 'bg-white text-burgundy-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              About
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/interests"
                  className={`text-[11px] xl:text-xs font-semibold px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 ${
                    pathname === '/interests'
                      ? 'bg-white text-burgundy-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`}
                >
                  Interests &amp; Matches
                </Link>

                <Link
                  href="/dashboard"
                  className={`text-[11px] xl:text-xs font-semibold px-2.5 xl:px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                    pathname === '/dashboard'
                      ? 'bg-white text-burgundy-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>My Dashboard</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {isAdmin && (
              <Link
                href="/admin"
                className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700/80 shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin Console</span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-rose-700 px-3.5 py-1.5 rounded-full bg-stone-100/80 hover:bg-rose-50 border border-stone-200/80 hover:border-rose-200 transition-all duration-200 shadow-2xs"
              >
                <svg className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-stone-700 hover:text-burgundy-900 px-3.5 py-2 rounded-full hover:bg-stone-100/70 transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-1.5 bg-gradient-to-r from-[#691122] via-[#85162f] to-[#aa1e3d] hover:from-[#570d1b] hover:to-[#921733] text-white px-5 py-2 rounded-full font-extrabold text-xs tracking-wide shadow-md shadow-rose-950/20 border border-rose-400/30 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span>Register Free</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-full bg-stone-100/80 border border-stone-200/80 text-stone-800 hover:text-burgundy-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fdfbf7]/98 backdrop-blur-xl border-b border-[#ece2d1] px-5 py-5 space-y-4 shadow-xl text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1.5 text-xs font-bold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-stone-800 hover:bg-stone-100/80 hover:text-burgundy-800 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-stone-800 hover:bg-stone-100/80 hover:text-burgundy-800 transition-colors flex items-center justify-between"
            >
              <span>Search Profiles</span>
              <span className="text-xs text-stone-400">›</span>
            </Link>
            <Link
              href="/subscriptions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-stone-800 hover:bg-stone-100/80 hover:text-burgundy-800 transition-colors flex items-center justify-between"
            >
              <span>Subscription Plans</span>
              <span className="text-xs text-stone-400">›</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3.5 py-2 rounded-xl text-stone-800 hover:bg-stone-100/80 hover:text-burgundy-800 transition-colors flex items-center justify-between"
            >
              <span>About CovenantNest</span>
              <span className="text-xs text-stone-400">›</span>
            </Link>

            {isAuthenticated && (
              <>
                <div className="pt-2 pb-1 text-[10px] uppercase font-bold text-stone-400 px-3.5 tracking-wider">
                  Member Portal
                </div>
                <Link
                  href="/interests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-stone-800 hover:bg-stone-100/80 hover:text-burgundy-800 transition-colors flex items-center justify-between"
                >
                  <span>Interests &amp; Matches</span>
                  <span className="text-xs text-stone-400">›</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-stone-800 hover:bg-stone-100/80 hover:text-burgundy-800 transition-colors flex items-center justify-between"
                >
                  <span>My Dashboard</span>
                  <span className="text-xs text-stone-400">›</span>
                </Link>
                <Link
                  href="/profile/photos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-stone-800 hover:bg-stone-100/80 hover:text-burgundy-800 transition-colors"
                >
                  Manage Photos (5+)
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-amber-300 font-extrabold flex items-center gap-2 border border-slate-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Admin Portal</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="pt-3 border-t border-[#ece2d1] flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center text-xs font-bold py-2.5 rounded-full text-rose-700 bg-rose-50 border border-rose-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold py-2.5 rounded-full border border-stone-300 text-stone-800 bg-white shadow-2xs"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-bold py-2.5 rounded-full bg-gradient-to-r from-[#691122] via-[#85162f] to-[#aa1e3d] text-white shadow-md shadow-rose-950/20"
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
