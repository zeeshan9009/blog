import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  ChevronDown,
  Search,
  Bot,
  Sparkles,
  Megaphone,
  Code,
  FolderKanban,
  Users,
  ExternalLink,
  Flame,
  Zap,
  ArrowUpRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OutbidModal } from '../modals/OutbidModal';
import { CreatePromotedCampaignModal } from '../modals/CreatePromotedCampaignModal';
import { supabase } from '../../lib/supabase';
import type { PromotedCampaign } from '../../types/promotedAuction';
import toast from 'react-hot-toast';

const CATEGORY_TABS = [
  { id: 'All', label: 'All', icon: '⊞' },
  { id: 'SEO', label: 'SEO', icon: '🔍' },
  { id: 'Agents', label: 'AI Agents', icon: '🤖' },
  { id: 'Developer', label: 'Developer', icon: '</>' },
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
      .channel('hero_promoted_live')
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

    // Check if entered URL matches an existing campaign
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
    <section className="pt-8 sm:pt-12 pb-16 bg-[#fffaf5] text-slate-900 font-sans border-b border-orange-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-7">
        
        {/* Top Floating Action & Search Bar */}
        <div className="space-y-2">
          <form
            onSubmit={handleOutbidBarSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-full p-2 border border-orange-200/80 shadow-[0_4px_20px_-4px_rgba(232,98,44,0.12)] transition focus-within:border-[#e8622c] focus-within:ring-2 focus-within:ring-orange-500/20"
          >
            {/* Input URL or Handle */}
            <div className="flex items-center gap-3 pl-4 pr-2 py-1 flex-1 w-full">
              <Globe className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Your product URL, LinkedIn, or @handle"
                className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative border-t sm:border-t-0 sm:border-l border-slate-200 pl-3 pr-2 py-1 flex items-center w-full sm:w-auto shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-hidden pr-6 cursor-pointer appearance-none"
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
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
            </div>

            {/* Outbid Action Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-2.5 bg-[#f59e7a] hover:bg-[#e8622c] text-white font-bold text-sm rounded-full transition shadow-xs cursor-pointer shrink-0 text-center"
            >
              Outbid
            </button>
          </form>

          {/* Subtext info */}
          <p className="text-center text-xs text-slate-400 font-medium">
            Already on the list? Enter the same URL or @handle and up your bid.
          </p>
        </div>

        {/* Category Pill Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#e8622c] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-orange-50/50 hover:text-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Ranked Auction Cards List */}
        <div className="space-y-3.5">
          {filteredCampaigns.map((camp, idx) => (
            <div
              key={camp.id}
              onClick={() => setSelectedOutbidCampaign(camp)}
              className="group bg-[#fff5ee]/90 hover:bg-[#ffece0] border border-[#fbd3c1] rounded-3xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left Rank Pill & Logo Info */}
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                {/* # Rank Tag */}
                <div className="px-2.5 py-1 bg-[#f5835b] text-white rounded-full font-black text-xs font-mono shrink-0 shadow-xs">
                  #{idx + 1}
                </div>

                {/* Avatar Icon */}
                <div className="w-12 h-12 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center shrink-0 border border-black/10 shadow-xs">
                  {camp.avatarUrl ? (
                    <img src={camp.avatarUrl} alt={camp.authorName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-base">{camp.authorName.charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate group-hover:text-[#e8622c] transition">
                      {camp.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {camp.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-2.5 text-[11px] text-slate-500 font-medium flex-wrap pt-0.5">
                    <span className="text-slate-400">active</span>
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
                      className="text-slate-700 hover:text-[#e8622c] font-semibold underline underline-offset-2 flex items-center gap-0.5"
                    >
                      <span>{camp.destinationUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{camp.category}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-bold text-slate-700">
                      {(camp.clicks || 0).toLocaleString()} clicks
                    </span>
                    <span className="text-slate-400">see details</span>
                  </div>
                </div>
              </div>

              {/* Right Bid & Outbid Action */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 pl-12 sm:pl-0">
                <div className="text-right">
                  <div className="text-lg sm:text-xl font-black text-[#e8622c] tracking-tight font-mono">
                    ${(camp.currentBid || 2).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOutbidCampaign(camp);
                  }}
                  className="mt-1 px-3 py-1 bg-white hover:bg-black hover:text-white border border-[#f5835b] text-[#e8622c] text-[11px] font-bold rounded-full transition shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Outbid</span>
                  <Zap className="w-3 h-3 fill-current" />
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
