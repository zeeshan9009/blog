import React, { useState, useEffect } from 'react';
import {
  Link2,
  Copy,
  Check,
  Share2,
  ExternalLink,
  RefreshCw,
  Trophy,
  Users,
  Clock,
  Flame,
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ChallengeLinkItem {
  id: string;
  slug: string;
  title: string;
  status: string;
  submissionLink: string;
  directArenaLink: string;
  entriesCount: number;
  submissionsCount: number;
  submissionDeadline: string;
  entryDeadline: string;
  timeRemainingMs: number;
  leadingBidDollars: string | null;
  leadingSponsorName: string | null;
  createdAt: string;
}

interface AdminChallengeLinksTabProps {
  adminKey: string;
}

export const AdminChallengeLinksTab: React.FC<AdminChallengeLinksTabProps> = ({ adminKey }) => {
  const [challenges, setChallenges] = useState<ChallengeLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/challenge-links?all=${showAll}`, {
        headers: {
          'x-admin-key': adminKey
        }
      });
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.challengeLinks || []);
      } else {
        toast.error('Failed to load challenge links');
      }
    } catch (e: any) {
      toast.error(e.message || 'Error fetching links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLinks();
    }, 30000);

    return () => clearInterval(interval);
  }, [showAll, adminKey]);

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('📋 Submission link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareToTwitter = (ch: ChallengeLinkItem) => {
    const text = encodeURIComponent(
      `🏆 Join the ${ch.title} on RankLancr!\n\nPay $5, submit your project, and compete for 72-hour site-wide Top Developer Rail placement.\n\nSubmit your work here:`
    );
    const url = encodeURIComponent(ch.submissionLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const formatCountdown = (ms: number) => {
    if (ms <= 0) return 'Ended';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="space-y-6 font-mono">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#e8622c]" />
            <h2 className="text-lg font-black text-black uppercase">
              Auto-Generated Challenge Submission Links
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            Unique, human-readable submission URLs for social campaigns, developer groups & email announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Active vs All Toggle */}
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className={`px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
              showAll ? 'bg-black text-white border-black' : 'bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {showAll ? 'Showing: All Challenges' : 'Showing: Active Only'}
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchLinks}
            disabled={loading}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-black border border-black font-bold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh (30s)</span>
          </button>
        </div>
      </div>

      {/* Challenge Links Table */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {loading && challenges.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#e8622c] mx-auto" />
            <p>Loading active challenge links...</p>
          </div>
        ) : challenges.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="font-bold text-black uppercase">No Active Challenges Found</p>
            <p>Create and activate a challenge in the Challenges tab to auto-generate submission links.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black text-white border-b-2 border-black uppercase text-[11px]">
                  <th className="p-3.5">Challenge Title</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Auto-Generated Submission URL</th>
                  <th className="p-3.5 text-center">Entries</th>
                  <th className="p-3.5 text-center">Submissions</th>
                  <th className="p-3.5">Closes In</th>
                  <th className="p-3.5">Leading Sponsor</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {challenges.map((ch) => {
                  const isCopied = copiedId === ch.id;
                  const isOpen = ch.status === 'open_entry' || ch.status === 'submission_window';

                  return (
                    <tr key={ch.id} className="hover:bg-orange-50/40 transition">
                      
                      {/* Title */}
                      <td className="p-3.5 font-bold text-black max-w-[220px]">
                        <div className="truncate" title={ch.title}>
                          {ch.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          slug: <code className="text-[#e8622c]">{ch.slug}</code>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-black ${
                          ch.status === 'open_entry'
                            ? 'bg-amber-300 text-black'
                            : ch.status === 'submission_window'
                            ? 'bg-emerald-300 text-black'
                            : ch.status === 'voting_window'
                            ? 'bg-blue-200 text-black'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {ch.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* URL Box + Copy */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 bg-[#fafafa] border border-slate-300 p-1.5 max-w-[320px]">
                          <span className="text-[11px] text-slate-800 truncate select-all flex-1 font-mono">
                            {ch.submissionLink}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(ch.submissionLink, ch.id)}
                            className={`p-1 border transition shrink-0 cursor-pointer ${
                              isCopied ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white hover:bg-slate-100 text-black border-black'
                            }`}
                            title="Copy link"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Entries Count */}
                      <td className="p-3.5 text-center font-bold text-black">
                        <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-300 px-2 py-0.5">
                          <Users className="w-3 h-3 text-[#e8622c]" />
                          <span>{ch.entriesCount}</span>
                        </div>
                      </td>

                      {/* Submissions Count */}
                      <td className="p-3.5 text-center font-bold text-black">
                        <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-300 px-2 py-0.5">
                          <Trophy className="w-3 h-3 text-amber-600" />
                          <span>{ch.submissionsCount}</span>
                        </div>
                      </td>

                      {/* Closes in Countdown */}
                      <td className="p-3.5 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatCountdown(ch.timeRemainingMs)}</span>
                        </div>
                      </td>

                      {/* Sponsor */}
                      <td className="p-3.5 text-slate-800">
                        {ch.leadingSponsorName ? (
                          <div className="font-bold text-[#e8622c] truncate max-w-[130px]" title={ch.leadingSponsorName}>
                            ${ch.leadingBidDollars} • {ch.leadingSponsorName}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">$100 Floor (Unbidded)</span>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Post on X */}
                          <button
                            type="button"
                            onClick={() => shareToTwitter(ch)}
                            className="p-1.5 bg-[#000000] hover:bg-slate-800 text-white font-bold text-[10px] transition border border-black shadow-xs cursor-pointer flex items-center gap-1"
                            title="Share on X / Twitter"
                          >
                            <Share2 className="w-3 h-3 text-sky-400" />
                            <span>Share</span>
                          </button>

                          {/* Open Page */}
                          <a
                            href={ch.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white hover:bg-slate-100 text-black border border-black text-[10px] transition cursor-pointer"
                            title="Open submission page"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminChallengeLinksTab;
