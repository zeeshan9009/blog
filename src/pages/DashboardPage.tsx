import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Flame,
  Plus,
  Settings,
  Search,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTalent } from '../context/TalentContext';
import { calculateProfileQualityScore } from '../services/ranking/profileQualityScore';
import { calculateProfessionalScore } from '../services/ranking/professionalScore';
import { PromoteModal } from '../components/modals/PromoteModal';

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
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'requests' | 'my-requests' | 'promotion' | 'services'>(
    isRequestsRoute ? 'requests' : isMyRequestsRoute ? 'my-requests' : isPromoRoute ? 'promotion' : 'overview'
  );

  const [promoteModalOpen, setPromoteModalOpen] = useState(false);

  // Target provider profile
  const myProfile = useMemo(() => {
    return professionals.find(p => p.id === 'ali-raza') || professionals[0];
  }, [professionals]);

  // Provider's services
  const myServices = useMemo(() => {
    return services.filter(s => s.providerId === myProfile.id || s.providerId === 'ali-raza');
  }, [services, myProfile]);

  // Incoming requests for provider
  const incomingRequests = useMemo(() => {
    return serviceRequests.filter(r => r.providerId === myProfile.id || r.providerId === 'ali-raza');
  }, [serviceRequests, myProfile]);

  // Outgoing requests by buyer
  const mySentRequests = useMemo(() => {
    return serviceRequests;
  }, [serviceRequests]);

  // Completeness score
  const qualityScoreNorm = useMemo(() => calculateProfileQualityScore(myProfile), [myProfile]);
  const completenessPercent = Math.round(qualityScoreNorm * 100);
  const proScore = useMemo(() => calculateProfessionalScore(myProfile).displayScore, [myProfile]);

  // Countdown timer for promotion
  const promoTimeRemaining = useMemo(() => {
    if (!myProfile.isPromoted || !myProfile.promotionExpiresAt) return null;
    const diff = new Date(myProfile.promotionExpiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  }, [myProfile]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white pb-20">
      
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black flex items-center justify-center text-white">
                <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-[#e8622c] ml-0.5" />
              </div>
              <span className="text-lg font-black tracking-tight text-black">
                ProRank<span className="text-[#e8622c]">.</span>
              </span>
            </Link>
            <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
              DASHBOARD
            </span>
          </div>

          {/* Quick Dual Role Switcher */}
          {hasBoth && (
            <div className="hidden sm:flex items-center bg-slate-100 p-1 border-2 border-black">
              <button
                onClick={() => setActiveRoleView('provider')}
                className={`px-3 py-1 text-xs font-mono font-bold transition cursor-pointer ${
                  activeRoleView === 'provider' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                [ YOUR SERVICES (PROVIDER) ]
              </button>
              <button
                onClick={() => setActiveRoleView('buyer')}
                className={`px-3 py-1 text-xs font-mono font-bold transition cursor-pointer ${
                  activeRoleView === 'buyer' ? 'bg-black text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                [ FOR YOU (BUYER) ]
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 transition"
              title="Role Settings"
            >
              <Settings className="w-4 h-4 text-slate-700" />
            </button>

            <Link
              to="/find-services"
              className="px-3 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition shadow-xs"
            >
              [ EXPLORE SERVICES ]
            </Link>
          </div>

        </div>
      </header>

      {/* 2. DASHBOARD HERO BANNER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
        
        <div className="bg-black text-white p-6 sm:p-8 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/10 text-orange-400 font-mono text-[10px] font-bold uppercase">
              <Sparkles className="w-3 h-3" />
              <span>ROLE: {hasBoth ? 'BUYER & PROVIDER' : hasProvider ? 'SERVICE PROVIDER' : 'SERVICE BUYER'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.name || myProfile.name} 👋
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal">
              {activeRoleView === 'provider'
                ? 'Manage your professional services, respond to direct hire requests, and boost visibility with $1 sponsored placement.'
                : 'Discover top professionals, manage your active project requests, and hire talent with 0% platform markups.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="relative z-10 flex flex-wrap gap-2.5 shrink-0">
            {activeRoleView === 'provider' ? (
              <>
                <button
                  onClick={() => setPromoteModalOpen(true)}
                  className="px-4 py-2.5 bg-[#e8622c] hover:bg-orange-600 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>[ 🔥 PROMOTE FOR $1 ]</span>
                </button>

                <button
                  onClick={() => navigate('/create-profile')}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>[ + ADD SERVICE ]</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/find-services')}
                  className="px-4 py-2.5 bg-[#e8622c] hover:bg-orange-600 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>[ FIND A SERVICE ]</span>
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6">
        <div className="flex flex-wrap items-center gap-2 border-b-2 border-black pb-2 font-mono text-xs font-bold">
          
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 border transition cursor-pointer ${
              activeSubTab === 'overview' ? 'bg-black text-white border-black' : 'bg-white text-slate-600 hover:border-black'
            }`}
          >
            [ OVERVIEW ]
          </button>

          {activeRoleView === 'provider' && (
            <>
              <button
                onClick={() => setActiveSubTab('requests')}
                className={`px-3 py-1.5 border transition flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === 'requests' ? 'bg-black text-white border-black' : 'bg-white text-slate-600 hover:border-black'
                }`}
              >
                <span>[ INCOMING REQUESTS ({incomingRequests.length}) ]</span>
                {incomingRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#e8622c] animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setActiveSubTab('services')}
                className={`px-3 py-1.5 border transition cursor-pointer ${
                  activeSubTab === 'services' ? 'bg-black text-white border-black' : 'bg-white text-slate-600 hover:border-black'
                }`}
              >
                [ MY SERVICES ({myServices.length}) ]
              </button>

              <button
                onClick={() => setActiveSubTab('promotion')}
                className={`px-3 py-1.5 border transition flex items-center gap-1.5 cursor-pointer ${
                  activeSubTab === 'promotion' ? 'bg-black text-white border-black' : 'bg-white text-slate-600 hover:border-black'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#e8622c]" />
                <span>[ PROMOTION & ANALYTICS ]</span>
              </button>
            </>
          )}

          {activeRoleView === 'buyer' && (
            <>
              <button
                onClick={() => setActiveSubTab('my-requests')}
                className={`px-3 py-1.5 border transition cursor-pointer ${
                  activeSubTab === 'my-requests' ? 'bg-black text-white border-black' : 'bg-white text-slate-600 hover:border-black'
                }`}
              >
                [ MY SENT REQUESTS ({mySentRequests.length}) ]
              </button>
            </>
          )}

        </div>
      </div>

      {/* 4. MAIN TAB CONTENT */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6">
        
        {/* ========================================================= */}
        {/* PROVIDER OVERVIEW */}
        {/* ========================================================= */}
        {activeRoleView === 'provider' && activeSubTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 4-Card Metric Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">ProRank Score</div>
                <div className="text-3xl font-black text-black mt-1">{proScore}/100</div>
                <div className="text-[10px] font-mono text-emerald-600 mt-1">✓ Top 5% Talent Pool</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Profile Completeness</div>
                <div className="text-3xl font-black text-black mt-1">{completenessPercent}%</div>
                <div className="w-full bg-slate-200 h-1.5 mt-2 overflow-hidden">
                  <div className="bg-[#e8622c] h-full" style={{ width: `${completenessPercent}%` }} />
                </div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Profile Views</div>
                <div className="text-3xl font-black text-black mt-1">1,284</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">+14% this week</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Promotion Status</div>
                <div className="text-xl font-black text-[#e8622c] mt-2 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 fill-[#e8622c]" />
                  <span>{myProfile.isPromoted ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  {promoTimeRemaining || 'Promote for $1'}
                </div>
              </div>

            </div>

            {/* Completeness Recommendations */}
            {completenessPercent < 100 && (
              <div className="p-4 bg-amber-50 border-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-black">Improve Your Profile Quality:</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Add portfolio images, link GitHub/LinkedIn, and add more services to reach 100% completeness.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/create-profile')}
                  className="px-3 py-1.5 bg-black text-white font-mono text-xs font-bold hover:bg-[#e8622c] transition shrink-0"
                >
                  [ EDIT PROFILE ]
                </button>
              </div>
            )}

            {/* Pending Requests & My Services Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left (7 cols): Incoming Requests */}
              <div className="lg:col-span-7 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <h3 className="font-mono text-xs font-bold uppercase text-black">
                    Incoming Service Requests ({incomingRequests.length})
                  </h3>
                  <button
                    onClick={() => setActiveSubTab('requests')}
                    className="text-[11px] font-mono text-[#e8622c] font-bold hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {incomingRequests.map(req => (
                    <div key={req.id} className="p-4 bg-slate-50 border border-slate-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-black">{req.buyerName}</span>
                        <span className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase ${
                          req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'declined' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{req.projectDescription}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                        <span>Budget: <strong className="text-black">{req.budget}</strong></span>
                        <span>Deadline: {req.deadline}</span>
                      </div>
                      {req.status === 'pending' && (
                        <div className="flex gap-2 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => updateServiceRequestStatus(req.id, 'accepted')}
                            className="px-3 py-1 bg-black text-white font-mono text-xs font-bold hover:bg-emerald-600 transition"
                          >
                            [ ACCEPT ]
                          </button>
                          <button
                            onClick={() => updateServiceRequestStatus(req.id, 'declined')}
                            className="px-3 py-1 bg-white border border-slate-300 font-mono text-xs font-bold hover:bg-red-50 text-slate-700 transition"
                          >
                            [ DECLINE ]
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right (5 cols): Active Services List */}
              <div className="lg:col-span-5 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <h3 className="font-mono text-xs font-bold uppercase text-black">
                    Your Services ({myServices.length})
                  </h3>
                  <button
                    onClick={() => navigate('/create-profile')}
                    className="text-[11px] font-mono text-[#e8622c] font-bold hover:underline"
                  >
                    + Add New
                  </button>
                </div>

                <div className="space-y-3">
                  {myServices.map(srv => (
                    <div key={srv.id} className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-black truncate">{srv.title}</div>
                        <div className="text-[10px] font-mono text-slate-500">
                          ${srv.startingPrice} • {srv.deliveryTime}
                        </div>
                      </div>
                      <Link
                        to={`/service/${srv.id}`}
                        className="px-2 py-1 bg-white border border-black font-mono text-[10px] font-bold hover:bg-slate-100"
                      >
                        [ VIEW ]
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* BUYER OVERVIEW */}
        {/* ========================================================= */}
        {activeRoleView === 'buyer' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Quick Buyer Metrics */}
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

            {/* Sent Requests Table */}
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
                        <span className={`px-2 py-0.2 font-mono text-[9px] font-bold uppercase ${
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

        {/* ========================================================= */}
        {/* PROMOTION & ANALYTICS SUBTAB */}
        {/* ========================================================= */}
        {activeSubTab === 'promotion' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="p-6 bg-orange-50/50 border-2 border-[#e8622c] shadow-[6px_6px_0px_0px_#e8622c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 fill-[#e8622c] text-[#e8622c]" />
                  <h3 className="font-black text-lg text-black">24-Hour Sponsored Visibility Engine</h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  $1 activates sponsored placement in relevant ProRank searches. Fair rotation prevents monopoly and ensures balanced impression distribution.
                </p>
              </div>

              <button
                onClick={() => setPromoteModalOpen(true)}
                className="px-5 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition shrink-0 shadow-xs cursor-pointer"
              >
                [ 🔥 PROMOTE FOR $1 ]
              </button>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Impressions</div>
                <div className="text-3xl font-black text-black mt-1">1,284</div>
                <div className="text-[10px] font-mono text-slate-400">Search placements</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Profile Clicks</div>
                <div className="text-3xl font-black text-black mt-1">86</div>
                <div className="text-[10px] font-mono text-[#e8622c] font-bold">CTR: 6.7%</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Direct Contacts</div>
                <div className="text-3xl font-black text-black mt-1">12</div>
                <div className="text-[10px] font-mono text-emerald-600 font-bold">Contact Rate: 13.9%</div>
              </div>

              <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Fair Rotation</div>
                <div className="text-xl font-black text-emerald-600 mt-2">ACTIVE</div>
                <div className="text-[10px] font-mono text-slate-400">Damping enabled</div>
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
