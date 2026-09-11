'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from './Logo';

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_role');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Banner for Techmasters Innovations attribution */}
      <div className="bg-[#0f172a] text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-sans">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded text-[9px] tracking-wider uppercase">
              Official
            </span>
            <span>
              A <strong className="text-white font-bold">Techmasters Innovations</strong> Product • CovenantNest Administrative Console
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-mono font-bold text-[10px] tracking-wider">
              SUPER ADMIN ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#ece2d1] shadow-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/dashboard" className="group">
            <Logo size="md" showTechmastersTag={false} lightText={false} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold">
            <Link
              href="/dashboard"
              className={`py-1 transition-colors ${
                pathname === '/dashboard'
                  ? 'text-cyan-900 border-b-2 border-cyan-600 font-extrabold'
                  : 'text-slate-700 hover:text-cyan-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/profiles"
              className={`py-1 transition-colors ${
                pathname === '/profiles'
                  ? 'text-cyan-900 border-b-2 border-cyan-600 font-extrabold'
                  : 'text-slate-700 hover:text-cyan-700'
              }`}
            >
              Candidate Moderation
            </Link>
            <Link
              href="/users"
              className={`py-1 transition-colors ${
                pathname === '/users'
                  ? 'text-cyan-900 border-b-2 border-cyan-600 font-extrabold'
                  : 'text-slate-700 hover:text-cyan-700'
              }`}
            >
              User Directory
            </Link>
            <Link
              href="/reports"
              className={`py-1 transition-colors ${
                pathname === '/reports'
                  ? 'text-cyan-900 border-b-2 border-cyan-600 font-extrabold'
                  : 'text-slate-700 hover:text-cyan-700'
              }`}
            >
              Safety Reports
            </Link>
            <Link
              href="/settings"
              className={`py-1 transition-colors ${
                pathname === '/settings'
                  ? 'text-cyan-900 border-b-2 border-cyan-600 font-extrabold'
                  : 'text-slate-700 hover:text-cyan-700'
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-cyan-50 border border-cyan-200 text-cyan-950 font-bold px-3 py-1.5 rounded-xl shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
              <span>Super Administrator</span>
            </span>

            <button
              onClick={handleLogout}
              className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-all shadow-2xs"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
