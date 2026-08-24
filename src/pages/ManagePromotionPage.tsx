import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Flame,
  Zap,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Check,
  Clock,
  TrendingUp,
  BarChart3,
  Globe,
  Share2,
  Pause,
  Play
} from 'lucide-react';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
import toast from 'react-hot-toast';

interface ManagedCampaign {
  id: string;
  title: string;
  description: string;
  authorName: string;
  avatarUrl?: string;
  destinationType: string;
  destinationUrl: string;
  category: string;
  skills: string[];
  startingBid: number;
  currentBid: number;
  status: string;
  userEmail?: string;
  managementToken: string;
  expiresAt: string;
  createdAt: string;
  currentPosition: number;
  highestBidOverall: number;
  minToTakeNumberOne: number;
  impressions: number;
  clicks: number;
  externalVisits: number;
  ctr: number;
}

export const ManagePromotionPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<ManagedCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newBidAmount, setNewBidAmount] = useState<number>(0);
  const [isUpdatingBid, setIsUpdatingBid] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchCampaign = async () => {
    if (!token) {
      setError('Missing management token');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/promotions/auction/manage?token=${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Campaign not found');
      }

      setCampaign(data.campaign);
      setNewBidAmount(data.campaign.minToTakeNumberOne || (data.campaign.currentBid + 1));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load promotion management dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
    const interval = setInterval(fetchCampaign, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const handleIncreaseBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    if (newBidAmount <= campaign.currentBid) {
      toast.error(`New bid must be higher than current bid ($${campaign.currentBid})`);
      return;
    }

    setIsUpdatingBid(true);
    try {
      const res = await fetch('/api/promotions/auction/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'increase_bid',
          amount: newBidAmount,
          managementToken: token
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update bid');
      }

      toast.success(`🔥 Bid successfully boosted to $${newBidAmount}!`);
      fetchCampaign();
    } catch (err: any) {
      toast.error(err.message || 'Error boosting bid');
    } finally {
      setIsUpdatingBid(false);
    }
  };

  const handleTogglePause = async () => {
    if (!campaign) return;
    try {
      const res = await fetch('/api/promotions/auction/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_pause',
          managementToken: token
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle status');
      toast.success(data.status === 'paused' ? 'Promotion paused' : 'Promotion activated');
      fetchCampaign();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const copyManagementUrl = () => {
    const fullUrl = window.location.href;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    toast.success('Magic management link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatRemainingTime = (expiresAt?: string) => {
    if (!expiresAt) return '24h remaining';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 font-mono text-xs">
        <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
          <span className="w-3 h-3 bg-[#e8622c] animate-pulse" />
          <span>AUTHENTICATING SECURE MAGIC TOKEN...</span>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 font-mono">
        <div className="bg-white border-2 border-black p-8 max-w-md w-full text-center space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
          <h2 className="text-lg font-black text-black uppercase">Promotion Not Found</h2>
          <p className="text-xs text-slate-600">
            {error || 'This promotion link is either invalid or has expired.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            [ GO TO HOMEPAGE ]
          </button>
        </div>
      </div>
    );
  }

  const isNumberOne = campaign.currentPosition === 1;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-600 selection:text-white pb-20">
      
      {/* Top Navbar Header */}
      <header className="border-b-2 border-black bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 p-1 px-2.5 bg-slate-100 hover:bg-slate-200 border border-black font-mono text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ HOME ]</span>
          </button>
          <RankLancrLogo size="sm" showDomain={true} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyManagementUrl}
            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-black font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-black" />}
            <span className="hidden sm:inline">COPY MAGIC LINK</span>
          </button>

          <button
            onClick={handleTogglePause}
            className={`px-3 py-1.5 border border-black font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs ${
              campaign.status === 'paused' ? 'bg-emerald-600 text-white' : 'bg-white text-black hover:bg-slate-100'
            }`}
          >
            {campaign.status === 'paused' ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{campaign.status === 'paused' ? 'RESUME' : 'PAUSE'}</span>
          </button>
        </div>
      </header>

      {/* Main Management Dashboard */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Status Banner */}
        <div className={`p-5 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isNumberOne ? 'bg-orange-50/80 border-[#e8622c]' : 'bg-amber-50 border-black'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 border-2 border-black flex items-center justify-center shrink-0 ${
              isNumberOne ? 'bg-[#e8622c] text-white' : 'bg-amber-400 text-black'
            }`}>
              {isNumberOne ? <Flame className="w-6 h-6 fill-white" /> : <AlertTriangle className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base uppercase text-black">
                  {isNumberOne ? '🔥 YOU ARE #1 TOP SPONSORED' : `⚠️ CURRENTLY RANK #${campaign.currentPosition}`}
                </span>
                <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
                  {campaign.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600 mt-0.5">
                {isNumberOne
                  ? 'Your profile is receiving highest priority exposure and #1 placement in search.'
                  : `A competitor has placed a higher bid ($${campaign.highestBidOverall}). Increase your bid to reclaim #1.`}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-mono font-black text-[#e8622c]">
              ${campaign.currentBid}
            </div>
            <div className="text-[10px] font-mono text-slate-500 uppercase">
              Current Active Bid
            </div>
          </div>
        </div>

        {/* Quick Outbid / Boost Bid Form Box */}
        <div className="p-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div>
            <h3 className="text-sm font-mono font-black uppercase text-black flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#e8622c]" />
              <span>Real-Time Boost & Outbid Controller</span>
            </h3>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              Instantly outbid competitors or increase exposure without logging in.
            </p>
          </div>

          <form onSubmit={handleIncreaseBid} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-base text-black">$</span>
              <input
                type="number"
                min={campaign.currentBid + 1}
                step="1"
                value={newBidAmount}
                onChange={(e) => setNewBidAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border-2 border-black font-mono font-bold text-base text-black focus:outline-hidden focus:border-[#e8622c]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingBid}
              className="px-8 py-3 bg-[#e8622c] hover:bg-black text-white font-mono font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            >
              {isUpdatingBid ? 'UPDATING...' : `[ BOOST BID TO $${newBidAmount} ⚡ ]`}
            </button>
          </form>

          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Minimum bid to take #1 right now: <strong>${campaign.minToTakeNumberOne}</strong></span>
            <span className="text-black font-bold uppercase">{formatRemainingTime(campaign.expiresAt)}</span>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Search Impressions</div>
            <div className="text-xl sm:text-2xl font-black text-black font-mono mt-1">
              {(campaign.impressions || 0).toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-emerald-600 mt-0.5">Live placements</div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Profile Clicks</div>
            <div className="text-xl sm:text-2xl font-black text-black font-mono mt-1">
              {(campaign.clicks || 0).toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-slate-600 mt-0.5">On RankLancr</div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Outbound Visits</div>
            <div className="text-xl sm:text-2xl font-black text-[#e8622c] font-mono mt-1">
              {(campaign.externalVisits || 0).toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-[#e8622c] mt-0.5">Direct to your URL</div>
          </div>

          <div className="p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Click-Through (CTR)</div>
            <div className="text-xl sm:text-2xl font-black text-black font-mono mt-1">
              {campaign.ctr || 0}%
            </div>
            <div className="text-[10px] font-mono text-emerald-600 mt-0.5">High engagement</div>
          </div>
        </div>

        {/* Campaign Details Card */}
        <div className="p-6 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black/10 pb-3">
            <div>
              <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
                {campaign.destinationType.toUpperCase()}
              </span>
              <h3 className="text-base font-black text-black font-mono mt-1">{campaign.title}</h3>
            </div>

            <a
              href={campaign.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#e8622c] hover:text-white border border-black font-mono text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Test Live Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">DESTINATION URL</span>
              <span className="text-black font-bold break-all">{campaign.destinationUrl}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CATEGORY</span>
              <span className="text-black font-bold">{campaign.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ASSOCIATED EMAIL</span>
              <span className="text-black font-bold">{campaign.userEmail || 'Not provided (Guest)'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">PROMOTION EXPIRES AT</span>
              <span className="text-black font-bold">{new Date(campaign.expiresAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Magic Link Reminder Card */}
        <div className="p-4 bg-orange-50 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="font-mono font-bold text-xs uppercase text-black">
              🔒 Bookmark or Save This Magic Link
            </div>
            <div className="text-[11px] font-mono text-slate-600">
              You do not need a password. This secure link is your key to managing your $2 boost anytime.
            </div>
          </div>

          <button
            onClick={copyManagementUrl}
            className="px-4 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase transition cursor-pointer shrink-0 shadow-xs"
          >
            {copiedLink ? '[ COPIED ✓ ]' : '[ COPY LINK ]'}
          </button>
        </div>

      </main>
    </div>
  );
};

export default ManagePromotionPage;
