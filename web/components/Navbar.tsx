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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2E8F0] py-3'
          : 'bg-[#FAF9F6] border-b border-[#E2E8F0]/60 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#172554] text-[#C9A227] flex items-center justify-center font-serif text-lg font-bold shadow-sm group-hover:scale-105 transition-transform border border-[#C9A227]/30">
            ✝
          </div>
          <div>
            <span className="font-serif-heading text-lg sm:text-xl font-bold tracking-tight text-[#172554] block leading-none">
              Christian Matrimony
            </span>
            <span className="text-[10px] text-[#64748B] font-medium tracking-wider uppercase block mt-1">
              Faith • Love • Commitment
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#17202A]/80">
          <Link href="/" className="hover:text-[#1D4ED8] transition-colors">
            Home
          </Link>
          <Link href="/#how-it-works" className="hover:text-[#1D4ED8] transition-colors">
            How It Works
          </Link>
          <Link href="/#success-stories" className="hover:text-[#1D4ED8] transition-colors">
            Success Stories
          </Link>
          <Link href="/discover" className="hover:text-[#1D4ED8] transition-colors">
            Discover
          </Link>
          <Link href="/subscriptions" className="hover:text-[#1D4ED8] transition-colors">
            Plans
          </Link>
        </nav>

        {/* Right Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/discover"
                className="text-xs font-semibold text-[#172554] hover:text-[#1D4ED8] px-3 py-2"
              >
                Find Matches
              </Link>
              <Link
                href="/verification-status"
                className="text-xs font-semibold text-[#172554] bg-[#FAF9F6] border border-[#E2E8F0] px-3.5 py-2 rounded-full hover:bg-white transition-colors"
              >
                Profile Status
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#172554] hover:text-[#1D4ED8] px-3 py-2 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-[#172554] hover:bg-[#1e3a8a] text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 border border-[#C9A227]/40"
              >
                <span>Create Your Profile</span>
                <span className="text-[#C9A227] text-xs">✦</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-[#172554] hover:bg-black/5"
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
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-6 py-5 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#17202A]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#1D4ED8]"
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#1D4ED8]"
            >
              How It Works
            </Link>
            <Link
              href="/#success-stories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#1D4ED8]"
            >
              Success Stories
            </Link>
            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#1D4ED8]"
            >
              Discover Profiles
            </Link>
            <Link
              href="/subscriptions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#1D4ED8]"
            >
              Membership Plans
            </Link>
          </nav>

          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  href="/verification-status"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-xs font-semibold py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E2E8F0]"
                >
                  My Verification Status
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center text-xs font-semibold py-2.5 rounded-xl text-red-600 bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold py-2.5 rounded-full border border-[#172554] text-[#172554]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold py-2.5 rounded-full bg-[#172554] text-white shadow-sm"
                >
                  Create Your Profile
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
