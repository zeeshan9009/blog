import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Code,
  Briefcase,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loginWithGoogle } = useAuth();

  // Determine initial mode based on route path
  const isRegisterRoute = location.pathname.includes('register') || location.pathname.includes('signup');
  const [mode, setMode] = useState<'login' | 'register'>(isRegisterRoute ? 'register' : 'login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'developer' | 'client'>('developer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (mode === 'register' && !name) {
      toast.error('Please enter your full name');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          navigate('/');
        }
      } else {
        const success = await register(email, password, name);
        if (success) {
          navigate('/');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword('demo123456');
    if (mode === 'register') {
      setName(demoName);
    }
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col">
      
      {/* ========================================================= */}
      {/* 1. COMPACT TOP HEADER */}
      {/* ========================================================= */}
      <header className="h-14 shrink-0 border-b-2 border-black bg-white px-4 sm:px-8 flex items-center justify-between z-10 shadow-xs">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 p-1 px-2.5 bg-white hover:bg-slate-100 border border-black font-mono text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[ RETURN HOME ]</span>
        </button>

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-black flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-xs">
            <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-[#e8622c] ml-0.5" />
          </div>
          <span className="text-lg font-black tracking-tight text-black">
            ProRank<span className="text-[#e8622c]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#e8622c]" />
          <span className="hidden sm:inline">256-BIT ENCRYPTED</span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. FULL VIEWPORT SPLIT CONTENT (ZERO SCROLLBAR) */}
      {/* ========================================================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: BRAND & PLATFORM PERKS (HIDDEN ON MOBILE) */}
        <div className="hidden lg:flex lg:col-span-5 bg-black text-white p-8 xl:p-12 flex-col justify-between border-r-2 border-black relative overflow-hidden">
          
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Top Pill */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#e8622c] border border-white/20 text-xs font-mono font-bold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>THE FAIR BUILDER ECOSYSTEM</span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
              Direct Client Inquiries With <span className="text-[#e8622c]">0% Marketplace Fee.</span>
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              Showcase your skills with deterministic 0-100 ProRank scores, boost visibility for $1/24h, and get hired directly with zero platform cuts.
            </p>
          </div>

          {/* Middle Badges List */}
          <div className="relative z-10 space-y-3.5 my-4">
            <div className="p-3 bg-white/5 border border-white/15 flex items-center gap-3">
              <div className="p-2 bg-[#e8622c] text-white shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase font-mono">$1 / 24-Hour Sponsored Boost</div>
                <div className="text-[11px] text-slate-400">Fair rotation algorithm prevents monopoly exposure</div>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/15 flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase font-mono">0% Commission Model</div>
                <div className="text-[11px] text-slate-400">Clients deal and pay talent directly with no middleman</div>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/15 flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white shrink-0">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase font-mono">Deterministic Pro Score</div>
                <div className="text-[11px] text-slate-400">Transparent mathematical score based on skills & portfolio</div>
              </div>
            </div>
          </div>

          {/* Bottom Terminal Notice */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>STATUS: SYSTEM OPERATIONAL</span>
            <span className="text-emerald-400 font-bold">● V2.4 PRO ENGINE</span>
          </div>

        </div>

        {/* RIGHT COLUMN: FITTED AUTH FORM (NO SCROLLBAR) */}
        <div className="lg:col-span-7 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#fafafa] overflow-hidden">
          
          <div className="w-full max-w-[440px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            
            {/* Header Tabs */}
            <div className="grid grid-cols-2 border-b-2 border-black bg-slate-100">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2.5 text-xs font-mono font-bold transition border-r border-black cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-black border-b-2 border-b-[#e8622c]'
                    : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200'
                }`}
              >
                [ SIGN IN ]
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-2.5 text-xs font-mono font-bold transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-black border-b-2 border-b-[#e8622c]'
                    : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200'
                }`}
              >
                [ CREATE ACCOUNT ]
              </button>
            </div>

            {/* Form Container */}
            <div className="p-5 sm:p-6 space-y-3.5">
              
              {/* Google Fast Auth */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-2 px-3 bg-white hover:bg-slate-50 border-2 border-black text-xs font-bold text-black transition flex items-center justify-center gap-2.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider relative">
                  OR EMAIL
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Name (Register Mode Only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black mb-1 font-mono">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ali Raza"
                        required
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border-2 border-black text-xs font-medium text-black focus:bg-white focus:outline-hidden focus:border-[#e8622c]"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-black mb-1 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      required
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border-2 border-black text-xs font-medium text-black focus:bg-white focus:outline-hidden focus:border-[#e8622c]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-black font-mono">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => toast('Password reset link will be sent to your email.', { icon: '📧' })}
                        className="text-[10px] text-[#e8622c] hover:underline font-mono font-semibold cursor-pointer"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-8 pr-9 py-1.5 bg-slate-50 border-2 border-black text-xs font-medium text-black focus:bg-white focus:outline-hidden focus:border-[#e8622c]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-black cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Account Role Selector (Register Mode Only) */}
                {mode === 'register' && (
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('developer')}
                        className={`p-1.5 border-2 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-mono ${
                          role === 'developer'
                            ? 'border-black bg-black text-white'
                            : 'border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <Code className="w-3 h-3 text-[#e8622c]" />
                        <span>Offer Services</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('client')}
                        className={`p-1.5 border-2 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer font-mono ${
                          role === 'client'
                            ? 'border-black bg-black text-white'
                            : 'border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <Briefcase className="w-3 h-3 text-[#e8622c]" />
                        <span>Hire Talent</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-1 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  {isLoading ? (
                    <span>AUTHENTICATING...</span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? '[ SIGN IN ]' : '[ CREATE ACCOUNT ]'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

              </form>

              {/* Quick 1-Click Demo Profiles */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                    1-CLICK DEMO LOGIN:
                  </span>
                  <Sparkles className="w-3 h-3 text-[#e8622c]" />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('ali.raza@example.com', 'Ali Raza')}
                    className="p-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-300 hover:border-black transition text-left cursor-pointer"
                  >
                    <div className="font-bold text-[10px] text-black">Ali Raza</div>
                    <div className="text-[9px] font-mono text-slate-500">Developer</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoAccount('sarah.design@example.com', 'Sarah Jenkins')}
                    className="p-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-300 hover:border-black transition text-left cursor-pointer"
                  >
                    <div className="font-bold text-[10px] text-black">Sarah Jenkins</div>
                    <div className="text-[10px] font-mono text-slate-500">UI/UX Lead</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Card Footer Switcher */}
            <div className="py-2.5 px-4 bg-slate-50 border-t-2 border-black text-center text-[11px] font-medium text-slate-600">
              {mode === 'login' ? (
                <span>
                  No account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-bold text-black hover:text-[#e8622c] underline cursor-pointer"
                  >
                    Create one here
                  </button>
                </span>
              ) : (
                <span>
                  Have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-black hover:text-[#e8622c] underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. COMPACT BOTTOM STATUS BAR */}
      {/* ========================================================= */}
      <footer className="h-9 shrink-0 border-t-2 border-black bg-white px-4 sm:px-8 flex items-center justify-between text-[10px] font-mono text-slate-500 z-10">
        <span>© 2026 PRORANK • DIRECT TALENT DISCOVERY</span>
        <div className="flex items-center gap-3 text-slate-600">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>•</span>
          <Link to="/developers" className="hover:text-[#e8622c]">Talent Directory</Link>
        </div>
      </footer>

    </div>
  );
};

export default AuthPage;
