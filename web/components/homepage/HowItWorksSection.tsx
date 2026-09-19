'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface StepPoint {
  icon: string;
  title: string;
  desc: string;
}

interface StepData {
  id: number;
  phase: string;
  badge: string;
  title: string;
  subtitle: string;
  frontDesc: string;
  image: string;
  badgeStyle: string;
  borderStyle: string;
  activeGlow: string;
  backGradient: string;
  points: StepPoint[];
  scripture: string;
  highlight: string;
}

const roadmapSteps: StepData[] = [
  {
    id: 1,
    phase: 'Step 1',
    badge: 'Step 1 • Free Signup',
    title: 'Create a protected faith profile',
    subtitle: 'Your Details & Church Parish',
    frontDesc:
      'Fill in your profile with your details, education, work, and church name. Your phone number is never displayed publicly.',
    image: '/images/christian-wedding-rings-bible.jpg',
    badgeStyle: 'bg-amber-500/15 text-amber-900 border-amber-300/80',
    borderStyle: 'hover:border-amber-400/80 hover:shadow-amber-500/10',
    activeGlow: 'from-amber-500 to-amber-600',
    backGradient: 'from-[#1a0f0a] via-[#26150c] to-[#0f0805]',
    points: [
      {
        icon: '🔒',
        title: 'Private Phone Number',
        desc: 'Your phone number is never displayed publicly.',
      },
      {
        icon: '⛪',
        title: 'Church Credentials',
        desc: 'Mention your Methodist, CSI, Catholic, Baptist, or Pentecostal church.',
      },
      {
        icon: '🎁',
        title: '100% Free Signup',
        desc: 'Create your full profile with zero registration fees.',
      },
    ],
    scripture: '“Commit your way to the Lord; trust in Him and He will do this.” — Psalm 37:5',
    highlight: 'Phone Number Kept Private',
  },
  {
    id: 2,
    phase: 'Step 2',
    badge: 'Step 2 • Find Match',
    title: 'Discover compatibility, then express interest',
    subtitle: 'Search Verified Profiles',
    frontDesc:
      'Look through genuine Christian profiles filtered by church or city. Conversation begins only after interest is mutual.',
    image: '/images/christian-wedding-vows-rings.jpg',
    badgeStyle: 'bg-cyan-500/15 text-cyan-900 border-cyan-300/80',
    borderStyle: 'hover:border-cyan-400/80 hover:shadow-cyan-500/10',
    activeGlow: 'from-cyan-500 to-teal-600',
    backGradient: 'from-[#07171d] via-[#0b242e] to-[#040d11]',
    points: [
      {
        icon: '💬',
        title: 'Mutual Interest First',
        desc: 'Conversation begins only after interest is mutual.',
      },
      {
        icon: '🔍',
        title: 'Filter by Church',
        desc: 'Easily find profiles matching your faith denomination and values.',
      },
      {
        icon: '🛡️',
        title: 'Safe & Respectful',
        desc: 'Daily safety limits keep your account private and free from spam.',
      },
    ],
    scripture: '“Be completely humble and gentle; be patient, bearing with one another in love.” — Ephesians 4:2',
    highlight: 'Mutual Interest Only',
  },
  {
    id: 3,
    phase: 'Step 3',
    badge: 'Step 3 • Family Meeting',
    title: 'Connect families and prepare for marriage',
    subtitle: 'Parents & Pastors Meeting',
    frontDesc:
      'When both of you accept interest, verified family numbers are shared. Both people control when family contact is opened.',
    image: '/images/covenant-wedding-couple.jpg',
    badgeStyle: 'bg-emerald-500/15 text-emerald-900 border-emerald-300/80',
    borderStyle: 'hover:border-emerald-400/80 hover:shadow-emerald-500/10',
    activeGlow: 'from-emerald-500 to-green-600',
    backGradient: 'from-[#061c14] via-[#092b1e] to-[#030e0a]',
    points: [
      {
        icon: '🤝',
        title: 'You Control Access',
        desc: 'Both people control when family contact is opened.',
      },
      {
        icon: '👨‍👩‍👧',
        title: 'Family & Pastor Support',
        desc: 'Parents and pastors guide your meeting with prayer and joy.',
      },
      {
        icon: '💍',
        title: 'Support Till Marriage',
        desc: 'Continuous help until your wedding day with no time limits.',
      },
    ],
    scripture: '“A cord of three strands is not quickly broken.” — Ecclesiastes 4:12',
    highlight: 'You Control Unlocking',
  },
];

