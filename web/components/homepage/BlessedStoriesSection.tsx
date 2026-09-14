'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const stories = [
  {
    names: 'Preethi & Emmanuel',
    fellowship: 'Methodist Church in India (MCI) • Bidar & Bengaluru',
    year: 'Blessed Covenant 2025',
    image: '/images/christian-couple-traditional.jpg',
    quote:
      'We wanted a platform that respected Christian family traditions and wouldn’t treat marriage like casual dating. From our first prayerful interest to the day our parents met with our pastor, Covenant Nest gave us complete safety, dignity, and peace of mind.',
    highlight1: {
      title: '⛪ Pastoral & Parish Support',
      desc: 'Encouraging background validation through local church pastors and parish elders.',
    },
    highlight2: {
      title: '🔒 Modest Family Privacy',
      desc: 'Contact numbers are never shown publicly; only shared upon mutual family consent.',
    },
  },
  {
    names: 'Dr. Rachel & Joshua',
    fellowship: 'Church of South India (CSI) • Bengaluru Diocese',
    year: 'Blessed Covenant 2025',
    image: '/images/indian-christian-wedding-couple.jpg',
    quote:
      'Finding a life partner who understands both medical healthcare duties and our deep commitment to Christ seemed difficult. The mutual consent verification made our parents immediately comfortable and confident.',
    highlight1: {
      title: '🏥 Healthcare & Professional Focus',
      desc: 'Connecting Christian doctors, engineers, and educators with spiritual alignment.',
    },
    highlight2: {
      title: '🕊️ Daily Safety Limits',
      desc: 'Protection against unsolicited cold calls, keeping communication sincere and dignified.',
    },
  },
  {
    names: 'Anita & Stephen Paul',
    fellowship: 'Roman Catholic & Protestant Fellowship • Pan-India',
    year: 'Blessed Covenant 2024',
    image: '/images/christian-church-altar-wedding.jpg',
    quote:
      'The "Till You Marry" commitment gave our families zero pressure. We took our time praying through the match, involved our elders and parish priest, and celebrated our holy matrimony before the altar of God.',
    highlight1: {
      title: '💒 Sacred Church Blessing',
      desc: 'Honoring Christian marriage traditions and parish verification.',
    },
    highlight2: {
      title: '♾️ "Till You Marry" Assurance',
      desc: 'Long-term support with no arbitrary 30-day expiration anxiety.',
    },
  },
];

export function BlessedStoriesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % stories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = stories[activeIdx];

  return (
    <section
      className="py-12 sm:py-16 bg-[#fdfbf7] text-[#1e1b18] border-b border-charcoal-100/70 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-950">
              <span>❤️</span>
              <span>Blessed Christian Unions Carousel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-brand">
              Stories of Faith, Grace &amp; Covenant
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              See how God brings prayerful Christian families together through mutual faith and parental blessing.
            </p>
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev === 0 ? stories.length - 1 : prev - 1))}
              aria-label="Previous Story"
              className="w-10 h-10 rounded-full bg-white hover:bg-rose-50 border border-charcoal-200 text-slate-700 hover:text-rose-900 flex items-center justify-center font-bold text-lg shadow-2xs transition-colors cursor-pointer"
            >
              ‹
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-charcoal-200 rounded-full text-xs font-mono font-bold text-slate-600">
              <span className="text-rose-700 font-extrabold">0{activeIdx + 1}</span>
              <span>/</span>
              <span>0{stories.length}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => (prev + 1) % stories.length)}
              aria-label="Next Story"
              className="w-10 h-10 rounded-full bg-white hover:bg-rose-50 border border-charcoal-200 text-slate-700 hover:text-rose-900 flex items-center justify-center font-bold text-lg shadow-2xs transition-colors cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>

        {/* Story Card with Transition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center bg-white rounded-3xl border border-charcoal-200 p-6 sm:p-8 shadow-xs relative overflow-hidden min-h-[440px]">
          {/* Left Column: Real Couple Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/4.2] rounded-2xl overflow-hidden shadow-md border-2 border-white ring-1 ring-charcoal-200/80 group">
              <img
                src={current.image}
                alt={current.names}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-950 border border-emerald-200 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>United in Holy Matrimony</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-md">
                <span className="text-xs font-serif font-extrabold text-charcoal-900 block">
                  {current.names}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-1">
                  {current.fellowship}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Testimonials */}
          <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
            <blockquote className="space-y-2.5">
              <div className="text-amber-500 text-2xl font-serif">“</div>
              <p className="font-serif italic text-base sm:text-lg text-slate-800 leading-relaxed min-h-[90px]">
                {current.quote}
              </p>
              <footer className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                — {current.names}, {current.year}
              </footer>
            </blockquote>

            {/* Micro Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/60 space-y-1">
                <span className="text-xs font-bold text-orange-950 block">
                  {current.highlight1.title}
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {current.highlight1.desc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200/60 space-y-1">
                <span className="text-xs font-bold text-cyan-950 block">
                  {current.highlight2.title}
                </span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {current.highlight2.desc}
                </p>
              </div>
            </div>

            {/* Bottom Actions & Slide Tabs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all"
                >
                  <span>Find Your Story in Christ</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/about"
                  className="text-xs font-bold text-cyan-950 hover:underline"
                >
                  Our Values →
                </Link>
              </div>

              {/* Slide Selector Buttons */}
              <div className="flex items-center gap-1.5">
                {stories.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeIdx === idx ? 'w-6 bg-rose-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
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

export default BlessedStoriesSection;
