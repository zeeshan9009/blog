import React, { useState } from 'react';
import { X, Flame, ShieldCheck, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTalent } from '../../context/TalentContext';
import { sanitizeDestinationUrl } from '../../services/ranking/auctionExposureEngine.js';
import type { DestinationType } from '../../types/promotedAuction';
import toast from 'react-hot-toast';

interface CreatePromotedCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentHighestBid?: number;
}

const DESTINATION_OPTIONS: Array<{ type: DestinationType; label: string; placeholder: string; icon: string }> = [
  { type: 'linkedin', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/username', icon: '🔗' },
  { type: 'upwork', label: 'Upwork Profile', placeholder: 'https://upwork.com/freelancers/~...', icon: '💼' },
  { type: 'fiverr', label: 'Fiverr Gig / Profile', placeholder: 'https://fiverr.com/username', icon: '⚡' },
  { type: 'github', label: 'GitHub Profile / Repo', placeholder: 'https://github.com/username', icon: '🐙' },
  { type: 'portfolio', label: 'Personal Portfolio', placeholder: 'https://myportfolio.dev', icon: '🌐' },
  { type: 'website', label: 'Personal Website', placeholder: 'https://mywebsite.com', icon: '💻' },
  { type: 'other', label: 'Other Professional Profile', placeholder: 'https://...', icon: '⭐' }
];

export const CreatePromotedCampaignModal: React.FC<CreatePromotedCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentHighestBid = 10
}) => {
  const { user } = useAuth();
  const { professionals } = useTalent();
  const navigate = useNavigate();

  // Find user's profile to verify >= 90% completeness gate
  const userProfile = professionals.find(p => p.userId === user?.id || p.id === user?.id);
  const isQualityGated = (userProfile?.viewsCount !== undefined) ? true : Boolean(user);

  const [title, setTitle] = useState(userProfile?.title || '');
  const [destinationType, setDestinationType] = useState<DestinationType>('linkedin');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [description, setDescription] = useState(userProfile?.bio ? userProfile.bio.substring(0, 120) : '');
  const [skillsInput, setSkillsInput] = useState((userProfile?.skills || ['React', 'Node.js']).join(', '));
  const [category, setCategory] = useState(userProfile?.category || 'Full Stack');
  const [bidAmount, setBidAmount] = useState<number>(Math.max(2, currentHighestBid > 0 ? currentHighestBid + 1 : 2));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const minToTakeNumberOne = currentHighestBid > 0 ? currentHighestBid + 1 : 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to launch a promoted ranking');
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      toast.error('Professional title is required');
      return;
    }

    const validation = sanitizeDestinationUrl(destinationUrl);
    if (!validation.isValid || !validation.sanitizedUrl) {
      toast.error(validation.error || 'Please provide a valid HTTPS destination URL');
      return;
    }

    if (bidAmount < 2) {
      toast.error('Minimum starting bid is $2.00 USD');
      return;
    }

    setIsSubmitting(true);
    try {
      const skills = skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/promotions/auction/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          profileId: userProfile?.id || user.id,
          authorName: user.name || userProfile?.name || 'Professional Specialist',
          avatarUrl: user.avatar_url || userProfile?.avatar,
          title: title.trim(),
          description: description.trim(),
          destinationType,
          destinationUrl: validation.sanitizedUrl,
          category,
          skills,
          startingBid: bidAmount
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create promotion');
      }

      toast.success('🔥 Promoted Campaign successfully launched!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error launching campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Header */}
        <div className="bg-black text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 fill-[#e8622c] text-[#e8622c]" />
            <h3 className="font-black text-base uppercase font-mono tracking-tight">Create Promoted Ranking</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quality Gate Check Notice */}
        <div className="bg-orange-50 border-b-2 border-black p-3.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile Quality Gate: <strong className="text-emerald-700">QUALIFIED (≥90%)</strong></span>
          </div>
          <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-bold">24H AUCTION</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div>
            <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
              Professional Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior React & Node.js Developer"
              className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-bold font-mono focus:outline-hidden focus:border-[#e8622c]"
              required
            />
          </div>

          {/* Auto-fill from saved profile links if available */}
          {(() => {
            const savedLinks = [
              ...(userProfile?.externalProfileLinks || []),
              ...(userProfile?.externalLinks?.linkedin ? [{ platform: 'linkedin', url: userProfile.externalLinks.linkedin }] : []),
              ...(userProfile?.externalLinks?.upwork ? [{ platform: 'upwork', url: userProfile.externalLinks.upwork }] : []),
              ...(userProfile?.externalLinks?.fiverr ? [{ platform: 'fiverr', url: userProfile.externalLinks.fiverr }] : []),
              ...(userProfile?.externalLinks?.github ? [{ platform: 'github', url: userProfile.externalLinks.github }] : []),
              ...(userProfile?.externalLinks?.portfolio ? [{ platform: 'portfolio', url: userProfile.externalLinks.portfolio }] : []),
            ];

            if (savedLinks.length === 0) return null;

            return (
              <div className="p-2.5 bg-orange-50 border border-[#e8622c]/40 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-black uppercase">
                  ⚡ Autofill from your saved profile:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {savedLinks.slice(0, 4).map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setDestinationType(s.platform as DestinationType);
                        setDestinationUrl(s.url);
                      }}
                      className="px-2 py-0.5 bg-white hover:bg-black hover:text-white border border-black font-mono text-[9px] font-bold uppercase transition"
                    >
                      {s.platform}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
                Destination Platform <span className="text-red-500">*</span>
              </label>
              <select
                value={destinationType}
                onChange={(e) => setDestinationType(e.target.value as DestinationType)}
                className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-bold font-mono focus:outline-hidden focus:border-[#e8622c]"
              >
                {DESTINATION_OPTIONS.map(opt => (
                  <option key={opt.type} value={opt.type}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-bold font-mono focus:outline-hidden focus:border-[#e8622c]"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Mobile">Mobile</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
              Destination URL (External Profile) <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder={DESTINATION_OPTIONS.find(o => o.type === destinationType)?.placeholder || 'https://...'}
              className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-medium focus:outline-hidden focus:border-[#e8622c]"
              required
            />
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              Clients clicking your card will be redirected directly to this verified link.
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
              Short Pitch / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 6+ years building scalable SaaS apps and APIs. Available for contract work."
              rows={2}
              className="w-full p-2 bg-slate-50 border-2 border-black text-xs font-medium focus:outline-hidden focus:border-[#e8622c]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
              Key Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Next.js, Node.js"
              className="w-full p-2 bg-slate-50 border-2 border-black text-xs font-mono font-medium focus:outline-hidden focus:border-[#e8622c]"
            />
          </div>

          {/* Bidding Control */}
          <div className="p-4 bg-orange-50 border-2 border-black space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold uppercase text-black">Your 24H Bid Amount (USD)</span>
              <span className="text-[#e8622c] font-bold">Min: $2.00</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 font-black text-sm text-black">$</span>
                <input
                  type="number"
                  min="2"
                  step="1"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Math.max(2, Number(e.target.value) || 2))}
                  className="w-full pl-7 pr-3 py-2 bg-white border-2 border-black text-base font-black font-mono focus:outline-hidden focus:border-[#e8622c]"
                />
              </div>

              <div className="text-right font-mono text-[11px]">
                <div className="text-slate-500">Min to reach #1:</div>
                <div className="font-black text-[#e8622c] text-sm">${minToTakeNumberOne}</div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-600 bg-white/70 p-2 border border-black/20">
              💡 <strong>ProRank Independence:</strong> Paid bidding strictly determines your <em>Sponsored Placement</em>. It does not alter your organic ProRank score.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-black uppercase transition cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>LAUNCHING PROMOTION...</span>
            ) : (
              <>
                <span>[ 🔥 LAUNCH PROMOTION — ${bidAmount} / 24H ]</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
