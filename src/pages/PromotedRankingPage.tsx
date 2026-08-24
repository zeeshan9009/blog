import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Info,
  TrendingUp
} from 'lucide-react';
import { Navbar } from '../components/pixelpush/Navbar';
import { Footer } from '../components/pixelpush/Footer';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
import { CreatePromotedCampaignModal } from '../components/modals/CreatePromotedCampaignModal';
import { OutbidModal } from '../components/modals/OutbidModal';
import { supabase } from '../lib/supabase';
import type { PromotedCampaign } from '../types/promotedAuction';

const CATEGORIES = [
  'All',
  'Full Stack',
  'Frontend',
  'Backend',
  'AI & Machine Learning',
  'UI/UX Design',
  'DevOps & Cloud',
  'Mobile'
];

export const PromotedRankingPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<PromotedCampaign[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOutbidCampaign, setSelectedOutbidCampaign] = useState<PromotedCampaign | null>(null);

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

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    if (selectedCategory === 'All') return campaigns;
    return campaigns.filter(c => c.category === selectedCategory);
  }, [campaigns, selectedCategory]);

  const highestBid = campaigns.length > 0 ? Math.max(...campaigns.map(c => Number(c.currentBid) || 2)) : 0;
  const minToTakeNumberOne = highestBid > 0 ? highestBid + 1 : 2;

  const getPlatformBadge = (type: string) => {
    switch (type) {
      case 'linkedin':
        return <span className="px-2 py-0.5 bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/30 font-mono text-[10px] font-bold">🔗 LinkedIn</span>;
      case 'upwork':
        return <span className="px-2 py-0.5 bg-[#14a800]/10 text-[#14a800] border border-[#14a800]/30 font-mono text-[10px] font-bold">💼 Upwork</span>;
      case 'fiverr':
        return <span className="px-2 py-0.5 bg-[#1dbf73]/10 text-[#1dbf73] border border-[#1dbf73]/30 font-mono text-[10px] font-bold">⚡ Fiverr</span>;
      case 'github':
        return <span className="px-2 py-0.5 bg-black/10 text-black border border-black/30 font-mono text-[10px] font-bold">🐙 GitHub</span>;
      case 'portfolio':
        return <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 font-mono text-[10px] font-bold">🌐 Portfolio</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 font-mono text-[10px] font-bold">💻 Website</span>;
    }
  };

  const calculateTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m left`;
  };

  return (
    <div className="min-h-screen bg-[#fffefc] text-black flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 w-full">
        
        {/* Hero Section */}
        <div className="bg-[#faf8f5] border-2 border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_0px_#e8622c]">
                <Flame className="w-3.5 h-3.5 fill-[#e8622c] text-[#e8622c]" />
                <span>COMPETITIVE BOOST AUCTION</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-none">
                Get Your Profile in Front of More Clients
              </h1>
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                Compete for premium visibility. Place your <strong>LinkedIn</strong>, <strong>Fiverr</strong>, <strong>Upwork</strong>, <strong>GitHub</strong>, portfolio or personal website at the top of RankLancr’s promoted results.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-black uppercase transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>[ START A PROMOTION ]</span>
              </button>

              <a
                href="#live-rankings"
                className="px-6 py-3.5 bg-white hover:bg-slate-100 border-2 border-black font-mono text-xs font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Live Rankings</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Key Differentiator Notice */}
          <div className="p-4 bg-black text-white border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Strict ProRank Independence:</strong> Paid bidding determines <em>Sponsored Visibility</em>. Organic ProRank scores cannot be bought.</span>
            </div>
            <span className="text-[#e8622c] font-bold shrink-0">MIN BID: $2.00 / 24H</span>
          </div>
        </div>

        {/* Live Auction Statistics Ticker */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Highest Active Bid</div>
            <div className="text-3xl font-black text-[#e8622c] mt-1">${highestBid}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Leading #1 Slot</div>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Active Campaigns</div>
            <div className="text-3xl font-black text-black mt-1">{campaigns.length}</div>
            <div className="text-[10px] font-mono text-emerald-600 mt-0.5">Compromising 24H Auction</div>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Minimum To Enter</div>
            <div className="text-3xl font-black text-black mt-1">$2.00</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">24 Hours Duration</div>
          </div>

          <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Minimum To Take #1</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">${minToTakeNumberOne}</div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">Calculated Dynamically</div>
          </div>
        </div>

        {/* Category Filters */}
        <div id="live-rankings" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black font-mono uppercase tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 fill-[#e8622c] text-[#e8622c]" />
              <span>Live Promoted Leaderboard</span>
            </h2>
            <span className="font-mono text-xs text-slate-500">
              Showing {filteredCampaigns.length} Active Sponsored Placements
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 font-mono text-xs font-bold border-2 transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Live Promoted Cards Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-black p-12 text-center space-y-4">
            <Flame className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <h3 className="font-black text-lg text-black">No active promotions yet in this category</h3>
              <p className="text-xs text-slate-500 mt-1">Be the first professional to promote your profile and take #1!</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-[#e8622c] text-white font-mono text-xs font-bold uppercase transition hover:bg-black cursor-pointer shadow-xs"
            >
              [ START PROMOTION — FROM $2 ]
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((camp, idx) => (
              <div
                key={camp.id}
                className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-5 hover:-translate-y-1 transition duration-200"
              >
                <div className="space-y-4">
                  {/* Top Bar: Rank & Sponsored Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 font-mono text-xs font-black border-2 border-black ${
                        idx === 0 ? 'bg-[#e8622c] text-white' : idx === 1 ? 'bg-amber-400 text-black' : 'bg-black text-white'
                      }`}>
                        #{idx + 1} {idx === 0 && '🔥'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{camp.category}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      SPONSORED
                    </span>
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={camp.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(camp.authorName)}`}
                      alt={camp.authorName}
                      className="w-14 h-14 rounded-full border-2 border-black object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-black text-base text-black truncate">{camp.authorName}</h3>
                      <div className="text-xs font-mono font-bold text-slate-700 mt-0.5">{camp.title}</div>
                      <div className="mt-1.5">{getPlatformBadge(camp.destinationType)}</div>
                    </div>
                  </div>

                  {/* Description Pitch */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {camp.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-slate-100 border border-slate-300 font-mono text-[10px] text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bidding & Actions */}
                <div className="space-y-4 pt-4 border-t-2 border-black/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Current Bid</div>
                      <div className="text-2xl font-black text-black">${camp.currentBid}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Countdown</div>
                      <div className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{calculateTimeRemaining(camp.expiresAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={camp.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        fetch('/api/promotions/auction/analytics', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ campaignId: camp.id, eventType: 'external_visit' })
                        }).catch(() => {});
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-black text-black font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Visit Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => setSelectedOutbidCampaign(camp)}
                      className="p-2.5 bg-[#e8622c] hover:bg-black text-white border-2 border-black font-mono text-xs font-bold text-center flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <span>Outbid</span>
                      <Zap className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />

      {/* Campaign Creation Modal */}
      <CreatePromotedCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCampaigns}
        currentHighestBid={highestBid}
      />

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={Boolean(selectedOutbidCampaign)}
        onClose={() => setSelectedOutbidCampaign(null)}
        campaign={selectedOutbidCampaign}
        onSuccess={fetchCampaigns}
      />
    </div>
  );
};

export default PromotedRankingPage;
