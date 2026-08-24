import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Briefcase, Building2, ArrowRight } from 'lucide-react';

export const UseCases: React.FC = () => {
  const navigate = useNavigate();

  const cases = [
    {
      label: 'For Independent Talent',
      icon: <UserCheck className="w-9 h-9 text-[#e8622c]" strokeWidth={1.75} />,
      headline: 'Get discovered by top clients with a $2 daily boost.',
      description: 'Activate 24-hour sponsored visibility at the top of relevant search results and receive high-budget client inquiries with zero platform commission cuts.',
      action: 'Promote Profile',
      link: '/promote'
    },
    {
      label: 'For Startups & Hiring Teams',
      icon: <Briefcase className="w-9 h-9 text-[#e8622c]" strokeWidth={1.75} />,
      headline: 'Hire senior vetted talent in hours, not weeks.',
      description: 'Search through pre-screened full-stack engineers, designers, and video editors with transparent 0-100 ProRank scores and verified GitHub/portfolio links.',
      action: 'Search Talent',
      link: '/search'
    },
    {
      label: 'For Studios & Agencies',
      icon: <Building2 className="w-9 h-9 text-[#e8622c]" strokeWidth={1.75} />,
      headline: 'Scale your team roster and inbound pipeline.',
      description: 'Showcase multiple team member profiles, manage consolidated client project leads, and access priority sponsor placement credits.',
      action: 'Agency Access',
      link: '/create-profile'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#fafafa] border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Eyebrow & Heading */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e8622c] mb-3">
            <span className="w-2 h-2 bg-[#e8622c] block" />
            <span>Use cases</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-[-0.03em] leading-tight">
            How modern teams & talent discover faster
          </h2>
        </div>

        {/* 3-Column Structured Square Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="p-8 sm:p-10 bg-white border-2 border-slate-200 shadow-2xs hover:border-black transition-all duration-200 flex flex-col justify-between space-y-8 rounded-none group"
            >
              <div className="space-y-6">
                {/* Square Icon Container */}
                <div className="w-14 h-14 bg-orange-50 border border-orange-200 flex items-center justify-center rounded-none group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>

                {/* Target Audience Label */}
                <div className="text-xs font-bold uppercase tracking-wider text-[#e8622c]">
                  {item.label}
                </div>

                {/* Bold Headline */}
                <h3 className="text-xl font-bold text-black leading-snug">
                  {item.headline}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Pixel-Notched Action Button */}
              <div className="pixel-btn-outline-wrapper w-full">
                <button
                  onClick={() => navigate(item.link)}
                  className="pixel-btn-outline-inner w-full py-3 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{item.action}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#e8622c]" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default UseCases;
