import React, { useState } from 'react';
import { Lock, X, Save, CheckCircle2, Sliders, Calendar, ShieldCheck, Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminVotingRulesModalProps {
  challenge: any;
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
  onSaved: () => void;
}

export const AdminVotingRulesModal: React.FC<AdminVotingRulesModalProps> = ({
  challenge,
  isOpen,
  onClose,
  adminToken,
  onSaved
}) => {
  if (!isOpen || !challenge) return null;

  const existing = challenge.votingSettings || {};
  const [maxVotes, setMaxVotes] = useState(existing.max_votes_per_voter || existing.maxVotesPerVoter || 1);
  const [allowOncePerParticipant, setAllowOncePerParticipant] = useState(
    existing.allow_once_per_participant !== false && existing.allowOncePerParticipant !== false
  );
  const [requireAuth, setRequireAuth] = useState(Boolean(existing.require_auth || existing.requireAuth));
  const [isPublic, setIsPublic] = useState(existing.is_public !== false && existing.isPublic !== false);
  const [voteStatus, setVoteStatus] = useState<'upcoming' | 'active' | 'ended'>(
    existing.vote_status || existing.voteStatus || (challenge.status === 'voting_window' ? 'active' : 'upcoming')
  );
  const [votingStartAt, setVotingStartAt] = useState(
    existing.voting_start_at ? new Date(existing.voting_start_at).toISOString().slice(0, 16) : ''
  );
  const [votingEndAt, setVotingEndAt] = useState(
    existing.voting_end_at ? new Date(existing.voting_end_at).toISOString().slice(0, 16) : ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin?action=update-voting-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          maxVotesPerVoter: maxVotes,
          allowOncePerParticipant,
          requireAuth,
          isPublic,
          voteStatus,
          votingStartAt: votingStartAt ? new Date(votingStartAt).toISOString() : null,
          votingEndAt: votingEndAt ? new Date(votingEndAt).toISOString() : null
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Voting rules saved and enforced!');
        onSaved();
        onClose();
      } else {
        toast.error(data.error || 'Failed to update voting settings');
      }
    } catch {
      toast.error('Network error saving voting rules');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white border-2 border-black w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Modal Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#e8622c]" />
            <h3 className="font-mono font-black text-sm uppercase tracking-wide">
              Configure Voting Rules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Challenge Banner Info */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-mono text-xs">
          <span className="text-slate-500 font-bold uppercase block text-[10px]">Target Arena</span>
          <span className="font-black text-black text-sm line-clamp-1">{challenge.title}</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono text-xs">
          
          {/* Vote Status */}
          <div className="space-y-1">
            <label className="block font-bold text-black uppercase">Voting Status</label>
            <select
              value={voteStatus}
              onChange={(e) => setVoteStatus(e.target.value as any)}
              className="w-full px-3 py-2 border-2 border-black bg-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="upcoming">Upcoming (Not started)</option>
              <option value="active">Active (Voting Open)</option>
              <option value="ended">Ended (Voting Closed)</option>
            </select>
          </div>

          {/* Max Votes Per Voter */}
          <div className="space-y-1">
            <label className="block font-bold text-black uppercase">Max Allowed Votes Per Voter</label>
            <input
              type="number"
              min={1}
              max={50}
              value={maxVotes}
              onChange={(e) => setMaxVotes(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-2 border-2 border-black bg-white font-bold focus:outline-hidden"
            />
            <p className="text-[10px] text-slate-500">Total votes a single authenticated user / fingerprint can cast in this arena.</p>
          </div>

          {/* Toggle: Once per participant */}
          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={allowOncePerParticipant}
              onChange={(e) => setAllowOncePerParticipant(e.target.checked)}
              className="w-4 h-4 accent-[#e8622c]"
            />
            <span className="font-bold text-slate-800">Allow only 1 vote per participant (Prevents spamming single entry)</span>
          </label>

          {/* Toggle: Require Auth */}
          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={requireAuth}
              onChange={(e) => setRequireAuth(e.target.checked)}
              className="w-4 h-4 accent-[#e8622c]"
            />
            <span className="font-bold text-slate-800">Require platform sign-in to vote (Strict verified votes)</span>
          </label>

          {/* Toggle: Public Voting */}
          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 accent-[#e8622c]"
            />
            <span className="font-bold text-slate-800">Public leaderboard visibility (Show live scores to all visitors)</span>
          </label>

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="block font-bold text-black uppercase text-[10px]">Voting Start Date</label>
              <input
                type="datetime-local"
                value={votingStartAt}
                onChange={(e) => setVotingStartAt(e.target.value)}
                className="w-full px-2.5 py-1.5 border-2 border-black bg-white font-mono text-[11px] focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-black uppercase text-[10px]">Voting End Date</label>
              <input
                type="datetime-local"
                value={votingEndAt}
                onChange={(e) => setVotingEndAt(e.target.value)}
                className="w-full px-2.5 py-1.5 border-2 border-black bg-white font-mono text-[11px] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-black font-bold uppercase transition border border-black cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#e8622c] hover:bg-black text-white font-bold uppercase transition border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save & Enforce'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
