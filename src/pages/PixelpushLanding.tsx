import React from 'react';
import Navbar from '../components/pixelpush/Navbar';
import Hero from '../components/pixelpush/Hero';
import PromotedTalentSection from '../components/pixelpush/PromotedTalentSection';
import AiCuts from '../components/pixelpush/AiCuts';
import FeatureGrid from '../components/pixelpush/FeatureGrid';
import BenchmarkChart from '../components/pixelpush/BenchmarkChart';
import Testimonials from '../components/pixelpush/Testimonials';
import UseCases from '../components/pixelpush/UseCases';
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
        
        {/* 1. Hero Section */}
        <div id="hero">
          <Hero />
        </div>

        {/* 2. Featured $2 Sponsored Talent Section in Square UI */}
        <div id="talent">
          <PromotedTalentSection />
        </div>

        {/* 3. Discovery that cuts the noise */}
        <div id="discovery">
          <AiCuts />
        </div>

        {/* 4. Feature Grid */}
        <div id="features">
          <FeatureGrid />
        </div>

        {/* 5. Benchmark / Chart Section */}
        <div id="benchmark">
          <BenchmarkChart />
        </div>

        {/* 6. Testimonial Section */}
        <div id="testimonials">
          <Testimonials />
        </div>

        {/* 7. Use Cases Section */}
        <div id="usecases">
          <UseCases />
        </div>

        {/* 8. Pricing Section */}
        <div id="pricing">
          <Pricing />
        </div>

        {/* 9. FAQ Section */}
        <div id="faq">
          <Faq />
        </div>

        {/* 10. Final CTA Section */}
        <div id="cta">
          <FinalCta />
        </div>

      </main>

      {/* 11. Footer (Black background, 4-column links, newsletter subscription box) */}
      <Footer />
    </div>
  );
};

export default PixelpushLanding;
