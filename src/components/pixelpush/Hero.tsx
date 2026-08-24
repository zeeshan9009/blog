import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Briefcase, Code } from 'lucide-react';
import PixelMosaic from './PixelMosaic';
import { useTalent } from '../../context/TalentContext';
import { PromoteModal } from '../modals/PromoteModal';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { currentProfile, setSearchQuery } = useTalent();
  const [searchInput, setSearchInput] = useState('');
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      navigate(`/find-services?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/find-services');
    }
  };

  return (
    <section className="relative pt-12 sm:pt-20 pb-0 bg-[#fafafa] border-b border-slate-200 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Two-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pb-16 sm:pb-24">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Top Square Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 text-[#e8622c] text-xs font-bold uppercase tracking-wider rounded-none">
              <span className="w-2 h-2 bg-[#e8622c] block animate-pulse" />
              <span>THE FAIR TALENT & SERVICES DISCOVERY PLATFORM</span>
              <span className="text-orange-300">•</span>
              <span className="text-slate-900 font-extrabold">0% Commission</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-black text-black tracking-[-0.03em] leading-[1.04]">
              Find Talent. <br />
              Offer Skills. <br />
              <span className="text-[#e8622c]">Get Work.</span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              RankLancr connects people who need professional services with skilled people ready to provide them. Direct client communication, deterministic ranking scores, and zero platform cuts.
            </p>

            {/* Square Search Input Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center max-w-xl bg-white border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:ring-2 focus-within:ring-orange-500/30"
            >
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search services, skills, or talent (e.g. Node.js, React, SEO, Framer)..."
                className="w-full py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-black hover:bg-[#e8622c] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 rounded-none font-mono"
              >
                [ SEARCH ]
              </button>
            </form>

            {/* Two Primary CTAs: Find a Service & Offer a Service */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/find-services')}
                className="px-6 py-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>[ FIND A SERVICE ]</span>
              </button>

              <button
                onClick={() => navigate('/create-profile')}
                className="px-6 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <Code className="w-4 h-4" />
                <span>[ OFFER A SERVICE ]</span>
              </button>
            </div>

            {/* Promotion Disclaimer & Notice */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 pt-1">
              <Zap className="w-3.5 h-3.5 text-[#e8622c]" />
              <span>Want more visibility? Promote your profile for just <strong>$2/24 hours</strong>.</span>
            </div>

          </div>

          {/* Right Column: Visual Component Sandbox */}
          <div className="lg:col-span-5 relative">
            <PixelMosaic />
          </div>

        </div>

      </div>

      {isPromoteOpen && currentProfile && (
        <PromoteModal
          isOpen={isPromoteOpen}
          onClose={() => setIsPromoteOpen(false)}
          professional={currentProfile}
        />
      )}
    </section>
  );
};

export default Hero;
