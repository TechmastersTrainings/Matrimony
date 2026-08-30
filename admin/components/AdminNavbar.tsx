'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNavbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-stone-200 bg-stone-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            ✝
          </span>
          <div>
            <span className="font-extrabold text-sm tracking-tight block leading-none">
              Bidar Christian Matrimony
            </span>
            <span className="text-[10px] text-amber-500 font-semibold tracking-wider uppercase">
              Admin Platform Control
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-xs font-semibold text-stone-300">
          <Link href="/dashboard" className={`hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-amber-500 font-bold' : ''}`}>
            Dashboard
          </Link>
          <Link href="/profiles" className={`hover:text-white transition-colors ${pathname === '/profiles' ? 'text-amber-500 font-bold' : ''}`}>
            Profiles & Photos
          </Link>
          <Link href="/users" className={`hover:text-white transition-colors ${pathname === '/users' ? 'text-amber-500 font-bold' : ''}`}>
            Users
          </Link>
          <Link href="/reports" className={`hover:text-white transition-colors ${pathname === '/reports' ? 'text-amber-500 font-bold' : ''}`}>
            Reports
          </Link>
          <Link href="/settings" className={`hover:text-white transition-colors ${pathname === '/settings' ? 'text-amber-500 font-bold' : ''}`}>
            Settings
          </Link>
          <Link href="/audit-logs" className={`hover:text-white transition-colors ${pathname === '/audit-logs' ? 'text-amber-500 font-bold' : ''}`}>
            Audit Logs
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] bg-stone-800 text-stone-300 px-3 py-1.5 rounded-lg font-medium">
            Role: SUPER_ADMIN
          </span>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
