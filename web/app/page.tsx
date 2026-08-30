import React from 'react';
import { IndianHeroSection } from '../components/homepage/IndianHeroSection';
import { DynamicProfilesSection } from '../components/homepage/DynamicProfilesSection';
import { DenominationsGrid } from '../components/homepage/DenominationsGrid';
import { IndianTrustSection } from '../components/homepage/IndianTrustSection';
import { IndianMatchProcess } from '../components/homepage/IndianMatchProcess';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Indian Matrimony Hero with Quick Search & Quick Registration */}
      <IndianHeroSection />

      {/* 2. Real Dynamic Profiles Feed (No dummy mock data, live from DB) */}
      <DynamicProfilesSection />

      {/* 3. Denominations & Christian Communities Grid */}
      <DenominationsGrid />

      {/* 4. Indian Family Trust, Privacy & Safety */}
      <IndianTrustSection />

      {/* 5. 3-Step Matchmaking & Bottom Free Registration Banner */}
      <IndianMatchProcess />
    </div>
  );
}
