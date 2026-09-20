'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryItem {
  title: string;
  image: string;
  description: string;
  highlight1: {
    title: string;
    desc: string;
  };
  highlight2: {
    title: string;
    desc: string;
  };
}

const galleryItems: GalleryItem[] = [
  {
    title: 'Holy Vows Before the Altar of God',
    image: '/images/sacred-couple-holding-rings.jpg',
    description:
      'Christian marriage begins at the altar in reverence and prayer. Standing before God and the church fellowship, bride and groom exchange sacred vows, receive pastoral blessings, and dedicate their lifelong union to Christ.',
    highlight1: {
      title: '⛪ Pastoral & Parish Blessing',
      desc: 'Honoring liturgical traditions, pastoral oversight, and church community validation.',
    },
    highlight2: {
      title: '💍 Sacred Covenant Vows',
      desc: 'A lifelong commitment sealed in prayer, biblical love, and mutual dedication.',
    },
  },
  {
    title: 'The Joy of Two Families United in Christ',
    image: '/images/sacred-family-joy-couple.jpg',
    description:
      'Christian matrimony brings two families together with mutual respect and joy. Supported by parental prayers, elders, and church leaders, families celebrate each step with thanksgiving, honoring generational faith.',
    highlight1: {
      title: '🤝 Parental Care & Blessing',
      desc: 'Parents and elders actively involved with complete dignity, transparency, and honor.',
    },
    highlight2: {
      title: '🔒 Privacy & Mutual Consent',
      desc: 'Safeguarding candidate dignity and contact privacy with honorable discretion.',
    },
  },
  {
    title: 'Symbols of an Unbroken Covenant',
    image: '/images/sacred-wedding-rings-hand.jpg',
    description:
      'The exchange of rings signifies an everlasting covenant anchored in God’s grace. Grounded in biblical love and devotion, Christian couples step forward in lifelong harmony and faith.',
    highlight1: {
      title: '📖 Biblical Matrimony Values',
      desc: 'Anchored in 1 Corinthians 13: love that is patient, kind, and enduring.',
    },
    highlight2: {
      title: '🕊️ "Till You Marry" Assurance',
      desc: 'Patient, long-term matrimonial agency support with zero arbitrary 30-day deadlines.',
    },
  },
  {
    title: 'Diverse Christian Fellowships in Bidar',
    image: '/images/sacred-diverse-fellowships-couple.jpg',
    description:
      'CovenantNest respectfully brings together Christian brides, grooms, and prayerful families across Methodist (MCI), CSI, Roman Catholic, Baptist, and Pentecostal fellowships, preserving distinct church heritages.',
    highlight1: {
      title: '⛪ All Major Church Fellowships',
      desc: 'Connecting believers across denominations with genuine church validation.',
    },
    highlight2: {
      title: '🛡️ Verified Profiles & Safe Space',
      desc: 'Authentic candidate credentials validated for reverent matrimonial discovery.',
    },
  },
];

export function BlessedStoriesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % galleryItems.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = galleryItems[activeIdx];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0a090d] text-white py-12 sm:py-16 select-none border-b border-white/10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient Warm Atmosphere Glows (matching Hero section) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-gradient-to-bl from-amber-400/10 via-amber-600/5 to-transparent rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10"
        >
          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-brand">
              Sacred Moments of Holy Matrimony
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Celebrating reverent Christian wedding traditions, church altar blessings, and the beauty of holy covenant unions.
            </p>
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setActiveIdx((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))}
              aria-label="Previous Slide"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center font-bold text-lg shadow-md transition-colors cursor-pointer"
            >
              ‹
            </motion.button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-mono font-bold text-stone-300 shadow-md">
              <span className="text-amber-400 font-extrabold">0{activeIdx + 1}</span>
              <span>/</span>
              <span>0{galleryItems.length}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setActiveIdx((prev) => (prev + 1) % galleryItems.length)}
              aria-label="Next Slide"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center font-bold text-lg shadow-md transition-colors cursor-pointer"
            >
              ›
            </motion.button>
          </div>
        </motion.div>

        {/* Gallery Card with Smooth AnimatePresence Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-[#131118]/90 border border-amber-400/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md min-h-0 lg:min-h-[480px]"
          >
            {/* Left Column: Gallery Photo */}
            <div className="lg:col-span-5 h-full flex items-center justify-center">
              <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/15 group bg-black">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: Tradition & Values Description */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 flex flex-col justify-between">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white font-brand">
                  {current.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-stone-300 leading-relaxed font-normal">
                  {current.description}
                </p>
              </div>

              {/* Micro Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-3 border-t border-white/10">
                <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-amber-400/20 space-y-1">
                  <span className="text-xs sm:text-sm font-bold text-amber-300 block">
                    {current.highlight1.title}
                  </span>
                  <p className="text-[11px] sm:text-xs text-stone-300 leading-snug">
                    {current.highlight1.desc}
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-rose-400/20 space-y-1">
                  <span className="text-xs sm:text-sm font-bold text-rose-300 block">
                    {current.highlight2.title}
                  </span>
                  <p className="text-[11px] sm:text-xs text-stone-300 leading-snug">
                    {current.highlight2.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Actions & Slide Tabs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Link
                    href="/register"
                    className="btn-shine-effect inline-flex items-center justify-center gap-2 bg-gradient-to-r from-burgundy-700 via-rose-600 to-amber-600 hover:from-burgundy-800 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg border border-amber-400/30 transition-transform hover:scale-103 text-center"
                  >
                    <span>Start Your Matrimonial Journey</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/about"
                    className="text-xs font-bold text-amber-300/90 hover:text-amber-200 hover:underline text-center sm:text-left py-1 sm:py-0 transition-colors"
                  >
                    Our Values →
                  </Link>
                </div>

                {/* Slide Selector Buttons */}
                <div className="flex items-center gap-1.5">
                  {galleryItems.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeIdx === idx
                          ? 'w-6 bg-gradient-to-r from-amber-400 to-rose-500'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Go to gallery slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default BlessedStoriesSection;
