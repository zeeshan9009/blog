import React, { useState } from 'react';
import { Mail, Lock, Loader2, User2, Eye, EyeOff, Sparkles, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/talent';
import toast from 'react-hot-toast';

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
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
  );
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login'
}) => {
  const { signInWithGoogle, setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch {
      toast.error('Google sign-in error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const userName = name.trim() || email.split('@')[0] || 'Pro Talent';
      const newUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        email: email || 'talent@prorank.dev',
        name: userName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
        plan: 'PRO' as const,
        roles: ['buyer', 'provider'] as UserRole[],
        user_metadata: {
          full_name: userName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
          roles: ['buyer', 'provider'] as UserRole[],
        }
      };

      setUser(newUser);
      setLoading(false);
      toast.success(isLogin ? `Welcome back, ${userName}!` : `Account created! Welcome to ProRank.`);
      onClose();
    }, 450);
  };

  const handleQuickDemo = (role: string, demoEmail: string) => {
    setName(role);
    setEmail(demoEmail);
    setPassword('prorank-pass-123');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg overflow-hidden animate-fadeIn rounded-none">
        
        {/* Top Header */}
        <div className="p-4 border-b-2 border-black flex items-center justify-between bg-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#e8622c]" />
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-black">
              PRO-RANK AUTHENTICATION GATEWAY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white transition border border-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Title & Subtitle */}
          <div className="mb-5">
            <h2 className="text-2xl font-black text-black tracking-tight">
              {isLogin ? 'Sign into your account' : 'Create talent profile'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isLogin
                ? 'Access your verified developer & designer credentials'
                : 'Join 4,800+ pre-vetted engineers with 0% commission'}
            </p>
          </div>

          {/* Square UI Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-slate-100 border border-slate-300">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-2 text-xs font-bold transition-all cursor-pointer font-mono ${
                isLogin
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              [ SIGN IN ]
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-2 text-xs font-bold transition-all cursor-pointer font-mono ${
                !isLogin
                  ? 'bg-[#e8622c] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              [ REGISTER ]
            </button>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="w-full py-2.5 px-4 bg-white border-2 border-black hover:bg-orange-50 text-black flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] mb-5"
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-slate-300 w-full" />
            <span className="bg-white px-3 text-[10px] font-mono text-slate-500 uppercase">
              OR ENTER EMAIL
            </span>
            <div className="border-t border-slate-300 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                  Full Name <span className="text-[#e8622c]">*</span>
                </label>
                <div className="relative">
                  <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-300 focus:border-black focus:bg-white text-xs font-medium text-black placeholder:text-slate-400 outline-hidden transition-colors rounded-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                Email Address <span className="text-[#e8622c]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@prorank.dev"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border-2 border-slate-300 focus:border-black focus:bg-white text-xs font-medium text-black placeholder:text-slate-400 outline-hidden transition-colors rounded-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">
                Password <span className="text-[#e8622c]">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border-2 border-slate-300 focus:border-black focus:bg-white text-xs font-medium text-black placeholder:text-slate-400 outline-hidden transition-colors rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-[#e8622c] text-white font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-[3px_3px_0px_0px_#e8622c] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{isLogin ? 'Authenticate & Enter' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e8622c]" />
              <span>Instant Demo Accounts:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('David Chen (Full-Stack)', 'david.chen@example.com')}
                className="px-2 py-1 text-[10px] font-mono bg-slate-100 hover:bg-orange-100 hover:text-orange-900 border border-slate-300 text-slate-700 transition cursor-pointer"
              >
                ⚡ Full-Stack Dev
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Elena Rostova (UI/UX)', 'elena.design@example.com')}
                className="px-2 py-1 text-[10px] font-mono bg-slate-100 hover:bg-orange-100 hover:text-orange-900 border border-slate-300 text-slate-700 transition cursor-pointer"
              >
                🎨 UI Designer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Acme Hiring (Client)', 'hiring@acmecorp.com')}
                className="px-2 py-1 text-[10px] font-mono bg-slate-100 hover:bg-orange-100 hover:text-orange-900 border border-slate-300 text-slate-700 transition cursor-pointer"
              >
                💼 Client Recruiter
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
