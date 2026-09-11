import React from 'react';
import { MatrimonyHeroSection } from '../components/homepage/MatrimonyHeroSection';
import { FeaturedProfiles } from '../components/homepage/FeaturedProfiles';
import { MatrimonyCovenantSection } from '../components/homepage/MatrimonyCovenantSection';
import { AboutTechmastersSection } from '../components/homepage/AboutTechmastersSection';
import { MatrimonyInvitationBanner } from '../components/homepage/MatrimonyInvitationBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] font-sans">
      {/* 1. Cinematic Matrimony Hero Section with Shaadi-style couple imagery */}
      <MatrimonyHeroSection />

      {/* 2. Real Verified Christian Brides & Grooms from Database */}
      <FeaturedProfiles />

      {/* 3. Sacred Covenant, Faith & Family Privacy (Compact Unified Section) */}
      <MatrimonyCovenantSection />

      {/* 4. About Us & Techmasters Innovations Backbone */}
      <AboutTechmastersSection />

      {/* 5. Matrimony Invitation Closing Banner */}
      <MatrimonyInvitationBanner />
    </div>
  );
}
