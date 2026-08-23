import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Faq: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item expanded by default

  const faqItems = [
    {
      q: 'What does the $1 promotion actually do?',
      a: 'Paying $1 activates a full 24-hour Sponsored Placement on ProRank. Your profile card is prominently featured at the top of relevant talent searches with a prominent Promoted badge for exactly 24 hours.'
    },
    {
      q: 'Does ProRank take any commission on freelance gigs?',
      a: 'Zero percent. ProRank is a direct talent discovery engine. Clients and talent connect directly with zero fees or commission cuts taken from either party.'
    },
    {
      q: 'How is the 0-100 ProRank score calculated?',
      a: 'The ProRank score is computed algorithmically based on portfolio completeness, verified experience, external repository links (GitHub, LinkedIn, Figma), and direct client review ratings.'
    },
    {
      q: 'Does ProRank control rankings on third-party platforms like Fiverr or Upwork?',
      a: 'No. ProRank operates an independent talent discovery and scoring system. ProRank does not influence, alter, or claim control over third-party platforms.'
    },
    {
      q: 'Can I extend or renew my $1 promotion anytime?',
      a: 'Yes! From your Professional Dashboard, you can track the exact remaining time on your active 24-hour promotion and extend or renew it anytime with a single click.'
    },
    {
      q: 'How do client inquiries work?',
      a: 'Clients browse your profile and click "Contact". Their project details, proposed budget, and contact email are delivered straight to your ProRank dashboard inbox with instant notifications.'
    },
    {
      q: 'How do I create and verify my professional profile?',
      a: 'Click "Create Free Profile", add your skills, hourly rate, bio, and portfolio links. Your profile is indexed immediately in our search catalog.'
    }
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#fafafa] border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Eyebrow, Heading, Subtext, CTA Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e8622c]">
              <span className="w-2 h-2 bg-[#e8622c] block" />
              <span>FAQ</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-[-0.03em] leading-tight">
              Your questions, <br />
              <span className="text-black">answered</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Everything you need to know about ProRank discovery, our $1 sponsored visibility, profile scoring, and direct inquiries.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigate('/create-profile')}
                className="pixel-btn-black px-6 py-3.5 font-bold text-xs flex items-center gap-2 cursor-pointer select-none"
              >
                <span>Create Free Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Square Accordion List */}
          <div className="lg:col-span-7 divide-y divide-slate-200 border-y border-slate-200">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-bold text-black hover:text-[#e8622c] text-base sm:text-lg transition cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#e8622c]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed pr-6 animate-fadeIn">
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
