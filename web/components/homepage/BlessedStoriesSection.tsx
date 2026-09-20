'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryItem {
  title: string;
  category: string;
  fellowship: string;
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
    category: 'Sacred Church Ceremony',
    fellowship: 'Methodist Church in India (MCI), CSI & Catholic Traditions',
    image: '/images/hero-sunset-covenant-hands.jpg',
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
    category: 'Family Fellowship & Blessing',
    fellowship: 'Traditional Christian Matrimonial Celebrations',
    image: '/images/hero-sunset-covenant-hands.jpg',
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
    category: 'Exchanging Wedding Vows & Rings',
    fellowship: 'Biblical Foundations & Christian Heritage',
    image: '/images/christian-wedding-rings-bible.jpg',
    description:
      'The exchange of rings upon the Holy Scriptures signifies an everlasting covenant anchored in God’s grace. Grounded in biblical love and devotion, Christian couples step forward in lifelong harmony and faith.',
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
    title: 'Diverse Fellowships Across India',
    category: 'Christian Community',
    fellowship: 'Bidar, Karnataka & Telangana Dioceses',
    image: '/images/hero-sunset-covenant-hands.jpg',
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
      className="py-12 sm:py-16 bg-[#fdfbf7] text-[#1e1b18] border-b border-charcoal-100/70 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10"
        >
          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-950 shadow-xs">
              <span>💒</span>
              <span>Christian Matrimony Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
              Sacred Moments of Holy Matrimony
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
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
              className="w-10 h-10 rounded-full bg-white hover:bg-rose-50 border border-charcoal-200 text-slate-700 hover:text-rose-900 flex items-center justify-center font-bold text-lg shadow-2xs transition-colors cursor-pointer"
            >
              ‹
            </motion.button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-charcoal-200 rounded-full text-xs font-mono font-bold text-slate-600 shadow-2xs">
              <span className="text-rose-700 font-extrabold">0{activeIdx + 1}</span>
              <span>/</span>
              <span>0{galleryItems.length}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => setActiveIdx((prev) => (prev + 1) % galleryItems.length)}
              aria-label="Next Slide"
              className="w-10 h-10 rounded-full bg-white hover:bg-rose-50 border border-charcoal-200 text-slate-700 hover:text-rose-900 flex items-center justify-center font-bold text-lg shadow-2xs transition-colors cursor-pointer"
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-white rounded-2xl sm:rounded-3xl border border-charcoal-200 p-4 sm:p-8 shadow-xs relative overflow-hidden min-h-0 lg:min-h-[440px]"
          >
            {/* Left Column: Gallery Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-full sm:max-w-sm aspect-[4/3] sm:aspect-[4/4.2] rounded-xl sm:rounded-2xl overflow-hidden shadow-md border-2 border-white ring-1 ring-charcoal-200/80 group">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-emerald-950 border border-emerald-200 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{current.category}</span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/60 shadow-md">
                  <span className="text-xs font-serif font-extrabold text-charcoal-900 block truncate">
                    {current.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1">
                    {current.fellowship}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Tradition & Values Description */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 flex flex-col justify-between">
              <div className="space-y-2 sm:space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] sm:text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                  <span>⛪</span>
                  <span>{current.category}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 font-brand">
                  {current.title}
                </h3>
                <p className="text-xs sm:text-base text-slate-700 leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* Micro Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 sm:p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/60 space-y-0.5">
                  <span className="text-xs font-bold text-orange-950 block">
                    {current.highlight1.title}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {current.highlight1.desc}
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200/60 space-y-0.5">
                  <span className="text-xs font-bold text-cyan-950 block">
                    {current.highlight2.title}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {current.highlight2.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Actions & Slide Tabs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Link
                    href="/register"
                    className="btn-shine-effect inline-flex items-center justify-center gap-2 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-transform hover:scale-103 text-center"
                  >
                    <span>Start Your Matrimonial Journey</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/about"
                    className="text-xs font-bold text-cyan-950 hover:underline text-center sm:text-left py-1 sm:py-0"
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
                        activeIdx === idx ? 'w-6 bg-rose-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
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
