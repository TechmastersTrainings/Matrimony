'use client';

import React from 'react';
import Link from 'next/link';

export function TechmastersJourneySection() {
  const steps = [
    {
      step: 'STEP 1',
      tag: 'AUTHENTICATION',
      title: 'Profile Setup & Church Verification',
      desc: 'Create your matrimonial account with 5+ photos, church denomination, and verified mobile authentication.',
      features: [
        'Mobile OTP and email verification pipeline',
        'Pastoral and denomination validation',
        'Controlled photo privacy and primary photo settings',
      ],
      linkText: 'Learn about verification',
      linkHref: '/verification-status',
    },
    {
      step: 'STEP 2',
      tag: 'DISCOVERY',
      title: 'Smart Matrimonial Matchmaking',
      desc: 'Filter verified candidates by age, denomination (MCI, CSI, Catholic, Baptist, Pentecostal), education, and city.',
      features: [
        'Opposite gender preference matching engine',
        'Dedicated Bidar, Karnataka & Pan-India regional filters',
        'Detailed candidate background without public phone leaks',
      ],
      linkText: 'Explore active profiles',
      linkHref: '/discover',
    },
    {
      step: 'STEP 3',
      tag: 'INTERACTION',
      title: 'Express Interest & Mutual Acceptance',
      desc: 'Send respectful matrimonial connection requests. Once accepted by both sides, start direct in-app messaging.',
      features: [
        'Respectful one-click matrimonial interest requests',
        'In-app direct messaging for mutually accepted matches',
        'Zero spam with immediate user block and report safety',
      ],
      linkText: 'View matchmaking process',
      linkHref: '/discover',
    },
    {
      step: 'STEP 4',
      tag: 'FAMILY ALLIANCE',
      title: 'Controlled Contact Reveal & Family Blessing',
      desc: 'Exchange verified phone numbers and parent details only after two-way mutual consent.',
      features: [
        'Strict two-way consent before any phone/email disclosure',
        'Parent, sibling, and candidate joint coordination',
        'Direct family meetings arranged in spiritual peace',
      ],
      linkText: 'Read contact reveal policy',
      linkHref: '/subscriptions',
    },
  ];

  return (
    <section id="journey" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Lighting Blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
            Structured Matrimonial Journey
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Your Proven Path to a Blessed Alliance
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A secure 4-step framework combining authentic church background, rigorous profile moderation, private candidate chat, and confidential contact sharing.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {s.step}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800/60">
                    {s.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5">
                  {s.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  {s.desc}
                </p>

                <ul className="space-y-2 mb-6 text-xs text-slate-300 border-t border-slate-900 pt-4">
                  {s.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={s.linkHref}
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs font-bold pt-3 border-t border-slate-800/80"
              >
                <span>{s.linkText}</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
