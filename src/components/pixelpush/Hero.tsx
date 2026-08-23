import React, { useState } from 'react';
import { Search, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import PixelMosaic from './PixelMosaic';
import { useTalent } from '../../context/TalentContext';
import { PromoteModal } from '../modals/PromoteModal';

export const Hero: React.FC = () => {
  const { currentProfile, setSearchQuery } = useTalent();
  const [searchInput, setSearchInput] = useState('');
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
    }
    const el = document.getElementById('talent') || document.getElementById('discovery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
              <span>24-Hour Sponsored Visibility for $1</span>
              <span className="text-orange-300">•</span>
              <span className="text-slate-900 font-extrabold">ProRank Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-[66px] font-black text-black tracking-[-0.03em] leading-[1.04]">
              Discover top talent <br />
              <span className="text-black">in minutes, </span>
              <span className="text-[#e8622c]">not days.</span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              ProRank connects fast-moving teams with vetted full-stack engineers, UI/UX designers, video editors, and growth specialists. Professionals promote their profile for just <strong className="text-black font-bold">$1/day</strong> for 24-hour sponsored search placement.
            </p>

            {/* Square Search Input Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center max-w-xl bg-white border-2 border-black p-1 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/30"
            >
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search skills, roles, or talent (e.g. React, UI/UX, Python, Video)..."
                className="w-full py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-black hover:bg-[#e8622c] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 rounded-none"
              >
                Search
              </button>
            </form>

            {/* Two CTAs: Pixel-Notched Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('talent') || document.getElementById('discovery');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="pixel-btn-black px-7 py-3.5 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer select-none"
              >
                <span>Explore Talent</span>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>

              <div className="pixel-btn-outline-wrapper">
                <button
                  onClick={() => setIsPromoteOpen(true)}
                  className="pixel-btn-outline-inner px-6 py-3.5 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer select-none"
                >
                  <Zap className="w-4 h-4 text-[#e8622c]" />
                  <span>Promote for $1</span>
                </button>
              </div>
            </div>

            {/* Key Trust Highlights */}
            <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#e8622c]" />
                <span>Zero platform commission</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#e8622c]" />
                <span>Direct client inquiries</span>
              </div>
            </div>

          </div>

          {/* Right Column: Square Pixel Mosaic Graphic with Live Professional Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square bg-gradient-to-br from-orange-50/50 via-white to-orange-100/30 border-2 border-slate-900 p-6 sm:p-8 shadow-xl shadow-orange-500/5 flex items-center justify-center rounded-none">
              
              {/* The Pixel/Mosaic 8-bit Art Grid */}
              <PixelMosaic rows={8} cols={8} density="dense" className="w-full h-full" />

              {/* Floating Center Talent Badge in Square UI */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white border-2 border-black shadow-lg flex items-center justify-between rounded-none">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Ali Raza"
                    className="w-10 h-10 object-cover border border-black rounded-none shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-black">Ali Raza</span>
                      <span className="px-1.5 py-0.5 bg-orange-100 text-orange-800 font-black text-[9px] uppercase">
                        $1 Boost
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">Lead Full-Stack Architect</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-[#e8622c]">96/100</div>
                  <div className="text-[10px] text-slate-400 font-mono">Score</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Thin Bordered Stat Strip with 3 Columns (Divided by Vertical Lines) */}
        <div className="border-t border-slate-200 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-left">
            
            {/* Stat 1 */}
            <div className="py-4 md:py-0 md:px-8 first:pl-0">
              <div className="text-4xl sm:text-5xl font-black text-[#e8622c] tracking-tight font-sans">
                25M+
              </div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mt-1">
                Profile impressions
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                across active discovery searches
              </div>
            </div>

            {/* Stat 2 */}
            <div className="py-4 md:py-0 md:px-8">
              <div className="text-4xl sm:text-5xl font-black text-[#e8622c] tracking-tight font-sans">
                10x
              </div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mt-1">
                Faster discovery
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                with 24h sponsored visibility boost
              </div>
            </div>

            {/* Stat 3 */}
            <div className="py-4 md:py-0 md:px-8 last:pr-0">
              <div className="text-4xl sm:text-5xl font-black text-[#e8622c] tracking-tight font-sans">
                180k+
              </div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mt-1">
                Direct inquiries
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                sent with zero intermediary friction
              </div>
            </div>

          </div>
        </div>

      </div>

      <PromoteModal
        isOpen={isPromoteOpen}
        onClose={() => setIsPromoteOpen(false)}
        professional={currentProfile}
      />
    </section>
  );
};

export default Hero;
