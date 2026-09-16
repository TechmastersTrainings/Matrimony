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
    md: { icon: 'w-11 h-11 sm:w-12 sm:h-12', text: 'text-2xl sm:text-3xl', sub: 'text-[10px] sm:text-[11px]', tag: 'text-[9px] sm:text-[10px]' },
    lg: { icon: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-3xl sm:text-4xl', sub: 'text-[12px]', tag: 'text-[11px]' },
    xl: { icon: 'w-18 h-18 sm:w-20 sm:h-20', text: 'text-4xl sm:text-5xl', sub: 'text-[14px]', tag: 'text-[12px]' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Round Emblem Logo */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses.icon}`}>
        {/* Ambient Halo Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-500/20 to-purple-600/30 blur-md transition-all group-hover:blur-lg" />
        
        {/* Circular Ring Container */}
        <div className="relative w-full h-full rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md group-hover:scale-105 transition-all duration-300 ring-1 ring-white/30 overflow-hidden">
          <img
            src="/images/covenant-nest-logo.png"
            alt="CovenantNest Logo"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>

      {/* Brand Text: CovenantNest */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-serif font-extrabold tracking-tight ${lightText ? 'text-white' : 'text-charcoal-900'} ${sizeClasses.text}`}>
            Covenant<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-cyan-600">Nest</span>
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`font-sans font-black tracking-[0.16em] uppercase ${lightText ? 'text-cyan-300' : 'text-cyan-800'} ${sizeClasses.sub}`}>
            CHRISTIAN MATRIMONY • BIDAR &amp; PAN INDIA
          </span>

          {showTechmastersTag && (
            <>
              <span className="text-slate-400 font-bold hidden xl:inline">•</span>
              <span className={`font-sans font-semibold tracking-wider hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full ${lightText ? 'text-slate-200 bg-white/10 border border-white/20' : 'text-charcoal-800 bg-cyan-50/80 border border-cyan-200'} ${sizeClasses.tag}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
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
