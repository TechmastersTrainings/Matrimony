'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const heroSlides = [
  {
    image: '/images/indian-christian-wedding-couple.jpg',
    badge: 'Christian Matrimony • Bidar & Pan-India',
    title: 'Where Holy Covenants Build Blessed Homes',
    subtitle:
      'Connecting devout Christian brides & bridegrooms across Karnataka, Telangana, and Pan-India through prayerful, verified matrimonial introductions.',
    scripture: '“Therefore what God has joined together, let no one separate.” — Mark 10:9',
    accent: 'from-orange-400 via-rose-300 to-amber-200',
  },
  {
    image: '/images/christian-church-altar-wedding.jpg',
    badge: 'Till You Marry Commitment',
    title: 'Register Once. Complete Support Till Marriage',
    subtitle:
      'Say goodbye to arbitrary 30-day renewal anxiety. Our sacred agency stands faithfully beside Christian families throughout their entire journey.',
    scripture: '“Love is patient, love is kind. It always protects, always trusts, always hopes.” — 1 Cor 13:4-7',
    accent: 'from-amber-300 via-orange-300 to-rose-300',
  },
  {
    image: '/images/christian-couple-traditional.jpg',
    badge: 'Honoring Christian Heritage',
    title: 'Preserving Faith, Modesty & Family Values',
    subtitle:
      'Connecting devout Methodist (MCI), CSI, Roman Catholic, Baptist, Pentecostal, and Protestant fellowships with dignity and pastoral respect.',
    scripture: '“Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.” — Prov 31:30',
    accent: 'from-emerald-300 via-teal-200 to-cyan-300',
  },
  {
    image: '/images/christian-wedding-vows-rings.jpg',
    badge: '100% Confidential & Secure',
    title: 'Mutual Family Consent & Protected Privacy',
    subtitle:
      'Contact numbers remain strictly locked until both families accept mutual interest. Daily contact limits protect candidate modesty.',
    scripture: '“Above all, love each other deeply, because love covers over a multitude of sins.” — 1 Peter 4:8',
    accent: 'from-rose-300 via-pink-200 to-amber-200',
  },
  {
    image: '/images/christian-wedding-rings-bible.jpg',
    badge: 'Scriptural Foundation',
    title: 'A Cord of Three Strands is Not Quickly Broken',
    subtitle:
      'Christ-centered unions prayerfully nurtured through verified background credentials, pastoral blessings, and parental guidance.',
    scripture: '“Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.” — Eccl 4:12',
    accent: 'from-cyan-300 via-sky-200 to-indigo-300',
  },
];

