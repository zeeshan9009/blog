import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  ChevronDown,
  ExternalLink,
  Flame,
  Zap,
  Tag,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OutbidModal } from '../modals/OutbidModal';
import { CreatePromotedCampaignModal } from '../modals/CreatePromotedCampaignModal';
import { supabase } from '../../lib/supabase';
import type { PromotedCampaign } from '../../types/promotedAuction';
import toast from 'react-hot-toast';

const CATEGORY_TABS = [
  { id: 'All', label: 'All', icon: '⊞' },
  { id: 'Web Development', label: 'Web Dev', icon: '</>' },
  { id: 'UI/UX Design', label: 'UI/UX', icon: '🎨' },
  { id: 'SEO & Marketing', label: 'SEO', icon: '🔍' },
  { id: 'AI Engineering', label: 'AI Agents', icon: '🤖' },
  { id: 'Mobile Development', label: 'Mobile', icon: '📱' },
  { id: 'Graphic Design', label: 'Design', icon: '✨' },
  { id: 'Video Editing', label: 'Video', icon: '🎬' },
  { id: 'Content Writing', label: 'Writing', icon: '✍️' }
];

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [urlInput, setUrlInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [campaigns, setCampaigns] = useState<PromotedCampaign[]>([]);
  const [selectedOutbidCampaign, setSelectedOutbidCampaign] = useState<PromotedCampaign | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customBid, setCustomBid] = useState<number>(2);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/promotions/auction/campaigns');
      if (res.ok) {
        const data = await res.json();
        if (data.campaigns) {
          setCampaigns(data.campaigns);
          const topBid = data.campaigns.length > 0
            ? Math.max(...data.campaigns.map((c: PromotedCampaign) => c.currentBid || 2))
            : 0;
          setCustomBid(topBid > 0 ? topBid + 1 : 2);
          setIsLoading(false);
          return;
        }
      }
      setCampaigns([]);
    } catch {
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();

    const channel = supabase
      .channel('hero_promoted_live_square')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'promoted_campaigns' },
        () => {
          fetchCampaigns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOutbidBarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setIsCreateModalOpen(true);
      return;
    }

    const existing = campaigns.find(
      c => c.destinationUrl.toLowerCase().includes(urlInput.toLowerCase()) || c.title.toLowerCase().includes(urlInput.toLowerCase())
    );

    if (existing) {
      setSelectedOutbidCampaign(existing);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const filteredCampaigns = useMemo(() => {
    if (selectedCategory === 'All') return campaigns;
    return campaigns.filter(
      c => c.category.toLowerCase().includes(selectedCategory.toLowerCase()) || (c.skills && c.skills.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase())))
    );
  }, [campaigns, selectedCategory]);

  // Real Dynamic Bidding Algorithm
  const currentHighestBid = useMemo(() => {
    return filteredCampaigns.length > 0
      ? Math.max(...filteredCampaigns.map(c => c.currentBid || 2))
      : 0;
  }, [filteredCampaigns]);

  const minRequiredForNumberOne = useMemo(() => {
    return currentHighestBid > 0 ? currentHighestBid + 1 : 2;
  }, [currentHighestBid]);

  // Adjust customBid floor when category changes
  useEffect(() => {
    setCustomBid(prev => Math.max(prev, minRequiredForNumberOne));
  }, [minRequiredForNumberOne, selectedCategory]);

  // Real-time rank & exposure share predictor
  const { projectedRank, projectedExposureShare } = useMemo(() => {
    const higherBids = filteredCampaigns.filter(c => (c.currentBid || 2) > customBid).length;
    const rank = higherBids + 1;

    const existingSum = filteredCampaigns.reduce((acc, c) => acc + (c.currentBid || 2), 0);
    const totalPool = existingSum + customBid;
    const share = totalPool > 0 ? Math.min(100, Math.round((customBid / totalPool) * 100)) : 100;

    return { projectedRank: rank, projectedExposureShare: share };
  }, [filteredCampaigns, customBid]);

  return (
    <section className="pt-8 sm:pt-12 pb-16 bg-[#faf8f5] text-slate-900 font-sans border-b-2 border-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Live Traffic Pill Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border-2 border-black text-[11px] font-mono font-bold text-slate-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span><strong className="text-black">{Math.max(1, campaigns.length)}</strong> active auctions</span>
            <span className="text-slate-300">•</span>
            <span><strong className="text-black">100%</strong> direct traffic</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#e8622c] uppercase font-mono">0% marketplace cut</span>
          </div>
        </div>

        {/* Dynamic Claim #1 for - $Amount + Headline */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-mono flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span>Claim #1 for</span>
            <div className="inline-flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setCustomBid(prev => Math.max(2, prev - 1))}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black bg-orange-100 hover:bg-[#e8622c] hover:text-white text-black flex items-center justify-center font-mono font-black text-sm sm:text-base cursor-pointer transition shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                title="Decrease bid"
              >
                -
              </button>

              <span className="text-[#e8622c] font-black underline decoration-4 decoration-black underline-offset-4">
                ${customBid}
              </span>

              <button
                type="button"
                onClick={() => setCustomBid(prev => prev + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-black bg-orange-100 hover:bg-[#e8622c] hover:text-white text-black flex items-center justify-center font-mono font-black text-sm sm:text-base cursor-pointer transition shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                title="Increase bid"
              >
                +
              </button>
            </div>
          </h1>

          {/* Real-time Bid Projection Status Pill */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-mono text-[11px] font-bold uppercase shadow-[2px_2px_0px_0px_#e8622c]">
              {projectedRank === 1 ? (
                <span>🔥 Projected Rank: #1 TOP SPONSORED (~{projectedExposureShare}% Exposure Share)</span>
              ) : (
                <span>⚡ Projected Rank: #{projectedRank} Sponsored (Bid ${minRequiredForNumberOne} to take #1)</span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-xl mx-auto leading-relaxed">
            New spots start at <strong className="text-black">$2</strong>. Paying less than the #1 price still puts you on the board at whatever place that bid can take.
          </p>
        </div>

        {/* Top Square Action & Search Bar */}
        <div className="space-y-2">
          <form
            onSubmit={handleOutbidBarSubmit}
            className="flex flex-col sm:flex-row items-stretch bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1.5 focus-within:border-[#e8622c]"
          >
            {/* Input URL or Handle */}
            <div className="flex items-center gap-2.5 px-3 py-2 flex-1">
              <Globe className="w-4 h-4 text-black shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Your product URL or @handle (LinkedIn, Fiverr, Upwork, Portfolio)"
                className="w-full text-xs sm:text-sm font-mono font-bold text-black placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              />
            </div>

            {/* Real Category Dropdown */}
            <div className="relative border-t-2 sm:border-t-0 sm:border-l-2 border-black px-3 py-2 flex items-center shrink-0 bg-slate-50">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-mono font-bold uppercase text-black bg-transparent focus:outline-hidden pr-6 cursor-pointer appearance-none"
              >
                <option value="All">Choose a category</option>
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="SEO & Marketing">SEO & Marketing</option>
                <option value="AI Engineering">AI Engineering</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Content Writing">Content Writing</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-black absolute right-3 pointer-events-none" />
            </div>

            {/* Outbid Action Button */}
            <button
              type="submit"
              className="px-8 py-3 bg-[#e8622c] hover:bg-black text-white font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shrink-0 text-center border-t-2 sm:border-t-0 sm:border-l-2 border-black shadow-xs"
            >
              [ OUTBID ⚡ ]
            </button>
          </form>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
            <span>Already on the list? Enter the same URL or @handle and up your bid.</span>
            <span className="font-bold text-black uppercase hidden sm:inline-block">24H AUCTION • $2 MIN</span>
          </div>
        </div>

        {/* Category Square Button Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
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

        {/* Ranked Auction Cards List (Square UI) */}
        <div className="space-y-4">
          {filteredCampaigns.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-black p-10 text-center space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-12 h-12 bg-orange-50 border-2 border-black flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6 text-[#e8622c] fill-[#e8622c]" />
              </div>
              <div>
                <h3 className="font-mono font-black text-base uppercase text-black">
                  No Active Promoted Campaigns Yet
                </h3>
                <p className="text-xs font-mono text-slate-600 mt-1 max-w-md mx-auto">
                  Be the first professional to claim the #1 Sponsored spot for your LinkedIn, Fiverr, Upwork, or Portfolio from just $2.00 / 24 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-[#e8622c] hover:bg-black text-white font-mono font-black text-xs uppercase transition cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-flex items-center gap-2"
              >
                <span>[ 🔥 LAUNCH FIRST PROMOTION — $2.00 ]</span>
              </button>
            </div>
          ) : (
            filteredCampaigns.map((camp, idx) => (
              <div
                key={camp.id}
                onClick={() => setSelectedOutbidCampaign(camp)}
                className="group bg-white border-2 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_#e8622c] transition-all duration-150 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
              >
                {/* Left Rank & Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  
                  {/* # Rank Tag */}
                  <div className={`px-3 py-1.5 border-2 border-black font-mono font-black text-xs shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    idx === 0 ? 'bg-[#e8622c] text-white' : idx === 1 ? 'bg-amber-400 text-black' : 'bg-black text-white'
                  }`}>
                    #{idx + 1} {idx === 0 && '🔥'}
                  </div>

                {/* Avatar Icon (Square) */}
                <div className="w-13 h-13 border-2 border-black bg-black overflow-hidden flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {camp.avatarUrl ? (
                    <img src={camp.avatarUrl} alt={camp.authorName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-mono font-black text-lg">{camp.authorName.charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-black text-sm sm:text-base tracking-tight truncate group-hover:text-[#e8622c] transition">
                      {camp.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {camp.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-500 font-bold flex-wrap pt-1">
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-300 px-1 py-0.2">ACTIVE</span>
                    <a
                      href={camp.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        fetch('/api/promotions/auction/analytics', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ campaignId: camp.id, eventType: 'external_visit' })
                        }).catch(() => {});
                      }}
                      className="text-black hover:text-[#e8622c] underline flex items-center gap-0.5"
                    >
                      <span>{camp.destinationUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span>•</span>
                    <span className="text-slate-700">[{camp.category}]</span>
                    <span>•</span>
                    <span className="text-black">
                      {(camp.clicks || 0).toLocaleString()} CLICKS
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Bid & Outbid Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pl-16 sm:pl-0 pt-2 sm:pt-0 border-t-2 sm:border-t-0 border-black/10">
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-[#e8622c] tracking-tight font-mono">
                    ${(camp.currentBid || 2).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOutbidCampaign(camp);
                  }}
                  className="px-4 py-1.5 bg-[#e8622c] hover:bg-black text-white border-2 border-black font-mono text-xs font-black uppercase transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>OUTBID</span>
                  <Zap className="w-3.5 h-3.5 fill-white" />
                </button>
              </div>

            </div>
          )))}
        </div>

      </div>

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={Boolean(selectedOutbidCampaign)}
        onClose={() => setSelectedOutbidCampaign(null)}
        campaign={selectedOutbidCampaign}
        onSuccess={fetchCampaigns}
      />

      {/* Create Campaign Modal */}
      <CreatePromotedCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCampaigns}
        currentHighestBid={campaigns.length > 0 ? Math.max(...campaigns.map(c => c.currentBid)) : 10}
        initialBid={customBid}
        initialUrl={urlInput}
        initialCategory={selectedCategory !== 'All' ? selectedCategory : undefined}
      />
    </section>
  );
};

export default Hero;
