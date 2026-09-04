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
    <header className="border-b border-slate-800 bg-slate-950 text-white sticky top-0 z-50">
      {/* Top Banner for Admin */}
      <div className="bg-slate-900/90 text-slate-400 text-[10px] py-1 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="font-semibold text-slate-300">
            A <strong className="text-amber-400">Techmasters Innovations</strong> Product • Admin Management Console
          </span>
          <span className="text-emerald-400 font-mono font-bold">SYSTEM ACTIVE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center group">
          <Logo size="md" showTechmastersTag={false} />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
          <Link
            href="/dashboard"
            className={`hover:text-amber-400 transition-colors ${pathname === '/dashboard' ? 'text-amber-400' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/profiles"
            className={`hover:text-amber-400 transition-colors ${pathname === '/profiles' ? 'text-amber-400' : ''}`}
          >
            Profile Moderation
          </Link>
          <Link
            href="/users"
            className={`hover:text-amber-400 transition-colors ${pathname === '/users' ? 'text-amber-400' : ''}`}
          >
            User Management
          </Link>
          <Link
            href="/reports"
            className={`hover:text-amber-400 transition-colors ${pathname === '/reports' ? 'text-amber-400' : ''}`}
          >
            Reports
          </Link>
          <Link
            href="/settings"
            className={`hover:text-amber-400 transition-colors ${pathname === '/settings' ? 'text-amber-400' : ''}`}
          >
            Settings
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[11px] bg-slate-900 border border-slate-800 text-amber-400 px-3 py-1.5 rounded-xl font-mono font-bold">
            SUPER_ADMIN
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
