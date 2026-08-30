import React from 'react';
import { TechmastersHeroSection } from '../components/homepage/TechmastersHeroSection';
import { TechmastersSearchSection } from '../components/homepage/TechmastersSearchSection';
import { DynamicProfilesSection } from '../components/homepage/DynamicProfilesSection';
import { DenominationsGrid } from '../components/homepage/DenominationsGrid';
import { TechmastersJourneySection } from '../components/homepage/TechmastersJourneySection';
import { IndianTrustSection } from '../components/homepage/IndianTrustSection';
import { TechmastersBottomBanner } from '../components/homepage/TechmastersBottomBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section (Techmasters Innovations style - Centered, ambient lighting, dual CTAs, NO registration form) */}
      <TechmastersHeroSection />

      {/* 2. Floating Match Search Bar */}
      <TechmastersSearchSection />

      {/* 3. Real Dynamic Profiles Feed (Direct from DB, 0 mock data) */}
      <DynamicProfilesSection />

      {/* 4. Christian Denominations & Communities Grid */}
      <DenominationsGrid />

      {/* 5. 4-Step Matchmaking Journey Framework */}
      <TechmastersJourneySection />

      {/* 6. Security, Trust & Confidential Privacy */}
      <IndianTrustSection />

      {/* 7. Bottom Conversion Banner */}
      <TechmastersBottomBanner />
    </div>
  );
}
