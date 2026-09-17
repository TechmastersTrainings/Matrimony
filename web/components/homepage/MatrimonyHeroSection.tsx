'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const heroSlides = [
  {
    image: '/images/indian-christian-wedding-couple.jpg',
    badge: 'Christian Matrimony • Bidar & Karnataka',
    title: 'Where Holy Covenants Build Blessed Homes',
    highlight: 'Blessed Homes',
    subtitle:
      'Connecting devout Christian brides & bridegrooms across Bidar, Karnataka, and beyond through prayerful, verified matrimonial introductions.',
    scripture: '“Therefore what God has joined together, let no one separate.” — Mark 10:9',
  },
  {
    image: '/images/christian-church-altar-wedding.jpg',
    badge: 'Till You Marry Commitment',
    title: 'Register Once. Complete Support Till Marriage',
    highlight: 'Till Marriage',
    subtitle:
      'Say goodbye to arbitrary 30-day renewal anxiety. Our sacred agency stands faithfully beside Christian families throughout their entire journey.',
    scripture: '“Love is patient, love is kind. It always protects, always trusts, always hopes.” — 1 Cor 13:4-7',
  },
  {
    image: '/images/christian-couple-traditional.jpg',
    badge: 'Honoring Christian Heritage',
    title: 'Preserving Faith, Modesty & Family Values',
    highlight: 'Family Values',
    subtitle:
      'Connecting devout Methodist (MCI), CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships with dignity and pastoral respect.',
    scripture: '“Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.” — Prov 31:30',
  },
  {
    image: '/images/christian-wedding-rings-bible.jpg',
    badge: '100% Confidential & Secure',
    title: 'Mutual Family Consent & Protected Privacy',
    highlight: 'Protected Privacy',
    subtitle:
      'Contact numbers remain strictly locked until both families accept mutual interest. Daily contact limits protect candidate modesty.',
    scripture: '“Above all, love each other deeply, because love covers over a multitude of sins.” — 1 Peter 4:8',
  },
  {
    image: '/images/covenant-sunset-couple.jpg',
    badge: 'Scriptural Foundation',
    title: 'A Cord of Three Strands is Not Quickly Broken',
    highlight: 'Three Strands',
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
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeSlide = heroSlides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#fbf9f5] group">
      {/* Full-Width Carousel Container */}
      <div
        className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* High-Resolution Carousel Slides with Natural Color Vibrancy */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
            }`}
          >
            {/* The High-Res Photo: positioned cleanly on the right half, razor sharp */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-[75%_25%] sm:object-[80%_30%] lg:object-[85%_35%] transform scale-100 transition-transform duration-[7000ms] ease-out filter contrast-[1.03] saturate-[1.05]"
            />

            {/* Left-Side Directional Gradient: Shields text on the left while leaving the couple 100% visible & bright on the right */}
            <div className="absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[50%] bg-gradient-to-r from-[#fbf9f5] via-[#fbf9f5]/95 to-transparent z-10" />

            {/* Subtle bottom edge blend into ivory canvas */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fbf9f5] via-[#fbf9f5]/60 to-transparent z-10" />
          </div>
        ))}

        {/* Content Container (Left-Aligned with High Contrast) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-22">
          <div className="max-w-2xl flex flex-col justify-center text-left space-y-4 sm:space-y-5 text-[#1e1b18]">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-amber-300/80 text-xs sm:text-sm font-bold tracking-wide uppercase text-[#8c1936] w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.14] font-brand text-stone-950">
              {activeSlide.title}
            </h1>

            {/* Scripture Quote Box */}
            <div className="border-l-4 border-[#8c1936] pl-4 py-2 bg-gradient-to-r from-amber-50/90 via-rose-50/60 to-transparent backdrop-blur-xs rounded-r-xl max-w-xl shadow-2xs">
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-stone-800 leading-relaxed font-medium">
                {activeSlide.scripture}
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-stone-700 max-w-xl font-normal leading-relaxed">
              {activeSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8c1936] via-[#a31d40] to-[#c59b27] hover:from-[#771932] hover:to-[#8c1936] text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Verified Profiles</span>
                <span>→</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-900 px-6 py-3 rounded-full font-bold text-sm sm:text-base border border-[#d8c8b6] shadow-xs backdrop-blur-md transition-all hover:border-[#8c1936] cursor-pointer"
              >
                <span>Register Free</span>
                <span className="text-[#8c1936] font-extrabold">+</span>
              </Link>
            </div>

            {/* Interactive Carousel Progress & Indicators */}
            <div className="flex items-center gap-4 pt-3">
              <span className="text-xs font-mono font-bold tracking-wider text-stone-600">
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
                        ? 'w-8 bg-gradient-to-r from-[#8c1936] to-[#c59b27]'
                        : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows (Visible on hover on larger screens) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-4 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md border border-stone-200 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="hidden md:flex absolute right-4 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow-md border border-stone-200 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
