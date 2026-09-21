import React from 'react';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TopLoadingBar } from '../components/TopLoadingBar';
import { InactivityHandler } from '../components/InactivityHandler';

export const metadata = {
  title: 'Shalom | Blessed Christian Matrimony | Bidar & Karnataka',
  description:
    'Shalom is a reverent Christian matrimonial sanctuary where holy covenants build blessed homes. Connecting brides, bridegrooms, and prayerful families across Bidar, Karnataka, and India.',
  keywords: [
    'Shalom',
    'Shalom Matrimony',
    'Christian Matrimony',
    'Bidar Christian Matrimony',
    'Karnataka Christian Brides',
    'Methodist Matrimony',
    'CSI Christian Matrimony',
    'Catholic Matrimony',
    'Indian Christian Matrimony',
  ],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body className="bg-[#fdfbf7] text-[#1e1b18] antialiased selection:bg-burgundy-100 selection:text-burgundy-900 overflow-x-hidden w-full">
        <TopLoadingBar />
        <InactivityHandler />
        <Navbar />
        <main className="min-h-screen pt-16 sm:pt-20 overflow-x-hidden w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
