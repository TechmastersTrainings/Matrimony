import React from 'react';
import './globals.css';
import { AdminNavbar } from '../components/AdminNavbar';
import { AdminInactivityHandler } from '../components/AdminInactivityHandler';

export const metadata = {
  title: 'CovenantNest Admin | Administrative Command Center',
  description: 'Administrative moderation, church verification, and safety portal for CovenantNest.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fdfbf7] text-[#1e1b18] min-h-screen antialiased selection:bg-cyan-100 selection:text-cyan-900 font-sans">
        <AdminInactivityHandler />
        <AdminNavbar />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </body>
    </html>
  );
}
