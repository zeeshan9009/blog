import React from 'react';
import Navbar from '../components/pixelpush/Navbar';
import Hero from '../components/pixelpush/Hero';
import { RailStealCard } from '../components/challenges/RailStealCard';
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
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white">
      {/* Toast provider for live real-time steal notifications */}
      <Toaster position="top-right" richColors expand={true} />

      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content">
        
        {/* 1. Hero Section + Live Activity Feed Ticker */}
        <div id="hero">
          <Hero />
        </div>

        {/* 2. Steal the Rail Card — Front & Center Main Hook */}
        <div id="rail-steal-section" className="py-8 sm:py-12 bg-linear-to-b from-[#faf8f5] to-white border-b-2 border-black">
          <RailStealCard />
        </div>

        {/* 3. Active Challenge & Live Vote Battle Section */}
        <div id="arena-live-battle" className="py-8 sm:py-12 bg-white border-b-2 border-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <LiveVoteBattle />
            <ChallengeSection />
          </div>
        </div>

        {/* 4. How It Works — Condensed 3-Step Explainer */}
        <div id="how-it-works">
          <HowItWorksCondensed />
        </div>

        {/* 5. Pricing Section (kept as-is) */}
        <div id="pricing">
          <Pricing />
        </div>

        {/* 6. FAQ Section (kept as-is) */}
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
