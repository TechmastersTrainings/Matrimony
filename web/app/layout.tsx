import React from 'react';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata = {
  title: 'Christian Matrimony | Find Your Blessed Partner in Bidar & Karnataka',
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
      <body className="bg-[#FFFDFB] text-slate-900 antialiased selection:bg-red-200 selection:text-red-900">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
