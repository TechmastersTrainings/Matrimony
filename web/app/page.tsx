import React from 'react';
import { HeroSection } from '../components/homepage/HeroSection';
import { TrustBar } from '../components/homepage/TrustBar';
import { HowItWorks } from '../components/homepage/HowItWorks';
import { FeaturedProfiles } from '../components/homepage/FeaturedProfiles';
import { FaithSection } from '../components/homepage/FaithSection';
import { WhyChooseUs } from '../components/homepage/WhyChooseUs';
import { ContactRevealSection } from '../components/homepage/ContactRevealSection';
import { SuccessStories } from '../components/homepage/SuccessStories';
import { CommunitySection } from '../components/homepage/CommunitySection';
import { FinalCTA } from '../components/homepage/FinalCTA';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trust Strip */}
      <TrustBar />

      {/* 3. How It Works (4 Connected Steps) */}
      <HowItWorks />

      {/* 4. Featured Profiles Preview */}
      <FeaturedProfiles />

      {/* 5. Faith-Centered Section */}
      <FaithSection />

      {/* 6. Why Choose Us (4 Feature Cards) */}
      <WhyChooseUs />

      {/* 7. Contact Reveal Controlled Consent USP */}
      <ContactRevealSection />

      {/* 8. Real Success Stories & Testimonials */}
      <SuccessStories />

      {/* 9. Christian Community & 5 Pillars */}
      <CommunitySection />

      {/* 10. Final Call to Action */}
      <FinalCTA />
    </div>
  );
}
