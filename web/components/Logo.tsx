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
  lightText = true,
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

            {/* Emblem SVG: Grace Cross + Intertwined Union Hearts */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-3/5 h-3/5 text-burgundy-950 drop-shadow-xs"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Central Grace Cross */}
              <path d="M12 2v14" />
              <path d="M7 6h10" />
              
              {/* Intertwined Heart Rings */}
              <path d="M8.5 13.5C7 12 5 13.5 5 15.5c0 2 3.5 4.5 7 6.5 3.5-2 7-4.5 7-6.5 0-2-2-3.5-3.5-2C14 15 13 16 12 16.5c-1-.5-2-1.5-3.5-3z" fill="currentColor" fillOpacity="0.25" />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-serif font-extrabold tracking-tight ${lightText ? 'text-white' : 'text-charcoal-900'} ${sizeClasses.text}`}>
            Christian<span className="text-burgundy-700">Matrimony</span>
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`font-sans font-black tracking-[0.2em] uppercase text-gold-700 ${sizeClasses.sub}`}>
            BIDAR • KARNATAKA
          </span>

          {showTechmastersTag && (
            <>
              <span className="text-[#c7b9a2] font-bold hidden sm:inline">•</span>
              <span className={`font-sans font-semibold tracking-wider text-charcoal-800 flex items-center gap-1.5 bg-[#faf6ee] border border-[#ded0ba] px-2 py-0.5 rounded-full ${sizeClasses.tag}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-burgundy-600 animate-pulse" />
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
