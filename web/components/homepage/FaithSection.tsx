import React from 'react';
import Link from 'next/link';

export function FaithSection() {
  return (
    <section className="py-24 bg-[#172554] text-white relative overflow-hidden">
      {/* Subtle gold glow background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-xs font-bold text-[#C9A227] tracking-wider uppercase">
              <span>✦</span>
              <span>Spiritual Foundation</span>
            </div>

            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              More Than a Match. <br className="hidden sm:inline" />
              <span className="text-[#C9A227]">A Shared Faith.</span>
            </h2>

            <p className="text-base text-stone-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              We believe marriage begins with understanding, shared values and faith. Our platform helps Christian individuals and families discover meaningful connections with purpose, prayer, and mutual commitment.
            </p>

            <div className="space-y-4 pt-2 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✝
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Denominational & Church Alignment</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Connect across Methodist, CSI, Catholic, Baptist, Pentecostal, and Protestant fellowships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  👨‍👩‍👧‍👦
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Family-Honoring Approach</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Whether created by the candidate or parents, our platform respects Christian family traditions.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#C9A227] hover:bg-[#d4af37] text-[#172554] font-bold text-sm px-8 py-3.5 rounded-full shadow-lg transition-all"
              >
                <span>Find Your Faith Partner</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg">
              <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-white/5 p-2">
                <div className="aspect-4/3 rounded-2xl overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80"
                    alt="Christian family celebrating a marriage milestone"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/80 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating Scripture / Quote Box */}
              <div className="absolute -bottom-6 left-6 right-6 p-5 rounded-2xl bg-white text-[#17202A] shadow-xl border border-[#E2E8F0] hidden sm:block">
                <p className="font-serif-heading text-xs italic text-[#172554]">
                  &quot;Two are better than one, because they have a good return for their labor.&quot;
                </p>
                <span className="text-[10px] uppercase font-bold text-[#C9A227] tracking-wider block mt-1.5">
                  Ecclesiastes 4:9
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
