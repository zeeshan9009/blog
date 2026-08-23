import React from 'react';
import {
  Zap,
  ShieldCheck,
  Search,
  CreditCard,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-[#e8622c]" />,
      title: '24-Hour $1 Sponsored Boost',
      description: 'Pin your profile at the top of relevant talent searches for a full 24 hours. Transparent pricing with instant activation.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#e8622c]" />,
      title: 'Independent ProRank Scoring',
      description: 'Transparent 0-100 algorithmic score based on verified experience, completed portfolios, and client review ratings.'
    },
    {
      icon: <Search className="w-6 h-6 text-[#e8622c]" />,
      title: 'Precision Skill & Rate Filtering',
      description: 'Search developers, designers, and video editors by exact framework, hourly rate, and timezone availability.'
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#e8622c]" />,
      title: 'Zero Platform Commission',
      description: 'Keep 100% of your earnings. Clients and professionals transact directly without 20% commission cuts.'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[#e8622c]" />,
      title: 'Direct Client Inquiries',
      description: 'Receive rich project leads directly in your inbox with budget ranges, milestones, and client contact info.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#e8622c]" />,
      title: 'Real-Time Impression Analytics',
      description: 'Track daily profile views, search appearances, and inquiry conversion rates in your professional dashboard.'
    }
  ];

  return (
    <section id="features" className="py-24 sm:py-32 bg-white border-b border-slate-200 text-center">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Eyebrow with Square Dot */}
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e8622c] mb-4">
          <span className="w-2 h-2 bg-[#e8622c] block" />
          <span>Why ProRank</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-black tracking-[-0.03em] leading-tight mb-4">
          Everything you need <br />
          <span className="text-black">to hire & get discovered</span>
        </h2>

        {/* Subtext */}
        <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-16 sm:mb-20">
          Built for modern teams and top independent professionals to connect with complete transparency.
        </p>

        {/* 6-Item 2x3 Grid with Sharp Square Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:grid-flow-row border-t border-slate-200 text-left">
          {features.map((feat, idx) => {
            const isRightBorder = (idx + 1) % 3 !== 0;
            const isBottomBorder = idx < 3;
            return (
              <div
                key={idx}
                className={`p-8 sm:p-10 space-y-4 transition-colors hover:bg-orange-50/20 rounded-none ${
                  isRightBorder ? 'lg:border-r border-slate-200' : ''
                } ${isBottomBorder ? 'lg:border-b border-slate-200' : ''}`}
              >
                <div className="w-11 h-11 bg-orange-50 border border-orange-100 flex items-center justify-center rounded-none">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-black">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeatureGrid;
