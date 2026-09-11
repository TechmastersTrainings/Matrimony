'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTechmastersTag?: boolean;
  className?: string;
  lightText?: boolean;
}

export function Logo({
  size = 'md',
  showTechmastersTag = true,
  className = '',
  lightText = false,
}: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg sm:text-xl', sub: 'text-[9px]', tag: 'text-[8px]' },
    md: { icon: 'w-11 h-11', text: 'text-2xl sm:text-3xl', sub: 'text-[10px] sm:text-[11px]', tag: 'text-[9px] sm:text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-3xl sm:text-4xl', sub: 'text-[12px]', tag: 'text-[11px]' },
    xl: { icon: 'w-18 h-18', text: 'text-4xl sm:text-5xl', sub: 'text-[14px]', tag: 'text-[12px]' },
  }[size];

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Super Beautiful Emblem Logo */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses.icon}`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/40 via-amber-400/20 to-amber-600/40 blur-md transition-all group-hover:blur-lg" />
        
        {/* Badge Container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-burgundy-900 via-burgundy-950 to-burgundy-900 p-0.5 border border-gold-400/60 shadow-md group-hover:border-gold-300 group-hover:scale-105 transition-all duration-300">
          <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 flex items-center justify-center relative overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute -inset-x-full inset-y-0 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 group-hover:animate-shimmer" />

            {/* Emblem SVG: Grace Cross + Intertwined Covenant Rings in Nest Arch */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-3/5 h-3/5 text-burgundy-950 drop-shadow-xs"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Central Grace Cross */}
              <path d="M12 3v12" />
              <path d="M7.5 7h9" />
              
              {/* Sacred Nest Base Arch & Covenant Rings */}
              <path d="M4 14.5c2.5 5 13.5 5 16 0" strokeWidth="2.4" />
              <circle cx="10" cy="13.5" r="2.6" strokeWidth="1.8" />
              <circle cx="14" cy="13.5" r="2.6" strokeWidth="1.8" />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Text: CovenantNest */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-serif font-extrabold tracking-tight ${lightText ? 'text-white' : 'text-slate-900'} ${sizeClasses.text}`}>
            Covenant<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-cyan-600">Nest</span>
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`font-sans font-black tracking-[0.16em] uppercase text-cyan-800 ${sizeClasses.sub}`}>
            CHRISTIAN MATRIMONY • ADMIN PORTAL
          </span>

          {showTechmastersTag && (
            <>
              <span className="text-slate-300 font-bold hidden sm:inline">•</span>
              <span className={`font-sans font-semibold tracking-wider text-slate-800 flex items-center gap-1.5 bg-cyan-50/80 border border-cyan-200 px-2 py-0.5 rounded-full ${sizeClasses.tag}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
                Techmasters Innovations
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logo;
