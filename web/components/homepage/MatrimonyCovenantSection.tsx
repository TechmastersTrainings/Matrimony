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
      bg: 'bg-gradient-to-br from-cyan-50/90 via-white to-cyan-100/30',
      border: 'border-cyan-200/90 hover:border-cyan-400',
      numBadge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      titleColor: 'text-cyan-950',
      highlight: 'Phone Number Never Public',
      icon: '🔒',
    },
    {
      num: '02',
      badge: 'MUTUAL INTEREST',
      title: 'Discover compatibility, then express interest',
      description:
        'Conversation begins only after interest is mutual. Filter verified profiles by church denomination and connect without cold calling or pressure.',
      bg: 'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-100/30',
      border: 'border-emerald-200/90 hover:border-emerald-400',
      numBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      titleColor: 'text-emerald-950',
      highlight: 'Conversation Mutual First',
      icon: '💬',
    },
    {
      num: '03',
      badge: 'FAMILY CONNECTION',
      title: 'Connect families and prepare for marriage',
      description:
        'Both people control when family contact is opened. Families meet with pastoral guidance, honor, and zero arbitrary 30-day deadline pressures.',
      bg: 'bg-gradient-to-br from-orange-50/90 via-white to-amber-100/30',
      border: 'border-orange-200/90 hover:border-orange-400',
      numBadge: 'bg-orange-100 text-orange-900 border-orange-300',
      titleColor: 'text-orange-950',
      highlight: 'Both People Control Access',
      icon: '🤝',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] border-t border-charcoal-100/80 relative overflow-hidden select-none">
      {/* Background Subtle Watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-5 pointer-events-none rounded-full overflow-hidden">
        <img
          src="/images/christian-wedding-rings-bible.jpg"
          alt="Holy Bible and Rings"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-50 via-orange-50 to-emerald-50 border border-cyan-200/80 text-charcoal-900 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
            <span>Our Sacred Covenant &amp; Trust Pillars</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-brand">
            Built on Faith, Protected by Reverence
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Christian marriage is a holy covenant instituted by God. We hold our platform to the highest biblical integrity and family security standards.
          </p>
        </motion.div>

        {/* 3 Pillars Grid with Scroll-Triggered Staggered Single-Card Entrances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 45, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px', amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: idx * 0.2, // Staggered entry card bring up one by one!
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`p-6 sm:p-8 rounded-3xl ${p.bg} border ${p.border} transition-all duration-300 shadow-sm hover:shadow-2xl flex flex-col justify-between cursor-pointer group`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform">
                    {p.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 bg-white/95 border border-slate-200 px-3 py-1 rounded-md shadow-2xs">
                    {p.badge}
                  </span>
                </div>

                <h3 className={`text-lg sm:text-xl font-extrabold ${p.titleColor} font-brand leading-snug group-hover:text-burgundy-900 transition-colors`}>
                  {p.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-1 font-normal">
                  {p.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-200/70 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-extrabold">
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
