'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideData {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
  scripture: string;
  floatingCard: {
    icon: string;
    title: string;
    subtitle: string;
    tag: string;
  };
}

const heroSlides: SlideData[] = [
  {
    image: '/images/indian-christian-wedding-couple.jpg',
    badge: 'Christian Matrimony • Bidar & Karnataka',
    title: 'Where Holy Covenants Build Blessed Homes',
    subtitle:
      'Connecting devout Christian brides & bridegrooms across Bidar, Karnataka, and beyond through prayerful, verified matrimonial introductions.',
    scripture: '“Therefore what God has joined together, let no one separate.” — Mark 10:9',
    floatingCard: {
      icon: '✝️',
      title: 'Parish Verified',
      subtitle: 'Church elder & pastor verified candidates',
      tag: '100% Authentic',
    },
  },
  {
    image: '/images/covenant-wedding-couple.jpg',
    badge: 'Till You Marry Commitment',
    title: 'Register Once. Support Till Holy Marriage',
    subtitle: 'Say goodbye to arbitrary 30-day renewal anxiety. Our sacred agency stands faithfully beside Christian families throughout their entire journey.',
    scripture: '“Love is patient, love is kind. It always protects, always trusts, always hopes.” — 1 Cor 13:4-7',
    floatingCard: {
      icon: '💍',
      title: 'Till You Marry',
      subtitle: 'Continuous support with zero time limits',
      tag: 'No Deadlines',
    },
  },
  {
    image: '/images/christian-couple-traditional.jpg',
    badge: 'Honoring Christian Heritage',
    title: 'Preserving Faith, Modesty & Family Values',
    subtitle: 'Connecting devout Methodist (MCI), CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships with dignity.',
    scripture: '“Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.” — Prov 31:30',
    floatingCard: {
      icon: '⛪',
      title: 'Denomination Filters',
      subtitle: 'Methodist, CSI, Catholic, Baptist & Pentecostal',
      tag: 'All Denominations',
    },
  },
  {
    image: '/images/christian-wedding-vows-rings.jpg',
    badge: 'Protected Phone Privacy',
    title: 'Mutual Consent & Unlocked Family Contacts',
    subtitle: 'Your phone number is never displayed publicly. Conversation begins only after interest is mutual, giving both families total control.',
    scripture: '“Above all, love each other deeply, because love covers over a multitude of sins.” — 1 Peter 4:8',
    floatingCard: {
      icon: '🔒',
      title: 'Private Phone Number',
      subtitle: 'Direct contacts shared only upon mutual consent',
      tag: 'Locked & Safe',
    },
  },
  {
    image: '/images/christian-wedding-rings-bible.jpg',
    badge: 'Scriptural Foundation',
    title: 'A Cord of Three Strands is Not Quickly Broken',
    subtitle: 'Christ-centered unions prayerfully nurtured through verified background credentials, pastoral blessings, and parental guidance.',
    scripture: '“A cord of three strands is not quickly broken.” — Ecclesiastes 4:12',
    floatingCard: {
      icon: '📖',
      title: 'Biblical Integrity',
      subtitle: 'Guided by faith, prayer, and pastoral respect',
      tag: 'Faith Centered',
    },
  },
];

