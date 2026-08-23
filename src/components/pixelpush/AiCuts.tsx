import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import talentMatchingImg from '../../assets/features/talent-matching.jpeg';
import sponsoredVisibilityImg from '../../assets/features/sponsored-visibility.jpeg';
import directInquiryImg from '../../assets/features/direct-inquiry.jpeg';

export const AiCuts: React.FC = () => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(1); // $1 Sponsored visibility expanded by default

  const features = [
    {
      title: 'Precision Skill & Framework Matching',
      description: 'Search developers, designers, video editors, and AI specialists by exact technical tags (React, Node.js, Python, Figma, After Effects) with verified portfolio credentials.',
      image: talentMatchingImg,
      tag: 'PRECISION TALENT & SKILL MATCHING'
    },
    {
      title: '24-Hour Sponsored Visibility for $1',
      description: 'Boost your profile to the top of relevant search results for exactly 24 hours. Transparent pricing with instant activation and zero recurring lock-in.',
      image: sponsoredVisibilityImg,
      tag: '24-HOUR SPONSORED PRO-VISIBILITY'
    },
    {
      title: 'Direct Client Inquiries & Zero Commission',
      description: 'Connect directly with clients. Receive project inquiries with budget ranges and milestones without 20% platform marketplace cuts.',
      image: directInquiryImg,
      tag: 'DIRECT CLIENT INQUIRIES & CONTRACTS'
    }
  ];

  const currentFeature = expandedIndex >= 0 ? features[expandedIndex] : features[0];

  return (
    <section className="bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
          
          {/* Left Column: Heading, Button, Accordion (Exact Square UI) */}
          <div className="lg:col-span-6 p-8 sm:p-14 lg:p-20 flex flex-col justify-between space-y-10">
            
            {/* Top Area: Heading with 8-Bit Pixel Scissors and Button */}
            <div className="space-y-6">
              
              {/* Heading with 8-Bit Pixelated Scissors Icon */}
              <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-black tracking-[-0.03em] leading-tight flex items-center flex-wrap gap-3">
                <span>Discovery that</span>
                
                {/* 8-Bit Pixelated Orange Scissors Motif */}
                <div className="inline-grid grid-cols-3 gap-0.5 w-7 h-7 shrink-0">
                  <div className="w-2 h-2 bg-[#e8622c]" />
                  <div className="w-2 h-2 bg-transparent" />
                  <div className="w-2 h-2 bg-[#e8622c]" />
                  <div className="w-2 h-2 bg-transparent" />
                  <div className="w-2 h-2 bg-[#e8622c]" />
                  <div className="w-2 h-2 bg-transparent" />
                  <div className="w-2 h-2 bg-[#e8622c]" />
                  <div className="w-2 h-2 bg-transparent" />
                  <div className="w-2 h-2 bg-[#e8622c]" />
                </div>

                <span>cuts the noise</span>
              </h2>

              {/* Exact Pixel-Notched "Explore Talent" Button */}
              <div>
                <button
                  onClick={() => navigate('/search')}
                  className="pixel-btn-black inline-block px-6 py-2.5 font-bold text-xs cursor-pointer select-none"
                >
                  Explore Talent
                </button>
              </div>

            </div>

            {/* Bottom Area: Clean 1px Border Accordion List in Square UI */}
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {features.map((item, idx) => {
                const isOpen = expandedIndex === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      onClick={() => setExpandedIndex(isOpen ? -1 : idx)}
                      className={`w-full text-left font-bold transition cursor-pointer text-sm sm:text-base ${
                        isOpen ? 'text-black' : 'text-slate-500 hover:text-black'
                      }`}
                    >
                      {item.title}
                    </button>

                    {isOpen && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Dynamic Square Image */}
          <div className="lg:col-span-6 relative bg-slate-950 overflow-hidden min-h-[380px] lg:min-h-full flex items-center justify-center">
            <img
              key={currentFeature.image}
              src={currentFeature.image}
              alt={currentFeature.title}
              className="w-full h-full object-cover transition-opacity duration-500 animate-fadeIn"
            />
            {/* Overlay Tag */}
            <div className="absolute bottom-6 left-6 bg-black/90 text-white p-3 border-l-4 border-[#e8622c] text-xs font-mono backdrop-blur-sm shadow-xl">
              <span className="text-[#e8622c] font-black">PRO-RANK VERIFIED</span>: {currentFeature.tag}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AiCuts;
