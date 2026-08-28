import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Trophy, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Faq: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Is this gambling or a game of chance?',
      a: 'No. Top submissions are determined solely by transparent public community voting on submitted code and design quality. There is no randomness, no odds, and zero cash prizes — RankLancr is a professional portfolio and skill-showcase platform, not a betting or chance-based product.'
    },
    {
      q: 'What do I actually get for my $5 entry fee?',
      a: 'The $5 entry fee provides digital access to submit your work for community peer review, eligibility for the Top Developer Rail (a 72-hour promotional visibility placement, not money), and permanent portfolio badge credentials. Entry fees fund server infrastructure and anti-abuse verification; no cash is transferred or paid out to entrants at any point.'
    },
    {
      q: "What does 'Outbid Spotlight' / sponsorship auction mean?",
      a: 'This is a paid promotional visibility placement auction (similar to an online ad placement auction), fully separate from the merit-based Challenge Arena voting. Sponsors and creators pay for card/banner visibility on the platform, never for challenge judging or voting outcomes.'
    },
    {
      q: 'How does the community voting and Steal the Rail mechanic work?',
      a: 'Top Developer Rail placement is earned by community vote count, not chance or payment amount. When a challenge is live, peers vote on project quality. If a qualifying challenger entry receives strictly more community votes than the current #1 holder, they immediately take over the Top Developer Rail.'
    },
    {
      q: 'How does RankLancr prevent vote rigging and bot manipulation?',
      a: 'Our voting engine utilizes browser device fingerprinting, strict IP rate-limiting (maximum 5 votes per minute), and limits voting to one vote per submission per device. Any automated or sybil voting surges are automatically filtered and discarded.'
    },
    {
      q: 'Are payment transactions secure and refundable?',
      a: 'All payment transactions are processed securely through our authorized Merchant of Record under PCI-DSS Level 1 compliance with 256-bit SSL encryption. Entry fees and visibility bids are non-refundable as server resources and ad placements are delivered immediately upon checkout.'
    }
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#fafafa] border-b-2 border-black">
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
              <span className="text-[#e8622c]">Clear Answers.</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Everything you need to know about entering skill challenges, transparent community voting, advertising visibility placements, and our zero-cash-prize compliance standard.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigate('/arena')}
                className="px-6 py-3.5 bg-black hover:bg-[#e8622c] text-white font-mono font-bold text-xs flex items-center gap-2 transition cursor-pointer border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <span>[ EXPLORE CHALLENGE ARENA ]</span>
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
