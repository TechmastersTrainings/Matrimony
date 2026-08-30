'use client';

import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-[#FAF9F6]">
      {/* Background subtle decorative radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1D4ED8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Subtle Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172554]/5 border border-[#172554]/10 text-xs font-semibold text-[#172554]">
              <span className="text-[#C9A227] text-sm">✝</span>
              <span>Faith-Centered Christian Matrimony</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#172554] tracking-tight leading-[1.15]">
              Find Someone <br className="hidden sm:inline" />
              Who Shares <br className="hidden sm:inline" />
              <span className="relative inline-block">
                <span className="relative z-10 text-[#172554]">Your Faith</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#C9A227]/25 -z-0 rounded-sm" />
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#64748B] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Build a meaningful relationship rooted in faith, trust and a shared vision for life. Verified profiles for Christian families in Bidar, Karnataka and across India.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-[#172554] hover:bg-[#1e3a8a] text-white font-semibold text-base px-8 py-4 rounded-full shadow-lg shadow-[#172554]/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-[#C9A227]/40 group"
              >
                <span>Create Your Profile</span>
                <span className="text-[#C9A227] group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                href="/discover"
                className="w-full sm:w-auto bg-white hover:bg-[#FAF9F6] text-[#172554] font-semibold text-base px-8 py-4 rounded-full border border-[#E2E8F0] shadow-sm hover:shadow transition-all text-center"
              >
                Explore Profiles
              </Link>
            </div>

            {/* Trust Checklist Badges */}
            <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs font-semibold text-[#17202A]/80">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">✓</span>
                <span>Verified Profiles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">✓</span>
                <span>Faith-Centered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">✓</span>
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer elegant frame with subtle gold accent */}
              <div className="relative rounded-3xl p-3 bg-white border border-[#E2E8F0] shadow-2xl shadow-[#172554]/10">
                <div className="aspect-4/5 rounded-2xl overflow-hidden relative bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80"
                    alt="Happy Indian Christian couple celebrating a meaningful relationship"
                    className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  />
                  {/* Subtle warm overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/60 via-transparent to-transparent" />

                  {/* Floating Testimonial/Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#172554] text-[#C9A227] flex items-center justify-center font-serif text-sm font-bold shrink-0">
                        ✝
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#17202A] truncate">
                          &quot;A blessed union rooted in prayer & trust&quot;
                        </p>
                        <p className="text-[10px] text-[#64748B] mt-0.5">
                          Methodist & CSI Families • Bidar & Bengaluru
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Accent Pill */}
              <div className="absolute -top-4 -left-4 bg-white border border-[#C9A227]/40 shadow-lg rounded-2xl px-4 py-2 flex items-center gap-2 hidden sm:flex">
                <span className="text-[#C9A227] text-base">★</span>
                <span className="text-xs font-bold text-[#172554]">100% Pastoral & Manual Checks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
