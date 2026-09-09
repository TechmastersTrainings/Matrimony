import React from 'react';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TopLoadingBar } from '../components/TopLoadingBar';
import { InactivityHandler } from '../components/InactivityHandler';

export const metadata = {
  title: 'Christian Matrimony | Trusted Christian Matrimonial Portal | Bidar & Karnataka',
  description:
    'Dedicated Christian matrimonial portal connecting brides, grooms and families in Bidar, Bengaluru, Kalaburagi, Hyderabad and across India.',
  keywords: [
    'Christian Matrimony',
    'Bidar Christian Matrimony',
    'Karnataka Christian Brides',
    'Methodist Matrimony',
    'CSI Christian Matrimony',
    'Catholic Matrimony',
    'Indian Christian Matrimony',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#fdfbf7] text-[#1e1b18] antialiased selection:bg-burgundy-100 selection:text-burgundy-900">
        <TopLoadingBar />
        <InactivityHandler />
        <Navbar />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
