import React from 'react';
import {
  Trophy,
  ShieldCheck,
  Flame,
  Vote,
  Award,
  TrendingUp
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Trophy className="w-6 h-6 text-[#e8622c]" />,
      title: '$5 Fixed Challenge Entries',
      description: 'Transparent digital entry tickets to compete in 3-day engineering and design challenges with verified public scoring.'
    },
    {
      icon: <Flame className="w-6 h-6 text-[#e8622c]" />,
      title: '72-Hour Top Developer Rail',
      description: 'The top 3 community winners earn 72 hours of uninterrupted flagship visibility across the entire platform header.'
    },
    {
      icon: <Vote className="w-6 h-6 text-[#e8622c]" />,
      title: '100% Merit-Based Voting',
      description: 'Anti-collusion rate-limiting and browser fingerprinting ensure pure engineering merit decides every competition.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#e8622c]" />,
      title: 'Ascending Outbid Spotlight',
      description: 'Guaranteed 72-hour auction spots for creators, agencies, and sponsors looking for immediate global visibility.'
    },
    {
      icon: <Award className="w-6 h-6 text-[#e8622c]" />,
      title: 'Verified Creator Accolades',
      description: 'Permanent challenge winner badges and public repository verification scores tied directly to your creator profile.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#e8622c]" />,
      title: 'Zero Commission Marketplace',
      description: 'Clients and companies contact featured talent directly. No 20% platform markups or hidden escrow fees.'
    }
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-white border-b-2 border-black text-center">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Eyebrow with Square Dot */}
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#e8622c] mb-4">
          <span className="w-2 h-2 bg-[#e8622c] block" />
          <span>PLATFORM ADVANTAGES</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight mb-4">
          Built for Builders. <br />
          <span className="text-black">Rewarded by Pure Merit.</span>
        </h2>

        {/* Subtext */}
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-16">
          Everything you need to compete, showcase your engineering skills, and claim top global developer visibility.
        </p>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-8 bg-[#fafafa] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition duration-200"
            >
              <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {f.icon}
              </div>
              <h3 className="text-lg font-black text-black mb-2">
                {f.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeatureGrid;
