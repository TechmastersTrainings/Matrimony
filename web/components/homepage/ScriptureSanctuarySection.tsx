'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ScriptureSanctuarySection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] relative overflow-hidden border-t border-[#ece2d1] select-none">
      {/* Soft Luminous Warm Golden Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none animate-ambient" />

      {/* Edge-to-Edge Full Width Stretch Container */}
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 relative z-10">
        {/* Beautiful Full-Width 2-Column Scripture Card with Motion Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px', amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-lg shadow-amber-950/5 p-5 sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Column: Authentic Holy Bible & Wedding Rings Image */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[240px] sm:max-w-xs aspect-[4/4.5] rounded-xl sm:rounded-2xl overflow-hidden shadow-md border-2 border-amber-300/80 ring-4 ring-amber-100/70 group">
                <img
                  src="/images/christian-wedding-rings-bible.jpg"
                  alt="Wedding Rings resting on open Holy Bible"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-0.5 rounded-full border border-amber-300 text-[11px] font-extrabold text-amber-950 uppercase tracking-wider shadow-sm whitespace-nowrap">
                  Holy Bible • Sacred Vows
                </div>
              </div>
            </div>

            {/* Right Column: Sacred Scripture Quote & Citation */}
            <div className="md:col-span-7 flex flex-col justify-center text-left space-y-3 sm:space-y-4">
              {/* Decorative Gold Quotation Mark */}
              <div className="font-serif text-4xl sm:text-6xl text-amber-400/60 leading-none select-none -mb-2 sm:-mb-4">
                &ldquo;
              </div>

              {/* The 1 Corinthians 13:4–8 Passage */}
              <blockquote className="font-serif text-sm sm:text-base md:text-lg lg:text-xl italic text-burgundy-950 leading-relaxed font-normal">
                Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.{' '}
                <span className="font-extrabold not-italic text-burgundy-900 underline decoration-amber-400 decoration-2 underline-offset-4">
                  Love never fails.
                </span>
                &rdquo;
              </blockquote>

              {/* Delicate Divider */}
              <div className="h-0.5 w-16 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-600 rounded-full my-1" />

              {/* Biblical Citation */}
              <div className="space-y-0.5">
                <cite className="not-italic text-sm sm:text-base font-extrabold uppercase tracking-widest text-burgundy-900 block font-brand">
                  1 Corinthians 13:4–8
                </cite>
                <span className="text-xs sm:text-sm text-slate-600 font-semibold block">
                  The Divine Standard for Christian Marriages
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ScriptureSanctuarySection;