export function MatrimonyHeroSection() {
  const router = useRouter();

  // Matchmaker form state
  const [lookingFor, setLookingFor] = useState<'FEMALE' | 'MALE'>('FEMALE');
  const [profileFor, setProfileFor] = useState('Self');
  const [ageRange, setAgeRange] = useState('21-30');
  const [denomination, setDenomination] = useState('');
  const [district, setDistrict] = useState('');

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

  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      {/* 1. Full-Width Banner Carousel Container */}
      <div
        className="relative w-full min-h-[600px] sm:min-h-[640px] lg:min-h-[660px] flex items-center select-none"
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
            {/* Cinematic Gradient Overlay: Deep left shadow for crisp white text, soft bottom vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40 lg:to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/50" />
          </div>
        ))}

        {/* Carousel Left / Right Navigation Chevrons */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/20 transition-all z-30 cursor-pointer shadow-lg hover:scale-105"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/20 transition-all z-30 cursor-pointer shadow-lg hover:scale-105"
        >
          ›
        </button>

        {/* Main Content Area: Left Headline + Right Overlapping Matchmaker Card */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Cinematic Matrimonial Headline & Subtitle */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-4 sm:space-y-5 text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-extrabold tracking-wide uppercase text-amber-300 w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{activeSlide.badge}</span>
              </div>

              {/* Dynamic H1 Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] font-brand drop-shadow-md">
                {activeSlide.title}
              </h1>

              {/* Dynamic Scripture Quote */}
              <div className="border-l-3 border-amber-400 pl-3.5 py-1 bg-white/5 backdrop-blur-xs rounded-r-lg max-w-xl">
                <p className="text-xs sm:text-sm font-serif italic text-amber-200/95 leading-snug">
                  {activeSlide.scripture}
                </p>
              </div>

              {/* Narrative Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 max-w-xl font-normal leading-relaxed drop-shadow-xs">
                {activeSlide.subtitle}
              </p>

              {/* Quick Action Links & Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md border border-orange-400/40 transition-all hover:scale-102"
                >
                  <span>Explore Profiles</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-6 py-2.5 rounded-xl font-bold text-sm border border-white/30 backdrop-blur-md transition-all hover:scale-102"
                >
                  <span>Register Free</span>
                  <span>+</span>
                </Link>
              </div>

              {/* Slide Counter & Indicators */}
              <div className="flex items-center gap-3 pt-4">
                <span className="text-xs font-mono font-bold tracking-widest text-slate-300">
                  {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
                </span>

                <div className="flex items-center gap-1.5">
                  {heroSlides.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentSlide(dotIdx)}
                      aria-label={`Jump to slide ${dotIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === dotIdx ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Nest Matrimony-Style Floating Matchmaker Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl shadow-black/40 p-5 sm:p-6 border border-white/80 text-slate-900 backdrop-blur-md">
                
                {/* Card Title & Subtitle */}
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 font-brand">
                      Find Your Blessed Match
                    </h2>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                      100% Free
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Search verified Christian brides &amp; bridegrooms
                  </p>
                </div>

                {/* Matchmaker Search Form */}
                <form onSubmit={handleQuickSearch} className="pt-4 space-y-3.5">
                  
                  {/* 1. I am Looking For (Bride / Groom Toggle) */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                      I am Looking For
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLookingFor('FEMALE')}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          lookingFor === 'FEMALE'
                            ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs font-extrabold ring-1 ring-rose-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>👰</span>
                        <span>Christian Bride</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLookingFor('MALE')}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          lookingFor === 'MALE'
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-900 shadow-2xs font-extrabold ring-1 ring-cyan-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>🤵</span>
                        <span>Christian Groom</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Profile Created For */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">
                      Profile Created For
                    </label>
                    <select
                      value={profileFor}
                      onChange={(e) => setProfileFor(e.target.value)}
                      aria-label="Profile Created For"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="Self">Self (Candidate)</option>
                      <option value="Son">My Son</option>
                      <option value="Daughter">My Daughter</option>
                      <option value="Brother">My Brother</option>
                      <option value="Sister">My Sister</option>
                      <option value="Relative">Relative / Friend</option>
                    </select>
                  </div>

                  {/* 3. Church Denomination */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">
                      Church Denomination
                    </label>
                    <select
                      value={denomination}
                      onChange={(e) => setDenomination(e.target.value)}
                      aria-label="Church Denomination"
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">All Christian Fellowships</option>
                      <option value="Methodist (MCI)">Methodist Church in India (MCI)</option>
                      <option value="CSI">Church of South India (CSI)</option>
                      <option value="Roman Catholic">Roman Catholic (RC)</option>
                      <option value="Baptist">Baptist Fellowship</option>
                      <option value="Pentecostal">Pentecostal / Born-Again</option>
                      <option value="Protestant">Protestant &amp; Independent</option>
                    </select>
                  </div>

                  {/* 4. Age Range & District (Two-Column Row) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">
                        Age Range
                      </label>
                      <select
                        value={ageRange}
                        onChange={(e) => setAgeRange(e.target.value)}
                        aria-label="Age Range"
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      >
                        <option value="18-25">18 - 25 Yrs</option>
                        <option value="21-30">21 - 30 Yrs</option>
                        <option value="25-35">25 - 35 Yrs</option>
                        <option value="30-45">30 - 45 Yrs</option>
                        <option value="18-60">All Ages</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">
                        Region / City
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        aria-label="Region or City"
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      >
                        <option value="">All Regions</option>
                        <option value="Bidar">Bidar &amp; North KA</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Hyderabad">Hyderabad / TG</option>
                        <option value="Kalaburagi">Kalaburagi</option>
                      </select>
                    </div>
                  </div>

                  {/* 5. Primary Search CTA Button */}
                  <button
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white font-black text-sm py-3 px-4 rounded-xl shadow-lg shadow-orange-950/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Find Christian Matches</span>
                    <span>→</span>
                  </button>
                </form>

                {/* Sub-link to Register */}
                <div className="pt-3 text-center border-t border-slate-100 mt-3">
                  <p className="text-xs text-slate-600">
                    New candidate or parent?{' '}
                    <Link
                      href="/register"
                      className="font-bold text-orange-700 hover:text-orange-800 underline ml-1"
                    >
                      Register Free in 2 Mins →
                    </Link>
                  </p>
                </div>

                {/* Trust Guarantees */}
                <div className="pt-2.5 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                  <span>✓ 100% Free Search</span>
                  <span>•</span>
                  <span>🔒 Locked Phone Numbers</span>
                  <span>•</span>
                  <span>⛪ Pastoral Honor</span>
                </div>
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
