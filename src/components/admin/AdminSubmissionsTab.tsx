import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  ExternalLink,
  CreditCard,
  Vote,
  Sliders,
  Sparkles,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import type { ChallengeSubmission } from '../../types/challenge';
import { AdminSubmissionPreviewModal } from './AdminSubmissionPreviewModal';
import toast from 'react-hot-toast';

interface AdminSubmissionsTabProps {
  submissions: ChallengeSubmission[];
  challenges: any[];
  adminToken: string;
  onRefresh: () => void;
  onOpenVotingRules: (challenge: any) => void;
}

export const AdminSubmissionsTab: React.FC<AdminSubmissionsTabProps> = ({
  submissions,
  challenges,
  adminToken,
  onRefresh,
  onOpenVotingRules
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChallengeId, setSelectedChallengeId] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedSubmissionStatus, setSelectedSubmissionStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'votes' | 'title'>('newest');

  const [previewSubmission, setPreviewSubmission] = useState<ChallengeSubmission | null>(null);
  const [isReconciling, setIsReconciling] = useState(false);

  // Quick Approve Action
  const handleQuickApprove = async (subId: string) => {
    try {
      const res = await fetch('/api/admin?action=approve-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ submissionId: subId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Submission Approved!');
        onRefresh();
      } else {
        toast.error(data.error || 'Failed to approve');
      }
    } catch {
      toast.error('Network error');
    }
  };

  // Quick Reject Action
  const handleQuickReject = async (subId: string) => {
    const reason = prompt('Enter rejection reason / feedback for the participant:');
    if (reason === null) return;
    try {
      const res = await fetch('/api/admin?action=reject-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          submissionId: subId,
          reason: reason || 'Does not meet challenge specifications'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Submission marked as Rejected');
        onRefresh();
      } else {
        toast.error(data.error || 'Failed to reject');
      }
    } catch {
      toast.error('Network error');
    }
  };

  // Reconcile Payments Action
  const handleReconcilePayments = async () => {
    setIsReconciling(true);
    try {
      const res = await fetch('/api/admin?action=reconcile-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Payment reconciliation complete!');
        onRefresh();
      } else {
        toast.error(data.error || 'Reconciliation failed');
      }
    } catch {
      toast.error('Network error reconciling payments');
    } finally {
      setIsReconciling(false);
    }
  };

  // Filtered & Sorted Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (sub.title || '').toLowerCase().includes(q) ||
        (sub.authorName || '').toLowerCase().includes(q) ||
        (sub.authorEmail || '').toLowerCase().includes(q) ||
        (sub.challengeTitle || '').toLowerCase().includes(q) ||
        (sub.paymentTransactionId || '').toLowerCase().includes(q) ||
        sub.id.toLowerCase().includes(q);

      // Challenge filter
      const matchesChallenge = selectedChallengeId === 'all' || sub.challengeId === selectedChallengeId;

      // Payment status filter
      const matchesPayment = selectedPaymentStatus === 'all' || sub.paymentStatus === selectedPaymentStatus;

      // Submission status filter
      const matchesStatus = selectedSubmissionStatus === 'all' || sub.status === selectedSubmissionStatus;

      return matchesSearch && matchesChallenge && matchesPayment && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'votes') {
        return (b.voteCount || 0) - (a.voteCount || 0);
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });
  }, [submissions, searchQuery, selectedChallengeId, selectedPaymentStatus, selectedSubmissionStatus, sortBy]);

  // Counts
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'submitted' || s.status === 'submission_pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Reconcile Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-black font-mono flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#e8622c]" />
            <span>CHALLENGE SUBMISSIONS & AUDIT</span>
          </h3>
          <p className="text-xs text-slate-600">
            Audit work, verify payment transactions, moderate participant entries, and configure voting rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReconcilePayments}
            disabled={isReconciling}
            className="py-2 px-3.5 bg-slate-900 hover:bg-black text-white font-mono text-xs font-bold uppercase transition flex items-center gap-1.5 border border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            title="Scan database and auto-link any unlinked transactions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
            <span>{isReconciling ? 'RECONCILING...' : 'RECONCILE PAYMENTS'}</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">TOTAL SUBMISSIONS</span>
          <span className="text-2xl font-black text-black">{totalCount}</span>
        </div>

        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#e8622c]">
          <span className="text-[10px] text-[#e8622c] uppercase font-bold block">PENDING REVIEW</span>
          <span className="text-2xl font-black text-[#e8622c]">{pendingCount}</span>
        </div>

        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(16,185,129,1)]">
          <span className="text-[10px] text-emerald-600 uppercase font-bold block">APPROVED (VOTING READY)</span>
          <span className="text-2xl font-black text-emerald-600">{approvedCount}</span>
        </div>

        <div className="p-3 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(239,68,68,1)]">
          <span className="text-[10px] text-red-600 uppercase font-bold block">REJECTED / ARCHIVED</span>
          <span className="text-2xl font-black text-red-600">{rejectedCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search participant, email, title, txn..."
              className="w-full pl-9 pr-3 py-2 bg-[#fafafa] border-2 border-black font-medium focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Challenge Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedChallengeId}
              onChange={(e) => setSelectedChallengeId(e.target.value)}
              className="w-full px-3 py-2 bg-[#fafafa] border-2 border-black font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Challenges</option>
              {challenges.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Submission Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedSubmissionStatus}
              onChange={(e) => setSelectedSubmissionStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#fafafa] border-2 border-black font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="submission_pending">Changes Requested</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 bg-[#fafafa] border-2 border-black font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid ($5.00)</option>
              <option value="pending">Pending</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2 py-2 bg-[#fafafa] border-2 border-black font-bold focus:outline-hidden cursor-pointer"
              title="Sort By"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="votes">Votes</option>
              <option value="title">Title</option>
            </select>
          </div>

        </div>

        {/* Selected Challenge Action helper */}
        {selectedChallengeId !== 'all' && (
          <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs">
            <span className="text-slate-600 font-bold">
              Filtering by: {challenges.find(c => c.id === selectedChallengeId)?.title}
            </span>
            <button
              onClick={() => {
                const target = challenges.find(c => c.id === selectedChallengeId);
                if (target) onOpenVotingRules(target);
              }}
              className="px-3 py-1 bg-[#e8622c] hover:bg-black text-white font-bold uppercase transition flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Voting Rules for this Arena</span>
            </button>
          </div>
        )}
      </div>

      {/* Submissions Table */}
      <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-black text-white font-mono uppercase text-[11px] border-b-2 border-black">
            <tr>
              <th className="p-3.5">Participant</th>
              <th className="p-3.5">Challenge & Project Title</th>
              <th className="p-3.5">Payment Status & Txn ID</th>
              <th className="p-3.5">Submission Status</th>
              <th className="p-3.5 text-center">Votes</th>
              <th className="p-3.5">Submitted</th>
              <th className="p-3.5 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-slate-500 font-mono text-xs">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  No submissions matched your search or filters.
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((sub) => {
                const isApproved = sub.status === 'approved';
                const isRejected = sub.status === 'rejected';
                const isPaid = sub.paymentStatus === 'paid';

                return (
                  <tr key={sub.id} className="hover:bg-orange-50/40 transition font-mono text-xs">
                    
                    {/* Participant */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={sub.authorAvatar}
                          alt={sub.authorName}
                          className="w-8 h-8 rounded-full border border-black shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-black text-black truncate max-w-[140px]">{sub.authorName}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {sub.authorEmail || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Challenge & Project Title */}
                    <td className="p-3.5 max-w-xs">
                      <div className="text-[10px] font-bold text-[#e8622c] uppercase truncate">
                        {sub.challengeTitle || 'Challenge Arena'}
                      </div>
                      <div className="font-bold text-black text-sm truncate">{sub.title}</div>
                      <a
                        href={sub.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-600 hover:underline font-bold inline-flex items-center gap-1 mt-0.5"
                      >
                        <span>Preview Project Link</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>

                    {/* Payment Status & Txn */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase inline-block border ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          {isPaid ? 'PAID ($5.00)' : 'UNPAID'}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]" title={sub.paymentTransactionId || 'No Txn ID'}>
                          Txn: {sub.paymentTransactionId ? sub.paymentTransactionId.slice(0, 14) + '...' : 'None'}
                        </div>
                      </div>
                    </td>

                    {/* Submission Status */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase inline-block border ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isRejected
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        {sub.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    {/* Votes */}
                    <td className="p-3.5 text-center font-black text-sm text-[#e8622c]">
                      <span className="px-2 py-0.5 bg-orange-100 border border-orange-300">
                        {sub.voteCount || 0}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                      
                      {/* View Details */}
                      <button
                        onClick={() => setPreviewSubmission(sub)}
                        className="py-1 px-2.5 bg-slate-100 hover:bg-black hover:text-white text-black border border-black text-[10px] font-bold uppercase transition cursor-pointer"
                        title="View Full Details"
                      >
                        [ VIEW ]
                      </button>

                      {/* Quick Approve */}
                      {!isApproved && (
                        <button
                          onClick={() => handleQuickApprove(sub.id)}
                          className="py-1 px-2.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-300 text-[10px] font-bold uppercase transition cursor-pointer"
                          title="Quick Approve"
                        >
                          APPROVE
                        </button>
                      )}

                      {/* Quick Reject */}
                      {!isRejected && (
                        <button
                          onClick={() => handleQuickReject(sub.id)}
                          className="py-1 px-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-300 text-[10px] font-bold uppercase transition cursor-pointer"
                          title="Quick Reject"
                        >
                          REJECT
                        </button>
                      )}

                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Submission Preview & Moderation Modal */}
      {previewSubmission && (
        <AdminSubmissionPreviewModal
          submission={previewSubmission}
          isOpen={Boolean(previewSubmission)}
          onClose={() => setPreviewSubmission(null)}
          adminToken={adminToken}
          onUpdated={() => {
            setPreviewSubmission(null);
            onRefresh();
          }}
        />
      )}

    </div>
  );
};
