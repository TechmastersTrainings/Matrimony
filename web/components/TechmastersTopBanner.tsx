'use client';

import React from 'react';

export function TechmastersTopBanner() {
  return (
    <div className="bg-gradient-to-r from-[#5a1024] via-[#1a2d3b] to-[#0c3944] text-cyan-50 text-xs py-2 px-4 border-b border-cyan-500/20 flex items-center justify-between shadow-xs">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Product attribution */}
        <div className="flex items-center gap-2.5 font-medium">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-orange-400 to-amber-400 text-orange-950 shadow-xs">
            Official
          </span>
          <span className="text-white text-xs font-semibold">
            A <strong className="text-cyan-300 font-extrabold tracking-wide">Techmasters Innovations</strong> Product
          </span>
          <span className="hidden md:inline text-cyan-300/40">•</span>
          <span className="hidden md:inline text-cyan-100/90 text-xs font-medium">
            Empowering Blessed Christian Marriages
          </span>
        </div>

        {/* Right: Regional highlight */}
        <div className="flex items-center gap-3 text-xs text-cyan-50 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300 font-bold">Verified Profiles</span>
          </span>
          <span className="text-cyan-300/30">|</span>
          <span className="font-semibold text-orange-200">Bidar • Karnataka • Pan India</span>
        </div>
      </div>
    </div>
  );
}

export default TechmastersTopBanner;
