'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function MatrimonyCovenantSection() {
  const pillars = [
    {
      num: '01',
      badge: 'PROTECTED FAITH PROFILE',
      title: 'Create a protected faith profile',
      description:
        'Your phone number is never displayed publicly. Share your testimony, church parish details, education, and family values with complete privacy and peace of mind.',
      bg: 'bg-gradient-to-br from-cyan-50/90 to-cyan-100/30',
      border: 'border-cyan-200 hover:border-cyan-400',
      numBadge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      titleColor: 'text-cyan-950',
      highlight: 'Phone Number Never Public',
    },
    {
      num: '02',
      badge: 'MUTUAL INTEREST',
      title: 'Discover compatibility, then express interest',
      description:
        'Conversation begins only after interest is mutual. Filter verified profiles by church denomination and connect without cold calling or pressure.',
      bg: 'bg-gradient-to-br from-emerald-50/90 to-emerald-100/30',
      border: 'border-emerald-200 hover:border-emerald-400',
      numBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      titleColor: 'text-emerald-950',
      highlight: 'Conversation Mutual First',
    },
    {
      num: '03',
      badge: 'FAMILY CONNECTION',
      title: 'Connect families and prepare for marriage',
      description:
        'Both people control when family contact is opened. Families meet with pastoral guidance, honor, and zero arbitrary 30-day deadline pressures.',
      bg: 'bg-gradient-to-br from-orange-50/90 to-amber-100/30',
      border: 'border-orange-200 hover:border-orange-400',
      numBadge: 'bg-orange-100 text-orange-900 border-orange-300',
      titleColor: 'text-orange-950',
      highlight: 'Both People Control Access',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] border-t border-charcoal-100/80 relative overflow-hidden">
      {/* Background Subtle Watermark of Wedding Rings on Bible */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-5 pointer-events-none rounded-full overflow-hidden">
        <img
          src="/images/christian-wedding-rings-bible.jpg"
          alt="Holy Bible and Rings"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-50 via-orange-50 to-emerald-50 border border-cyan-200 text-charcoal-900 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Our Sacred Covenant &amp; Trust Pillars</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-brand">
            Built on Faith, Protected by Reverence
          </h2>

          <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
            Christian marriage is a holy covenant instituted by God. We hold our platform to the highest biblical integrity and family security standards.
          </p>
        </motion.div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {pillars.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className={`p-6 sm:p-7 rounded-2xl ${p.bg} border ${p.border} transition-shadow duration-300 shadow-2xs hover:shadow-xl flex flex-col justify-between cursor-pointer`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`w-9 h-9 rounded-lg ${p.numBadge} border flex items-center justify-center font-mono text-sm font-black shadow-2xs`}>
                    {p.num}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 bg-white/95 border border-slate-200 px-3 py-1 rounded-md">
                    {p.badge}
                  </span>
                </div>

                <h3 className={`text-lg sm:text-xl font-extrabold ${p.titleColor} font-brand`}>
                  {p.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold">
                  <span>✓</span>
                  <span>{p.highlight}</span>
                </span>
                <span className="text-slate-400 font-mono text-xs">Pillar {p.num}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MatrimonyCovenantSection;
