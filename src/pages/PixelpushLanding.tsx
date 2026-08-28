import React from 'react';
import Navbar from '../components/pixelpush/Navbar';
import Hero from '../components/pixelpush/Hero';
import { LiveVoteBattle } from '../components/challenges/LiveVoteBattle';
import { ChallengeSection } from '../components/challenges/ChallengeSection';
import { HowItWorksCondensed } from '../components/pixelpush/HowItWorksCondensed';
import Pricing from '../components/pixelpush/Pricing';
import Faq from '../components/pixelpush/Faq';
import Footer from '../components/pixelpush/Footer';
import { Toaster } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTalent } from '../context/TalentContext';
import { useUserBroadcast } from '../hooks/useRealtimeChannel';

export const PixelpushLanding: React.FC = () => {
  const { user } = useAuth();
  const { professionals } = useTalent();
  const userProfile = professionals.find((p) => p.userId === user?.id) || professionals[0];
  const currentUserId = user?.id || userProfile?.id;

  // Listen for realtime broadcast toasts if this user's rail spot was stolen
  useUserBroadcast(currentUserId);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Toast provider for live real-time steal notifications */}
      <Toaster position="top-right" richColors expand={true} />

      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content">
        
        {/* 1. Hero Section (Includes Live Activity Ticker & #1 Top Developer Rail Card) */}
        <div id="hero">
          <Hero />
        </div>

        {/* 2. Active Challenge & Live Vote Battle Section */}
        <div id="arena-live-battle" className="bg-white">
          <ChallengeSection />
        </div>

        {/* 3. How It Works — Condensed 3-Step Explainer */}
        <div id="how-it-works">
          <HowItWorksCondensed />
        </div>

        {/* 4. Pricing Section */}
        <div id="pricing">
          <Pricing />
        </div>

        {/* 5. FAQ Section */}
        <div id="faq">
          <Faq />
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PixelpushLanding;
