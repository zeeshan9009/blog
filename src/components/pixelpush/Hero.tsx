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
  { id: 'Developer', label: 'Developer', icon: '</>' },
  { id: 'SEO', label: 'SEO', icon: '🔍' },
  { id: 'Agents', label: 'AI Agents', icon: '🤖' },
  { id: 'Design', label: 'Design & UI', icon: '🎨' },
  { id: 'Marketing', label: 'Marketing', icon: '📢' },
  { id: 'Productivity', label: 'Productivity', icon: '🗂' },
  { id: 'People', label: 'People', icon: '👤' }
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

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/promotions/auction/campaigns');
      if (res.ok) {
        const data = await res.json();
        if (data.campaigns && data.campaigns.length > 0) {
          setCampaigns(data.campaigns);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default seeded showcase data
    setCampaigns([
      {
        id: 'promo-1',
        userId: 'u1',
        authorName: 'see.io',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        title: 'see.io · see your idea live',
        description: 'Just describe your idea. AI turns it into a fully built, live website in minutes. Get your own domain whenever you want one. No coding required.',
        destinationType: 'website',
        destinationUrl: 'https://see.io',
        category: 'Agents',
        skills: ['AI Agents & Infrastructure', 'Website Builder'],
        status: 'active',
        startingBid: 2,
        currentBid: 15000,
        currentPosition: 1,
        peakPosition: 1,
        impressions: 24890,
        clicks: 17751,
        externalVisits: 15200,
        startAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'promo-2',
        userId: 'u2',
        authorName: 'JONI',
        avatarUrl: 'https://images.unsplash.com/photo-1633409381658-a0c36b447471?w=120&auto=format&fit=crop&q=80',
        title: 'JONI | Your Personal AI Computer',
        description: 'JONI is your personal AI computer. Chat once and a team of AI agents and skills gets to work, with the right model picked for every job. None of the complexity.',
        destinationType: 'website',
        destinationUrl: 'https://joni.ai',
        category: 'Agents',
        skills: ['AI Agents & Infrastructure', 'Personal Assistant'],
        status: 'active',
        startingBid: 2,
        currentBid: 14028,
        currentPosition: 2,
        peakPosition: 1,
        impressions: 21300,
        clicks: 16617,
        externalVisits: 14100,
        startAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 16 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'promo-3',
        userId: 'u3',
        authorName: 'Requesty',
        avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        title: 'Requesty: AI Gateway & LLM Router for 600+ Models',
        description: 'Route every LLM call through one OpenAI-compatible API. 600+ models from OpenAI, Anthropic, Google and more. Smart routing, caching, failover, observability...',
        destinationType: 'website',
        destinationUrl: 'https://requesty.ai',
        category: 'Developer',
        skills: ['AI Gateway', 'LLM Router', 'Observability'],
        status: 'active',
        startingBid: 2,
        currentBid: 14023,
        currentPosition: 3,
        peakPosition: 2,
        impressions: 8900,
        clicks: 2786,
        externalVisits: 2400,
        startAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 11 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'promo-4',
        userId: 'u4',
        authorName: 'Ahmed Khan',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
        title: 'Ahmed Khan · Senior Full Stack & AI Architect',
        description: 'Specializing in Next.js, Node.js microservices, and AI integrations. Over 7+ years of production engineering experience with top startups.',
        destinationType: 'linkedin',
        destinationUrl: 'https://linkedin.com',
        category: 'Developer',
        skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        status: 'active',
        startingBid: 2,
        currentBid: 8500,
        currentPosition: 4,
        peakPosition: 3,
        impressions: 6100,
        clicks: 1940,
        externalVisits: 1650,
        startAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
    setIsLoading(false);
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

  return (
    <section className="pt-8 sm:pt-12 pb-16 bg-[#faf8f5] text-slate-900 font-sans border-b-2 border-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        
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
                placeholder="Your product URL, LinkedIn, Upwork, or @handle"
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
                <option value="All">Choose a category</option>
                <option value="Developer">Developer</option>
                <option value="SEO">SEO</option>
                <option value="Agents">AI Agents</option>
                <option value="Design">Design & UI</option>
                <option value="Marketing">Marketing</option>
                <option value="Productivity">Productivity</option>
                <option value="People">People</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-black absolute right-3 pointer-events-none" />
            </div>

            {/* Outbid Action Button */}
            <button
              type="submit"
              className="px-8 py-3 bg-[#e8622c] hover:bg-black text-white font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shrink-0 text-center border-t-2 sm:border-t-0 sm:border-l-2 border-black"
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
          {filteredCampaigns.map((camp, idx) => (
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
          ))}
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
      />
    </section>
  );
};

export default Hero;
