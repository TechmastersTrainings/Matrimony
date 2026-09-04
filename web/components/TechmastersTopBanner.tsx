'use client';

import React from 'react';

export function TechmastersTopBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-amber-500/30 flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Product attribution */}
        <div className="flex items-center gap-2.5 font-medium">
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-900/50">
            Official
          </span>
          <span className="text-slate-200 text-xs font-semibold">
            A <strong className="text-amber-400 font-extrabold tracking-wide">Techmasters Innovations</strong> Product
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400 text-xs font-medium">
            Empowering Blessed Christian Marriages
          </span>
        </div>

        {/* Right: Regional highlight */}
        <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">Verified Profiles</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="font-semibold text-slate-300">Bidar • Karnataka • Pan India</span>
        </div>
      </div>
    </div>
  );
}

export default TechmastersTopBanner;
