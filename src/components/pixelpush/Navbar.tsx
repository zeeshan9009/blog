import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  Search,
  Zap,
  Code,
  Palette,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LayoutDashboard,
  BookOpen,
  FileText,
  Bot,
  Smartphone,
  Video,
  TrendingUp,
  CheckCircle2,
  LogOut,
  UserCheck,
  Briefcase,
  Users,
  Plus,
  Flame,
  Settings
} from 'lucide-react';
import { useTalent } from '../../context/TalentContext';
import { useAuth } from '../../context/AuthContext';
import { RankLancrLogo } from '../brand/RankLancrLogo';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { setSearchQuery, currentProfile } = useTalent();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'talent' | 'platform' | null>(null);
  const [navSearch, setNavSearch] = useState('');
  
  // User Profile Dropdown
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Modals for Docs and Policies
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  const menuContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setUserDropdownOpen(false);
        setDocsModalOpen(false);
        setPolicyModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      setSearchQuery(navSearch.trim());
      navigate(`/developers?q=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/developers');
    }
    setActiveMenu(null);
  };

  const goToPage = (path: string, query?: string) => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (query) {
      setSearchQuery(query);
    }

    if (path.includes('search') || path.includes('developers') || path.includes('talent')) {
      navigate(query ? `/developers?q=${encodeURIComponent(query)}` : '/developers');
      return;
    }

    let targetId = 'main-content';
    if (path.includes('promote') || path.includes('pricing')) targetId = 'pricing';
    else if (path.includes('create-profile') || path.includes('dashboard')) targetId = 'cta';
    else if (path.includes('faq')) targetId = 'faq';
    else if (path.includes('features') || path.includes('discover')) targetId = 'features';

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const toggleMenu = (menu: 'talent' | 'platform') => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <>
      {/* Accessible Skip-to-content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#e8622c] focus:text-white focus:font-bold focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Spacious Sticky Header */}
      <header
        ref={menuContainerRef}
        className={`sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md transition-all duration-300 border-b ${
          isScrolled ? 'border-slate-200 shadow-xs py-3 sm:py-3.5' : 'border-slate-100 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: ProRank Logo + Nav Links */}
            <div className="flex items-center gap-8 lg:gap-10 shrink-0">
              
              {/* RankLancr Brand Logo */}
              <button onClick={() => goToPage('/')} className="cursor-pointer text-left focus:outline-hidden">
                <RankLancrLogo isLink={false} size="md" showDomain={true} />
              </button>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-3 text-xs font-bold text-slate-800" aria-label="Main Navigation">
                
                <Link
                  to="/find-services"
                  className="hover:text-[#e8622c] transition py-1.5 px-2 flex items-center gap-1"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Find Services</span>
                </Link>

                <Link
                  to="/developers"
                  className="hover:text-[#e8622c] transition py-1.5 px-2 flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Professionals</span>
                </Link>

                <a href="#features" onClick={() => setActiveMenu(null)} className="hover:text-black transition py-1.5 px-2">
                  How It Works
                </a>

                {/* Categories Button */}
                <button
                  onClick={() => toggleMenu('talent')}
                  className={`flex items-center gap-1.5 transition cursor-pointer py-1.5 px-3 border rounded-none ${
                    activeMenu === 'talent'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'text-slate-800 hover:text-black border-transparent hover:border-slate-300'
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeMenu === 'talent' ? 'rotate-180 text-[#e8622c]' : 'text-slate-500'
                    }`}
                  />
                </button>
              </nav>

            </div>

            {/* Middle: Square UI Search Bar on Scroll */}
            <div className="flex-1 flex justify-center px-4">
              <div
                className={`transition-all duration-300 ease-out overflow-hidden ${
                  isScrolled
                    ? 'w-full max-w-lg opacity-100 scale-100 pointer-events-auto'
                    : 'w-0 max-w-0 opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <form
                  onSubmit={handleSearch}
                  className="flex items-center bg-white border-2 border-black rounded-none shadow-xs p-0.5 focus-within:ring-2 focus-within:ring-orange-500/30"
                >
                  <input
                    type="text"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    placeholder="Search talent (e.g. React, UI/UX, Python, SEO)..."
                    className="w-full px-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-black hover:bg-[#e8622c] text-white p-2 px-3 rounded-none transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    title="Search"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Actions (Log in / Avatar / Promote / Explore) */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              
              {/* AUTH STATE: Logged in Avatar vs Sign in button */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 bg-white border-2 border-black hover:border-[#e8622c] transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer group rounded-none"
                  >
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                      alt={user.name}
                      className="w-6 h-6 rounded-none object-cover border border-black bg-orange-100 shrink-0"
                    />
                    <span className="text-xs font-bold text-black max-w-[100px] truncate group-hover:text-[#e8622c] transition">
                      {user.name || 'Pro Member'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-600 group-hover:text-black" />
                  </button>

                  {/* Square UI User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3.5 z-50 animate-fadeIn rounded-none">
                      <div className="pb-3 mb-3 border-b border-slate-200 flex items-center gap-2.5">
                        <img
                          src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                          alt={user.name}
                          className="w-9 h-9 rounded-none border border-black bg-orange-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-black truncate">{user.name}</div>
                          <div className="text-[10px] font-mono text-slate-500 truncate">{user.email}</div>
                          <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-[#e8622c] font-mono text-[9px] font-bold">
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>VERIFIED MEMBER</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 pb-2">
                        <button
                          onClick={() => goToPage('/dashboard')}
                          className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100 flex items-center gap-2 transition cursor-pointer"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => goToPage('/dashboard/requests')}
                          className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100 flex items-center gap-2 transition cursor-pointer"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                          <span>Service Requests</span>
                        </button>

                        {/* If already promoted, show Active Boost status instead of promote purchase prompt */}
                        {currentProfile?.isPromoted ? (
                          <button
                            onClick={() => goToPage('/dashboard/promotion')}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-black hover:bg-orange-50/50 flex items-center justify-between transition cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 fill-[#e8622c] text-[#e8622c]" />
                              <span>Boost Active</span>
                            </span>
                            <span className="font-mono text-[9px] px-1.5 py-0.2 bg-orange-100 text-[#e8622c] font-bold">24H ACTIVE</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => goToPage('/promote')}
                            className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-black hover:bg-orange-50/50 flex items-center justify-between transition cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-[#e8622c]" />
                              <span>$1 Boost Placement</span>
                            </span>
                            <span className="font-mono text-[10px] text-[#e8622c]">$1/day</span>
                          </button>
                        )}

                        <button
                          onClick={() => goToPage('/settings')}
                          className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-black hover:bg-slate-100 flex items-center gap-2 transition cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-500" />
                          <span>Role & Settings</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full mt-2 py-2 px-3 bg-black hover:bg-red-600 text-white text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>[ LOG OUT ]</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-xs font-bold text-slate-800 hover:text-black px-2.5 transition cursor-pointer"
                  >
                    Sign in
                  </button>

                  <button
                    onClick={() => navigate('/onboarding')}
                    className="px-3.5 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer shadow-[2px_2px_0px_0px_#e8622c] flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Become a Professional</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => goToPage('/search')}
                className="pixel-btn-black px-3 py-1.5 font-bold text-xs"
              >
                Search
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-none text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. FULL-WIDTH SQUARE UI EXPLORE TALENT DROPDOWN BOX */}
        {/* ========================================================= */}
        {activeMenu === 'talent' && (
          <>
            <div
              onClick={() => setActiveMenu(null)}
              className="fixed inset-0 bg-black/35 backdrop-blur-xs z-40 top-[72px]"
            />
            <div className="absolute top-full left-0 w-full z-50 bg-white border-b-4 border-black shadow-[0_16px_36px_rgba(0,0,0,0.18)] animate-fadeIn">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-7">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Area: 6 Talent Categories (8 Cols) */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => goToPage('/search', 'Development')}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Code className="w-4 h-4 text-[#e8622c]" />
                          <span className="text-[10px] font-mono text-slate-400">1,820 PROS</span>
                        </div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition">
                          Web & Software Engineers
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">React, Node.js, Python, Next.js, Go</div>
                      </div>
                      <div className="text-[11px] font-bold text-black group-hover:text-[#e8622c] mt-3 flex items-center gap-1">
                        <span>Browse Roster</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => goToPage('/search', 'AI')}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Bot className="w-4 h-4 text-[#e8622c]" />
                          <span className="text-[10px] font-mono text-slate-400">940 PROS</span>
                        </div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition">
                          AI & Machine Learning
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">PyTorch, LLMs, Computer Vision, Agents</div>
                      </div>
                      <div className="text-[11px] font-bold text-black group-hover:text-[#e8622c] mt-3 flex items-center gap-1">
                        <span>Browse Roster</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => goToPage('/search', 'Design')}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Palette className="w-4 h-4 text-[#e8622c]" />
                          <span className="text-[10px] font-mono text-slate-400">1,150 PROS</span>
                        </div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition">
                          UI/UX & Product Design
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Figma, Design Systems, Mobile Apps</div>
                      </div>
                      <div className="text-[11px] font-bold text-black group-hover:text-[#e8622c] mt-3 flex items-center gap-1">
                        <span>Browse Roster</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => goToPage('/search', 'Mobile')}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Smartphone className="w-4 h-4 text-[#e8622c]" />
                          <span className="text-[10px] font-mono text-slate-400">620 PROS</span>
                        </div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition">
                          Mobile App Developers
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">React Native, Flutter, Swift, Kotlin</div>
                      </div>
                      <div className="text-[11px] font-bold text-black group-hover:text-[#e8622c] mt-3 flex items-center gap-1">
                        <span>Browse Roster</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => goToPage('/search', 'Marketing')}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <TrendingUp className="w-4 h-4 text-[#e8622c]" />
                          <span className="text-[10px] font-mono text-slate-400">410 PROS</span>
                        </div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition">
                          Technical SEO & Growth
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">SEO Audits, Analytics, Growth Systems</div>
                      </div>
                      <div className="text-[11px] font-bold text-black group-hover:text-[#e8622c] mt-3 flex items-center gap-1">
                        <span>Browse Roster</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    <button
                      onClick={() => goToPage('/search', 'Video')}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <Video className="w-4 h-4 text-[#e8622c]" />
                          <span className="text-[10px] font-mono text-slate-400">380 PROS</span>
                        </div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition">
                          Video & 3D Motion
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">After Effects, 3D Renders, Product Demos</div>
                      </div>
                      <div className="text-[11px] font-bold text-black group-hover:text-[#e8622c] mt-3 flex items-center gap-1">
                        <span>Browse Roster</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>

                  {/* Right Area: Spotlight & Direct Action (4 Cols) */}
                  <div className="lg:col-span-4 bg-black text-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_#e8622c] flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 text-[10px] font-mono text-orange-300 mb-3">
                        <ShieldCheck className="w-3 h-3 text-[#e8622c]" />
                        <span>DIRECT CONTRACTS — 0% CUT</span>
                      </div>

                      <h3 className="text-base font-black text-white leading-snug">
                        Discover 4,800+ pre-vetted engineers & designers.
                      </h3>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        Search by exact framework tags, live portfolio repos, and verified peer scores.
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                      <button
                        onClick={() => goToPage('/search')}
                        className="w-full py-2.5 px-3 bg-[#e8622c] hover:bg-[#ff7a3d] text-white font-bold text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>View Entire Talent Directory</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Bar: Read Docs & Read Policies Buttons */}
                <div className="mt-6 pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => { setActiveMenu(null); setDocsModalOpen(true); }}
                      className="px-3.5 py-1.5 bg-white border-2 border-black hover:bg-orange-50 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#e8622c]" />
                      <span>[ READ TALENT DOCS ]</span>
                    </button>

                    <button
                      onClick={() => { setActiveMenu(null); setPolicyModalOpen(true); }}
                      className="px-3.5 py-1.5 bg-white border-2 border-black hover:bg-orange-50 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#e8622c]" />
                      <span>[ READ TALENT POLICIES ]</span>
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500">
                    PRESS <span className="font-bold text-black">[ ESC ]</span> TO CLOSE
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* 2. FULL-WIDTH SQUARE UI PLATFORM INFO DROPDOWN BOX */}
        {/* ========================================================= */}
        {activeMenu === 'platform' && (
          <>
            <div
              onClick={() => setActiveMenu(null)}
              className="fixed inset-0 bg-black/35 backdrop-blur-xs z-40 top-[72px]"
            />
            <div className="absolute top-full left-0 w-full z-50 bg-white border-b-4 border-black shadow-[0_16px_36px_rgba(0,0,0,0.18)] animate-fadeIn">
              <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-7">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Area: Platform Tools (8 Cols) */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    <button
                      onClick={() => goToPage('/dashboard')}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex items-start gap-3"
                    >
                      <div className="p-2 bg-black text-white shrink-0 mt-0.5">
                        <LayoutDashboard className="w-4 h-4 text-[#e8622c]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition flex items-center justify-between">
                          <span>Professional Dashboard</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Live search rank, profile visits, client inquiries & earnings summary.</div>
                      </div>
                    </button>

                    <button
                      onClick={() => goToPage('/promote')}
                      className="text-left p-3.5 border-2 border-[#e8622c]/50 bg-orange-50/30 hover:border-black hover:bg-orange-50 transition cursor-pointer group flex items-start gap-3"
                    >
                      <div className="p-2 bg-[#e8622c] text-white shrink-0 mt-0.5">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition flex items-center justify-between">
                          <span>$1 / 24h Sponsored Boost</span>
                          <span className="px-1.5 py-0.5 bg-[#e8622c] text-white text-[9px] font-mono font-bold">$1/DAY</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Instant top search rank for 24 hours. Zero subscription lock-in.</div>
                      </div>
                    </button>

                    <button
                      onClick={() => goToPage('/create-profile')}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex items-start gap-3"
                    >
                      <div className="p-2 bg-black text-white shrink-0 mt-0.5">
                        <UserPlus className="w-4 h-4 text-[#e8622c]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition flex items-center justify-between">
                          <span>Create Free Talent Profile</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Join the 4,800+ verified talent network in under 2 minutes.</div>
                      </div>
                    </button>

                    <a
                      href="#features"
                      onClick={() => setActiveMenu(null)}
                      className="text-left p-3.5 border-2 border-slate-200 hover:border-black hover:bg-orange-50/50 transition cursor-pointer group flex items-start gap-3"
                    >
                      <div className="p-2 bg-black text-white shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-[#e8622c]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-black group-hover:text-[#e8622c] transition flex items-center justify-between">
                          <span>0-100 Score System</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">Deterministic rating across verified code commits and project reviews.</div>
                      </div>
                    </a>

                  </div>

                  {/* Right Area: Architecture & Model (4 Cols) */}
                  <div className="lg:col-span-4 bg-black text-white p-5 border-2 border-black shadow-[4px_4px_0px_0px_#e8622c] flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/10 text-[10px] font-mono text-orange-300 mb-3">
                        <ShieldCheck className="w-3 h-3 text-[#e8622c]" />
                        <span>FAIR & TRANSPARENT</span>
                      </div>

                      <h3 className="text-base font-black text-white leading-snug">
                        0% Commission Policy. Keep 100% of your earnings.
                      </h3>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        We charge clients $0 to search and talent 0% marketplace fees. Direct payment directly from client to talent.
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                      <button
                        onClick={() => goToPage('/create-profile')}
                        className="w-full py-2.5 px-3 bg-[#e8622c] hover:bg-[#ff7a3d] text-white font-bold text-xs font-mono uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Start Free Profile Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Bottom Bar: Read Docs & Read Policies Buttons */}
                <div className="mt-6 pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => { setActiveMenu(null); setDocsModalOpen(true); }}
                      className="px-3.5 py-1.5 bg-white border-2 border-black hover:bg-orange-50 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#e8622c]" />
                      <span>[ READ PLATFORM DOCS ]</span>
                    </button>

                    <button
                      onClick={() => { setActiveMenu(null); setPolicyModalOpen(true); }}
                      className="px-3.5 py-1.5 bg-white border-2 border-black hover:bg-orange-50 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#e8622c]" />
                      <span>[ READ TERMS & PRIVACY POLICY ]</span>
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500">
                    PRESS <span className="font-bold text-black">[ ESC ]</span> TO CLOSE
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b-2 border-black px-4 pt-3 pb-6 space-y-3 text-sm animate-fadeIn">
            <form onSubmit={handleSearch} className="flex items-center bg-slate-100 border-2 border-black p-1 mb-3 rounded-none">
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search talent..."
                className="w-full px-3 py-1.5 text-xs bg-transparent focus:outline-hidden"
              />
              <button type="submit" className="bg-black text-white p-1.5 rounded-none">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="space-y-1 border-b border-slate-200 pb-3">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase px-3">Talent Categories</div>
              <button
                onClick={() => goToPage('/search', 'Development')}
                className="block w-full text-left px-3 py-1.5 font-bold text-xs text-slate-800 hover:bg-slate-50"
              >
                💻 Web & Software Engineers
              </button>
              <button
                onClick={() => goToPage('/search', 'AI')}
                className="block w-full text-left px-3 py-1.5 font-bold text-xs text-slate-800 hover:bg-slate-50"
              >
                🤖 AI & Machine Learning
              </button>
              <button
                onClick={() => goToPage('/search', 'Design')}
                className="block w-full text-left px-3 py-1.5 font-bold text-xs text-slate-800 hover:bg-slate-50"
              >
                🎨 UI/UX & Product Designers
              </button>
            </div>

            <div className="space-y-1 border-b border-slate-200 pb-3">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase px-3">Platform</div>
              <button
                onClick={() => goToPage('/dashboard')}
                className="block w-full text-left px-3 py-1.5 font-bold text-xs text-slate-800 hover:bg-slate-50"
              >
                📊 Professional Dashboard
              </button>
              {currentProfile?.isPromoted ? (
                <button
                  onClick={() => goToPage('/dashboard/promotion')}
                  className="block w-full text-left px-3 py-1.5 font-bold text-xs text-[#e8622c] hover:bg-orange-50"
                >
                  🔥 24h Sponsored Boost (ACTIVE)
                </button>
              ) : (
                <button
                  onClick={() => goToPage('/promote')}
                  className="block w-full text-left px-3 py-1.5 font-bold text-xs text-slate-800 hover:bg-slate-50"
                >
                  ⚡ $1 / 24h Sponsored Boost
                </button>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setMobileMenuOpen(false); setDocsModalOpen(true); }}
                className="flex-1 py-2 text-center text-xs font-mono font-bold bg-slate-100 border border-slate-300"
              >
                [ Read Docs ]
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setPolicyModalOpen(true); }}
                className="flex-1 py-2 text-center text-xs font-mono font-bold bg-slate-100 border border-slate-300"
              >
                [ Read Policy ]
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              {user ? (
                <div className="p-3 bg-slate-50 border-2 border-black flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-none border border-black bg-orange-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-black truncate">{user.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-1.5 px-3 bg-black hover:bg-red-600 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>[ LOG OUT ]</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/register');
                    }}
                    className="pixel-btn-black block w-full py-2.5 text-center font-bold text-xs"
                  >
                    Create Free Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className="block w-full py-2 text-center text-xs font-bold text-slate-700 hover:text-black border border-slate-300"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 3. SQUARE UI DOCUMENTATION MODAL */}
      {/* ========================================================= */}
      {docsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b-2 border-black flex items-center justify-between bg-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#e8622c]" />
                <span className="font-mono font-bold text-xs uppercase tracking-wider">
                  PRORANK PLATFORM & TALENT DOCUMENTATION
                </span>
              </div>
              <button
                onClick={() => setDocsModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white transition border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
              <div className="p-3 bg-orange-50 border border-[#e8622c]/40">
                <h4 className="font-bold text-black mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#e8622c]" />
                  <span>1. How ProRank Indexing Works</span>
                </h4>
                <p className="text-slate-600">
                  ProRank verifies technical profiles using verified GitHub code repositories, Figma design systems, live production URLs, and validated client reviews.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-black text-sm">2. Search Ranking Algorithm & 0-100 Score</h4>
                <p>
                  Talent rankings are computed deterministically across 4 key criteria:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Technical Tag Verification (35%):</strong> Confirmed commits and live production builds.</li>
                  <li><strong>Client Completion Rate (25%):</strong> Project milestones delivered on schedule.</li>
                  <li><strong>Response Velocity (20%):</strong> Average inquiry reply time under 2 hours.</li>
                  <li><strong>Peer Review & Code Quality (20%):</strong> Automated repo analysis and peer feedback.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-black text-sm">3. $1 Daily Sponsored Placement</h4>
                <p>
                  Developers and designers can sponsor their profile for exactly 24 hours ($1 USD). Sponsoring puts their profile directly at the top of category searches without requiring recurring subscriptions.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-black text-sm">4. Direct Inquiries & Payments</h4>
                <p>
                  Clients contact talent directly through verified inquiry channels. ProRank takes <strong>0% cut</strong> from freelance contracts.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t-2 border-black bg-slate-50 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-500">VERSION 2.4 — 2026</span>
              <button
                onClick={() => setDocsModalOpen(false)}
                className="px-4 py-2 bg-black text-white hover:bg-[#e8622c] font-bold font-mono text-xs transition cursor-pointer"
              >
                [ CLOSE DOCUMENTATION ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. SQUARE UI POLICY & TERMS MODAL */}
      {/* ========================================================= */}
      {policyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b-2 border-black flex items-center justify-between bg-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#e8622c]" />
                <span className="font-mono font-bold text-xs uppercase tracking-wider">
                  TERMS OF SERVICE & ZERO-COMMISSION POLICIES
                </span>
              </div>
              <button
                onClick={() => setPolicyModalOpen(false)}
                className="p-1 hover:bg-black hover:text-white transition border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
              <div className="space-y-2">
                <h4 className="font-bold text-black text-sm">1. Zero Commission Guarantee</h4>
                <p>
                  ProRank operates strictly as an open discovery network. We never intercept, escrow, or deduct platform percentages (0% marketplace cut) from contracts agreed between clients and talent.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-black text-sm">2. Profile Accuracy & Fraud Protection</h4>
                <p>
                  All members agree to provide authentic portfolio items, accurate framework credentials, and genuine client references. Misleading portfolios or spoofed repositories will result in permanent roster removal.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-black text-sm">3. Transparent $1 Boost Billing</h4>
                <p>
                  The 24-hour sponsored visibility ($1.00) is a single, non-recurring transaction. Instant activation is executed upon payment confirmation and expires automatically after 24 hours.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-black text-sm">4. Privacy & Data Integrity</h4>
                <p>
                  We do not sell personal data. Contact details are only displayed with user permission on their public profile or sent through secure inquiry forms.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t-2 border-black bg-slate-50 flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-500">LAST UPDATED: AUGUST 2026</span>
              <button
                onClick={() => setPolicyModalOpen(false)}
                className="px-4 py-2 bg-black text-white hover:bg-[#e8622c] font-bold font-mono text-xs transition cursor-pointer"
              >
                [ ACCEPT & CLOSE ]
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Navbar;

