import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Star,
  Zap,
  ChevronDown,
  ArrowLeft,
  X,
  Sparkles,
  Flame,
  Award,
  Clock
} from 'lucide-react';
import { useTalent } from '../context/TalentContext';
import { useAuth } from '../context/AuthContext';
import { HireRequestModal } from '../components/modals/HireRequestModal';
import { executeProRankSearch } from '../services/ranking/searchEngine';
import type { Professional, Service } from '../types/talent';

export const FindServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const {
    services,
    professionals,
    recordImpression,
    recordClick
  } = useTalent();
  const { user } = useAuth();

  // Filters State
  const [localSearch, setLocalSearch] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(120);
  const [deliverySpeed, setDeliverySpeed] = useState<string>('Any');
  const [sortBy, setSortBy] = useState<'score' | 'rating' | 'priceLow' | 'priceHigh'>('score');

  // Modals
  const [selectedProForHire, setSelectedProForHire] = useState<Professional | null>(null);
  const [selectedServiceForHire, setSelectedServiceForHire] = useState<Service | undefined>(undefined);

  // Dropdown filter toggle states
  const [openDropdown, setOpenDropdown] = useState<'category' | 'budget' | 'delivery' | null>(null);

  // Execute existing backend searchEngine for relevance calculation & sponsored separation
  const searchResults = useMemo(() => {
    return executeProRankSearch(professionals, {
      query: localSearch,
      category: selectedCategory,
      maxRate: maxBudget,
      limit: 30
    });
  }, [professionals, localSearch, selectedCategory, maxBudget]);

  // Track impressions for rendered sponsored items
  useEffect(() => {
    searchResults.sponsored.forEach(s => {
      recordImpression(s.profile.id, user?.id || 'visitor_client');
    });
  }, [searchResults.sponsored, user?.id, recordImpression]);

  const handleHireClick = (pro: Professional, srv?: Service, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    recordClick(pro.id, user?.id || 'visitor_client');
    setSelectedProForHire(pro);
    setSelectedServiceForHire(srv);
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    setSelectedCategory('All');
    setMaxBudget(120);
    setDeliverySpeed('Any');
    setSortBy('score');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white pb-20">
      
      {/* 1. TOP HEADER & SEARCH */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 p-1.5 px-3 hover:bg-slate-100 border border-slate-300 font-mono text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>[ HOME ]</span>
            </button>

            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black flex items-center justify-center text-white">
                <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-[#e8622c] ml-0.5" />
              </div>
              <span className="text-lg font-black tracking-tight text-black">
                ProRank<span className="text-[#e8622c]">.</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-orange-100 text-[#e8622c] text-[10px] font-mono font-bold">
                SERVICES MARKETPLACE
              </span>
            </Link>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="flex items-center bg-slate-50 border-2 border-black p-0.5 shadow-xs">
              <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search services (e.g. Node.js REST API, Framer, GoHighLevel, SEO, Python)..."
                className="w-full px-3 py-1.5 text-xs text-black placeholder:text-slate-400 bg-transparent outline-hidden font-medium"
              />
              {localSearch && (
                <button onClick={() => setLocalSearch('')} className="p-1 text-slate-400 hover:text-black">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/create-profile')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border-2 border-black text-xs font-bold font-mono transition cursor-pointer"
            >
              <span>Offer a Service</span>
            </button>

            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                [ DASHBOARD ]
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-3.5 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                [ SIGN IN ]
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. DIRECTORY TITLE & FILTER RIBBON */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 pb-4">
        
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#e8622c] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVER PROFESSIONAL SERVICES // 0% PLATFORM CUT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Find the Right Professional for Your Project
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Directly connect with top-rated talent. Transparent pricing, verified portfolios, and deterministic ProRank scores.
          </p>
        </div>

        {/* Filter Ribbon */}
        <div className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  className={`px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory !== 'All' ? 'bg-black text-white border-black' : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                  }`}
                >
                  <span>Category</span>
                  {selectedCategory !== 'All' && <span className="text-[#e8622c]">({selectedCategory})</span>}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'category' && (
                  <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 z-50">
                    {['All', 'Web Development', 'Graphic Design', 'UI/UX Design', 'SEO & Marketing', 'AI Engineering', 'Video Editing'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setOpenDropdown(null); }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs font-medium hover:bg-orange-50 transition ${
                          selectedCategory === cat ? 'font-bold text-[#e8622c]' : 'text-slate-700'
                        }`}
                      >
                        {cat === 'All' ? 'All Categories' : cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget Filter */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                  className={`px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    maxBudget < 120 ? 'bg-black text-white border-black' : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                  }`}
                >
                  <span>Budget: Up to ${maxBudget}/hr</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'budget' && (
                  <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3.5 z-50">
                    <div className="text-xs font-bold text-black mb-2 flex justify-between">
                      <span>Max Rate</span>
                      <span className="text-[#e8622c] font-mono">${maxBudget}/hr</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="150"
                      step="5"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full accent-[#e8622c] cursor-pointer"
                    />
                    <button
                      onClick={() => setOpenDropdown(null)}
                      className="w-full mt-3 py-1 bg-black text-white font-mono text-xs font-bold"
                    >
                      APPLY
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery Speed */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'delivery' ? null : 'delivery')}
                  className={`px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    deliverySpeed !== 'Any' ? 'bg-black text-white border-black' : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                  }`}
                >
                  <span>Delivery Speed</span>
                  {deliverySpeed !== 'Any' && <span className="text-[#e8622c]">({deliverySpeed})</span>}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'delivery' && (
                  <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 z-50">
                    {['Any', '1 day', '2 days', '3 days'].map(dlv => (
                      <button
                        key={dlv}
                        onClick={() => { setDeliverySpeed(dlv); setOpenDropdown(null); }}
                        className="w-full text-left px-2.5 py-1.5 text-xs font-medium hover:bg-orange-50"
                      >
                        {dlv === 'Any' ? 'Any Speed' : `Express (${dlv})`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
              <span className="text-slate-400 font-mono text-[11px]">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-black focus:outline-hidden cursor-pointer"
              >
                <option value="score">Best ProRank Score (0-100)</option>
                <option value="rating">Top Rated ⭐ 5.0</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="font-mono text-slate-500 font-semibold">
              <span>{searchResults.meta.total} VERIFIED SERVICES & PROFILES</span>
            </div>
            {(selectedCategory !== 'All' || maxBudget < 120 || deliverySpeed !== 'Any' || localSearch) && (
              <button onClick={clearAllFilters} className="text-[#e8622c] hover:underline font-bold">
                [ RESET FILTERS ]
              </button>
            )}
          </div>
        </div>

      </div>

      {/* 3. DUAL-SECTION SEARCH RESULTS: SPONSORED & ORGANIC */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-4 space-y-10">
        
        {/* ========================================================= */}
        {/* A. 🔥 SPONSORED SERVICES (Gated by R >= 0.35) */}
        {/* ========================================================= */}
        {searchResults.sponsored.length > 0 && (
          <div className="space-y-4 p-5 bg-orange-50/40 border-2 border-[#e8622c] shadow-[4px_4px_0px_0px_#e8622c]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[#e8622c] text-white">
                  <Flame className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-black tracking-wider uppercase font-mono flex items-center gap-2">
                    <span>🔥 SPONSORED SERVICES</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#e8622c] text-white font-bold">$1/24H VISIBILITY</span>
                  </h2>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Verified relevant services with active 24-hour sponsored placement. Gated by ProRank relevance engine.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.sponsored.map(({ profile, relevance }) => {
                const matchedService = services.find(s => s.providerId === profile.id) || {
                  id: `srv-${profile.id}`,
                  title: profile.gigTitle || `Expert ${profile.skills.slice(0, 2).join(' & ')} Services`,
                  startingPrice: profile.hourlyRate,
                  deliveryTime: profile.deliveryTime || '2 days',
                  category: profile.category
                };

                return (
                  <div
                    key={profile.id}
                    onClick={() => navigate(`/service/${matchedService.id}`)}
                    className="group bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_#e8622c] hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer overflow-hidden"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b-2 border-black">
                        <img
                          src={profile.gigImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-[#e8622c] text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                            <Zap className="w-2.5 h-2.5" />
                            <span>SPONSORED</span>
                          </span>
                          <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-mono">
                            {relevance.percentageMatch}% MATCH
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold">
                          PRO SCORE: <span className="text-[#e8622c]">{profile.score}/100</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-3.5 pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-6 h-6 border border-black object-cover bg-orange-100 shrink-0"
                          />
                          <span className="font-bold text-xs text-black truncate">{profile.name}</span>
                          <span className="ml-auto px-1.5 py-0.2 bg-orange-100 text-[#e8622c] font-mono text-[9px] font-bold">
                            {profile.levelBadge || 'PRO'}
                          </span>
                        </div>

                        <h3 className="text-xs text-slate-800 line-clamp-2 font-bold leading-snug group-hover:text-black mb-2">
                          {matchedService.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{profile.rating.toFixed(1)}</span>
                            <span className="text-slate-400 text-[11px]">({profile.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                            <Clock className="w-3 h-3 text-[#e8622c]" />
                            <span>{matchedService.deliveryTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 pt-2 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">STARTING FROM</span>
                        <span className="text-xs font-black text-black">${matchedService.startingPrice}</span>
                      </div>

                      <button
                        onClick={(e) => handleHireClick(profile, matchedService as any, e)}
                        className="px-3 py-1.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        [ HIRE / CONTACT ]
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* B. TOP SERVICES & PROFESSIONALS (ORGANIC) */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-black" />
              <h2 className="text-sm font-black text-black tracking-wider uppercase font-mono">
                TOP SERVICES (ORGANIC RANKING)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              0% COMMISSION • RELEVANCE RANKED
            </span>
          </div>

          {searchResults.organic.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {searchResults.organic.map(({ profile }) => {
                const matchedService = services.find(s => s.providerId === profile.id) || {
                  id: `srv-${profile.id}`,
                  title: `Full-Stack ${profile.skills.slice(0, 2).join(' & ')} Services`,
                  startingPrice: profile.hourlyRate,
                  deliveryTime: '2 days',
                  category: profile.category
                };

                return (
                  <div
                    key={profile.id}
                    onClick={() => navigate(`/service/${matchedService.id}`)}
                    className="group bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer overflow-hidden"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b-2 border-black">
                        <img
                          src={profile.avatar || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white font-mono text-[9px] font-bold">
                          {profile.category}
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/85 text-white font-mono text-[9px] font-bold">
                          SCORE: <span className="text-orange-400">{profile.score}/100</span>
                        </div>
                      </div>

                      <div className="p-3.5 pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`}
                            alt={profile.name}
                            className="w-6 h-6 border border-black object-cover bg-orange-100 shrink-0"
                          />
                          <span className="font-bold text-xs text-black truncate">{profile.name}</span>
                          <span className="ml-auto px-1.5 py-0.2 bg-slate-100 border border-slate-300 font-mono text-[9px] font-bold text-slate-700">
                            PRO
                          </span>
                        </div>

                        <h3 className="text-xs text-slate-800 line-clamp-2 font-bold leading-snug group-hover:text-black mb-2">
                          {matchedService.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{profile.rating.toFixed(1)}</span>
                            <span className="text-slate-400 text-[11px]">({profile.reviewCount})</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{matchedService.deliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 pt-2 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">STARTING FROM</span>
                        <span className="text-xs font-black text-black">${matchedService.startingPrice}</span>
                      </div>

                      <button
                        onClick={(e) => handleHireClick(profile, matchedService as any, e)}
                        className="px-3 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        [ HIRE / CONTACT ]
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border-2 border-dashed border-black bg-white p-12 text-center max-w-xl mx-auto space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 bg-black text-[#e8622c] mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-black">No Services Found</h3>
                <p className="text-xs text-slate-600">
                  {localSearch ? `No results matching "${localSearch}". Try resetting filters or search keywords.` : 'Be the first specialist to publish a professional service on ProRank.'}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => navigate('/create-profile')}
                  className="px-5 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  [ + OFFER A SERVICE ]
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Hire Modal */}
      {selectedProForHire && (
        <HireRequestModal
          isOpen={true}
          onClose={() => { setSelectedProForHire(null); setSelectedServiceForHire(undefined); }}
          professional={selectedProForHire}
          service={selectedServiceForHire}
        />
      )}

    </div>
  );
};

export default FindServicesPage;
