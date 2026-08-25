import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Search,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_TABS = [
  { id: 'All', label: 'All Talent', icon: '⊞' },
  { id: 'Web Development', label: 'Web Dev', icon: '</>' },
  { id: 'UI/UX Design', label: 'UI/UX', icon: '🎨' },
  { id: 'AI Engineering', label: 'AI Agents', icon: '🤖' },
  { id: 'SEO & Marketing', label: 'SEO', icon: '🔍' },
  { id: 'Mobile Development', label: 'Mobile', icon: '📱' },
  { id: 'Video Editing', label: 'Video', icon: '🎬' }
];

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('q', searchInput.trim());
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    navigate(`/developers?${params.toString()}`);
  };

  const scrollToSpotlight = () => {
    const el = document.getElementById('spotlight');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-10 sm:pt-14 pb-16 bg-[#faf8f5] text-slate-900 font-sans border-b-2 border-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Live Status Pill Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border-2 border-black text-[11px] font-mono font-bold text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span><strong className="text-black">100%</strong> Direct Client Connections</span>
            <span className="text-slate-300">•</span>
            <span><strong className="text-black">0%</strong> Platform Commission</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#e8622c] uppercase font-mono">ProRank Verified</span>
          </div>
        </div>

        {/* Dynamic Headline */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight font-mono leading-[1.1]">
            Rank Higher. Get Hired Directly with{' '}
            <span className="text-[#e8622c] underline decoration-4 decoration-black underline-offset-6">
              0% Commission.
            </span>
          </h1>

          <p className="text-sm sm:text-base font-mono text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The direct freelance talent index. Connect directly through authentic LinkedIn, Upwork, Fiverr, GitHub, and Portfolio profiles without platform fees or middleman escrow.
          </p>
        </div>

        {/* Quick Search & Explore Bar */}
        <div className="max-w-3xl mx-auto space-y-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-stretch bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 focus-within:border-[#e8622c]"
          >
            {/* Input Search */}
            <div className="flex items-center gap-2.5 px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-black shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by skill (e.g. Next.js, PyTorch, Figma, SEO)..."
                className="w-full text-xs sm:text-sm font-mono font-bold text-black placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative border-t-2 sm:border-t-0 sm:border-l-2 border-black px-3 py-2 flex items-center shrink-0 bg-slate-50">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-mono font-bold uppercase text-black bg-transparent focus:outline-hidden pr-6 cursor-pointer appearance-none"
              >
                {CATEGORY_TABS.map(tab => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>

            {/* Search Action Button */}
            <button
              type="submit"
              className="px-8 py-3 bg-[#e8622c] hover:bg-black text-white font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shrink-0 text-center border-t-2 sm:border-t-0 sm:border-l-2 border-black shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>[ SEARCH TALENT ]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Action Badges */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-black font-bold">Trending:</span>
              <button
                type="button"
                onClick={() => { setSearchInput('React'); navigate('/developers?q=React'); }}
                className="underline hover:text-[#e8622c] cursor-pointer"
              >
                React
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setSearchInput('AI'); navigate('/developers?q=AI'); }}
                className="underline hover:text-[#e8622c] cursor-pointer"
              >
                AI Agents
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setSearchInput('UI/UX'); navigate('/developers?q=UI%2FUX'); }}
                className="underline hover:text-[#e8622c] cursor-pointer"
              >
                UI/UX
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollToSpotlight}
                className="font-bold text-[#e8622c] hover:text-black uppercase inline-flex items-center gap-1 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 fill-[#e8622c]" />
                <span>View Spotlight Leaderboard ↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Square Button Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  const params = new URLSearchParams();
                  if (tab.id !== 'All') params.set('category', tab.id);
                  navigate(`/developers?${params.toString()}`);
                }}
                className={`px-3 py-1.5 border-2 border-black text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_#e8622c]'
                    : 'bg-white text-black hover:bg-orange-50/80 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Marketplace Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ProRank Organic Index</span>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              Mathematical multi-factor ranking based on proven skill benchmarks, verified projects, and client reviews.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black">
              <Flame className="w-4 h-4 text-[#e8622c] fill-[#e8622c] shrink-0" />
              <span>Outbid Spotlight Top 3</span>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              Ascending-auction premium leaderboard. Claim Top 3 placement with exclusive 72-hour visibility holds.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-black">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Direct Link Routing</span>
            </div>
            <p className="text-xs text-slate-600 font-mono leading-relaxed">
              Buyers click straight to your verified LinkedIn, Upwork, Fiverr, or Portfolio to hire you directly with 0% cut.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
