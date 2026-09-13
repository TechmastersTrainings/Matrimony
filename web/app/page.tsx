import React from 'react';
import { MatrimonyHeroSection } from '../components/homepage/MatrimonyHeroSection';
import { FeaturedProfiles } from '../components/homepage/FeaturedProfiles';
import { MatrimonyCovenantSection } from '../components/homepage/MatrimonyCovenantSection';
import { ScriptureSanctuarySection } from '../components/homepage/ScriptureSanctuarySection';
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

      {/* 4. Scripture Sanctuary: 1 Corinthians 13:4-8 & Ecclesiastes 4:12 */}
      <ScriptureSanctuarySection />

      {/* 5. About Us & Techmasters Innovations Backbone */}
      <AboutTechmastersSection />

      {/* 6. Matrimony Invitation Closing Banner */}
      <MatrimonyInvitationBanner />
    </div>
  );
}

