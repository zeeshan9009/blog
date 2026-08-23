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
  Briefcase
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
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER NAVIGATION */}
      {/* ========================================================= */}
      <header className="border-b-2 border-black bg-white px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 p-1.5 px-3 bg-white hover:bg-slate-100 border-2 border-black font-mono text-xs font-bold transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ RETURN TO HOME ]</span>
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-xs">
              <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-[#e8622c] ml-0.5" />
            </div>
            <span className="text-xl font-black tracking-tight text-black">
              ProRank<span className="text-[#e8622c]">.</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#e8622c]" />
            <span>256-BIT ENCRYPTED AUTH</span>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN AUTHENTICATION CONTAINER */}
      {/* ========================================================= */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 my-8">
        <div className="w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          
          {/* Card Top Title Banner */}
          <div className="bg-black text-white p-6 border-b-2 border-black">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3 h-3 text-[#e8622c]" />
              <span>SQUARE UI MEMBER ACCESS</span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Sign In to Your Account' : 'Create ProRank Account'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {mode === 'login'
                ? 'Access your talent profile, boost analytics, and direct inquiries.'
                : 'Join verified developers and funnel builders with 0% commission.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 border-b-2 border-black bg-slate-100">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-3 text-xs font-mono font-bold transition border-r border-black cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-black shadow-inner border-b-2 border-b-[#e8622c]'
                  : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200'
              }`}
            >
              [ SIGN IN ]
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-3 text-xs font-mono font-bold transition cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-black shadow-inner border-b-2 border-b-[#e8622c]'
                  : 'bg-slate-100 text-slate-600 hover:text-black hover:bg-slate-200'
              }`}
            >
              [ REGISTER ]
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-7 space-y-5">
            
            {/* Google Fast Auth */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border-2 border-black text-xs font-bold text-black transition flex items-center justify-center gap-3 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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
              <div className="border-t border-slate-300 w-full" />
              <span className="bg-white px-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider relative">
                OR WITH EMAIL
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Field (Register Mode) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1 font-mono">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ali Raza"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-black text-xs font-medium text-black focus:bg-white focus:outline-hidden focus:border-[#e8622c]"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1 font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-black text-xs font-medium text-black focus:bg-white focus:outline-hidden focus:border-[#e8622c]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-black font-mono">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => toast('Password reset link will be sent to your email.', { icon: '📧' })}
                      className="text-[11px] text-[#e8622c] hover:underline font-mono font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border-2 border-black text-xs font-medium text-black focus:bg-white focus:outline-hidden focus:border-[#e8622c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Account Role Selector (Register Mode) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5 font-mono">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('developer')}
                      className={`p-2.5 border-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer font-mono ${
                        role === 'developer'
                          ? 'border-black bg-black text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-black'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5 text-[#e8622c]" />
                      <span>Offer Services</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`p-2.5 border-2 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer font-mono ${
                        role === 'client'
                          ? 'border-black bg-black text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-black'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-[#e8622c]" />
                      <span>Hire Talent</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_0px_#e8622c]"
              >
                {isLoading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>{mode === 'login' ? '[ SIGN IN TO DASHBOARD ]' : '[ CREATE ACCOUNT ]'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-500 font-bold uppercase">
                  1-CLICK DEMO ACCOUNTS:
                </span>
                <Sparkles className="w-3 h-3 text-[#e8622c]" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('ali.raza@example.com', 'Ali Raza')}
                  className="p-2 bg-slate-50 hover:bg-orange-50/70 border border-slate-300 hover:border-black transition text-left cursor-pointer"
                >
                  <div className="font-bold text-[11px] text-black">Ali Raza</div>
                  <div className="text-[10px] font-mono text-slate-500">Developer Profile</div>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount('sarah.design@example.com', 'Sarah Jenkins')}
                  className="p-2 bg-slate-50 hover:bg-orange-50/70 border border-slate-300 hover:border-black transition text-left cursor-pointer"
                >
                  <div className="font-bold text-[11px] text-black">Sarah Jenkins</div>
                  <div className="text-[10px] font-mono text-slate-500">UI/UX Designer</div>
                </button>
              </div>
            </div>

          </div>

          {/* Card Footer Switcher */}
          <div className="p-4 bg-slate-50 border-t-2 border-black text-center text-xs font-medium text-slate-600">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-black hover:text-[#e8622c] underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
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
      </main>

      {/* ========================================================= */}
      {/* 3. BOTTOM FOOTER */}
      {/* ========================================================= */}
      <footer className="border-t-2 border-black bg-white px-4 sm:px-8 py-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 PRORANK • ALL RIGHTS RESERVED</span>
          <div className="flex items-center gap-4 text-slate-600">
            <Link to="/" className="hover:text-black">Terms of Service</Link>
            <span>•</span>
            <Link to="/" className="hover:text-black">Privacy Policy</Link>
            <span>•</span>
            <Link to="/developers" className="hover:text-[#e8622c]">Directory</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AuthPage;
