import React from 'react';
import Link from 'next/link';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description:
        'Share your testimony, church background, education, career, and family details with 5+ photos.',
      tag: '5-Minute Setup',
    },
    {
      number: '02',
      title: 'Discover Compatible Profiles',
      description:
        'Search verified brides and grooms by Christian denomination, values, and location with match scoring.',
      tag: 'Verified Matchmaking',
    },
    {
      number: '03',
      title: 'Connect & Build a Relationship',
      description:
        'Express interest, connect with mutual consent, and message privately in a respectful environment.',
      tag: 'Mutual Acceptance',
    },
    {
      number: '04',
      title: 'Take the Next Step Together',
      description:
        'Request contact details with two-way consent and bring both families together in blessed prayer.',
      tag: 'Family Blessing',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FAF9F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            Simple & Respectful Process
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#172554] mt-2 tracking-tight">
            Your Journey to Something Meaningful
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-3 font-normal">
            Designed for genuine believers seeking a lifelong partner with mutual faith, family values, and spiritual alignment.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 bg-[#E2E8F0] -translate-y-6 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-3xl p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif-heading text-2xl font-bold text-[#C9A227] tracking-wider">
                      {s.number}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[#FAF9F6] text-[#172554] border border-[#E2E8F0]">
                      {s.tag}
                    </span>
                  </div>

                  <h3 className="font-serif-heading text-lg font-bold text-[#172554] mb-2 group-hover:text-[#1D4ED8] transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0]/60 flex items-center gap-1.5 text-[11px] font-semibold text-[#172554]">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA prompt */}
        <div className="text-center mt-12">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#172554] hover:text-[#1D4ED8] group"
          >
            <span>Begin your journey today</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
