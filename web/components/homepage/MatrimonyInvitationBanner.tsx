'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function MatrimonyInvitationBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-[#5a1024] via-[#771932] to-[#0c3944] text-white py-14 sm:py-16 relative overflow-hidden">
      {/* Background Wedding Couple Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 filter brightness-110"
          style={{ backgroundImage: "url('/images/hero-slide-4.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5a1024]/90 via-[#771932]/85 to-[#0c3944]/90" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3 sm:space-y-4"
      >
        {/* Headline */}
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-brand">
            Your Story of Faith &amp; Love Begins Here
          </h2>
          <p className="text-xs sm:text-sm text-cyan-50/95 max-w-xl mx-auto leading-relaxed">
            Take the first step in prayer and faith. Join Christian brides, grooms, and prayerful families seeking God&apos;s ordained blessing in holy matrimony.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-1">
          <Link
            href="/register"
            className="btn-shine-effect w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-300 hover:to-amber-300 text-orange-950 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md border border-orange-300 transition-transform hover:scale-103"
          >
            <span>Register Your Profile Free</span>
            <span>→</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm border border-white/25 backdrop-blur-md transition-transform hover:scale-103"
          >
            <span>Sign In to Member Portal</span>
            <span>→</span>
          </Link>
        </div>

        <p className="text-[11px] sm:text-xs text-cyan-200/90 pt-0.5">
          Serving Christian families across Bidar, Bengaluru, Kalaburagi, Hyderabad &amp; beyond.
        </p>
      </motion.div>
    </section>
  );
}

export default MatrimonyInvitationBanner;
