import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Flame,
  Plus,
  Settings,
  Search,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Cpu,
  BarChart3,
  Layers,
  ShieldCheck,
  Eye,
  Sliders,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTalent } from '../context/TalentContext';
import { calculateProfileQualityScore } from '../services/ranking/profileQualityScore';
import { calculateProfessionalScore } from '../services/ranking/professionalScore';
import { calculateFairnessScore } from '../services/ranking/fairnessScore';
import { calculateFreshnessScore } from '../services/ranking/freshnessScore';
import { calculateRotationFactor } from '../services/ranking/rotation';
import { calculateRelevanceScore } from '../services/ranking/relevanceScore';
import { PromoteModal } from '../components/modals/PromoteModal';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
import { useBoostAnalytics } from '../hooks/useBoostAnalytics.js';
import type { Professional, ServiceRequest } from '../types/talent';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const {
    professionals,
    services,
    serviceRequests,
    savedProfessionals,
    updateServiceRequestStatus
  } = useTalent();

  // Role detection
  const roles = user?.roles || ['buyer', 'provider'];
  const hasBuyer = roles.includes('buyer');
  const hasProvider = roles.includes('provider');
  const hasBoth = hasBuyer && hasProvider;

  // Active sub-tab from path or state
  const isRequestsRoute = location.pathname.includes('/requests');
  const isMyRequestsRoute = location.pathname.includes('/my-requests');
  const isPromoRoute = location.pathname.includes('/promotion');

  const [activeRoleView, setActiveRoleView] = useState<'provider' | 'buyer'>(
    hasProvider ? 'provider' : 'buyer'
  );
  
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'algorithm' | 'requests' | 'my-requests' | 'services' | 'promotion'>(
    isRequestsRoute ? 'requests' : isMyRequestsRoute ? 'my-requests' : isPromoRoute ? 'promotion' : 'overview'
  );

  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'declined'>('all');
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [testQuery, setTestQuery] = useState('Full Stack');
  const [currentMicroRotation, setCurrentMicroRotation] = useState<number>(0);

  // Target provider profile with real metrics (0 if not recorded)
  const myProfile = useMemo<Professional>(() => {
    const found = professionals.find(p => p.userId === user?.id || p.id === user?.id) || (user ? null : professionals[0]);
    if (found) {
      return {
        ...found,
        viewsCount: found.viewsCount || 0,
        clicksCount: found.clicksCount || 0,
        inquiriesCount: found.inquiriesCount || 0
      };
    }
    return {
      id: user?.id || 'guest',
      userId: user?.id || 'guest',
      name: user?.name || 'Professional Specialist',
      title: 'Independent Specialist',
      category: 'Web Development',
      location: 'Global',
      country: 'Global',
      avatar: user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Pro')}`,
      bio: '',
      hourlyRate: 50,
      experienceYears: 0,
      score: 50,
      rating: 5.0,
      reviewCount: 0,
      skills: [],
      experience: [],
      portfolio: [],
      reviews: [],
      externalLinks: {},
      isVerified: false,
      isPromoted: false,
      viewsCount: 0,
      clicksCount: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString()
    };
  }, [professionals, user]);

  // Provider's services
  const myServices = useMemo(() => {
    return services.filter(s => s.providerId === myProfile.id || (user?.id && s.providerId === user.id));
  }, [services, myProfile.id, user?.id]);

  // Incoming requests for provider
  const incomingRequests = useMemo(() => {
    return serviceRequests.filter(r => r.providerId === myProfile.id || (user?.id && r.providerId === user.id));
  }, [serviceRequests, myProfile.id, user?.id]);

  // Filtered requests
  const filteredIncomingRequests = useMemo(() => {
    if (requestFilter === 'all') return incomingRequests;
    return incomingRequests.filter(r => r.status === requestFilter);
  }, [incomingRequests, requestFilter]);

  // Outgoing requests by buyer
  const mySentRequests = useMemo(() => {
    return serviceRequests;
  }, [serviceRequests]);

  // ==========================================
  // LIVE ALGORITHMIC METRICS & TELEMETRY
  // ==========================================
  const { analytics: boostAnalytics, isRealTimeActive } = useBoostAnalytics(myProfile?.id);

  const qualityScoreNorm = useMemo(() => calculateProfileQualityScore(myProfile), [myProfile]);
  const completenessPercent = Math.round(qualityScoreNorm * 100);
  const isProfilePubliclyVisible = completenessPercent >= 90;
  
  const proScoreResult = useMemo(() => calculateProfessionalScore(myProfile), [myProfile]);
  const proScore = proScoreResult.displayScore;

  const fairnessFactor = useMemo(() => {
    return calculateFairnessScore(myProfile, professionals.length || 1, professionals);
  }, [myProfile, professionals]);

  const freshnessFactor = useMemo(() => {
    return calculateFreshnessScore(myProfile.promotionExpiresAt || myProfile.createdAt);
  }, [myProfile.promotionExpiresAt, myProfile.createdAt]);

  useEffect(() => {
    const rot = calculateRotationFactor(myProfile.id);
    setCurrentMicroRotation(rot);
    const interval = setInterval(() => {
      setCurrentMicroRotation(calculateRotationFactor(myProfile.id));
    }, 15000);
    return () => clearInterval(interval);
  }, [myProfile.id]);

  // Test simulation for live algorithm query
  const testRelevance = useMemo(() => {
    return calculateRelevanceScore(myProfile, testQuery);
  }, [myProfile, testQuery]);

  const simulatedOrganicScore = useMemo(() => {
    // 0.50 * R + 0.35 * S_pro + 0.15 * S_quality
    const val = (0.50 * testRelevance.score) + (0.35 * (proScore / 100)) + (0.15 * qualityScoreNorm);
    return Math.round(val * 100);
  }, [testRelevance, proScore, qualityScoreNorm]);

  const simulatedSponsoredScore = useMemo(() => {
    // 0.40 * R + 0.35 * S_pro + 0.15 * F + 0.10 * (rotation / 0.03)
    const rotNorm = currentMicroRotation / 0.03;
    const val = (0.40 * testRelevance.score) + (0.35 * (proScore / 100)) + (0.15 * fairnessFactor) + (0.10 * rotNorm);
    return Math.round(val * 100);
  }, [testRelevance, proScore, fairnessFactor, currentMicroRotation]);

  // Countdown timer for promotion
  const promoTimeRemaining = useMemo(() => {
    if (!myProfile.isPromoted || !myProfile.promotionExpiresAt) return null;
    const diff = new Date(myProfile.promotionExpiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  }, [myProfile]);

  const handleStatusChange = (requestId: string, status: ServiceRequest['status']) => {
    updateServiceRequestStatus(requestId, status);
    toast.success(`Request marked as ${status.toUpperCase()}!`);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white pb-24">
      
      {/* 1. TOP COMMAND HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <RankLancrLogo size="sm" showDomain={true} />
            <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              COMMAND CENTER
            </span>
          </div>

          {/* Quick Dual Role Switcher */}
          {hasBoth && (
            <div className="hidden sm:flex items-center bg-slate-100 p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => { setActiveRoleView('provider'); setActiveSubTab('overview'); }}
                className={`px-3 py-1 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeRoleView === 'provider' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                <Cpu className="w-3 h-3 text-[#e8622c]" />
                <span>PROVIDER (SELLER)</span>
              </button>
              <button
                onClick={() => { setActiveRoleView('buyer'); setActiveSubTab('my-requests'); }}
                className={`px-3 py-1 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeRoleView === 'buyer' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                <Briefcase className="w-3 h-3 text-emerald-400" />
                <span>BUYER (CLIENT)</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/settings')}
              className="p-1.5 bg-white hover:bg-slate-100 border-2 border-black transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none cursor-pointer"
              title="Role Settings"
            >
              <Settings className="w-4 h-4 text-slate-800" />
            </button>

            <Link
              to="/find-services"
              className="px-3.5 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>[ EXPLORE MARKETPLACE ]</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. DASHBOARD HERO BANNER WITH LIVE STATUS */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
        
        <div className="bg-black text-white p-6 sm:p-8 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-start gap-4">
              <img
                src={myProfile.avatar}
                alt={myProfile.name}
                className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-white object-cover bg-orange-100 shrink-0"
              />

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  {isProfilePubliclyVisible ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[9px] font-bold uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>PUBLIC SEARCH VISIBILITY: ACTIVE (≥90%)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-[9px] font-bold uppercase">
                      <AlertCircle className="w-3 h-3" />
                      <span>SEARCH VISIBILITY: DRAFT (NEEDS ≥90% COMPLETENESS)</span>
                    </span>
                  )}

                  {myProfile.isPromoted ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[9px] font-bold uppercase">
                      <Flame className="w-3 h-3 fill-emerald-400" />
                      <span>$2 BOOST ACTIVE</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 text-slate-300 font-mono text-[9px] font-bold uppercase">
                      <span>ORGANIC RANKING</span>
                    </span>
                  )}

                  <span className="px-2 py-0.5 bg-white/10 text-slate-300 font-mono text-[9px] font-bold uppercase">
                    0% PLATFORM FEE
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {myProfile.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal line-clamp-1">
                  {myProfile.title} • {myProfile.category} • ${myProfile.hourlyRate}/hr
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
              {activeRoleView === 'provider' ? (
                <>
                  <button
                    onClick={() => setPromoteModalOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#e8622c] hover:bg-orange-600 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_#ffffff] cursor-pointer"
                  >
                    <Flame className="w-4 h-4 fill-white" />
                    <span>[ 🔥 BOOST RANK ($2) ]</span>
                  </button>

                  <button
                    onClick={() => navigate('/create-profile')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-slate-100 text-black font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_0px_#e8622c]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>[ + ADD SERVICE ]</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/find-services')}
                  className="px-5 py-2.5 bg-[#e8622c] hover:bg-orange-600 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_#ffffff]"
                >
                  <Search className="w-4 h-4" />
                  <span>[ FIND & HIRE TALENT ]</span>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 3. NAVIGATION SUB-TABS (EXPANSIVE & DETAILED) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6">
        <div className="flex flex-wrap items-center gap-2 border-b-2 border-black pb-2 font-mono text-xs font-bold">
          
          {activeRoleView === 'provider' && (
            <>
              <button
                onClick={() => setActiveSubTab('overview')}
                className={`px-3.5 py-2 border-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'overview'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-slate-700 border-black hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>[ 1. LIVE OVERVIEW ]</span>
              </button>

              <button
                onClick={() => setActiveSubTab('algorithm')}
                className={`px-3.5 py-2 border-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'algorithm'
                    ? 'bg-[#e8622c] text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-slate-700 border-black hover:bg-orange-50'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#e8622c] group-hover:text-black" />
                <span>[ 2. ALGORITHM INSPECTOR ({proScore}/100) ]</span>
              </button>

              <button
                onClick={() => setActiveSubTab('requests')}
                className={`px-3.5 py-2 border-2 transition flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'requests'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-slate-700 border-black hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>[ 3. INCOMING REQUESTS ({incomingRequests.length}) ]</span>
                {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#e8622c] animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveSubTab('services')}
                className={`px-3.5 py-2 border-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'services'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-slate-700 border-black hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>[ 4. MY SERVICES ({myServices.length}) ]</span>
              </button>

              <button
                onClick={() => setActiveSubTab('promotion')}
                className={`px-3.5 py-2 border-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === 'promotion'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-slate-700 border-black hover:bg-slate-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#e8622c]" />
                <span>[ 5. 24H BOOST ANALYTICS ]</span>
              </button>
            </>
          )}

          {activeRoleView === 'buyer' && (
            <>
              <button
                onClick={() => setActiveSubTab('my-requests')}
                className={`px-3.5 py-2 border-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'my-requests'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-slate-700 border-black hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>[ SENT PROJECT INQUIRIES ({mySentRequests.length}) ]</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* 4. MAIN BODY CONTENT */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6">
        
        {/* ========================================================= */}
        {/* TAB 1: PROVIDER LIVE OVERVIEW */}
        {/* ========================================================= */}
        {activeRoleView === 'provider' && activeSubTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Strict 90% Profile Completeness Visibility Banner */}
            {!isProfilePubliclyVisible ? (
              <div className="p-5 bg-amber-50 border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold font-mono text-xs uppercase">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>MARKETPLACE VISIBILITY INACTIVE: {completenessPercent}% / 90% MINIMUM REQUIRED</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-200 border border-amber-400 text-amber-950 font-mono text-[10px] font-bold">
                    NEEDS +{90 - completenessPercent}% MORE COMPLETENESS
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Your profile and services are currently <strong>hidden from public client search results</strong>. RankLancr requires at least <strong>90% profile completeness</strong> (Bio, Skills, Published Services, Portfolio) before profiles are indexed in the public algorithm.
                </p>
                <button
                  onClick={() => navigate('/create-profile')}
                  className="px-4 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  [ 🚀 COMPLETE PROFILE TO REACH 90% & GO LIVE ]
                </button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-900 uppercase">
                      ✓ PROFILE PUBLICLY INDEXED & LIVE ({completenessPercent}%)
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Your profile satisfies the 90%+ quality threshold and is receiving live organic algorithmic traffic.
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* 4 Live KPI Cards (Real numbers without mock fallback) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold uppercase">
                  <span>ProRank Composite Score</span>
                  <Cpu className="w-4 h-4 text-[#e8622c]" />
                </div>
                <div className="text-3xl font-black text-black mt-2">{proScore}/100</div>
                <div className="text-[11px] font-mono mt-1 flex items-center gap-1">
                  {isProfilePubliclyVisible ? (
                    <span className="text-emerald-600 font-bold">✓ Active in Search Engine</span>
                  ) : (
                    <span className="text-amber-600 font-bold">⚠️ Hidden (Needs ≥90%)</span>
                  )}
                </div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold uppercase">
                  <span>Profile Completeness</span>
                  <CheckCircle2 className={`w-4 h-4 ${isProfilePubliclyVisible ? 'text-emerald-600' : 'text-amber-500'}`} />
                </div>
                <div className="text-3xl font-black text-black mt-2">
                  {completenessPercent}%
                  <span className="text-xs font-mono font-normal text-slate-400 ml-1.5">/ 90% min</span>
                </div>
                <div className="w-full bg-slate-200 h-2 mt-2 overflow-hidden border border-black">
                  <div
                    className={`h-full transition-all duration-500 ${isProfilePubliclyVisible ? 'bg-emerald-500' : 'bg-[#e8622c]'}`}
                    style={{ width: `${completenessPercent}%` }}
                  />
                </div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold uppercase">
                  <span>Search Impressions & Clicks (24H)</span>
                  <Eye className="w-4 h-4 text-slate-700" />
                </div>
                <div className="text-3xl font-black text-black mt-2">
                  {boostAnalytics.impressions}
                  <span className="text-xs font-mono font-normal text-slate-500 ml-1">/ {boostAnalytics.clicks} clicks</span>
                </div>
                <div className="text-[11px] font-mono text-[#e8622c] mt-1 font-bold">
                  CTR: {boostAnalytics.ctrPercent}%
                </div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold uppercase">
                  <span>Sponsored Placement</span>
                  <Flame className="w-4 h-4 text-[#e8622c]" />
                </div>
                <div className="text-xl font-black text-[#e8622c] mt-3 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-[#e8622c]" />
                  <span>{myProfile.isPromoted ? 'ACTIVE (24H)' : 'INACTIVE'}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  {promoTimeRemaining || '$2 for 24 hours boost'}
                </div>
              </div>

            </div>

            {/* Live Profile Quality Factors & Dynamic Real Status Checklist */}
            <div className="p-5 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-sm font-black text-black uppercase font-mono flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#e8622c]" />
                    <span>Profile Quality Factors & Algorithm Checklist (90% Requirement)</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    ProRank checks each factor below in real time to calculate your eligibility and marketplace score.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/create-profile')}
                  className="px-3.5 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition shrink-0"
                >
                  [ ✏️ EDIT FULL PROFILE ]
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {/* 1. Bio Check */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-black">
                    {myProfile.bio && myProfile.bio.length >= 15 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span>Bio & Overview</span>
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${myProfile.bio && myProfile.bio.length >= 15 ? 'text-emerald-700 font-bold' : 'text-amber-700'}`}>
                    {myProfile.bio && myProfile.bio.length >= 15 ? '✓ 15+ Chars Verified' : '⚠️ Missing / Too Short'}
                  </div>
                </div>

                {/* 2. Skills Check */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-black">
                    {myProfile.skills && myProfile.skills.length >= 3 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span>Skills Tags ({myProfile.skills?.length || 0})</span>
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${myProfile.skills && myProfile.skills.length >= 3 ? 'text-emerald-700 font-bold' : 'text-amber-700'}`}>
                    {myProfile.skills && myProfile.skills.length >= 3 ? '✓ Taxonomy Verified' : '⚠️ Need at least 3 skills'}
                  </div>
                </div>

                {/* 3. Published Services Check */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-black">
                    {myServices.length >= 1 ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    <span>Published Services ({myServices.length})</span>
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${myServices.length >= 1 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}`}>
                    {myServices.length >= 1 ? '✓ Ready for Direct Hire' : '⚠️ 1+ Service Required'}
                  </div>
                </div>

                {/* 4. Rotation Engine Check */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-black">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fair Rotation Engine</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 mt-0.5 font-bold">
                    ✓ 5-Min Micro-Rotation
                  </div>
                </div>
              </div>
            </div>

            {/* Split: Incoming Requests Preview & Services Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left 7 cols: Incoming Requests */}
              <div className="lg:col-span-7 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <h3 className="font-mono text-xs font-bold uppercase text-black flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-700" />
                    <span>Active Inquiries & Client Requests ({incomingRequests.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveSubTab('requests')}
                    className="text-[11px] font-mono text-[#e8622c] font-bold hover:underline"
                  >
                    View All →
                  </button>
                </div>

                {incomingRequests.length > 0 ? (
                  <div className="space-y-3">
                    {incomingRequests.slice(0, 3).map(req => (
                      <div key={req.id} className="p-4 bg-slate-50 border-2 border-black space-y-2.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-black">{req.buyerName}</div>
                          <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase border ${
                            req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            req.status === 'declined' ? 'bg-red-100 text-red-800 border-red-300' :
                            req.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">{req.projectDescription}</p>
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                          <span>Budget: <strong className="text-black">{req.budget}</strong></span>
                          <span>Deadline: {req.deadline}</span>
                        </div>
                        {req.status === 'pending' && (
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleStatusChange(req.id, 'accepted')}
                              className="px-3 py-1 bg-black text-white font-mono text-xs font-bold hover:bg-emerald-600 transition cursor-pointer"
                            >
                              [ ACCEPT REQUEST ]
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, 'declined')}
                              className="px-3 py-1 bg-white border border-slate-400 font-mono text-xs font-bold hover:bg-red-50 text-slate-700 transition cursor-pointer"
                            >
                              [ DECLINE ]
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 space-y-2">
                    <p className="text-xs font-mono text-slate-600 font-bold">No client inquiries received yet.</p>
                    <p className="text-[11px] text-slate-500">Promote your profile or add more services to receive direct contracts.</p>
                    <button
                      onClick={() => setPromoteModalOpen(true)}
                      className="mt-2 px-3 py-1.5 bg-[#e8622c] text-white font-mono text-xs font-bold"
                    >
                      [ 🔥 BOOST VISIBILITY ]
                    </button>
                  </div>
                )}
              </div>

              {/* Right 5 cols: Active Services */}
              <div className="lg:col-span-5 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <h3 className="font-mono text-xs font-bold uppercase text-black flex items-center gap-2">
                    <Layers className="w-4 h-4 text-slate-700" />
                    <span>Published Services ({myServices.length})</span>
                  </h3>
                  <button
                    onClick={() => navigate('/create-profile')}
                    className="text-[11px] font-mono text-[#e8622c] font-bold hover:underline"
                  >
                    + Add New
                  </button>
                </div>

                {myServices.length > 0 ? (
                  <div className="space-y-3">
                    {myServices.map(srv => (
                      <div key={srv.id} className="p-3.5 bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-black truncate">{srv.title}</div>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            ${srv.startingPrice} starting • {srv.deliveryTime} delivery
                          </div>
                        </div>
                        <Link
                          to={`/service/${srv.id}`}
                          className="px-2.5 py-1 bg-white border border-black font-mono text-[10px] font-bold hover:bg-black hover:text-white transition shrink-0"
                        >
                          [ VIEW GIG ]
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-300">
                    <p className="text-xs font-mono text-slate-600 font-bold">No active gigs listed.</p>
                    <button
                      onClick={() => navigate('/create-profile')}
                      className="mt-3 px-3 py-1.5 bg-black text-white font-mono text-xs font-bold"
                    >
                      [ + CREATE YOUR FIRST GIG ]
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MATHEMATICAL ALGORITHM INSPECTOR */}
        {/* ========================================================= */}
        {activeRoleView === 'provider' && activeSubTab === 'algorithm' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Algorithm Overview Card */}
            <div className="bg-black text-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#e8622c] text-white font-mono text-[10px] font-bold uppercase mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>PRORANK DETERMINISTIC ENGINE V2.0</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Live Mathematical Formula & Score Diagnostic
                  </h2>
                </div>

                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">Total Diagnostic Rating</div>
                  <div className="text-3xl font-black text-[#e8622c]">{proScore} / 100</div>
                </div>
              </div>

              {/* Mathematical Formulas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white/5 border border-white/10 space-y-2">
                  <div className="font-mono text-xs font-bold text-orange-400 uppercase">1. Organic Rank Formula</div>
                  <div className="font-mono text-xs text-white bg-black/50 p-2.5 border border-white/10">
                    S_rank = 0.50 · R + 0.35 · S_pro + 0.15 · S_quality
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Calculated deterministically using token overlap, verified credentials, review ratings, and complete profile structure.
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 space-y-2">
                  <div className="font-mono text-xs font-bold text-emerald-400 uppercase">2. Sponsored ($2 Boost) Formula</div>
                  <div className="font-mono text-xs text-white bg-black/50 p-2.5 border border-white/10">
                    S_boost = 0.40 · R + 0.35 · S_pro + 0.15 · F + 0.10 · W_rot
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Guarantees top placement within relevant categories while Fair Exposure (F) and 5-min Micro-Rotation (W_rot) prevent monopoly.
                  </p>
                </div>
              </div>
            </div>

            {/* 6 Live Factor Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-slate-500">Quality Score (S_quality)</span>
                  <span className="font-mono text-xs font-bold text-black">{completenessPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border border-black overflow-hidden">
                  <div className="bg-[#e8622c] h-full" style={{ width: `${completenessPercent}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 pt-1">
                  Evaluates bio depth, portfolio density, skills taxonomy, and price sanity.
                </p>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-slate-500">Professional Score (S_pro)</span>
                  <span className="font-mono text-xs font-bold text-black">{proScore} / 100</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border border-black overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${proScore}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 pt-1">
                  Evaluates rating ({myProfile.rating}★), review count ({myProfile.reviewCount}), and verified status.
                </p>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-slate-500">Fairness Factor (F)</span>
                  <span className="font-mono text-xs font-bold text-black">{fairnessFactor.toFixed(3)}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border border-black overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${fairnessFactor * 100}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 pt-1">
                  Prevents impression hoarding (Formula: 1 / √(1 + exposure_ratio)).
                </p>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-slate-500">5-Min Micro-Rotation</span>
                  <span className="font-mono text-xs font-bold text-emerald-600">+{currentMicroRotation} factor</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border border-black overflow-hidden">
                  <div className="bg-purple-600 h-full" style={{ width: `${(currentMicroRotation / 0.03) * 100}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 pt-1">
                  Seed: deterministic hash refreshed automatically every 5 minutes.
                </p>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-slate-500">Freshness Score</span>
                  <span className="font-mono text-xs font-bold text-black">{freshnessFactor.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border border-black overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${freshnessFactor * 100}%` }} />
                </div>
                <p className="text-[11px] text-slate-600 pt-1">
                  Formula: exp(-age_hours / 24) giving boost to active 24h placements.
                </p>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-slate-500">Marketplace Commission</span>
                  <span className="font-mono text-xs font-bold text-[#e8622c]">0% (FREE)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 border border-black overflow-hidden">
                  <div className="bg-black h-full" style={{ width: '100%' }} />
                </div>
                <p className="text-[11px] text-slate-600 pt-1">
                  100% direct deal model between client and talent.
                </p>
              </div>

            </div>

            {/* Live Interactive Query Rank Simulator */}
            <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div>
                  <h3 className="text-base font-black text-black uppercase font-mono flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#e8622c]" />
                    <span>Live Search Query Rank Simulator</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Test any search query to see how the ProRank formula computes your ranking in real time.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    placeholder="Enter search term (e.g. React, Node.js, Design, SEO)..."
                    className="w-full p-3 bg-slate-50 border-2 border-black text-xs font-bold font-mono focus:outline-hidden focus:border-[#e8622c]"
                  />
                </div>
              </div>

              {/* Simulation Result Output */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                <div className="p-4 bg-slate-50 border-2 border-black">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Query Relevance Match (R)</div>
                  <div className="text-2xl font-black text-black mt-1">{(testRelevance.score * 100).toFixed(0)}%</div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {testRelevance.score >= 0.35 ? '✓ Meets Relevance Threshold (≥0.35)' : '⚠️ Low keyword match'}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-2 border-black">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Simulated Organic Rank Score</div>
                  <div className="text-2xl font-black text-black mt-1">{simulatedOrganicScore} / 100</div>
                  <div className="text-[10px] font-mono text-emerald-600 mt-0.5">Based on formula weights</div>
                </div>

                <div className="p-4 bg-orange-50 border-2 border-black">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Simulated Boosted Rank Score</div>
                  <div className="text-2xl font-black text-[#e8622c] mt-1">{simulatedSponsoredScore} / 100</div>
                  <div className="text-[10px] font-mono text-[#e8622c] mt-0.5">Includes $2 Sponsored Multiplier</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: INCOMING SERVICE REQUESTS PIPELINE */}
        {/* ========================================================= */}
        {activeRoleView === 'provider' && activeSubTab === 'requests' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Filter Bar */}
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs font-bold">
                {(['all', 'pending', 'accepted', 'completed', 'declined'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setRequestFilter(tab)}
                    className={`px-3 py-1 border uppercase transition cursor-pointer ${
                      requestFilter === tab ? 'bg-black text-white border-black' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-300'
                    }`}
                  >
                    {tab} ({tab === 'all' ? incomingRequests.length : incomingRequests.filter(r => r.status === tab).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Requests List */}
            {filteredIncomingRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredIncomingRequests.map(req => (
                  <div key={req.id} className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-black">{req.buyerName}</span>
                          <span className="text-xs font-mono text-slate-500">({req.buyerEmail})</span>
                        </div>
                        <div className="text-xs font-mono text-[#e8622c] mt-0.5">
                          Service: <strong>{req.serviceTitle || 'Custom Milestone Contract'}</strong>
                        </div>
                      </div>

                      <span className={`px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black shadow-xs ${
                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'declined' ? 'bg-red-100 text-red-800' :
                        req.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        STATUS: {req.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line bg-slate-50 p-4 border border-slate-200 font-normal">
                      {req.projectDescription}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 font-mono text-xs">
                      <div className="flex items-center gap-4 text-slate-600">
                        <span>Offered Budget: <strong className="text-black font-bold">{req.budget}</strong></span>
                        <span>•</span>
                        <span>Timeline: <strong>{req.deadline}</strong></span>
                        <span>•</span>
                        <span>Date: {new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Action buttons based on status */}
                      <div className="flex items-center gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, 'accepted')}
                              className="px-4 py-1.5 bg-black hover:bg-emerald-600 text-white font-mono text-xs font-bold transition cursor-pointer"
                            >
                              [ ACCEPT CONTRACT ]
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, 'declined')}
                              className="px-4 py-1.5 bg-white border border-slate-400 hover:bg-red-50 text-slate-700 font-mono text-xs font-bold transition cursor-pointer"
                            >
                              [ DECLINE ]
                            </button>
                          </>
                        )}

                        {req.status === 'accepted' && (
                          <button
                            onClick={() => handleStatusChange(req.id, 'completed')}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition cursor-pointer"
                          >
                            [ ✓ MARK AS COMPLETED ]
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-black p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="font-bold text-sm text-black">No requests found under filter: {requestFilter.toUpperCase()}</h3>
                <p className="text-xs text-slate-500">Incoming requests from direct clients will appear here in real time.</p>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: MY SERVICES HUB */}
        {/* ========================================================= */}
        {activeRoleView === 'provider' && activeSubTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <h3 className="font-mono text-xs font-bold uppercase text-black">Published Services Catalog</h3>
                <p className="text-xs text-slate-600">Clients can directly hire you or send contract proposals for these gigs.</p>
              </div>

              <button
                onClick={() => navigate('/create-profile')}
                className="px-4 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition shadow-xs cursor-pointer"
              >
                [ + ADD NEW SERVICE ]
              </button>
            </div>

            {myServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map(srv => (
                  <div key={srv.id} className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase border-b border-slate-200 pb-2">
                        <span className="font-bold text-[#e8622c]">{srv.category}</span>
                        <span>{srv.deliveryTime} Delivery</span>
                      </div>

                      <h4 className="font-black text-sm text-black mt-2">{srv.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-3">{srv.description}</p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {srv.skills.map((skill, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-black font-mono text-[9px] border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Starting Price</div>
                        <div className="font-black text-base text-black">${srv.startingPrice}</div>
                      </div>

                      <Link
                        to={`/service/${srv.id}`}
                        className="px-3 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition"
                      >
                        [ VIEW GIG → ]
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border-2 border-black p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="font-bold text-sm text-black">No services published yet</h3>
                <p className="text-xs text-slate-500">Create your first gig to start receiving orders on RankLancr.</p>
                <button
                  onClick={() => navigate('/create-profile')}
                  className="mt-2 px-4 py-2 bg-black text-white font-mono text-xs font-bold"
                >
                  [ + CREATE SERVICE GIG ]
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: 24H BOOST ANALYTICS */}
        {/* ========================================================= */}
        {activeRoleView === 'provider' && activeSubTab === 'promotion' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="p-6 bg-orange-50/50 border-2 border-[#e8622c] shadow-[6px_6px_0px_0px_#e8622c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 fill-[#e8622c] text-[#e8622c]" />
                  <h3 className="font-black text-lg text-black">24-Hour Sponsored Placement Engine</h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  $2 activates instant top placement in all relevant search queries. Fair rotation prevents monopoly and ensures balanced impression distribution.
                </p>
              </div>

              <button
                onClick={() => setPromoteModalOpen(true)}
                className="px-5 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition shrink-0 shadow-xs cursor-pointer"
              >
                [ 🔥 BOOST FOR $2 / 24H ]
              </button>
            </div>

            {/* Live Telemetry Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isRealTimeActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-blue-500'}`} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  {isRealTimeActive ? 'LIVE REAL-TIME TELEMETRY (24H ACTIVE)' : '24H TELEMETRY (15S HEARTBEAT)'}
                </span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                Last updated: {new Date(boostAnalytics.lastUpdated).toLocaleTimeString()}
              </span>
            </div>

            {/* Performance Metrics (Live Telemetry) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Total Impressions</div>
                <div className="text-3xl font-black text-black mt-1">{boostAnalytics.impressions}</div>
                <div className="text-[10px] font-mono text-emerald-600">
                  {boostAnalytics.sponsoredImpressions > 0 ? `${boostAnalytics.sponsoredImpressions} sponsored search placements` : 'Search placements'}
                </div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Profile Clicks</div>
                <div className="text-3xl font-black text-black mt-1">{boostAnalytics.clicks}</div>
                <div className="text-[10px] font-mono text-[#e8622c] font-bold">CTR: {boostAnalytics.ctrPercent}%</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Direct Inquiries</div>
                <div className="text-3xl font-black text-black mt-1">{boostAnalytics.inquiries}</div>
                <div className="text-[10px] font-mono text-emerald-600 font-bold">Conversion: {boostAnalytics.conversionPercent}%</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Fair Rotation Status</div>
                <div className={`text-xl font-black mt-2 ${boostAnalytics.fairRotation.isDamped ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {boostAnalytics.fairRotation.status}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {boostAnalytics.fairRotation.description}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* BUYER VIEW */}
        {/* ========================================================= */}
        {activeRoleView === 'buyer' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Requests Sent</div>
                <div className="text-3xl font-black text-black mt-1">{mySentRequests.length}</div>
                <div className="text-[10px] font-mono text-emerald-600 mt-1">Direct contracts</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Saved Professionals</div>
                <div className="text-3xl font-black text-black mt-1">{savedProfessionals.length}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">Favorite roster</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Marketplace Fee Saved</div>
                <div className="text-3xl font-black text-[#e8622c] mt-1">$0.00</div>
                <div className="text-[10px] font-mono text-emerald-600 mt-1">100% Direct deal model</div>
              </div>
            </div>

            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <h3 className="font-mono text-xs font-bold uppercase text-black">
                  Projects & Requests Sent to Talent ({mySentRequests.length})
                </h3>
                <Link to="/find-services" className="text-xs font-mono text-[#e8622c] font-bold hover:underline">
                  + Hire Another Service
                </Link>
              </div>

              <div className="space-y-3">
                {mySentRequests.map(req => (
                  <div key={req.id} className="p-4 bg-slate-50 border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-black">{req.serviceTitle || 'Custom Project'}</span>
                        <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                          req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'declined' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">Provider: <strong>{req.providerName}</strong> • Budget: <strong>{req.budget}</strong></div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{req.projectDescription}</p>
                    </div>

                    <Link
                      to="/find-services"
                      className="px-4 py-2 bg-black text-white font-mono text-xs font-bold hover:bg-[#e8622c] transition shrink-0"
                    >
                      [ VIEW TALENT ]
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Promotion Modal */}
      {promoteModalOpen && (
        <PromoteModal
          isOpen={promoteModalOpen}
          onClose={() => setPromoteModalOpen(false)}
          professional={myProfile}
        />
      )}

    </div>
  );
};

export default DashboardPage;
