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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Professional Micro Header */}
      <div className="bg-slate-900 text-slate-300 text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>Trusted Matrimonial Platform for Christian Families | Bidar, Karnataka</span>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span>Verified Profiles</span>
            <span>•</span>
            <span>Confidential & Secure</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            CM
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">
              Christian<span className="text-blue-700">Matrimony</span>
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block mt-1">
              Bidar • Karnataka • Pan India
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          <Link href="/" className="hover:text-blue-700 transition-colors">
            Home
          </Link>
          <Link href="/discover" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
            <span>Search Profiles</span>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
              Active
            </span>
          </Link>
          <Link href="/#denominations" className="hover:text-blue-700 transition-colors">
            Denominations
          </Link>
          <Link href="/#how-it-works" className="hover:text-blue-700 transition-colors">
            How It Works
          </Link>
          <Link href="/subscriptions" className="hover:text-blue-700 transition-colors">
            Membership Plans
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/discover"
                className="text-xs font-semibold text-slate-700 hover:text-blue-700 px-3 py-2"
              >
                Browse Matches
              </Link>
              <Link
                href="/verification-status"
                className="text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 px-3.5 py-2 rounded-lg hover:bg-slate-200 transition-all"
              >
                My Verification Status
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-slate-600 hover:text-red-600 px-3 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-blue-700 px-3.5 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg shadow-xs transition-all"
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
            aria-label="Open menu"
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
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
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 shadow-lg">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-800">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-blue-700">
              Home
            </Link>
            <Link href="/discover" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-blue-700">
              Search Profiles
            </Link>
            <Link href="/#denominations" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-blue-700">
              Denominations
            </Link>
            <Link href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-blue-700">
              How It Works
            </Link>
            <Link href="/subscriptions" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-blue-700">
              Membership Plans
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/verification-status"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-semibold py-2.5 rounded-lg bg-slate-100 text-slate-800"
                >
                  My Verification Status
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-xs font-semibold py-2.5 rounded-lg text-red-600 bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold py-2.5 rounded-lg border border-slate-300 text-slate-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold py-2.5 rounded-lg bg-blue-700 text-white"
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
