'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const heroSlides = [
  {
    image: '/images/indian-christian-wedding-couple.jpg',
    badge: 'Christian Matrimony • Bidar & Pan-India',
    title: 'Where Holy Covenants Build Blessed Homes',
    highlight: 'Blessed Homes',
    subtitle:
      'Connecting devout Christian brides & bridegrooms across Karnataka, Telangana, and Pan-India through prayerful, verified matrimonial introductions.',
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
    image: '/images/christian-wedding-vows-rings.jpg',
    badge: '100% Confidential & Secure',
    title: 'Mutual Family Consent & Protected Privacy',
    highlight: 'Protected Privacy',
    subtitle:
      'Contact numbers remain strictly locked until both families accept mutual interest. Daily contact limits protect candidate modesty.',
    scripture: '“Above all, love each other deeply, because love covers over a multitude of sins.” — 1 Peter 4:8',
  },
  {
    image: '/images/christian-wedding-rings-bible.jpg',
    badge: 'Scriptural Foundation',
    title: 'A Cord of Three Strands is Not Quickly Broken',
    highlight: 'Three Strands',
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

  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-[#fbf9f5]">
      {/* 1. Full-Width Lighter Banner Carousel Container */}
      <div
        className="relative w-full min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] flex items-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Carousel Background Images with Natural Light & Soft Luminous Gradient */}
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
              className="w-full h-full object-cover object-center lg:object-top transform scale-105 transition-transform duration-[6000ms] ease-out filter brightness-105 contrast-100"
            />
            {/* Lighter, Softer Gradient Overlay: Allows the wedding photo to be brightly seen while keeping text razor-sharp */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fbf9f5]/95 via-[#fbf9f5]/80 to-[#fbf9f5]/25 lg:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbf9f5]/90 via-transparent to-transparent" />
          </div>
        ))}

        {/* Main Content Area: Cinematic Headline, Scripture & CTAs (No arrow buttons) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl flex flex-col justify-center text-left space-y-4 sm:space-y-6 text-slate-900">
            
            {/* Badge with Light Styling */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-orange-200/90 text-xs sm:text-sm font-extrabold tracking-wide uppercase text-orange-900 w-fit shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{activeSlide.badge}</span>
            </div>

            {/* Dynamic H1 Headline with Rich Contrast */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] font-brand text-slate-950 drop-shadow-2xs">
              {activeSlide.title}
            </h1>

            {/* Dynamic Scripture Quote with Warm Light Accent */}
            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-gradient-to-r from-orange-50/95 via-amber-50/80 to-transparent backdrop-blur-xs rounded-r-xl max-w-2xl shadow-2xs">
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-slate-800 leading-relaxed font-medium">
                {activeSlide.scripture}
              </p>
            </div>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-700 max-w-2xl font-normal leading-relaxed">
              {activeSlide.subtitle}
            </p>

            {/* Action Links */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white px-7 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-md shadow-orange-950/15 border border-orange-400/40 transition-all hover:scale-103 cursor-pointer"
              >
                <span>Explore Verified Profiles</span>
                <span>→</span>
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-7 py-3 rounded-xl font-bold text-sm sm:text-base border border-slate-300/80 shadow-xs backdrop-blur-md transition-all hover:scale-103 cursor-pointer"
              >
                <span>Register Free Candidate</span>
                <span>+</span>
              </Link>
            </div>

            {/* Automatic Slide Counter & Indicator Dots (No manual arrow buttons) */}
            <div className="flex items-center gap-3 pt-4">
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
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === dotIdx ? 'w-8 bg-orange-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
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
