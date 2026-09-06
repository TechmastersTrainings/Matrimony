import React from 'react';
import './globals.css';
import { AdminNavbar } from '../components/AdminNavbar';
import { AdminInactivityHandler } from '../components/AdminInactivityHandler';

export const metadata = {
  title: 'Christian Matrimony Admin | Management Console',
  description: 'Administrative moderation and management portal for Christian Matrimony.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-amber-500 selection:text-slate-950">
        <AdminInactivityHandler />
        <AdminNavbar />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </body>
    </html>
  );
}
