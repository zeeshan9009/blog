import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  X,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Plus,
  Flame,
  Trophy,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RankLancrLogo } from '../brand/RankLancrLogo';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const goToPage = (path: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);

    if (path.startsWith('/')) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = path.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#e8622c] focus:text-white focus:font-bold focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="h-16 flex items-center justify-between gap-6">
            
            {/* Left: Brand Logo + Nav Links */}
            <div className="flex items-center gap-8 lg:gap-10 shrink-0">
              <button onClick={() => goToPage('/')} className="cursor-pointer text-left focus:outline-hidden">
                <RankLancrLogo isLink={false} size="md" showDomain={true} />
              </button>

              {/* Main Nav Links */}
              <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-800" aria-label="Main Navigation">
                
                {/* Outbid Spotlight */}
                <button
                  onClick={() => {
                    const el = document.getElementById('spotlight');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else goToPage('/#spotlight');
                  }}
                  className="hover:text-[#e8622c] transition py-1.5 px-2 flex items-center gap-1 text-[#e8622c] font-black cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-[#e8622c]" />
                  <span>Spotlight</span>
                </button>

                {/* Challenge Arena */}
                <button
                  onClick={() => goToPage('/arena')}
                  className="hover:text-[#e8622c] transition py-1.5 px-2 flex items-center gap-1 text-amber-800 font-bold cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                  <span>Challenge Arena</span>
                </button>

                {/* Pricing & Fees */}
                <button
                  onClick={() => goToPage('/pricing')}
                  className="hover:text-black transition py-1.5 px-2 cursor-pointer"
                >
                  Pricing
                </button>

                {/* How It Works */}
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-black transition py-1.5 px-2"
                >
                  How It Works
                </a>
              </nav>
            </div>

            {/* Right: Auth & Primary Action */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border-2 border-black text-xs font-bold transition cursor-pointer"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="Avatar"
                        className="w-5 h-5 rounded-full object-cover border border-black"
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    )}
                    <span className="truncate max-w-[120px]">{user.name || user.email?.split('@')[0] || 'My Account'}</span>
                    <ChevronDown className="w-3 h-3 text-slate-600" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 z-50 animate-fadeIn">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-black hover:bg-orange-50 transition"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[#e8622c]" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-black hover:bg-orange-50 transition"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Settings</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition text-left cursor-pointer pt-2 border-t border-slate-100"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-black transition cursor-pointer"
                  >
                    Sign in
                  </button>

                  <button
                    onClick={() => navigate('/create-profile')}
                    className="px-3.5 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer shadow-[2px_2px_0px_0px_#e8622c] flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Become a Professional</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-black bg-white p-4 space-y-3 animate-fadeIn">
            <button
              onClick={() => goToPage('/#spotlight')}
              className="w-full text-left py-2 px-3 font-bold text-xs text-[#e8622c] hover:bg-orange-50 flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Spotlight Leaderboard</span>
            </button>

            <button
              onClick={() => goToPage('/arena')}
              className="w-full text-left py-2 px-3 font-bold text-xs text-amber-800 hover:bg-amber-50 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Challenge Arena</span>
            </button>

            <button
              onClick={() => goToPage('/pricing')}
              className="w-full text-left py-2 px-3 font-bold text-xs text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <span>Pricing & Fees</span>
            </button>

            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 font-bold text-xs text-slate-800 hover:bg-slate-50"
            >
              How It Works
            </a>

            <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-3 bg-slate-100 font-bold text-xs text-black"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-2 px-3 text-left font-bold text-xs text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => goToPage('/login')}
                    className="w-full py-2 px-3 font-bold text-xs text-slate-800 hover:bg-slate-50 text-left"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => goToPage('/create-profile')}
                    className="w-full py-2.5 px-3 bg-[#e8622c] text-white font-mono text-xs font-bold text-center"
                  >
                    + Become a Professional
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
