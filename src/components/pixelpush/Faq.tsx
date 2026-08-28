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
    <section id="faq" className="py-20 sm:py-24 bg-[#FAFAF9] border-b border-[#E5E5E5] font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#FF5A1F] shrink-0" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Got Questions? <br />
              <span className="text-[#FF5A1F]">Clear Answers.</span>
            </h2>

            <p className="text-[#525252] text-sm sm:text-base leading-relaxed font-normal">
              Everything you need to know about entering skill challenges, transparent community voting, advertising visibility placements, and our zero-cash-prize compliance standard.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigate('/arena')}
                className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white font-sans font-semibold text-xs transition-colors flex items-center gap-2 border border-[#1A1A1A] hover:border-[#FF5A1F] cursor-pointer"
              >
                <span>Explore Challenge Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 divide-y divide-[#E5E5E5] bg-white border border-[#E5E5E5] overflow-hidden">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="p-6 transition-colors hover:bg-[#FAFAF9]">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-semibold text-[#1A1A1A] hover:text-[#FF5A1F] text-base transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#737373] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#FF5A1F]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-[#525252] text-sm leading-relaxed pr-6 animate-fadeIn font-normal">
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
