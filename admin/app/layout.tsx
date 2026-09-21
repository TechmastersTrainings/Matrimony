import React from 'react';
import './globals.css';
import { AdminNavbar } from '../components/AdminNavbar';
import { AdminInactivityHandler } from '../components/AdminInactivityHandler';
import { Footer } from '../components/Footer';

export const metadata = {
  title: 'Shalom Admin | Administrative Command Center',
  description: 'Administrative moderation, church verification, and safety portal for Shalom.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fdfbf7] text-[#1e1b18] min-h-screen antialiased selection:bg-cyan-100 selection:text-cyan-900 font-sans flex flex-col justify-between">
        <div>
          <AdminInactivityHandler />
          <AdminNavbar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
