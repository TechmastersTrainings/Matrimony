'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const heroSlides = [
  {
    image: '/images/indian-christian-wedding-couple.jpg',
    title: 'Blessed Holy Matrimony',
    subtitle: 'Connecting faithful Christian brides & grooms in Christ',
    badge: 'Holy Union',
  },
  {
    image: '/images/christian-church-altar-wedding.jpg',
    title: 'Sacred Altar Prayer',
    subtitle: 'Solemn vows rooted in prayer and pastoral honor',
    badge: 'Church Blessing',
  },
  {
    image: '/images/christian-couple-traditional.jpg',
    title: 'Joyful Christian Families',
    subtitle: 'Preserving modesty, Christian culture, and harmony',
    badge: 'Faith & Family',
  },
  {
    image: '/images/christian-wedding-vows-rings.jpg',
    title: 'Holy Covenant of Vows',
    subtitle: 'A cord of three strands is not quickly broken (Eccl 4:12)',
    badge: 'Holy Vows',
  },
];

export function MatrimonyHeroSection() {
  const router = useRouter();
  const [lookingFor, setLookingFor] = useState<'FEMALE' | 'MALE'>('FEMALE');
  const [ageRange, setAgeRange] = useState('21-30');
  const [denomination, setDenomination] = useState('');
  const [district, setDistrict] = useState('');

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (lookingFor) params.set('gender', lookingFor);
    if (denomination) params.set('denomination', denomination);
    if (district) params.set('district', district);
    if (ageRange) {
      const [min, max] = ageRange.split('-');
      if (min) params.set('age_min', min);
      if (max) params.set('age_max', max);
    }
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#fdfbf7] text-[#1e1b18] pt-20 sm:pt-24 pb-8 sm:pb-10 border-b border-charcoal-100">
      {/* Background Light Atmospheric Matrimonial View */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-right lg:bg-center bg-no-repeat opacity-20 filter saturate-125 contrast-105"
          style={{ backgroundImage: "url('/images/indian-christian-wedding-couple.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/90 to-transparent lg:to-[#fdfbf7]/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7]/60 via-transparent to-[#fdfbf7]" />
        <div className="absolute top-6 left-1/4 w-[500px] h-[250px] bg-gradient-to-tr from-cyan-200/20 via-orange-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-6 right-1/4 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-6 sm:space-y-8">
        {/* Top: 2-Column Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Headline, Narrative & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            {/* Sacred Matrimony Badge with Fresh Colors */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-50 via-orange-50 to-emerald-50 border border-cyan-200/90 text-charcoal-900 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="tracking-wide font-extrabold text-cyan-950">CovenantNest • Christian Matrimony</span>
              <span className="text-orange-400 font-bold">•</span>
              <span className="text-emerald-800 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md text-xs">Bidar &amp; Pan-India</span>
            </div>

            {/* Majestic Matrimonial Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-slate-900 font-brand">
              Where Holy Covenants Build{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-cyan-700">
                Blessed Homes
              </span>
            </h1>

            {/* Sacred Scripture Quote with Light Orange accent frame */}
            <div className="w-full max-w-lg bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-cyan-50/50 border-l-4 border-orange-500 py-2.5 px-4 rounded-r-xl shadow-2xs text-left">
              <p className="text-sm sm:text-base font-serif italic text-charcoal-900 leading-snug">
                &ldquo;Therefore what God has joined together, let no one separate.&rdquo;
              </p>
              <span className="block text-xs uppercase tracking-widest text-orange-800 font-bold mt-1">
                — Mark 10:9
              </span>
            </div>

            {/* Matrimony Emotion & Theme Narrative */}
            <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-normal">
              A reverent Christian matrimonial sanctuary where faithful brides, bridegrooms, and prayerful families across Methodist, CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships build blessed, lifelong homes in Christ.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-1">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white px-7 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-md shadow-orange-950/15 border border-orange-400/40 transition-all transform hover:-translate-y-0.5"
              >
                <span>Begin Your Journey Free</span>
                <span>→</span>
              </Link>

              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-cyan-50/80 text-cyan-950 px-7 py-3 rounded-xl font-bold text-sm sm:text-base border border-cyan-200 shadow-2xs transition-all transform hover:-translate-y-0.5"
              >
                <span>Search Profiles</span>
                <span>→</span>
              </Link>
            </div>

            {/* Trust Checklist Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm font-bold text-slate-700">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-900 shadow-2xs">
                <span className="text-emerald-600 font-black">✓</span>
                <span>100% Genuine Profiles</span>
              </div>
              <div className="flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full text-cyan-900 shadow-2xs">
                <span>⛪</span>
                <span>Church Endorsements</span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full text-orange-900 shadow-2xs">
                <span>🔒</span>
                <span>Strict Family Privacy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Christian Couple Showcase Carousel */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative w-full max-w-xs sm:max-w-sm aspect-[4/4.8] rounded-2xl overflow-hidden shadow-xl border-3 border-white ring-1 ring-cyan-500/20 group select-none"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slides */}
              {heroSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    currentSlide === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/75 via-transparent to-transparent" />
                </div>
              ))}

              {/* Floating Top-Right Pill */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-cyan-950 border border-cyan-200/80 shadow-sm flex items-center gap-1.5 z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Verified Profiles</span>
              </div>

              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                aria-label="Previous Slide"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
              >
                ‹
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                aria-label="Next Slide"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
              >
                ›
              </button>

              {/* Floating Bottom Info Card with Slide Details */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-white/60 shadow-lg space-y-1.5 z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-serif font-extrabold text-charcoal-900 truncate">
                    {heroSlides[currentSlide].title}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md shrink-0">
                    {heroSlides[currentSlide].badge}
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-600 font-medium line-clamp-1">
                  {heroSlides[currentSlide].subtitle}
                </p>

                {/* Carousel Indicator Dots */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {heroSlides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlide(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === dotIdx ? 'w-5 bg-orange-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Quick Partner Search Finder Widget */}
        <div className="w-full bg-white rounded-2xl border border-charcoal-200 p-4 sm:p-5 shadow-md shadow-charcoal-950/5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-charcoal-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 font-brand">
                Quick Partner Search • Find Christian Matches
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              ✓ Free to Search &amp; Explore
            </span>
          </div>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            {/* 1. Looking For */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">I am seeking</label>
              <select
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value as 'FEMALE' | 'MALE')}
                aria-label="I am seeking"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="FEMALE">Christian Bride (Female)</option>
                <option value="MALE">Christian Groom (Male)</option>
              </select>
            </div>

            {/* 2. Age Range */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Age Range</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                aria-label="Age Range"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="18-25">18 - 25 Yrs</option>
                <option value="21-30">21 - 30 Yrs</option>
                <option value="25-35">25 - 35 Yrs</option>
                <option value="30-45">30 - 45 Yrs</option>
                <option value="18-60">All Ages</option>
              </select>
            </div>

            {/* 3. Denomination */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Church Denomination</label>
              <select
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                aria-label="Church Denomination"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Denominations</option>
                <option value="Methodist (MCI)">Methodist (MCI)</option>
                <option value="CSI">Church of South India (CSI)</option>
                <option value="Roman Catholic">Roman Catholic</option>
                <option value="Baptist">Baptist</option>
                <option value="Pentecostal">Pentecostal / Born-Again</option>
                <option value="Protestant">Protestant &amp; Independent</option>
              </select>
            </div>

            {/* 4. Region / District */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Region / City</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                aria-label="Region or City"
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Regions</option>
                <option value="Bidar">Bidar &amp; North Karnataka</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad / Telangana</option>
                <option value="Kalaburagi">Kalaburagi</option>
              </select>
            </div>

            {/* 5. CTA Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Search Matches</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>

        {/* Four Sacred Hallmarks of Christian Marriage - Distinct Colorful Cards (Compact with readable font) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full pt-4 border-t border-charcoal-100/70 text-left">
          {/* Card 01 - Cyan Accent */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-cyan-50/90 to-cyan-100/30 border border-cyan-200 hover:border-cyan-400 transition-all shadow-2xs">
            <span className="text-xs font-mono font-bold text-cyan-700 tracking-wider mb-1 block">01 • PRAYER</span>
            <h4 className="text-sm font-bold text-cyan-950">Rooted in Prayer</h4>
            <p className="text-xs text-cyan-900/80 mt-1 leading-snug">
              Every holy union begins in prayer and divine guidance.
            </p>
          </div>

          {/* Card 02 - Light Orange Accent */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-orange-50/90 to-amber-100/30 border border-orange-200 hover:border-orange-400 transition-all shadow-2xs">
            <span className="text-xs font-mono font-bold text-orange-700 tracking-wider mb-1 block">02 • COVENANT</span>
            <h4 className="text-sm font-bold text-orange-950">Holy Covenant</h4>
            <p className="text-xs text-orange-900/80 mt-1 leading-snug">
              A sacred lifelong promise of love, grace, and fidelity.
            </p>
          </div>

          {/* Card 03 - Light Green Accent */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-emerald-50/90 to-green-100/30 border border-emerald-200 hover:border-emerald-400 transition-all shadow-2xs">
            <span className="text-xs font-mono font-bold text-emerald-700 tracking-wider mb-1 block">03 • BLESSING</span>
            <h4 className="text-sm font-bold text-emerald-950">Family Blessing</h4>
            <p className="text-xs text-emerald-900/80 mt-1 leading-snug">
              Honoring parents, church elders, and community traditions.
            </p>
          </div>

          {/* Card 04 - Rose & Amethyst Accent */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-rose-50/90 to-pink-100/30 border border-rose-200 hover:border-rose-400 transition-all shadow-2xs">
            <span className="text-xs font-mono font-bold text-rose-700 tracking-wider mb-1 block">04 • GRACE</span>
            <h4 className="text-sm font-bold text-rose-950">Lifelong Fellowship</h4>
            <p className="text-xs text-rose-900/80 mt-1 leading-snug">
              Walking together under Christ’s unconditional grace.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MatrimonyHeroSection;
