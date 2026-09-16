import React from 'react';
import { MatrimonyHeroSection } from '../components/homepage/MatrimonyHeroSection';
import { FeaturedProfiles } from '../components/homepage/FeaturedProfiles';
import { HowItWorksSection } from '../components/homepage/HowItWorksSection';
import { MatrimonyCovenantSection } from '../components/homepage/MatrimonyCovenantSection';
import { BlessedStoriesSection } from '../components/homepage/BlessedStoriesSection';
import { ScriptureSanctuarySection } from '../components/homepage/ScriptureSanctuarySection';
import { AboutTechmastersSection } from '../components/homepage/AboutTechmastersSection';
import { MatrimonyInvitationBanner } from '../components/homepage/MatrimonyInvitationBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] font-sans">
      {/* 1. Cinematic Matrimony Hero Section with Full-Bleed Carousel */}
      <MatrimonyHeroSection />

      {/* 2. Real Verified Christian Brides & Grooms from Database */}
      <FeaturedProfiles />

      {/* 4. How It Works: 3 Reverent Steps to Holy Matrimony */}
      <HowItWorksSection />

      {/* 5. Sacred Covenant, "Till You Marry" Promise, Daily Safety Limits & Discretion */}
      <MatrimonyCovenantSection />

      {/* 6. Sacred Christian Matrimony Gallery */}
      <BlessedStoriesSection />

      {/* 7. Scripture Sanctuary: 1 Corinthians 13:4-8 & Ecclesiastes 4:12 */}
      <ScriptureSanctuarySection />

      {/* 9. About Us & Techmasters Innovations Backbone */}
      <AboutTechmastersSection />

      {/* 10. Matrimony Invitation Closing Banner */}
      <MatrimonyInvitationBanner />
    </div>
  );
}
