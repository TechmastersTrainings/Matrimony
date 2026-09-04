import React from 'react';
import Link from 'next/link';
import { AboutTechmastersSection } from '../../components/homepage/AboutTechmastersSection';

export const metadata = {
  title: 'About Us | Techmasters Innovations Private Limited | Christian Matrimony',
  description: 'About Christian Matrimony and Techmasters Innovations Private Limited. Dedicated, secure, and confidential Christian matrimonial portal based in Bidar, Karnataka.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <AboutTechmastersSection />

      {/* Additional Mission & Community Context */}
      <section className="py-16 bg-slate-900/50 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Serving the Christian Community with Trust &amp; Integrity
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Our mission is to help Christian souls build holy, God-honoring families through transparent matchmaking, family honor, and absolute data protection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
            >
              Register Free Profile →
            </Link>
            <Link
              href="/discover"
              className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
            >
              Explore Member Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
