import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Lock,
  DollarSign,
  Trophy,
  Users,
  Vote,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Eye,
  Check,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Link2,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
import { AdminChallengeLinksTab } from '../components/admin/AdminChallengeLinksTab';
import { AdminSubmissionsTab } from '../components/admin/AdminSubmissionsTab';
import { AdminVotingRulesModal } from '../components/admin/AdminVotingRulesModal';
import toast from 'react-hot-toast';

interface AdminStats {
  financials: {
    totalRevenueDollars: number;
    entryRevenueDollars: number;
    sponsorshipRevenueDollars: number;
    spotlightRevenueDollars: number;
  };
  metrics: {
    totalChallenges: number;
    activeChallenges: number;
    totalEntries: number;
    totalSubmissions: number;
    totalVotes: number;
    totalProfiles: number;
  };
  challenges: any[];
  submissions: any[];
  sponsorships: any[];
  auctionSlots: any[];
  spotlightSlots: any[];
  profiles: any[];
}

export const AdminPage: React.FC = () => {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'submissions' | 'sponsorships' | 'users' | 'links'>('overview');

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Create Challenge Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [votingRulesChallenge, setVotingRulesChallenge] = useState<any | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newCategory, setNewCategory] = useState('Development');
  const [newBanner, setNewBanner] = useState('');
  const [newFeeDollars, setNewFeeDollars] = useState(5);

  // User search query
  const [userQuery, setUserQuery] = useState('');

  // Check saved passkey on mount
  useEffect(() => {
    const saved = localStorage.getItem('ranklancr_admin_token');
    if (saved) {
      setAdminToken(saved);
      setIsAuthenticated(true);
      fetchAdminData(saved);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin?action=auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('ranklancr_admin_token', data.token);
        setAdminToken(data.token);
        setIsAuthenticated(true);
        toast.success('Admin Console Unlocked');
        fetchAdminData(data.token);
      } else {
        toast.error(data.error || 'Invalid passkey');
      }
    } catch {
      toast.error('Authentication request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ranklancr_admin_token');
    setAdminToken('');
    setIsAuthenticated(false);
    setStats(null);
    toast.success('Admin Console Locked');
  };

  const fetchAdminData = async (token = adminToken) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin?action=stats', {
        headers: { 'x-admin-key': token }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data);
      } else {
        toast.error(data.error || 'Failed to fetch telemetry');
      }
    } catch {
      toast.error('Network error loading admin stats');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) {
      toast.error('Please enter title and prompt');
      return;
    }

    try {
      const res = await fetch('/api/admin?action=create-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          prompt: newPrompt.trim(),
          category: newCategory,
          bannerImage: newBanner.trim() || undefined,
          entryFeeDollars: newFeeDollars
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Challenge created successfully!');
        setIsCreateModalOpen(false);
        setNewTitle('');
        setNewPrompt('');
        fetchAdminData();
      } else {
        toast.error(data.error || 'Failed to create challenge');
      }
    } catch {
      toast.error('Network error creating challenge');
    }
  };

  const handleUpdatePhase = async (challengeId: string, status: string) => {
    try {
      const res = await fetch('/api/admin?action=update-phase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ challengeId, status })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Phase updated to: ${status}`);
        fetchAdminData();
      } else {
        toast.error(data.error || 'Failed to update phase');
      }
    } catch {
      toast.error('Network error updating phase');
    }
  };

  const handleResolveWinners = async (challengeId: string) => {
    if (!confirm('Resolve winners and distribute 72h Top Developer rewards now?')) return;
    try {
      const res = await fetch('/api/admin?action=resolve-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ challengeId })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Winners declared & 72h visibility rewards distributed!');
        fetchAdminData();
      } else {
        toast.error(data.error || 'Failed to resolve winners');
      }
    } catch {
      toast.error('Network error resolving challenge');
    }
  };

  const handleDisqualifySubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to remove and disqualify this submission?')) return;
    try {
      const res = await fetch('/api/admin?action=disqualify-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ submissionId })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Submission disqualified & removed');
        fetchAdminData();
      } else {
        toast.error(data.error || 'Failed to remove submission');
      }
    } catch {
      toast.error('Network error removing submission');
    }
  };

  const handleToggleVerified = async (profileId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin?action=toggle-verified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminToken
        },
        body: JSON.stringify({ profileId, isVerified: !currentStatus })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Verification toggled to: ${!currentStatus}`);
        fetchAdminData();
      } else {
        toast.error(data.error || 'Failed to toggle verification');
      }
    } catch {
      toast.error('Network error');
    }
  };

  // =========================================================================
  // PASSKEY LOGIN GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 font-sans selection:bg-[#e8622c] selection:text-white">
        <div className="w-full max-w-md bg-slate-900 border-2 border-[#e8622c] p-8 shadow-[8px_8px_0px_0px_#e8622c] relative">
          <div className="mb-6 space-y-2 text-center">
            <div className="inline-flex p-3 bg-black border border-[#e8622c] mb-2">
              <ShieldAlert className="w-8 h-8 text-[#e8622c]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase font-mono">
              Admin Command Console
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Restricted Area • Master Passkey Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-mono">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Enter Master Passkey
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-black border-2 border-slate-700 text-white text-sm focus:border-[#e8622c] focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#e8622c] hover:bg-white hover:text-black text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : '[ UNLOCK COMMAND CENTER ]'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setPasskey('ranklancr_admin_2026')}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Use default passkey (Quick Access)
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link to="/" className="text-xs font-mono text-slate-500 hover:text-white transition">
              ← Return to RankLancr.lol
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  const filteredProfiles = (stats?.profiles || []).filter(p =>
    (p.name || '').toLowerCase().includes(userQuery.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(userQuery.toLowerCase()) ||
    (p.headline || '').toLowerCase().includes(userQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white">
      
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-40 bg-black border-b-2 border-black text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-block">
            <span className="font-black text-xl tracking-tight text-white flex items-center gap-2">
              <div className="w-7 h-7 bg-[#e8622c] flex items-center justify-center text-white text-xs font-mono font-black border border-black">
                R
              </div>
              <span>Rank<span className="text-[#e8622c]">Lancr.lol</span></span>
              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-mono font-bold uppercase tracking-widest ml-1">
                ADMIN
              </span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-emerald-400 pl-4 border-l border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEM HEALTH: 100% OPERATIONAL</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAdminData()}
            disabled={loading}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            title="Refresh telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">REFRESH</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="py-2 px-3.5 bg-[#e8622c] hover:bg-white hover:text-black text-white border border-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW CHALLENGE</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-mono font-bold cursor-pointer"
            title="Lock Console"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Navigation Tabs */}
      <div className="bg-white border-b-2 border-black px-4 sm:px-8 py-2 overflow-x-auto flex gap-2">
        {[
          { id: 'overview', label: '1. Executive Overview', icon: Layers },
          { id: 'challenges', label: '2. Challenge Manager', icon: Trophy },
          { id: 'links', label: '3. Submission Links', icon: Link2 },
          { id: 'submissions', label: '4. Submissions & Anti-Abuse', icon: ShieldAlert },
          { id: 'sponsorships', label: '5. Sponsorships & Spotlight', icon: Flame },
          { id: 'users', label: '6. Talent & Badges', icon: Users }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-2 px-4 font-mono text-xs font-bold uppercase transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === t.id
                  ? 'bg-black text-white border-2 border-black shadow-[3px_3px_0px_0px_#e8622c]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Workspace Content */}
      <main className="max-w-[1440px] mx-auto p-4 sm:p-8 space-y-8">
        
        {/* =================================================================== */}
        {/* TAB 1: OVERVIEW & FINANCIALS */}
        {/* =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Revenue Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-black text-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_#e8622c]">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center justify-between">
                  <span>TOTAL PLATFORM REVENUE</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 my-2">
                  ${(stats?.financials.totalRevenueDollars || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  100% Platform Retained (No Cash Out)
                </div>
              </div>

              <div className="bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider flex items-center justify-between">
                  <span>CHALLENGE ENTRY REVENUE</span>
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-black my-2">
                  ${(stats?.financials.entryRevenueDollars || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] font-mono text-slate-600">
                  {stats?.metrics.totalEntries || 0} Paid Entries @ $5.00
                </div>
              </div>

              <div className="bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider flex items-center justify-between">
                  <span>BRAND SPONSORSHIPS</span>
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-black my-2">
                  ${(stats?.financials.sponsorshipRevenueDollars || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] font-mono text-slate-600">
                  Bronze, Silver & Gold Outbid Auctions
                </div>
              </div>

              <div className="bg-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider flex items-center justify-between">
                  <span>OUTBID SPOTLIGHT (72H)</span>
                  <Flame className="w-4 h-4 text-[#e8622c]" />
                </div>
                <div className="text-3xl font-black text-black my-2">
                  ${(stats?.financials.spotlightRevenueDollars || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] font-mono text-slate-600">
                  Active 3-Slot Ascending Auctions
                </div>
              </div>

            </div>

            {/* Platform Activity Stats */}
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black text-black uppercase font-mono mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#e8622c]" />
                <span>Live Community Telemetry</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-center">
                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">TOTAL CHALLENGES</span>
                  <span className="text-2xl font-black text-black">{stats?.metrics.totalChallenges || 0}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">ACTIVE ARENAS</span>
                  <span className="text-2xl font-black text-[#e8622c]">{stats?.metrics.activeChallenges || 0}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">PAID ENTRIES ($5)</span>
                  <span className="text-2xl font-black text-emerald-600">{stats?.metrics.totalEntries || 0}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">SUBMISSIONS</span>
                  <span className="text-2xl font-black text-black">{stats?.metrics.totalSubmissions || 0}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">TOTAL VOTES CAST</span>
                  <span className="text-2xl font-black text-blue-600">{stats?.metrics.totalVotes || 0}</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">TALENT PROFILES</span>
                  <span className="text-2xl font-black text-black">{stats?.metrics.totalProfiles || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setIsCreateModalOpen(true)}
                className="p-5 bg-white border-2 border-black hover:border-[#e8622c] transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer group"
              >
                <div className="text-xs font-mono font-bold text-[#e8622c] flex items-center justify-between">
                  <span>ACTION 01</span>
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                </div>
                <h4 className="text-base font-black text-black my-1">Create New Challenge Arena</h4>
                <p className="text-xs text-slate-600">Launch a weekly skill challenge prompt with $5 entry fee.</p>
              </div>

              <div
                onClick={() => setActiveTab('challenges')}
                className="p-5 bg-white border-2 border-black hover:border-black transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer group"
              >
                <div className="text-xs font-mono font-bold text-blue-600 flex items-center justify-between">
                  <span>ACTION 02</span>
                  <Trophy className="w-4 h-4" />
                </div>
                <h4 className="text-base font-black text-black my-1">Manage Phases & Winners</h4>
                <p className="text-xs text-slate-600">Advance submission windows and trigger algorithmic rewards.</p>
              </div>

              <div
                onClick={() => setActiveTab('submissions')}
                className="p-5 bg-white border-2 border-black hover:border-black transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer group"
              >
                <div className="text-xs font-mono font-bold text-red-600 flex items-center justify-between">
                  <span>ACTION 03</span>
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h4 className="text-base font-black text-black my-1">Moderate Submissions</h4>
                <p className="text-xs text-slate-600">Review live projects and disqualify malicious links.</p>
              </div>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: CHALLENGE MANAGER */}
        {/* =================================================================== */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-black font-mono">CHALLENGE LIFECYCLE CONTROLS</h3>
                <p className="text-xs text-slate-600">Switch phases, resolve winners, and monitor active arenas.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="py-2.5 px-4 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold flex items-center gap-2 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>CREATE CHALLENGE</span>
              </button>
            </div>

            <div className="space-y-4">
              {(stats?.challenges || []).map((ch: any) => (
                <div key={ch.id} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                          ch.status === 'closed'
                            ? 'bg-slate-800 text-white'
                            : ch.status === 'voting_window'
                            ? 'bg-blue-600 text-white'
                            : ch.status === 'submission_window'
                            ? 'bg-amber-500 text-black'
                            : 'bg-emerald-600 text-white'
                        }`}>
                          PHASE: {ch.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                          {ch.category}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-black">{ch.title}</h4>
                      <p className="text-xs text-slate-600 max-w-3xl line-clamp-2">{ch.prompt}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Phase Dropdown */}
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-slate-500 font-bold">Change Phase:</span>
                        <select
                          value={ch.status}
                          onChange={(e) => handleUpdatePhase(ch.id, e.target.value)}
                          className="px-2.5 py-1.5 border-2 border-black bg-white text-xs font-bold font-mono focus:outline-hidden cursor-pointer"
                        >
                          <option value="open_entry">open_entry</option>
                          <option value="submission_window">submission_window</option>
                          <option value="voting_window">voting_window</option>
                          <option value="closed">closed</option>
                        </select>
                      </div>

                      {/* Configure Voting Rules */}
                      <button
                        onClick={() => setVotingRulesChallenge(ch)}
                        className="py-1.5 px-3 bg-slate-900 hover:bg-[#e8622c] text-white font-mono text-xs font-bold border border-black cursor-pointer transition flex items-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[#e8622c]" />
                        <span>VOTING RULES</span>
                      </button>

                      {/* Force Winner Calculation */}
                      <button
                        onClick={() => handleResolveWinners(ch.id)}
                        className="py-1.5 px-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold border border-black cursor-pointer transition flex items-center gap-1.5"
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>RESOLVE WINNERS</span>
                      </button>

                      <Link
                        to={`/arena?id=${ch.id}`}
                        target="_blank"
                        className="py-1.5 px-3 bg-white hover:bg-slate-100 text-black font-mono text-xs font-bold border border-black cursor-pointer flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>VIEW ARENA</span>
                      </Link>

                      <Link
                        to={`/challenges/${ch.slug || ch.id}/vote`}
                        target="_blank"
                        className="py-1.5 px-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold border border-black cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <Vote className="w-3.5 h-3.5" />
                        <span>PUBLIC VOTING ↗</span>
                      </Link>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-600 bg-slate-50 p-2.5">
                    <div><strong>Entry Fee:</strong> ${(ch.entry_fee_cents || 500) / 100}</div>
                    <div><strong>Entry Ends:</strong> {new Date(ch.entry_deadline).toLocaleDateString()}</div>
                    <div><strong>Submissions End:</strong> {new Date(ch.submission_deadline).toLocaleDateString()}</div>
                    <div><strong>Voting Ends:</strong> {new Date(ch.voting_deadline).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SUBMISSIONS & MODERATION */}
        {/* =================================================================== */}
        {activeTab === 'submissions' && (
          <AdminSubmissionsTab
            submissions={stats?.submissions || []}
            challenges={stats?.challenges || []}
            adminToken={adminToken}
            onRefresh={() => fetchAdminData()}
            onOpenVotingRules={(ch) => setVotingRulesChallenge(ch)}
          />
        )}

        {/* =================================================================== */}
        {/* TAB 4: SPONSORSHIPS & SPOTLIGHT */}
        {/* =================================================================== */}
        {activeTab === 'sponsorships' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-black text-black font-mono">SPONSORSHIPS & OUTBID SPOTLIGHT</h3>
              <p className="text-xs text-slate-600">Audit active Gold Ascending Auctions, Fixed Tiers, and Homepage Spotlight slots.</p>
            </div>

            {/* Live Gold Sponsorship Auctions */}
            <div className="space-y-3">
              <h4 className="text-sm font-mono font-bold uppercase text-black flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#e8622c] fill-[#e8622c]" />
                <span>Live Gold Sponsorship Outbid Auctions</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(stats?.auctionSlots || []).map((slot: any) => (
                  <div key={slot.id} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_#e8622c] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 bg-[#e8622c] text-white font-bold uppercase">GOLD TIER</span>
                      <span className="text-slate-500 font-bold">{slot.total_bids_count || 0} Bids Placed</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">CURRENT HIGH BID</span>
                      <div className="text-2xl font-black text-black">${(slot.current_bid_cents || 10000) / 100}.00 USD</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">LEADING BRAND HOLDER</span>
                      <div className="font-bold text-sm text-black flex items-center gap-2 mt-1">
                        {slot.current_sponsor_name || 'No Sponsor Yet'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbid Spotlight 3 Slots */}
            <div className="space-y-3">
              <h4 className="text-sm font-mono font-bold uppercase text-black flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Outbid Spotlight 72h Homepage Slots</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(stats?.spotlightSlots || []).map((slot: any) => (
                  <div key={slot.id} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                    <div className="text-xs font-mono font-bold uppercase text-slate-500 flex justify-between">
                      <span>SLOT #{slot.slot_index}</span>
                      <span className="text-emerald-600">${(slot.current_price_cents || 0) / 100}</span>
                    </div>
                    <div className="font-black text-base text-black">
                      {slot.sponsor_name || slot.profile_id || 'Available Slot'}
                    </div>
                    <div className="text-[11px] font-mono text-slate-600">
                      Minimum Increment: +${(slot.min_increment_cents || 500) / 100}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: TALENT & BADGES */}
        {/* =================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-black font-mono">TALENT DIRECTORY & BADGES</h3>
                <p className="text-xs text-slate-600">Grant verification checkmarks and inspect user scores.</p>
              </div>

              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Search talent by name or email..."
                className="px-4 py-2 border-2 border-black bg-white text-xs font-mono w-full sm:w-72 focus:outline-hidden"
              />
            </div>

            <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-black text-white font-mono uppercase text-[11px] border-b-2 border-black">
                  <tr>
                    <th className="p-3">User Profile</th>
                    <th className="p-3">Headline / Title</th>
                    <th className="p-3 text-center">Score</th>
                    <th className="p-3 text-center">Verified Checkmark</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs">
                        No profiles matched your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredProfiles.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-black flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.is_verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">{p.email || p.id}</div>
                        </td>
                        <td className="p-3 text-slate-700 font-medium max-w-xs truncate">
                          {p.headline || 'Developer / Creator'}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-600">
                          {p.professional_score || 80}
                        </td>
                        <td className="p-3 text-center font-mono">
                          {p.is_verified ? (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px]">
                              VERIFIED
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">UNVERIFIED</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleVerified(p.id, Boolean(p.is_verified))}
                            className={`py-1 px-2.5 font-mono text-[10px] font-bold uppercase transition border cursor-pointer ${
                              p.is_verified
                                ? 'bg-red-50 text-red-700 border-red-300 hover:bg-red-600 hover:text-white'
                                : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            {p.is_verified ? '[ REVOKE VERIFIED ]' : '[ GRANT VERIFIED ]'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: AUTO-GENERATED SUBMISSION LINKS */}
        {/* =================================================================== */}
        {activeTab === 'links' && (
          <AdminChallengeLinksTab adminKey={adminToken} />
        )}

      </main>

      {/* =================================================================== */}
      {/* CREATE CHALLENGE MODAL */}
      {/* =================================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="bg-white border-2 border-black w-full max-w-xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative max-h-[90vh] overflow-y-auto">
            
            <div className="mb-6 space-y-1">
              <span className="px-2.5 py-0.5 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase">
                ADMIN ARENA CREATOR
              </span>
              <h2 className="text-2xl font-black text-black">Create New Skill Challenge</h2>
              <p className="text-xs text-slate-600">Launches a competitive arena prompt with $5 entry fee.</p>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 Streaming AI Agent UI Challenge"
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden font-mono"
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design / UI/UX</option>
                  <option value="AI & ML">AI & Machine Learning</option>
                  <option value="Marketing">Marketing / Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Challenge Prompt / Brief *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Detailed requirements, submission criteria, and rules for this challenge..."
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={newBanner}
                  onChange={(e) => setNewBanner(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                  Entry Fee ($ USD)
                </label>
                <input
                  type="number"
                  min={1}
                  value={newFeeDollars}
                  onChange={(e) => setNewFeeDollars(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-mono font-bold focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 bg-white hover:bg-slate-100 text-black font-mono text-xs font-bold border-2 border-black cursor-pointer"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase transition border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  [ LAUNCH CHALLENGE ]
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Admin Voting Rules Modal */}
      {votingRulesChallenge && (
        <AdminVotingRulesModal
          challenge={votingRulesChallenge}
          isOpen={Boolean(votingRulesChallenge)}
          onClose={() => setVotingRulesChallenge(null)}
          adminToken={adminToken}
          onSaved={() => {
            setVotingRulesChallenge(null);
            fetchAdminData();
          }}
        />
      )}

    </div>
  );
};

export default AdminPage;
