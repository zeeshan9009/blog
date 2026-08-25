import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Link, Video, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTalent } from '../../context/TalentContext';
import type { Challenge } from '../../types/challenge';
import toast from 'react-hot-toast';

interface ChallengeSubmitModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const ChallengeSubmitModal: React.FC<ChallengeSubmitModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onSubmitted
}) => {
  const { user } = useAuth();
  const { professionals } = useTalent();

  const [title, setTitle] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !challenge) return null;

  // Find user's profile
  const userProfile = professionals.find(p => p.userId === user?.id) || professionals[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!submissionUrl.trim()) {
      setErrorMsg('Please provide a valid GitHub, Figma, or live preview URL.');
      return;
    }

    if (!userProfile) {
      setErrorMsg('Please create or connect a developer profile to enter the Challenge Arena.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/challenges?route=submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          profileId: userProfile.id,
          title: title.trim() || 'Challenge Submission',
          submissionUrl: submissionUrl.trim(),
          submissionText: submissionText.trim(),
          demoVideoUrl: demoVideoUrl.trim() || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit entry.');
      }

      setSuccess(true);
      toast.success('Your entry was submitted to the Challenge Arena!');
      onSubmitted?.();
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setTitle('');
    setSubmissionUrl('');
    setSubmissionText('');
    setDemoVideoUrl('');
    setErrorMsg(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn rounded-none">
        
        {/* Header */}
        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-orange-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e8622c]" />
            <h2 className="font-mono font-black text-sm uppercase tracking-wider text-black">
              SUBMIT CHALLENGE ENTRY // ARENA
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 hover:bg-black hover:text-white transition border border-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {success ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 border-2 border-black rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-black">SUBMISSION RECEIVED!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your entry for <strong>"{challenge.title}"</strong> is now live in the Challenge Arena. The community and client judges can now review and vote on your work.
              </p>
              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                [ RETURN TO ARENA ]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Challenge Banner Brief */}
              <div className="p-3.5 bg-slate-50 border border-slate-300 space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#e8622c] uppercase tracking-wider">
                  CURRENT CHALLENGE
                </span>
                <h4 className="text-sm font-black text-black">{challenge.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{challenge.prompt}</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-black uppercase">
                  Project / Submission Title <span className="text-[#e8622c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 15 Streaming AI Agent UI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border-2 border-black focus:outline-hidden focus:bg-orange-50 font-medium"
                />
              </div>

              {/* URL */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-black uppercase flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-slate-500" />
                  <span>Work Link (GitHub / Figma / Live URL) <span className="text-[#e8622c]">*</span></span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/project or https://project.vercel.app"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border-2 border-black focus:outline-hidden focus:bg-orange-50 font-mono"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-black uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Technical Overview & Architecture</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe your solution, architecture choices, performance benchmarks, or design principles..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border-2 border-black focus:outline-hidden focus:bg-orange-50 font-sans resize-none"
                />
              </div>

              {/* Demo Video URL (Optional) */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-black uppercase flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-slate-500" />
                  <span>Demo Video (Loom / YouTube / MP4 - Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://www.loom.com/share/..."
                  value={demoVideoUrl}
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border-2 border-black focus:outline-hidden focus:bg-orange-50 font-mono"
                />
              </div>

              {/* Quality & Anti-Abuse Notice */}
              <div className="p-3 bg-orange-50/70 border border-orange-200 text-[11px] text-slate-700 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All submissions are automatically screened by <strong>ProRank Quality Gate</strong>. Only 1 entry is permitted per verified profile.
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>[ PROCESSING SUBMISSION... ]</span>
                  ) : (
                    <>
                      <span>[ CONFIRM & SUBMIT TO ARENA ]</span>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
