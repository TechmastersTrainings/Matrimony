'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            ✝
          </span>
          <div>
            <span className="font-extrabold text-stone-900 text-base tracking-tight block leading-none">
              Christian Matrimony
            </span>
            <span className="text-[10px] text-amber-700 font-semibold tracking-wider uppercase">
              Bidar, Karnataka
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <Link href="/discover" className={`hover:text-amber-700 transition-colors ${pathname === '/discover' ? 'text-amber-800 font-bold' : ''}`}>
            Discover
          </Link>
          <Link href="/interests" className={`hover:text-amber-700 transition-colors ${pathname === '/interests' ? 'text-amber-800 font-bold' : ''}`}>
            Interests & Matches
          </Link>
          <Link href="/chat" className={`hover:text-amber-700 transition-colors ${pathname === '/chat' ? 'text-amber-800 font-bold' : ''}`}>
            Chat
          </Link>
          <Link href="/subscriptions" className={`hover:text-amber-700 transition-colors ${pathname === '/subscriptions' ? 'text-amber-800 font-bold' : ''}`}>
            Plans
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile/photos"
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 px-3 py-2 rounded-lg"
              >
                Photos
              </Link>
              <Link
                href="/verification-status"
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 px-3 py-2 rounded-lg"
              >
                Status
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold bg-amber-700 text-white hover:bg-amber-800 px-4 py-2 rounded-lg shadow-xs transition-colors"
              >
                Register Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
