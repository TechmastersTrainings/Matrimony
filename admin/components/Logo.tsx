'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
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
  }[size];

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Super Beautiful Emblem Logo */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses.icon}`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500/40 via-amber-400/20 to-amber-600/40 blur-md transition-all group-hover:blur-lg" />
        
        {/* Badge Container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-0.5 border border-amber-400/50 shadow-xl shadow-amber-950/40 group-hover:border-amber-300 group-hover:scale-105 transition-all duration-300">
          <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center relative overflow-hidden">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-3/5 h-3/5 text-slate-950 drop-shadow-md"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v14" />
              <path d="M7 6h10" />
              <path d="M8.5 13.5C7 12 5 13.5 5 15.5c0 2 3.5 4.5 7 6.5 3.5-2 7-4.5 7-6.5 0-2-2-3.5-3.5-2C14 15 13 16 12 16.5c-1-.5-2-1.5-3.5-3z" fill="currentColor" fillOpacity="0.25" />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-brand font-extrabold tracking-tight ${lightText ? 'text-white' : 'text-slate-900'} ${sizeClasses.text}`}>
            Christian<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 drop-shadow-sm">Matrimony</span>
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`font-heading font-black tracking-[0.2em] uppercase text-amber-400 ${sizeClasses.sub}`}>
            ADMIN CONTROL
          </span>

          {showTechmastersTag && (
            <>
              <span className="text-slate-600 font-bold hidden sm:inline">•</span>
              <span className={`font-heading font-semibold tracking-wider text-slate-300 flex items-center gap-1.5 bg-slate-900/90 border border-amber-500/30 px-2 py-0.5 rounded-full ${sizeClasses.tag}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Techmasters Innovations Product
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logo;
