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
    image: '/images/hero-sunset-covenant-hands.jpg',
    badge: 'Christian Matrimony • Sacred Vows',
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
    image: '/images/hero-sunset-covenant-hands.jpg',
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
    image: '/images/hero-sunset-covenant-hands.jpg',
    badge: 'Christ-Centered Unions',
    title: 'A Cord of Three Strands is Not Quickly Broken',
    subtitle: 'Connecting devout Methodist (MCI), CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships with dignity.',
    scripture: '“A cord of three strands is not quickly broken.” — Ecclesiastes 4:12',
    floatingCard: {
      icon: '⛪',
      title: 'Denomination Filters',
      subtitle: 'Methodist, CSI, Catholic, Baptist & Pentecostal',
      tag: 'All Denominations',
    },
  },
  {
    image: '/images/hero-sunset-covenant-hands.jpg',
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
    image: '/images/hero-sunset-covenant-hands.jpg',
    badge: 'Honoring Christian Heritage',
    title: 'Preserving Faith, Modesty & Family Values',
    subtitle: 'Connecting Christian families with honor, respect, parental involvement, and zero pressure.',
    scripture: '“Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.” — Prov 31:30',
    floatingCard: {
      icon: '🤝',
      title: 'Mutual Consent',
      subtitle: 'Families meet with pastoral guidance and joy',
      tag: 'Family Centered',
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
    <section className="relative w-full overflow-hidden bg-[#0a090d] text-white select-none">
      {/* Top Animated Auto-Progress Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-40 overflow-hidden">
        <motion.div
          key={progressKey}
          initial={{ width: '0%' }}
          animate={{ width: isPaused ? '0%' : '100%' }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
          className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 shadow-md"
        />
      </div>

      {/* Subtle Atmospheric Ambient Backdrop (Soft warm glow, NOT stretched/maximized image) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-gradient-to-bl from-amber-400/10 via-amber-600/5 to-transparent rounded-full blur-[90px]" />
      </div>

      {/* Main Hero Container: Balanced 2-Column Showcase */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Rich Typography, Scripture & Actions (7 cols) */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left space-y-4 sm:space-y-5"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-amber-400/40 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-300 w-fit backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.14] font-brand text-white drop-shadow-md">
              {activeSlide.title}
            </h1>

            {/* Scripture Box with Gold Accent */}
            <div className="border-l-4 border-amber-400 pl-4 py-2.5 bg-white/5 backdrop-blur-md rounded-r-2xl border-y border-r border-amber-400/20 shadow-xl max-w-xl">
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-amber-100 leading-relaxed font-medium">
                {activeSlide.scripture}
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-stone-200 font-normal leading-relaxed max-w-xl">
              {activeSlide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
            </div>

            {/* Slide Navigation & Indicators */}
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

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2 ml-auto sm:ml-4">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-amber-400/30 flex items-center justify-center text-stone-200 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-amber-400/30 flex items-center justify-center text-stone-200 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  ›
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: The Photograph Shown As Is & Zoomed Out (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-lg lg:max-w-none group">
              {/* Outer Golden Ambient Halo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-amber-500/25 via-rose-500/20 to-amber-400/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Elegant Framed Photo Container (Natural 16:9 un-maximized proportions) */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/35 ring-1 ring-white/20 shadow-2xl bg-black/50">
                <img
                  src="/images/hero-sunset-covenant-hands.jpg"
                  alt="Holy Matrimony Covenant Hands and Rings"
                  className="w-full h-auto object-contain block transform transition-transform duration-500"
                />

                {/* Subtle Bottom Card Badge */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3.5 py-1.5 rounded-xl bg-black/65 backdrop-blur-md border border-amber-400/30 flex items-center justify-between text-xs text-amber-200 shadow-lg">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span>💍</span>
                    <span>Holy Matrimony Covenant</span>
                  </span>
                  <span className="font-serif italic text-amber-100/90 text-[11px]">
                    Genesis 2:24
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