export function MatrimonyHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const SLIDE_DURATION = 6000; // 6 seconds per slide

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setProgressKey((prev) => prev + 1);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, currentSlide]);

  const changeSlide = (index: number) => {
    setCurrentSlide(index);
    setProgressKey((prev) => prev + 1);
  };

  const prevSlide = () => {
    changeSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    changeSlide((currentSlide + 1) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 select-none">
      {/* LayerSlider Animated Auto-Progress Line Top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-40 overflow-hidden">
        <motion.div
          key={progressKey}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? '0%' : '100%' }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 shadow-md"
        />
      </div>

      {/* LayerSlider Hero Main Container */}
      <div
        className="group relative w-full min-h-[540px] sm:min-h-[600px] lg:min-h-[670px] flex items-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Layer 1: Background Images with Ken Burns Zoom & High Contrast */}
        <AnimatePresence mode="sync">
          {heroSlides.map((slide, idx) =>
            currentSlide === idx ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1.02 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.12]"
                />
                {/* LayerSlider Multi-Gradient Vignette & Shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40 lg:bg-gradient-to-r lg:from-slate-950/95 lg:via-slate-950/70 lg:to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80 z-10 pointer-events-none" />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Ambient Decorative Halo Light Layer */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-cyan-500/15 rounded-full blur-3xl pointer-events-none z-15 animate-pulse" />

        {/* Layer 2: Previous Slide Navigation Arrow */}
        <motion.button
          whileHover={{ scale: 1.15, x: -2 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white hover:text-amber-300 shadow-2xl border border-amber-400/30 backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Layer 2: Next Slide Navigation Arrow */}
        <motion.button
          whileHover={{ scale: 1.15, x: 2 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white hover:text-amber-300 shadow-2xl border border-amber-400/30 backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Layer 3: Main Slide Content + Floating Parallax Badge (LayerSlider Layout) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Hero Content Box with Staggered Multi-Layer Motion */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:max-w-2xl flex flex-col justify-center text-left space-y-4 sm:space-y-5 text-white"
          >
            {/* Layer 3A: Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-amber-400/40 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300 w-fit backdrop-blur-md shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{activeSlide.badge}</span>
            </motion.div>

            {/* Layer 3B: Main Title with Rich Layered Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-tight sm:leading-[1.12] font-brand text-white drop-shadow-lg"
            >
              {activeSlide.title}
            </motion.h1>

            {/* Layer 3C: Scripture Box with Glassmorphism & Gold Border */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="border-l-4 border-amber-400 pl-4 py-2.5 bg-slate-900/60 backdrop-blur-md rounded-r-2xl border-y border-r border-amber-400/20 shadow-xl max-w-xl"
            >
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-amber-100 leading-relaxed font-medium">
                {activeSlide.scripture}
              </p>
            </motion.div>

            {/* Layer 3D: Subtitle Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xs sm:text-sm md:text-base text-stone-200 font-normal leading-relaxed max-w-xl"
            >
              {activeSlide.subtitle}
            </motion.p>

            {/* Layer 3E: Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link
                href="/discover"
                className="btn-shine-effect inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-burgundy-700 via-rose-600 to-amber-600 hover:from-burgundy-800 hover:to-amber-700 text-white px-6 sm:px-7 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-2xl border border-amber-400/40 transition-transform hover:scale-103 cursor-pointer text-center"
              >
                <span>Discover Verified Profiles</span>
                <span>→</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 sm:px-7 py-3 rounded-xl font-bold text-xs sm:text-sm border border-white/25 shadow-xl transition-transform hover:scale-103 cursor-pointer text-center"
              >
                <span>Create Protected Profile</span>
                <span>+</span>
              </Link>
            </motion.div>

            {/* Layer 3F: Slide Indicators & Controls */}
            <div className="flex items-center gap-4 pt-3">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-300">
                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>

              <div className="flex items-center gap-2">
                {heroSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => changeSlide(dotIdx)}
                    aria-label={`Jump to slide ${dotIdx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentSlide === dotIdx
                        ? 'w-9 bg-gradient-to-r from-amber-400 to-rose-500 shadow-md ring-2 ring-amber-400/30'
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Floating Parallax Feature Card (LayerSlider Premium Depth Accent) */}
          <motion.div
            key={`floating-${currentSlide}`}
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block w-72 shrink-0 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 backdrop-blur-xl border border-amber-400/40 p-6 rounded-3xl shadow-2xl text-white relative group overflow-hidden"
          >
            {/* Top Shine Flare Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-rose-500/20 border border-amber-400/30 flex items-center justify-center text-2xl shadow-inner">
                  {activeSlide.floatingCard.icon}
                </span>

                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2.5 py-1 rounded-md">
                  {activeSlide.floatingCard.tag}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-brand text-base font-bold text-white">
                  {activeSlide.floatingCard.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {activeSlide.floatingCard.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-extrabold text-emerald-400">
                <span className="flex items-center gap-1">
                  <span>✓</span>
                  <span>Covenant Safety Verified</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
