import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Faq: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'How do skill challenges work on RankLancr?',
      a: 'We host timed skill challenges across web development, AI, design, and marketing. Participants pay a fixed $5.00 entry fee to enter the challenge arena, build their project according to the prompt, and submit their work. The community then votes on submissions.'
    },
    {
      q: 'Are there any cash prizes awarded to challenge winners?',
      a: 'No. RankLancr operates with a strict visibility-only reward model. Winners and the Top 3 earn 72 hours of site-wide Top Developer Rail placement, automated social media broadcasts, and permanent winner badges on their creator passport.'
    },
    {
      q: 'What does the $5.00 challenge entry fee cover?',
      a: 'The $5 entry fee is a pure platform service fee that covers server infrastructure, anti-bot voting verification, and live leaderboard hosting. Entry fees are non-refundable and unlock the digital right to submit one project during the active window.'
    },
    {
      q: 'How does the Gold Brand Sponsorship Outbid Auction work?',
      a: 'Companies and SaaS tools can sponsor challenge arenas through fixed Bronze ($50), Silver ($150) tiers, or compete in the live Gold Outbid Auction (floor $100.00, min increment +$25 / +10%). The leading Gold sponsor earns 48h co-branded placement alongside the challenge winner.'
    },
    {
      q: 'Do sponsors have any influence over challenge voting or winners?',
      a: 'Zero. RankLancr enforces a strict separation between brand advertising and competition judging. Winner selection is 100% determined by community merit votes.'
    },
    {
      q: 'How does RankLancr prevent vote rigging and bot manipulation?',
      a: 'Our voting engine utilizes client browser fingerprinting, strict IP rate-limiting (maximum 5 votes per minute), and one vote per submission per device. Any automated or suspicious voting surges are automatically filtered.'
    },
    {
      q: 'Are payment transactions secure?',
      a: 'Yes. All payments on RankLancr are processed through Paddle under PCI-DSS Level 1 compliance with 256-bit SSL encryption. We never store or log raw credit card numbers.'
    }
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#fafafa] border-b-2 border-black">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#e8622c]">
              <span className="w-2 h-2 bg-[#e8622c] block" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight">
              Got Questions? <br />
              <span className="text-[#e8622c]">We've Got Answers.</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Everything you need to know about entering skill challenges, public voting, brand sponsorships, and our 72-hour Top Developer visibility rewards.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigate('/arena')}
                className="px-6 py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono font-bold text-xs flex items-center gap-2 transition cursor-pointer border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <span>[ ENTER CHALLENGE ARENA ]</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 divide-y-2 divide-black border-y-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="p-6">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-bold text-black hover:text-[#e8622c] text-base transition cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#e8622c]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed pr-6 animate-fadeIn font-medium">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Faq;
