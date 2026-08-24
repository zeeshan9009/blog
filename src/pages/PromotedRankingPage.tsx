import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Zap,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Info,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Search
} from 'lucide-react';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
import { PlatformBrandIcon } from '../components/brand/PlatformBrandIcon';
import { CreatePromotedCampaignModal } from '../components/modals/CreatePromotedCampaignModal';
import { OutbidModal } from '../components/modals/OutbidModal';
import { autoDetectPlatformAndValidate } from '../services/validation/externalProfileValidator';
import { supabase } from '../lib/supabase';
import type { PromotedCampaign } from '../types/promotedAuction';

const CATEGORIES = [
  'All',
  'Web Development',
  'UI/UX Design',
  'SEO & Marketing',
  'AI Engineering',
  'Mobile Development',
  'Full Stack',
  'Frontend',
  'Backend'
];

type SortOption = 'highest_bid' | 'ending_soon' | 'most_clicked' | 'newest';

export const PromotedRankingPage: React.FC = () => {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState<PromotedCampaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState<SortOption>('highest_bid');
  const [isLoading, setIsLoading] = useState(true);

  // Quick URL Boost bar
  const [urlInput, setUrlInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOutbidCampaign, setSelectedOutbidCampaign] = useState<PromotedCampaign | null>(null);

  // Live auto-detection on URL bar
  const detectedPlatform = useMemo(() => {
    if (!urlInput.trim()) return null;
    return autoDetectPlatformAndValidate(urlInput);
  }, [urlInput]);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/promotions/auction/campaigns');
      if (res.ok) {
        const data = await res.json();
        if (data.campaigns) {
          setCampaigns(data.campaigns);
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

    // Realtime channel subscription
    const channel = supabase
      .channel('promoted_auction_live')
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

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    let result = campaigns;

    if (selectedCategory !== 'All') {
      result = result.filter(c => 
        c.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (c.skills && c.skills.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase())))
      );
    }

    return [...result].sort((a, b) => {
      if (sortOption === 'highest_bid') {
        return (Number(b.currentBid) || 2) - (Number(a.currentBid) || 2);
      }
      if (sortOption === 'ending_soon') {
        return new Date(a.expiresAt || '').getTime() - new Date(b.expiresAt || '').getTime();
      }
      if (sortOption === 'most_clicked') {
        return (b.clicks || 0) - (a.clicks || 0);
      }
      if (sortOption === 'newest') {
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
      return 0;
    });
  }, [campaigns, selectedCategory, sortOption]);

  const currentHighestBid = filteredAndSortedCampaigns.length > 0
    ? Math.max(...filteredAndSortedCampaigns.map(c => Number(c.currentBid) || 2))
    : 0;

  const minToTakeNumberOne = currentHighestBid > 0 ? currentHighestBid + 1 : 2;

  // Format clean countdown
  const formatRemainingTime = (expiresAt?: string) => {
    if (!expiresAt) return '24h remaining';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  const handleQuickUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setIsCreateModalOpen(true);
      return;
    }

    // Check if URL is already active on board
    const existing = campaigns.find(
      c => c.destinationUrl.toLowerCase().includes(urlInput.toLowerCase())
    );

    if (existing) {
      setSelectedOutbidCampaign(existing);
    } else {
      setIsCreateModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-600 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 w-full">
        
        {/* 1. Header Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 border border-black text-xs font-mono font-bold text-black uppercase shadow-xs">
            <Flame className="w-4 h-4 text-[#e8622c] fill-[#e8622c]" />
            <span>Competitive Boost Auction</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight font-mono">
            Promote Your Professional Profile
          </h1>

          <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Compete for premium search visibility. Your bid determines your sponsored position while ProRank continues to determine organic talent quality.
          </p>
        </div>

        {/* 2. URL-First Quick Boost Input Bar */}
        <div className="max-w-3xl mx-auto bg-white border-2 border-black p-4 sm:p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <form onSubmit={handleQuickUrlSubmit} className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔗</span>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste LinkedIn, Upwork, Fiverr, GitHub or portfolio URL..."
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-black font-mono text-xs sm:text-sm font-bold text-black placeholder:text-slate-400 focus:outline-hidden focus:border-[#e8622c]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0"
            >
              [ Claim Spot for ${minToTakeNumberOne} ⚡ ]
            </button>
          </form>

          {/* Live Auto-Detection Visual Pill */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            {detectedPlatform && detectedPlatform.isValid ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <PlatformBrandIcon platform={detectedPlatform.platform} className="w-4 h-4 text-emerald-800" />
                <span>✓ {detectedPlatform.platformName} detected</span>
              </div>
            ) : (
              <span className="text-slate-500">
                Zero login required • Starting at <strong>$2 / 24H</strong>
              </span>
            )}

            <span className="text-black font-bold">
              Current #1 Bid: <strong>${currentHighestBid}</strong> • Minimum to take #1: <strong className="text-[#e8622c]">${minToTakeNumberOne}</strong>
            </span>
          </div>
        </div>

        {/* 3. Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-y-2 border-black py-4">
          
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 font-mono text-xs font-bold whitespace-nowrap border-2 transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
            <span className="text-slate-500 font-bold uppercase">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="p-1.5 bg-white border-2 border-black font-mono text-xs font-bold focus:outline-hidden focus:border-[#e8622c]"
            >
              <option value="highest_bid">Highest Bid ($)</option>
              <option value="ending_soon">Ending Soon (24h)</option>
              <option value="most_clicked">Most Clicked</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* 4. Live Ranking Leaderboard */}
        {isLoading ? (
          <div className="p-12 text-center font-mono text-xs">
            <div className="inline-flex items-center gap-2 p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-3 h-3 bg-[#e8622c] animate-pulse" />
              <span>SYNCING LIVE AUCTION LEADERBOARD...</span>
            </div>
          </div>
        ) : filteredAndSortedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {filteredAndSortedCampaigns.map((item, index) => {
              const rank = index + 1;
              const isTopRank = rank === 1;

              return (
                <div
                  key={item.id}
                  className={`bg-white border-2 border-black p-5 flex flex-col justify-between space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-[#e8622c] transition-all group ${
                    isTopRank ? 'border-[#e8622c]' : ''
                  }`}
                >
                  {/* Top Bar: Rank Badge + Bid Amount + Countdown */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 font-mono text-xs font-black uppercase ${
                        rank === 1 ? 'bg-[#e8622c] text-white' :
                        rank === 2 ? 'bg-amber-400 text-black' :
                        rank === 3 ? 'bg-slate-200 text-black' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        #{rank} {rank === 1 && '🔥'}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                        Sponsored
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-base text-[#e8622c]">
                        ${item.currentBid || 2}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400">
                        {formatRemainingTime(item.expiresAt)}
                      </div>
                    </div>
                  </div>

                  {/* Profile & Destination Platform */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 border-2 border-black bg-slate-50 flex items-center justify-center shrink-0">
                        <PlatformBrandIcon platform={item.destinationType} className="w-4 h-4 text-black" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-mono font-black text-sm text-black truncate">
                          {item.authorName || 'Specialist'}
                        </h3>
                        <p className="text-xs font-mono text-slate-600 truncate">
                          {item.title}
                        </p>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-[11px] text-slate-600 font-mono line-clamp-2 bg-slate-50 p-2 border border-black/10">
                        {item.description}
                      </p>
                    )}

                    {/* Skill Tags */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.skills.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 font-mono text-[9px] font-bold text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions: View Direct Profile + Outbid Controller */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={item.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-black hover:text-[#e8622c] transition"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#e8622c]" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedOutbidCampaign(item)}
                      className="px-3 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-[10px] font-black uppercase transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      [ Outbid (${(Number(item.currentBid) || 2) + 1}) ⚡ ]
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 bg-white border-2 border-black text-center font-mono space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Flame className="w-10 h-10 text-[#e8622c] mx-auto" />
            <div className="text-base font-black text-black uppercase">No Active Promoted Profiles in this Category</div>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Be the first to claim the <strong>#1 Sponsored spot</strong> for only <strong>$2</strong> and get 24 hours of premium visibility.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              [ Claim #1 Spot for $2 ⚡ ]
            </button>
          </div>
        )}

        {/* 5. ProRank Organic vs Paid Transparency Notice */}
        <div className="p-5 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <div className="font-mono font-bold text-xs uppercase text-black">
                Transparent Two-Tier Architecture
              </div>
              <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                ProRank organic talent scores are computed strictly from skills, verified reviews, and project quality. Budget only purchases sponsored placement.
              </p>
            </div>
          </div>

          <Link
            to="/developers"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-black font-mono text-xs font-bold uppercase transition shrink-0"
          >
            Browse Organic ProRank Directory →
          </Link>
        </div>

      </main>

      <Footer />

      {/* Campaign Creation Modal */}
      <CreatePromotedCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCampaigns}
        currentHighestBid={currentHighestBid}
        initialUrl={urlInput}
        initialCategory={selectedCategory !== 'All' ? selectedCategory : undefined}
      />

      {/* Outbid Existing Campaign Modal */}
      {selectedOutbidCampaign && (
        <OutbidModal
          isOpen={Boolean(selectedOutbidCampaign)}
          onClose={() => setSelectedOutbidCampaign(null)}
          onSuccess={() => {
            setSelectedOutbidCampaign(null);
            fetchCampaigns();
          }}
          campaign={selectedOutbidCampaign}
        />
      )}
    </div>
  );
};

export default PromotedRankingPage;
