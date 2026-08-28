import React from 'react';
import { Sparkles, Vote, Trophy, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksCondensed: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Submit Your Best Work',
      subtitle: '$5 Fixed Entry Fee • 3-Day Prompts',
      description:
        'Pay a flat $5 entry fee, pick the active engineering specification, and submit your live demo and repository within 3 days. Zero pay-to-win tricks.',
      icon: Sparkles,
      badge: 'FIXED $5 ENTRY'
    },
    {
      number: '02',
      title: 'Get Community Votes',
      subtitle: '100% Merit • Fingerprinted Ballots',
      description:
        'The developer community votes on code quality, speed, and real-world execution. Anti-bot fingerprinting ensures every vote is authentic.',
      icon: Vote,
      badge: 'PURE MERIT'
    },
    {
      number: '03',
      title: 'Steal the Rail & Hold #1',
      subtitle: '72h Site-wide Flagship Placement',
      description:
        'Surpass the current #1 holder to instantly steal the Top Developer Rail. Hold your spot for 72 hours and defend against incoming challengers!',
      icon: Trophy,
      badge: '72H VISIBILITY REWARD'
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-[#FAFAF9] border-b border-[#E5E5E5] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>HOW THE PLATFORM WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Three Steps. One Crown.
          </h2>
          <p className="text-sm sm:text-base text-[#525252] font-normal leading-relaxed">
            A fast-paced developer arena where skill beats budget every single time.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="bg-white border border-[#E5E5E5] hover:border-[#D4D4D4] p-6 sm:p-7 flex flex-col justify-between space-y-5 transition-colors"
              >
                <div className="flex items-start justify-between border-b border-[#E5E5E5] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs">
                      {step.number}
                    </span>
                    <span className="text-[10px] font-semibold text-[#1A1A1A] border border-[#E5E5E5] px-2 py-0.5 bg-[#FAFAF9] uppercase">
                      {step.badge}
                    </span>
                  </div>
                  <Icon className="w-5 h-5 text-[#FF5A1F]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#1A1A1A] tracking-tight">
                    {step.title}
                  </h3>
                  <div className="text-xs font-semibold text-[#FF5A1F]">
                    {step.subtitle}
                  </div>
                  <p className="text-xs text-[#525252] leading-relaxed font-normal pt-1">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E5E5] text-[11px] text-[#737373] flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rule: {idx === 0 ? '$5 Entry Lock' : idx === 1 ? '1 Vote Per Person' : 'Live Realtime Takeover'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-white border border-[#E5E5E5] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base text-[#1A1A1A]">
              Ready to claim the #1 Developer Rail?
            </h4>
            <p className="text-xs text-[#525252] font-normal">
              Enter the open challenge arena now for $5 or vote on community entries.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/arena"
              className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#E54E17] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-[#FF5A1F] cursor-pointer"
            >
              <span>Enter Challenge Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksCondensed;
