'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
  {
    image: '/images/indian-christian-wedding-couple.jpg',
    badge: 'Christian Matrimony • Bidar & Karnataka',
    title: 'Where Holy Covenants Build Blessed Homes',
    subtitle:
      'Connecting devout Christian brides & bridegrooms across Bidar, Karnataka, and beyond through prayerful, verified matrimonial introductions.',
    scripture: '“Therefore what God has joined together, let no one separate.” — Mark 10:9',
  },
  {
    image: '/images/covenant-wedding-couple.jpg',
    badge: 'Till You Marry Commitment',
    title: 'Register Once. Complete Support Till Marriage',
    subtitle:
      'Say goodbye to arbitrary 30-day renewal anxiety. Our sacred agency stands faithfully beside Christian families throughout their entire journey.',
    scripture: '“Love is patient, love is kind. It always protects, always trusts, always hopes.” — 1 Cor 13:4-7',
  },
  {
    image: '/images/christian-couple-traditional.jpg',
    badge: 'Honoring Christian Heritage',
    title: 'Preserving Faith, Modesty & Family Values',
    subtitle:
      'Connecting devout Methodist (MCI), CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships with dignity and pastoral respect.',
    scripture: '“Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.” — Prov 31:30',
  },
  {
    image: '/images/christian-wedding-sunset.png',
    badge: 'Prayer & Fellowship',
    title: 'Blessed Unions Nurtured in Grace & Faith',
    subtitle:
      'Connecting prayerful Christian families across Bidar, Bengaluru, Kalaburagi, Hyderabad & beyond with complete trust and transparency.',
    scripture: '“Be completely humble and gentle; be patient, bearing with one another in love.” — Eph 4:2',
  },
  {
    image: '/images/christian-wedding-vows-rings.jpg',
    badge: '100% Confidential & Secure',
    title: 'Mutual Family Consent & Protected Privacy',
    subtitle:
      'Contact numbers remain strictly locked until both families accept mutual interest. Daily contact limits protect candidate modesty.',
    scripture: '“Above all, love each other deeply, because love covers over a multitude of sins.” — 1 Peter 4:8',
  },
  {
    image: '/images/christian-wedding-rings-bible.jpg',
    badge: 'Scriptural Foundation',
    title: 'A Cord of Three Strands is Not Quickly Broken',
    subtitle:
      'Christ-centered unions prayerfully nurtured through verified background credentials, pastoral blessings, and parental guidance.',
    scripture: '“Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.” — Eccl 4:12',
  },
];

export function MatrimonyHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      {/* Full-Width Cinematic High-Contrast Hero Carousel */}
      <div
        className="group relative w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[650px] flex items-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* 6 High-Definition Carousel Background Images with Smooth Motion Fade & Scale */}
        <AnimatePresence mode="sync">
          {heroSlides.map((slide, idx) =>
            currentSlide === idx ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.10]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent z-10 pointer-events-none" />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Previous Slide Arrow Button (‹) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white hover:text-amber-300 shadow-xl border border-white/20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Next Slide Arrow Button (›) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white hover:text-amber-300 shadow-xl border border-white/20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Main Content Area with Staggered Entrance Motion */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20 lg:py-24">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-2xl lg:max-w-xl flex flex-col justify-center text-left space-y-3.5 sm:space-y-5 text-white"
          >
            {/* Badge with Gold/Green Highlight */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/50 border border-amber-400/50 text-[10px] sm:text-[13px] font-bold tracking-wide uppercase text-amber-300 w-fit shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{activeSlide.badge}</span>
            </motion.div>

            {/* Dynamic H1 Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-tight sm:leading-[1.14] font-brand text-white drop-shadow-md"
            >
              {activeSlide.title}
            </motion.h1>

            {/* Dynamic Scripture Quote with Warm Gold Accent */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="border-l-4 border-amber-400 pl-3.5 sm:pl-4 py-2 bg-black/45 rounded-r-xl max-w-xl border-y border-r border-white/10 shadow-lg"
            >
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-amber-100 leading-relaxed font-medium">
                {activeSlide.scripture}
              </p>
            </motion.div>

            {/* Narrative Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xs sm:text-sm md:text-base text-stone-200 max-w-xl font-normal leading-relaxed drop-shadow-xs"
            >
              {activeSlide.subtitle}
            </motion.p>

            {/* Action Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5"
            >
              <Link
                href="/discover"
                className="btn-shine-effect inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#8c1936] via-[#a82245] to-[#771932] hover:from-[#771932] hover:to-[#8c1936] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full sm:rounded-xl font-bold text-xs sm:text-base shadow-xl border border-amber-400/40 transition-transform hover:scale-103 cursor-pointer text-center"
              >
                <span>Explore Verified Profiles</span>
                <span>→</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full sm:rounded-xl font-bold text-xs sm:text-base border border-white/30 shadow-xl transition-transform hover:scale-103 cursor-pointer text-center"
              >
                <span>Register Free Candidate</span>
                <span>+</span>
              </Link>
            </motion.div>

            {/* Slide Counter & Smooth Progress Indicators */}
            <div className="flex items-center gap-3 pt-2 sm:pt-3">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-300">
                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>

              <div className="flex items-center gap-2">
                {heroSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentSlide(dotIdx)}
                    aria-label={`Jump to slide ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === dotIdx
                        ? 'w-8 bg-gradient-to-r from-amber-400 to-rose-500'
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
