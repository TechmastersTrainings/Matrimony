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
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/discover', label: 'Discover' },
    { href: '/subscriptions', label: 'Plans' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
  ];

  const authenticatedLinks = [
    { href: '/interests', label: 'Matches' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 transition-all duration-200">
      <div
        className={`w-full h-20 transition-all duration-300 ${scrolled
            ? 'bg-[#150a0f]/98 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.35)] border-b border-amber-500/25'
            : 'bg-[#1c0d14]/95 backdrop-blur-md shadow-md border-b border-[#3b1926]'
          }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* Brand Logo with lightText for dark navbar */}
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
            <Logo size="md" showTechmastersTag={false} lightText={true} />
          </Link>

          {/* Desktop Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${active
                      ? 'text-amber-300 bg-amber-400/15 font-bold border border-amber-400/30 shadow-2xs'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <span className="w-px h-5 bg-stone-700 mx-1 xl:mx-2" />
                {authenticatedLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${active
                          ? 'text-amber-300 bg-amber-400/15 font-bold border border-amber-400/30 shadow-2xs'
                          : 'text-stone-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/60 text-amber-300 hover:bg-black/80 border border-amber-500/40 transition-colors shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin</span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-300 hover:text-rose-300 px-3.5 py-2 rounded-full hover:bg-rose-950/40 border border-stone-700/80 hover:border-rose-500/40 transition-all duration-150"
              >
                <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-stone-200 hover:text-white px-3.5 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#8c1936] via-[#aa2247] to-[#c59b27] hover:from-[#771932] hover:to-[#8c1936] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg border border-amber-300/30 transition-all duration-150 transform hover:-translate-y-0.5"
                >
                  <span>Register Free</span>
                  <span className="text-amber-200">→</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-stone-200 hover:text-white hover:bg-white/10 transition-colors"
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

      {/* Mobile Menu Drawer (Dark Luxury Theme) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#180d13]/98 backdrop-blur-xl border-b border-[#3b1926] px-5 py-4 space-y-3 shadow-2xl text-stone-200 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${active
                      ? 'text-amber-300 bg-amber-400/15 font-bold border border-amber-400/25'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <div className="pt-2 pb-1 text-[11px] uppercase font-bold text-stone-500 px-3.5 tracking-wider">
                  Member Portal
                </div>
                {authenticatedLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${active
                          ? 'text-amber-300 bg-amber-400/15 font-bold border border-amber-400/25'
                          : 'text-stone-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span>{link.label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </Link>
                  );
                })}

                <Link
                  href="/profile/photos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Manage Photos
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-sm font-bold bg-black/70 text-amber-300 flex items-center gap-2 border border-amber-500/40 mt-1"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Admin Portal</span>
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center text-sm font-semibold py-2.5 rounded-full text-rose-300 bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/50 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold py-2.5 rounded-full border border-stone-700 text-stone-200 bg-stone-900/60 hover:bg-stone-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold py-2.5 rounded-full bg-gradient-to-r from-[#8c1936] via-[#aa2247] to-[#c59b27] text-white shadow-md transition-colors"
                >
                  Register Free →
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