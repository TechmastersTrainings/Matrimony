import React from 'react';
import Link from 'next/link';
import { AboutTechmastersSection } from '../../components/homepage/AboutTechmastersSection';

export const metadata = {
  title: 'About Us | CovenantNest — Christian Matrimony | Techmasters Innovations',
  description: 'About CovenantNest and Techmasters Innovations Private Limited. Dedicated, secure, and confidential Christian matrimonial sanctuary based in Bidar, Karnataka.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] text-charcoal-900 font-sans">
      <AboutTechmastersSection />

      {/* Additional Mission & Community Context */}
      <section className="py-16 bg-[#faf6ee] border-t border-[#ece2d1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-charcoal-900">
            Serving the Christian Community with Trust &amp; Integrity
          </h2>
          <p className="text-sm text-charcoal-600 leading-relaxed max-w-2xl mx-auto">
            Our mission is to help Christian souls build holy, God-honoring families through transparent matchmaking, family honor, and absolute data protection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-burgundy-700 to-burgundy-800 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Register Free Profile →
            </Link>
            <Link
              href="/discover"
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-[#faf6ee] text-charcoal-800 font-bold text-xs border border-[#ded0ba] transition-all shadow-xs"
            >
              Explore Member Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
