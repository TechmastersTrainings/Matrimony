'use client';

import React from 'react';

export function ScriptureSanctuarySection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#faf6ee] via-rose-50/40 to-[#fdfbf7] text-[#1e1b18] relative overflow-hidden border-t border-[#ece2d1]">
      {/* Warm Golden Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Elegant Gold Accent Line */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6" />

        {/* Sacred Love Scripture Passage */}
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl italic text-burgundy-950 leading-relaxed sm:leading-loose">
          &ldquo;Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres. Love never fails.&rdquo;
        </blockquote>

        <div className="mt-6 flex flex-col items-center gap-1">
          <cite className="not-italic text-xs sm:text-sm font-bold uppercase tracking-widest text-burgundy-800">
            1 Corinthians 13:4–8
          </cite>
          <span className="text-xs text-slate-500 font-medium">
            The Divine Standard for Christian Marriages
          </span>
        </div>

        {/* The Threefold Cord Reflection */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-[#ece2d1] shadow-xs max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-700 italic font-serif leading-relaxed">
            &ldquo;Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.&rdquo;
            <span className="block not-italic font-sans text-[11px] font-bold text-gold-800 mt-2">
              — Ecclesiastes 4:12 • A Husband, A Wife, and Christ at the Center
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ScriptureSanctuarySection;
