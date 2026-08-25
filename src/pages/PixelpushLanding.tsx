import React from 'react';
import Navbar from '../components/pixelpush/Navbar';
import Hero from '../components/pixelpush/Hero';
import { TopDeveloperRail } from '../components/challenges/TopDeveloperRail';
import { SpotlightSection } from '../components/pixelpush/SpotlightSection';
import { ChallengeSection } from '../components/challenges/ChallengeSection';
import FeatureGrid from '../components/pixelpush/FeatureGrid';
import BenchmarkChart from '../components/pixelpush/BenchmarkChart';
import Pricing from '../components/pixelpush/Pricing';
import Faq from '../components/pixelpush/Faq';
import FinalCta from '../components/pixelpush/FinalCta';
import Footer from '../components/pixelpush/Footer';

export const PixelpushLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-orange-600 selection:text-white">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Landmark with Accessibility Anchor */}
      <main id="main-content">
        
        {/* 1. Direct Challenge Hero */}
        <div id="hero">
          <Hero />
        </div>

        {/* 2. Top Developer 72-Hour Earned Rail */}
        <div id="top-dev-rail" className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
          <TopDeveloperRail />
        </div>

        {/* 3. Challenge Arena (Weekly skill challenges + $5 entries) */}
        <div id="arena">
          <ChallengeSection />
        </div>

        {/* 4. Outbid Spotlight Ascending Auction Top 3 Slots */}
        <div id="spotlight">
          <SpotlightSection />
        </div>

        {/* 5. Feature Grid */}
        <div id="features">
          <FeatureGrid />
        </div>

        {/* 6. Benchmark / Chart Section */}
        <div id="benchmark">
          <BenchmarkChart />
        </div>

        {/* 7. Pricing Section */}
        <div id="pricing">
          <Pricing />
        </div>

        {/* 8. FAQ Section */}
        <div id="faq">
          <Faq />
        </div>

        {/* 9. Final CTA Section */}
        <div id="cta">
          <FinalCta />
        </div>

      </main>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
};

export default PixelpushLanding;
