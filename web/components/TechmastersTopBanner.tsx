'use client';

import React from 'react';

export function TechmastersTopBanner() {
  return (
    <div className="bg-gradient-to-r from-[#771932] via-[#8c1936] to-[#771932] text-amber-100 text-xs py-2 px-4 border-b border-amber-400/30 flex items-center justify-between shadow-xs">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Product attribution */}
        <div className="flex items-center gap-2.5 font-medium">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-[#430917] shadow-sm">
            Official
          </span>
          <span className="text-white text-xs font-semibold">
            A <strong className="text-amber-300 font-extrabold tracking-wide">Techmasters Innovations</strong> Product
          </span>
          <span className="hidden md:inline text-rose-300/60">•</span>
          <span className="hidden md:inline text-amber-100/90 text-xs font-medium">
            Empowering Blessed Christian Marriages
          </span>
        </div>

        {/* Right: Regional highlight */}
        <div className="flex items-center gap-3 text-xs text-amber-100 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300 font-bold">Verified Profiles</span>
          </span>
          <span className="text-rose-300/50">|</span>
          <span className="font-semibold text-amber-100">Bidar • Karnataka • Pan India</span>
        </div>
      </div>
    </div>
  );
}

export default TechmastersTopBanner;
