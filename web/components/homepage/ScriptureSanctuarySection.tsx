'use client';

import React from 'react';

export function ScriptureSanctuarySection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      {/* Warm Golden Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Elegant Gold Accent Line */}
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6" />

        {/* Sacred Love Scripture Passage */}
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl italic text-amber-100/95 leading-relaxed sm:leading-loose">
          &ldquo;Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres. Love never fails.&rdquo;
        </blockquote>

        <div className="mt-6 flex flex-col items-center gap-1">
          <cite className="not-italic text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-400">
            1 Corinthians 13:4–8
          </cite>
          <span className="text-xs text-slate-400 font-medium">
            The Divine Standard for Christian Marriages
          </span>
        </div>

        {/* The Threefold Cord Reflection */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-950/80 border border-amber-900/30 max-w-2xl mx-auto backdrop-blur-md">
          <p className="text-xs sm:text-sm text-slate-300 italic font-serif leading-relaxed">
            &ldquo;Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.&rdquo;
            <span className="block not-italic font-sans text-[11px] font-bold text-amber-400/90 mt-2">
              — Ecclesiastes 4:12 • A Husband, A Wife, and Christ at the Center
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ScriptureSanctuarySection;
