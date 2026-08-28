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
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
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

  return (
    <div className="min-h-screen w-screen bg-[#FAFAF9] text-[#1A1A1A] font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col justify-between">
      
      {/* 1. Header */}
      <header className="h-16 shrink-0 border-b border-[#E5E5E5] bg-white px-4 sm:px-8 flex items-center justify-between z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 py-1.5 px-3 bg-white hover:bg-[#FAFAF9] border border-[#E5E5E5] text-xs font-semibold text-[#1A1A1A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </button>

        <RankLancrLogo size="sm" showDomain={true} />

        <div className="flex items-center gap-2 text-xs font-medium text-[#737373]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
        </div>
      </header>

      {/* 2. Split Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Platform Benefits */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#1E293B] text-white p-8 xl:p-10 flex-col justify-between border border-slate-700/60 relative overflow-hidden">
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-[#FF5A1F] border border-white/20 text-[11px] font-semibold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Skill Challenge Platform</span>
            </div>

            <h2 className="text-2xl xl:text-3xl font-bold text-white tracking-tight leading-tight">
              Pure Merit Arena With <span className="text-[#FF5A1F]">72h Site-Wide Visibility.</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Enter focused 3-day skill prompts for $5, get voted by real developers, and contest the Top Developer Rail in real time.
            </p>
          </div>

          <div className="relative z-10 space-y-3 my-6">
            <div className="p-3.5 bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2 bg-[#FF5A1F] text-white shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">#1 Top Developer Rail</div>
                <div className="text-[11px] text-slate-400 font-normal">Take over the flagship spot when your project gets more votes</div>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">100% Merit-Based Voting</div>
                <div className="text-[11px] text-slate-400 font-normal">Anti-bot fingerprinting ensures every ballot is authentic</div>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="p-2 bg-blue-600 text-white shrink-0">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Zero Platform Cuts</div>
                <div className="text-[11px] text-slate-400 font-normal">Keep 100% of your client deal value with verified accolades</div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>RankLancr • Merit Arena</span>
            <span className="text-emerald-400 font-semibold font-mono">● LIVE V2.4</span>
          </div>

        </div>

        {/* Right Column: Square Auth Form */}
        <div className="lg:col-span-7 flex items-center justify-center">
          
          <div className="w-full max-w-[440px] bg-white border border-[#E5E5E5] flex flex-col justify-between">
            
            {/* Header Tabs */}
            <div className="grid grid-cols-2 border-b border-[#E5E5E5] bg-[#FAFAF9]">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-3 text-xs font-semibold transition-colors cursor-pointer border-r border-[#E5E5E5] ${
                  mode === 'login'
                    ? 'bg-white text-[#1A1A1A] border-b-2 border-b-[#FF5A1F]'
                    : 'bg-[#FAFAF9] text-[#737373] hover:text-[#1A1A1A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-3 text-xs font-semibold transition-colors cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-[#1A1A1A] border-b-2 border-b-[#FF5A1F]'
                    : 'bg-[#FAFAF9] text-[#737373] hover:text-[#1A1A1A]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Container */}
            <div className="p-6 sm:p-8 space-y-4">
              
              {/* Google Fast Auth */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-2.5 px-3 bg-white hover:bg-[#FAFAF9] border border-[#E5E5E5] text-xs font-semibold text-[#1A1A1A] transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
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
                <div className="border-t border-[#E5E5E5] w-full" />
                <span className="bg-white px-2 text-[10px] text-[#737373] uppercase tracking-wider relative font-semibold">
                  OR EMAIL
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Name (Register Mode Only) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full pl-8 pr-3 py-2 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#1A1A1A] focus:bg-white focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      required
                      className="w-full pl-8 pr-3 py-2 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#1A1A1A] focus:bg-white focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-[#1A1A1A]">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => toast('Password reset instructions will be sent to your email.', { icon: '📧' })}
                        className="text-[11px] text-[#FF5A1F] hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-8 pr-9 py-2 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#1A1A1A] focus:bg-white focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-[#737373] hover:text-[#1A1A1A] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-[#FF5A1F] hover:bg-[#E54E17] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-[#FF5A1F] cursor-pointer"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Card Footer Switcher */}
            <div className="py-3 px-4 bg-[#FAFAF9] border-t border-[#E5E5E5] text-center text-xs text-[#525252]">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="font-semibold text-[#1A1A1A] hover:text-[#FF5A1F] underline cursor-pointer"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-semibold text-[#1A1A1A] hover:text-[#FF5A1F] underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 3. Bottom Status Bar */}
      <footer className="h-12 shrink-0 border-t border-[#E5E5E5] bg-white px-4 sm:px-8 flex items-center justify-between text-xs text-[#737373] z-10">
        <span>© 2026 RankLancr • Skill Challenge Arena</span>
        <div className="flex items-center gap-4 text-xs text-[#525252]">
          <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
          <span>•</span>
          <Link to="/arena" className="hover:text-[#FF5A1F] transition-colors">Arena</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-[#1A1A1A] transition-colors">Terms</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy</Link>
        </div>
      </footer>

    </div>
  );
};

export default AuthPage;
