import React from 'react';
import Navbar from '../components/pixelpush/Navbar';
import Hero from '../components/pixelpush/Hero';
import { SpotlightSection } from '../components/pixelpush/SpotlightSection';
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
        
        {/* 1. Direct Marketplace Hero */}
        <div id="hero">
          <Hero />
        </div>

        {/* 2. Outbid Spotlight Ascending Auction Top 3 Slots */}
        <div id="spotlight">
          <SpotlightSection />
        </div>

        {/* 3. Feature Grid */}
        <div id="features">
          <FeatureGrid />
        </div>

        {/* 4. Benchmark / Chart Section */}
        <div id="benchmark">
          <BenchmarkChart />
        </div>

        {/* 5. Pricing Section */}
        <div id="pricing">
          <Pricing />
        </div>

        {/* 6. FAQ Section */}
        <div id="faq">
          <Faq />
        </div>

        {/* 7. Final CTA Section */}
        <div id="cta">
          <FinalCta />
        </div>

      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default PixelpushLanding;
