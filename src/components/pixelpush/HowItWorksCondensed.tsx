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
      accentBg: 'bg-white',
      badge: 'FIXED $5 ENTRY'
    },
    {
      number: '02',
      title: 'Get Community Votes',
      subtitle: '100% Merit • Fingerprinted Ballots',
      description:
        'The developer community votes on code quality, speed, and real-world execution. Anti-bot fingerprinting ensures every vote is authentic.',
      icon: Vote,
      accentBg: 'bg-white',
      badge: 'PURE MERIT'
    },
    {
      number: '03',
      title: 'Steal the Rail & Hold #1',
      subtitle: '72h Site-wide Flagship Placement',
      description:
        'Surpass the current #1 holder to instantly steal the Top Developer Rail. Hold your spot for 72 hours and defend against incoming challengers!',
      icon: Trophy,
      accentBg: 'bg-amber-50',
      badge: '72H VISIBILITY REWARD'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#faf8f5] border-b-2 border-black font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>HOW THE GAME WORKS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
            Three Steps. One Crown.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            A fast-paced developer arena where skill beats budget every single time.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={step.number}
                className={`${step.accentBg} border-3 border-black p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative transition hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between border-b-2 border-black/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-sm">
                      {step.number}
                    </span>
                    <span className="text-[10px] font-bold text-black border border-black px-1.5 py-0.5 bg-slate-100 uppercase">
                      {step.badge}
                    </span>
                  </div>
                  <Icon className={`w-6 h-6 ${isLast ? 'text-amber-500 fill-amber-400' : 'text-[#e8622c]'}`} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-black tracking-tight">
                    {step.title}
                  </h3>
                  <div className="text-[11px] font-bold text-[#e8622c]">
                    {step.subtitle}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-normal pt-1">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rule: {idx === 0 ? '$5 Entry Lock' : idx === 1 ? '1 Vote Per Person' : 'Live Realtime Takeover'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-white border-2 border-black p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-black text-sm sm:text-base text-black uppercase">
              Ready to claim the #1 developer rail?
            </h4>
            <p className="text-xs text-slate-600 font-sans">
              Enter the open challenge arena now for $5 or vote on community entries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center">
            <Link
              to="/arena"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#e8622c] hover:bg-black text-white text-xs font-black uppercase transition flex items-center justify-center gap-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <span>[ ENTER CHALLENGE ARENA ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksCondensed;
