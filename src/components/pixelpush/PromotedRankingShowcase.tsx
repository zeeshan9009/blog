import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowUpRight, ExternalLink, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import type { PromotedCampaign } from '../../types/promotedAuction';
import { OutbidModal } from '../modals/OutbidModal';

export const PromotedRankingShowcase: React.FC = () => {
  const [campaigns, setCampaigns] = useState<PromotedCampaign[]>([]);
  const [stats, setStats] = useState<{ highestBid: number; minToEnter: number; minToTakeNumberOne: number }>({
    highestBid: 15,
    minToEnter: 2,
    minToTakeNumberOne: 16
  });
  const [selectedOutbidCampaign, setSelectedOutbidCampaign] = useState<PromotedCampaign | null>(null);

  const fetchPromoted = async () => {
    try {
      const res = await fetch('/api/promotions/auction/campaigns');
      if (res.ok) {
        const data = await res.json();
        if (data.campaigns && data.campaigns.length > 0) {
          setCampaigns(data.campaigns.slice(0, 4));
          if (data.stats) setStats(data.stats);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default showcase preview
    setCampaigns([
      {
        id: 'promo-1',
        userId: 'u1',
        authorName: 'Ahmed Khan',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
        title: 'Senior React & Node.js Architect',
        description: 'Building microservices and low-latency SaaS platforms with Redis and PostgreSQL.',
        destinationType: 'linkedin',
        destinationUrl: 'https://linkedin.com',
        category: 'Full Stack',
        skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        status: 'active',
        startingBid: 2,
        currentBid: 15,
        currentPosition: 1,
        peakPosition: 1,
        impressions: 4821,
        clicks: 317,
        externalVisits: 284,
        startAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 18 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'promo-2',
        userId: 'u2',
        authorName: 'Ali Raza',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali',
        title: 'Lead Full Stack & Next.js Engineer',
        description: 'Specializing in high-performance web applications and enterprise cloud infrastructure.',
        destinationType: 'upwork',
        destinationUrl: 'https://upwork.com',
        category: 'Frontend',
        skills: ['Next.js', 'TypeScript', 'TailwindCSS'],
        status: 'active',
        startingBid: 2,
        currentBid: 10,
        currentPosition: 2,
        peakPosition: 1,
        impressions: 3410,
        clicks: 210,
        externalVisits: 195,
        startAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 14 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'promo-3',
        userId: 'u3',
        authorName: 'Usman Tariq',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Usman',
        title: 'AI & Python Backend Specialist',
        description: 'FastAPI microservices, vector search pipelines, and automated scraping systems.',
        destinationType: 'fiverr',
        destinationUrl: 'https://fiverr.com',
        category: 'AI & Machine Learning',
        skills: ['Python', 'FastAPI', 'PyTorch', 'Docker'],
        status: 'active',
        startingBid: 2,
        currentBid: 7,
        currentPosition: 3,
        peakPosition: 2,
        impressions: 2190,
        clicks: 142,
        externalVisits: 130,
        startAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 9 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'promo-4',
        userId: 'u4',
        authorName: 'Hamza Siddiqui',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hamza',
        title: 'Backend Go & Distributed Systems Engineer',
        description: 'Ultra high-concurrency gRPC microservices and Kubernetes cluster design.',
        destinationType: 'portfolio',
        destinationUrl: 'https://github.com',
        category: 'Backend',
        skills: ['Go', 'gRPC', 'Docker', 'PostgreSQL'],
        status: 'active',
        startingBid: 2,
        currentBid: 5,
        currentPosition: 4,
        peakPosition: 3,
        impressions: 1650,
        clicks: 98,
        externalVisits: 88,
        startAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 6 * 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  };

  useEffect(() => {
    fetchPromoted();
  }, []);

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

  return (
    <section className="py-20 bg-[#faf8f5] border-t-2 border-b-2 border-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-mono text-xs font-bold uppercase mb-3 shadow-[3px_3px_0px_0px_#e8622c]">
              <Flame className="w-3.5 h-3.5 fill-[#e8622c] text-[#e8622c]" />
              <span>LIVE PROMOTED RANKINGS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
              Get Your Profile in Front of More Clients
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Compete for premium visibility. Place your LinkedIn, Fiverr, Upwork, portfolio or personal website at the top of RankLancr’s promoted discovery results.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/promoted-ranking"
              className="px-5 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer"
            >
              <span>[ VIEW LIVE AUCTION ]</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Auction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {campaigns.map((camp, idx) => (
            <div
              key={camp.id}
              className="bg-white border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition duration-200"
            >
              {/* Top Meta */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-black text-white font-mono text-xs font-black">
                    #{idx + 1} {idx === 0 && '🔥'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    SPONSORED
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={camp.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(camp.authorName)}`}
                    alt={camp.authorName}
                    className="w-11 h-11 rounded-full border-2 border-black object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-black text-sm text-black truncate">{camp.authorName}</h4>
                    <div className="text-[11px] text-slate-500 font-mono truncate">{camp.title}</div>
                  </div>
                </div>

                {/* Platform Destination */}
                <div className="flex items-center justify-between pt-1">
                  {getPlatformBadge(camp.destinationType)}
                  <span className="text-[11px] font-mono font-bold text-slate-600">{camp.category}</span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1">
                  {camp.skills.slice(0, 3).map((skill, sIdx) => (
                    <span key={sIdx} className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 font-mono text-[9px] text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bid & Actions */}
              <div className="space-y-3 pt-3 border-t-2 border-black/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase font-bold">Current Bid</div>
                    <div className="text-xl font-black text-black">${camp.currentBid}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-slate-500 uppercase font-bold">Duration</div>
                    <div className="text-xs font-mono font-bold text-emerald-600">24H Active</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
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
                    className="p-2 bg-slate-100 hover:bg-slate-200 border-2 border-black text-black font-mono text-[10px] font-bold text-center flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <span>Visit Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => setSelectedOutbidCampaign(camp)}
                    className="p-2 bg-[#e8622c] hover:bg-black text-white border-2 border-black font-mono text-[10px] font-bold text-center flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                  >
                    <span>Outbid</span>
                    <Zap className="w-3 h-3 fill-white" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Dynamic CTA Footer Bar */}
        <div className="p-6 bg-black text-white border-2 border-black shadow-[6px_6px_0px_0px_#e8622c] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-mono text-xs font-bold text-[#e8622c] uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Want The #1 Top Placement?</span>
            </div>
            <p className="text-xs text-slate-300">
              Current highest bid is <strong>${stats.highestBid}</strong>. Bid <strong>${stats.minToTakeNumberOne}</strong> to immediately take the #1 Sponsored spot.
            </p>
          </div>

          <Link
            to="/promoted-ranking"
            className="px-6 py-3 bg-[#e8622c] hover:bg-white hover:text-black text-white font-mono text-xs font-black uppercase transition shrink-0 shadow-xs cursor-pointer"
          >
            [ 🔥 LAUNCH YOUR PROMOTION — FROM $2 ]
          </Link>
        </div>

      </div>

      {/* Outbid Modal */}
      <OutbidModal
        isOpen={Boolean(selectedOutbidCampaign)}
        onClose={() => setSelectedOutbidCampaign(null)}
        campaign={selectedOutbidCampaign}
        onSuccess={fetchPromoted}
      />
    </section>
  );
};
