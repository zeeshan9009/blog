import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  User,
  Vote,
  Clock,
  Trash2,
  MessageSquare
} from 'lucide-react';
import type { ChallengeSubmission } from '../../types/challenge';
import toast from 'react-hot-toast';

interface AdminSubmissionPreviewModalProps {
  submission: ChallengeSubmission | null;
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
  onUpdated: () => void;
}

export const AdminSubmissionPreviewModal: React.FC<AdminSubmissionPreviewModalProps> = ({
  submission,
  isOpen,
  onClose,
  adminToken,
  onUpdated
}) => {
  if (!isOpen || !submission) return null;

  const [feedback, setFeedback] = useState(submission.reviewFeedback || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin?action=approve-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ submissionId: submission.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Submission Approved! It is now eligible for public voting.');
        onUpdated();
        onClose();
      } else {
        toast.error(data.error || 'Failed to approve submission');
      }
    } catch {
      toast.error('Network error approving submission');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter a rejection reason / feedback for the participant');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin?action=reject-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          submissionId: submission.id,
          reason: feedback.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Submission marked as Rejected');
        onUpdated();
        onClose();
      } else {
        toast.error(data.error || 'Failed to reject submission');
      }
    } catch {
      toast.error('Network error rejecting submission');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      toast.error('Please specify what changes are required from the participant');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin?action=request-changes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          submissionId: submission.id,
          feedback: feedback.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Changes requested from participant');
        onUpdated();
        onClose();
      } else {
        toast.error(data.error || 'Failed to update submission');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete/archive this submission and all associated votes?')) {
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin?action=delete-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ submissionId: submission.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Submission archived & removed');
        onUpdated();
        onClose();
      } else {
        toast.error(data.error || 'Failed to delete submission');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white border-2 border-black w-full max-w-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between border-b-2 border-black shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#e8622c]" />
            <h3 className="font-mono font-black text-sm uppercase tracking-wide">
              Submission Details & Moderation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          
          {/* Top Overview Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Submission Status</span>
              <span className={`px-2 py-0.5 font-bold uppercase text-xs inline-block border ${
                submission.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : submission.status === 'rejected'
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {submission.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Payment Status</span>
              <span className={`px-2 py-0.5 font-bold uppercase text-xs inline-block border ${
                submission.paymentStatus === 'paid'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {submission.paymentStatus.toUpperCase()} ($5.00)
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Public Votes</span>
              <span className="text-sm font-black text-[#e8622c]">{submission.voteCount} Votes</span>
            </div>
          </div>

          {/* Participant & Challenge info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#fafafa] border border-slate-200 p-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Participant</span>
              <div className="flex items-center gap-2">
                <img
                  src={submission.authorAvatar}
                  alt={submission.authorName}
                  className="w-8 h-8 rounded-full border border-black"
                />
                <div>
                  <div className="font-bold text-black text-sm">{submission.authorName}</div>
                  <div className="text-[10px] text-slate-500">{submission.authorEmail || 'No email attached'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Challenge Arena</span>
              <div className="font-bold text-black text-sm">{submission.challengeTitle || submission.challengeId}</div>
              <div className="text-[10px] text-slate-500">ID: {submission.challengeId}</div>
            </div>
          </div>

          {/* Submitted Work */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Project Title & Description</span>
            <div className="p-4 bg-white border-2 border-black space-y-2">
              <h4 className="font-black text-base text-black">{submission.title || 'Untitled Project'}</h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {submission.submissionText || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Link & Preview */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Repository / Live Demo Link</span>
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-300">
              <span className="truncate text-xs font-bold text-blue-600 max-w-md">{submission.submissionUrl}</span>
              <a
                href={submission.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-black hover:bg-[#e8622c] text-white text-xs font-bold uppercase transition flex items-center gap-1 shrink-0"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Payment & Audit Info */}
          <div className="p-3 bg-slate-50 border border-slate-200 space-y-1 text-[11px] text-slate-600">
            <div><strong>Submission ID:</strong> {submission.id}</div>
            <div><strong>Payment Transaction ID:</strong> {submission.paymentTransactionId || 'Manual / Pre-entry pass'}</div>
            <div><strong>Created Date:</strong> {new Date(submission.createdAt).toLocaleString()}</div>
            <div><strong>Last Updated:</strong> {new Date(submission.updatedAt || submission.createdAt).toLocaleString()}</div>
          </div>

          {/* Admin Review Feedback Box */}
          <div className="space-y-1.5 pt-2">
            <label className="block font-bold text-black uppercase text-xs flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#e8622c]" />
              <span>Review Feedback / Rejection Reason (Sent to Participant)</span>
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Please update repository with clear README and live demo link..."
              className="w-full p-3 bg-white border-2 border-black text-xs font-mono focus:outline-hidden"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isProcessing}
            className="px-3 py-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-mono text-xs font-bold uppercase transition border border-red-300 cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRequestChanges}
              disabled={isProcessing}
              className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono text-xs font-bold uppercase transition border border-amber-300 cursor-pointer"
            >
              Request Changes
            </button>

            <button
              type="button"
              onClick={handleReject}
              disabled={isProcessing}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase transition border border-black cursor-pointer flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={isProcessing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase transition border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Submission</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
