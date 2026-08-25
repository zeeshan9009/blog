import React, { useState, useMemo } from 'react';
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
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTalent } from '../context/TalentContext';
import { calculateProfileQualityScore } from '../services/ranking/profileQualityScore';
import { calculateProfessionalScore } from '../services/ranking/professionalScore';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
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

  const [activeRoleView, setActiveRoleView] = useState<'provider' | 'buyer'>(
    hasProvider ? 'provider' : 'buyer'
  );
  
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'requests' | 'my-requests' | 'services'>(
    isRequestsRoute ? 'requests' : isMyRequestsRoute ? 'my-requests' : 'overview'
  );

  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'declined'>('all');

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
      id: user?.id || 'demo-provider',
      name: user?.name || 'Talent Member',
      title: 'Full Stack Developer',
      category: 'Web Development',
      location: 'Global',
      country: 'Global',
      avatar: user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Pro')}`,
      bio: '',
      hourlyRate: 50,
      experienceYears: 0,
      score: 80,
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

  // Algorithmic metrics
  const qualityScoreNorm = useMemo(() => calculateProfileQualityScore(myProfile), [myProfile]);
  const completenessPercent = Math.round(qualityScoreNorm * 100);
  const isProfilePubliclyVisible = completenessPercent >= 90;
  
  const proScoreResult = useMemo(() => calculateProfessionalScore(myProfile), [myProfile]);
  const proScore = proScoreResult.displayScore;

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
          <div className="flex items-center gap-3">
            {hasBoth && (
              <div className="flex items-center bg-slate-100 p-1 border-2 border-black">
                <button
                  onClick={() => setActiveRoleView('provider')}
                  className={`px-3 py-1 text-xs font-mono font-bold transition uppercase cursor-pointer ${
                    activeRoleView === 'provider'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  [ PROVIDER ]
                </button>
                <button
                  onClick={() => setActiveRoleView('buyer')}
                  className={`px-3 py-1 text-xs font-mono font-bold transition uppercase cursor-pointer ${
                    activeRoleView === 'buyer'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-black'
                  }`}
                >
                  [ CLIENT / BUYER ]
                </button>
              </div>
            )}

            <button
              onClick={() => navigate('/settings')}
              className="p-2 border-2 border-black hover:bg-slate-100 transition cursor-pointer"
              title="Settings & Switch Roles"
            >
              <Settings className="w-4 h-4 text-black" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. COMMAND HERO BAR */}
      <div className="bg-black text-white border-b-2 border-black py-8 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Identity & Status */}
            <div className="flex items-center gap-4">
              <img
                src={myProfile.avatar}
                alt={myProfile.name}
                className="w-16 h-16 object-cover border-2 border-[#e8622c] shadow-[3px_3px_0px_0px_#ffffff] shrink-0"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-[#e8622c] text-white font-mono text-[9px] font-bold uppercase">
                    {activeRoleView === 'provider' ? 'FREELANCE TALENT' : 'CLIENT ACCOUNT'}
                  </span>

                  {myProfile.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono text-[9px] font-bold uppercase">
                      <ShieldCheck className="w-3 h-3 text-blue-400" />
                      <span>VERIFIED</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 text-slate-300 font-mono text-[9px] font-bold uppercase">
                    <span>ORGANIC PRORANK</span>
                  </span>

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
                    onClick={() => navigate('/spotlight')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#e8622c] hover:bg-orange-600 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_0px_#ffffff] cursor-pointer"
                  >
                    <Flame className="w-4 h-4 fill-white" />
                    <span>[ 🔥 OUTBID SPOTLIGHT ]</span>
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

      {/* 3. NAVIGATION SUB-TABS */}
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
                onClick={() => setActiveSubTab('requests')}
                className={`px-3.5 py-2 border-2 transition flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'requests'
                    ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-slate-700 border-black hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>[ 2. INCOMING REQUESTS ({incomingRequests.length}) ]</span>
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
                <span>[ 3. MY SERVICES ({myServices.length}) ]</span>
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
        
        {/* TAB 1: PROVIDER LIVE OVERVIEW */}
        {activeRoleView === 'provider' && activeSubTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Profile Completeness Banner */}
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
                  Your profile and services are currently <strong>hidden from public client search results</strong>. RankLancr requires at least <strong>90% profile completeness</strong> before profiles are indexed in the public ProRank algorithm.
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
            
            {/* KPI Cards */}
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
                  <span>Search Impressions & Clicks</span>
                  <Eye className="w-4 h-4 text-slate-700" />
                </div>
                <div className="text-3xl font-black text-black mt-2">
                  {myProfile.viewsCount || 0}
                  <span className="text-xs font-mono font-normal text-slate-500 ml-1">/ {myProfile.clicksCount || 0} clicks</span>
                </div>
                <div className="text-[11px] font-mono text-[#e8622c] mt-1 font-bold">
                  Direct client discovery
                </div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 font-bold uppercase">
                  <span>Direct Inquiries</span>
                  <Briefcase className="w-4 h-4 text-[#e8622c]" />
                </div>
                <div className="text-3xl font-black text-black mt-2">
                  {incomingRequests.length}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  0% platform commission
                </div>
              </div>

            </div>

            {/* Profile Quality Checklist */}
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
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
                    <p className="text-[11px] text-slate-500">Complete your profile or explore Outbid Spotlight to boost your visibility.</p>
                    <button
                      onClick={() => navigate('/spotlight')}
                      className="mt-2 px-3 py-1.5 bg-[#e8622c] text-white font-mono text-xs font-bold cursor-pointer"
                    >
                      [ 🔥 VIEW SPOTLIGHT LEADERBOARD ]
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

        {/* TAB 2: INCOMING SERVICE REQUESTS PIPELINE */}
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

            {/* List */}
            <div className="space-y-4">
              {filteredIncomingRequests.length === 0 ? (
                <div className="p-12 text-center bg-white border-2 border-dashed border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="font-mono text-sm font-bold text-black uppercase">No {requestFilter} requests found</div>
                  <p className="text-xs text-slate-500 mt-1 font-mono">Incoming direct client contracts and inquiries will appear here.</p>
                </div>
              ) : (
                filteredIncomingRequests.map(req => (
                  <div key={req.id} className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-black">{req.buyerName}</span>
                          <span className="text-xs font-mono text-slate-400">• {req.buyerEmail}</span>
                        </div>
                        <div className="text-xs font-mono text-[#e8622c] font-bold mt-0.5">
                          Gig: {req.serviceTitle || 'Custom Engagement'}
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 font-mono text-[10px] font-bold uppercase border ${
                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        req.status === 'declined' ? 'bg-red-100 text-red-800 border-red-300' :
                        req.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">{req.projectDescription}</p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs font-mono">
                      <div className="flex items-center gap-4 text-slate-600">
                        <span>Budget: <strong className="text-black">{req.budget}</strong></span>
                        <span>Deadline: <strong className="text-black">{req.deadline}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, 'accepted')}
                              className="px-4 py-1.5 bg-black text-white font-mono text-xs font-bold hover:bg-emerald-600 transition cursor-pointer"
                            >
                              [ ACCEPT ]
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.id, 'declined')}
                              className="px-4 py-1.5 bg-white border border-slate-400 font-mono text-xs font-bold hover:bg-red-50 text-slate-700 transition cursor-pointer"
                            >
                              [ DECLINE ]
                            </button>
                          </>
                        )}
                        {req.status === 'accepted' && (
                          <button
                            onClick={() => handleStatusChange(req.id, 'completed')}
                            className="px-4 py-1.5 bg-emerald-600 text-white font-mono text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                          >
                            [ MARK COMPLETED ]
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 3: SERVICES HUB */}
        {activeRoleView === 'provider' && activeSubTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-mono text-base font-bold text-black uppercase">My Published Gigs & Services</h2>
                <p className="text-xs text-slate-500 font-mono">Manage your direct offerings with clear pricing and delivery timelines.</p>
              </div>

              <button
                onClick={() => navigate('/create-profile')}
                className="px-4 py-2 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus className="w-4 h-4" />
                <span>[ + CREATE NEW GIG ]</span>
              </button>
            </div>

            {myServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map(srv => (
                  <div key={srv.id} className="bg-white border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 font-mono text-[9px] font-bold uppercase text-slate-700">
                        {srv.category}
                      </span>
                      <h3 className="font-bold text-sm text-black line-clamp-2">{srv.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-3">{srv.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px]">PRICE</span>
                        <div className="font-black text-black">${srv.startingPrice}</div>
                      </div>

                      <Link
                        to={`/service/${srv.id}`}
                        className="px-3 py-1.5 bg-black text-white font-bold text-[10px] hover:bg-[#e8622c] transition"
                      >
                        [ VIEW GIG → ]
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white border-2 border-dashed border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="font-mono text-sm font-bold uppercase">No published services yet</div>
                <p className="text-xs text-slate-500 font-mono max-w-sm mx-auto">Create defined gigs so buyers can book you directly with clear scope.</p>
                <button
                  onClick={() => navigate('/create-profile')}
                  className="px-4 py-2 bg-black text-white font-mono text-xs font-bold"
                >
                  [ + CREATE SERVICE GIG ]
                </button>
              </div>
            )}

          </div>
        )}

        {/* BUYER VIEW */}
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

    </div>
  );
};

export default DashboardPage;
