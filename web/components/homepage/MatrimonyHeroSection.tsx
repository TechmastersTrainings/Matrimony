'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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
    <section className="relative w-full overflow-hidden bg-[#fbf9f5]">
      {/* Full-Width Carousel Container with Subtle Navigation Controls */}
      <div
        className="group relative w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[660px] flex items-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* 6 High-Definition Carousel Background Images */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-[80%_30%] lg:object-[85%_35%] transform scale-100 transition-transform duration-[6000ms] ease-out filter brightness-[1.02] contrast-[1.02]"
            />
            {/* Directional Left-Side Text Protection Gradient: Only shades text area on the left.
                The right half (where the couple & faces are positioned) has ZERO white overlay for 100% vibrant, sharp visibility */}
            <div className="absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[50%] bg-gradient-to-r from-[#fbf9f5] via-[#fbf9f5]/90 to-transparent z-10 pointer-events-none" />
          </div>
        ))}

        {/* Previous Slide Arrow Button (‹) - shown on tablet and desktop */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/85 hover:bg-white text-stone-800 hover:text-[#8c1936] shadow-lg border border-stone-200/80 backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Slide Arrow Button (›) - shown on tablet and desktop */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/85 hover:bg-white text-stone-800 hover:text-[#8c1936] shadow-lg border border-stone-200/80 backdrop-blur-md items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Main Content Area: Cinematic Headline, Scripture & CTAs */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 lg:py-24">
          <div className="max-w-2xl lg:max-w-xl flex flex-col justify-center text-left space-y-3.5 sm:space-y-5 text-slate-900">
            {/* Badge with Gold/Green Highlight */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-amber-200/90 text-[11px] sm:text-[13px] font-bold tracking-wide uppercase text-amber-950 w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Dynamic H1 Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.14] font-brand text-slate-950 drop-shadow-2xs">
              {activeSlide.title}
            </h1>

            {/* Dynamic Scripture Quote with Warm Burgundy/Gold Accent */}
            <div className="border-l-4 border-[#8c1936] pl-3.5 sm:pl-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-50/90 via-rose-50/60 to-transparent backdrop-blur-xs rounded-r-xl max-w-xl shadow-2xs">
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-slate-800 leading-relaxed font-medium">
                {activeSlide.scripture}
              </p>
            </div>

            {/* Narrative Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-700 max-w-xl font-normal leading-relaxed">
              {activeSlide.subtitle}
            </p>

            {/* Action Links */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#8c1936] via-[#a82245] to-[#771932] hover:from-[#771932] hover:to-[#8c1936] text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-full sm:rounded-xl font-bold text-xs sm:text-base shadow-md shadow-rose-950/20 border border-amber-400/30 transition-all hover:scale-103 cursor-pointer text-center"
              >
                <span>Explore Verified Profiles</span>
                <span>→</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-slate-900 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full sm:rounded-xl font-bold text-xs sm:text-base border border-stone-300 shadow-xs backdrop-blur-md transition-all hover:scale-103 cursor-pointer text-center"
              >
                <span>Register Free Candidate</span>
                <span>+</span>
              </Link>
            </div>

            {/* Slide Counter & Smooth Progress Indicators */}
            <div className="flex items-center gap-3 pt-2 sm:pt-3">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-600">
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
                        ? 'w-8 bg-gradient-to-r from-[#8c1936] to-amber-500'
                        : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
