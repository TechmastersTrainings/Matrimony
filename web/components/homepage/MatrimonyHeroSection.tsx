'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const heroSlides = [
  {
    image: '/images/indian-christian-wedding-couple.jpg',
    badge: 'Christian Matrimony • Bidar & Pan-India',
    title: 'Where Holy Covenants Build Blessed Homes',
    subtitle:
      'Connecting devout Christian brides & bridegrooms across Karnataka, Telangana, and Pan-India through prayerful, verified matrimonial introductions.',
    scripture: '“Therefore what God has joined together, let no one separate.” — Mark 10:9',
  },
  {
    image: '/images/christian-church-altar-wedding.jpg',
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
  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      {/* 1. Full-Width Banner Carousel Container */}
      <div
        className="relative w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex items-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Carousel Background Images with Smooth Crossfade */}
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
              className="w-full h-full object-cover object-center lg:object-top transform scale-105 transition-transform duration-[6000ms] ease-out"
            />
            {/* Cinematic Gradient Overlay: Dark left gradient for high-contrast white text */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40 lg:to-slate-950/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/50" />
          </div>
        ))}

        {/* Carousel Left / Right Navigation Chevrons */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/20 transition-all z-30 cursor-pointer shadow-lg hover:scale-105"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/20 transition-all z-30 cursor-pointer shadow-lg hover:scale-105"
        >
          ›
        </button>

        {/* Main Content Area: Cinematic Headline, Scripture & CTAs */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl flex flex-col justify-center text-left space-y-4 sm:space-y-6 text-white">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-extrabold tracking-wide uppercase text-amber-300 w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Dynamic H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] font-brand drop-shadow-md">
              {activeSlide.title}
            </h1>

            {/* Dynamic Scripture Quote */}
            <div className="border-l-4 border-amber-400 pl-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-r-xl max-w-2xl">
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-amber-200/95 leading-relaxed">
                {activeSlide.scripture}
              </p>
            </div>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200/95 max-w-2xl font-normal leading-relaxed drop-shadow-xs">
              {activeSlide.subtitle}
            </p>

            {/* Action Links */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white px-7 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-lg border border-orange-400/40 transition-all hover:scale-103"
              >
                <span>Explore Verified Profiles</span>
                <span>→</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-7 py-3 rounded-xl font-bold text-sm sm:text-base border border-white/30 backdrop-blur-md transition-all hover:scale-103"
              >
                <span>Register Free Candidate</span>
                <span>+</span>
              </Link>
            </div>

            {/* Slide Counter & Indicators */}
            <div className="flex items-center gap-3 pt-4">
              <span className="text-xs font-mono font-bold tracking-widest text-slate-300">
                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>

              <div className="flex items-center gap-2">
                {heroSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentSlide(dotIdx)}
                    aria-label={`Jump to slide ${dotIdx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === dotIdx ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Nest Matrimony-Style Credibility & Trust Strip (Immediately Below Banner) */}
      <div className="w-full bg-white border-b border-slate-200 py-4 shadow-xs relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-slate-800">
            
            {/* Trust Point 1 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-lg shrink-0">
                ⛪
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Church Verified Profiles
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Parish &amp; pastor validated
                </p>
              </div>
            </div>

            {/* Trust Point 2 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
                🤝
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  &ldquo;Till You Marry&rdquo; Support
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  No 30-day renewal pressure
                </p>
              </div>
            </div>

            {/* Trust Point 3 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-lg shrink-0">
                🔒
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Mutual Consent Privacy
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Locked phone numbers
                </p>
              </div>
            </div>

            {/* Trust Point 4 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg shrink-0">
                📍
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Bidar &amp; Pan-India
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight">
                  MCI, CSI, Catholic &amp; more
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