export function HowItWorksSection() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [activeStepId, setActiveStepId] = useState<number>(1);
  const flipTimers = useRef<Record<number, NodeJS.Timeout>>({});

  const handleCardFlip = (id: number, forceState?: boolean) => {
    // Clear any existing 5-second timer for this step
    if (flipTimers.current[id]) {
      clearTimeout(flipTimers.current[id]);
    }

    setFlippedCards((prev) => {
      const nextState = forceState !== undefined ? forceState : !prev[id];

      // If flipping to back (true), auto flip back after 5 seconds (5000ms)
      if (nextState) {
        flipTimers.current[id] = setTimeout(() => {
          setFlippedCards((current) => ({ ...current, [id]: false }));
        }, 5000);
      }

      return { ...prev, [id]: nextState };
    });
  };

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#fdfbf7] via-[#faf6ee] to-[#fdfbf7] text-[#1e1b18] border-b border-charcoal-100/70 relative overflow-hidden select-none">
      {/* Ambient Decorative Background Halo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-amber-200/15 via-rose-200/15 to-cyan-200/15 rounded-full blur-3xl pointer-events-none animate-ambient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-14">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-50 via-rose-50 to-cyan-50 border border-amber-200/80 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Interactive Matrimonial Roadmap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-brand">
            How Covenant Nest Works
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            A simple, trusted way for Christian brides, grooms, and families to connect across India.
          </p>
        </motion.div>

        {/* Animated Connected Roadmap Timeline Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative max-w-4xl mx-auto px-2"
        >
          {/* Connecting Track Line behind Nodes */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 bg-stone-200 rounded-full z-0" />

          {/* Glowing Animated Progress Bar */}
          <motion.div
            className="absolute top-1/2 left-8 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 rounded-full z-0 transition-all duration-500"
            style={{
              width: activeStepId === 1 ? '0%' : activeStepId === 2 ? '50%' : 'calc(100% - 4rem)',
            }}
          />

          {/* 3 Interactive Milestone Nodes */}
          <div className="relative z-10 flex items-center justify-between">
            {roadmapSteps.map((step) => {
              const isActive = activeStepId === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setActiveStepId(step.id);
                    handleCardFlip(step.id, false);
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg transition-all duration-300 shadow-md ${
                      isActive
                        ? 'bg-gradient-to-tr from-slate-900 via-burgundy-950 to-slate-900 text-amber-300 border-2 border-amber-400 ring-4 ring-amber-400/20 scale-110'
                        : 'bg-white text-slate-700 border border-stone-300 hover:border-amber-400'
                    }`}
                  >
                    <span>{step.id === 1 ? '✝️' : step.id === 2 ? '🕊️' : '💒'}</span>
                  </motion.div>
                  <span
                    className={`mt-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-colors ${
                      isActive ? 'text-burgundy-900 font-black' : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  >
                    {step.phase}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 3 Interactive Flip Cards Grid (Hover triggers flip & 5s auto-flipback) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 perspective-1000">
          {roadmapSteps.map((step, idx) => {
            const isFlipped = !!flippedCards[step.id];

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative min-h-[480px] sm:min-h-[510px] w-full"
                style={{ perspective: '1200px' }}
                onMouseEnter={() => {
                  handleCardFlip(step.id, true);
                  setActiveStepId(step.id);
                }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-full h-full relative"
                >
                  {/* ==================== CARD FRONT VIEW ==================== */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className={`absolute inset-0 w-full h-full bg-white rounded-2xl sm:rounded-3xl border border-charcoal-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${step.borderStyle}`}
                  >
                    {/* High-Definition Photo Container */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                      {/* Phase Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full border shadow-xs backdrop-blur-md ${step.badgeStyle}`}>
                          {step.badge}
                        </span>
                      </div>

                      {/* Hover Hint Badge */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-amber-300 text-xs px-2.5 py-1 rounded-full font-bold border border-amber-400/30 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <span>Hover to Flip</span>
                        <span>↺</span>
                      </div>
                    </div>

                    {/* Step Card Text Body */}
                    <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-widest block font-mono">
                          {step.subtitle}
                        </span>
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-brand group-hover:text-burgundy-900 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
                          {step.frontDesc}
                        </p>
                      </div>

                      {/* Flip Action Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-emerald-700 text-xs sm:text-sm font-bold flex items-center gap-1">
                          <span>✓</span>
                          <span>{step.highlight}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            handleCardFlip(step.id);
                            setActiveStepId(step.id);
                          }}
                          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all flex items-center gap-1 cursor-pointer hover:scale-105 border border-slate-200"
                        >
                          <span>Full Details</span>
                          <span className="text-amber-600">↺</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ==================== CARD BACK VIEW (FLIPPED) ==================== */}
                  <div
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className={`absolute inset-0 w-full h-full bg-gradient-to-br ${step.backGradient} text-white rounded-2xl sm:rounded-3xl border border-amber-400/30 p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-hidden`}
                  >
                    {/* Header */}
                    <div className="space-y-2 border-b border-white/15 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-md">
                          {step.phase} • Details (Auto-flips in 5s)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCardFlip(step.id, false)}
                          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                          aria-label="Close flip card"
                        >
                          ✕
                        </button>
                      </div>

                      <h4 className="font-brand text-lg sm:text-xl font-bold text-white">
                        {step.title}
                      </h4>
                    </div>

                    {/* Detailed Features List */}
                    <div className="space-y-3 py-2 flex-1">
                      {step.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                          <span className="text-base shrink-0">{pt.icon}</span>
                          <div className="space-y-0.5 text-left">
                            <span className="text-xs sm:text-sm font-bold text-amber-300 block">
                              {pt.title}
                            </span>
                            <p className="text-xs sm:text-sm text-stone-200 leading-normal">
                              {pt.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Scripture Quote Footer */}
                    <div className="pt-3 border-t border-white/15 space-y-2">
                      <p className="text-xs sm:text-sm font-serif italic text-amber-200/90 leading-snug">
                        {step.scripture}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleCardFlip(step.id, false)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Back to Overview</span>
                        <span>↻</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-orange-50 via-amber-50 to-cyan-50 border border-orange-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 font-brand">
              Ready to begin your prayerful matrimonial journey?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Create your profile in under 3 minutes. Zero registration fee.
            </p>
          </div>

          <Link
            href="/register"
            className="btn-shine-effect shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-burgundy-700 via-rose-600 to-orange-600 hover:from-burgundy-600 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-sm transition-transform hover:scale-103"
          >
            <span>Register Profile Free</span>
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
