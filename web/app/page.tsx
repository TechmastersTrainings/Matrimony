import React from 'react';
import { MatrimonyHeroSection } from '../components/homepage/MatrimonyHeroSection';
import { FeaturedProfiles } from '../components/homepage/FeaturedProfiles';
import { MatrimonyCovenantSection } from '../components/homepage/MatrimonyCovenantSection';
import { ScriptureSanctuarySection } from '../components/homepage/ScriptureSanctuarySection';
import { SacredDignitySection } from '../components/homepage/SacredDignitySection';
import { AboutTechmastersSection } from '../components/homepage/AboutTechmastersSection';
import { MatrimonyInvitationBanner } from '../components/homepage/MatrimonyInvitationBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans">
      {/* 1. Cinematic Sunset Matrimony Hero Section featuring uploaded bride & groom image */}
      <MatrimonyHeroSection />

      {/* 2. Real Verified Christian Brides & Grooms from Database */}
      <FeaturedProfiles />

      {/* 3. Sacred Pillars of Holy Matrimony: Faith, Prayer, Family Honor & Vows */}
      <MatrimonyCovenantSection />

      {/* 3. Scripture Sanctuary: 1 Corinthians 13 & Ecclesiastes 4:12 */}
      <ScriptureSanctuarySection />

      {/* 4. Sacred Dignity, Discretion & Family Reverence */}
      <SacredDignitySection />

      {/* 5. About Us & Techmasters Innovations Private Limited */}
      <AboutTechmastersSection />

      {/* 6. Matrimony Invitation Closing Banner */}
      <MatrimonyInvitationBanner />
    </div>
  );
}
