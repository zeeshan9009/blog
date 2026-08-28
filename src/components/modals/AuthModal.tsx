import React, { useState } from 'react';
import { Mail, Lock, User2, Eye, EyeOff, X } from 'lucide-react';
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
      const userName = name.trim() || email.split('@')[0] || 'RankLancr Creator';
      const newUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        email: email || 'creator@ranklancr.lol',
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
      toast.success(isLogin ? `Welcome back, ${userName}!` : `Account created! Welcome to RankLancr.`);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-[#E5E5E5] w-full max-w-md overflow-hidden animate-fadeIn shadow-lg">
        
        {/* Top Header */}
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FAFAF9]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#FF5A1F]" />
            <span className="font-semibold text-xs text-[#1A1A1A]">
              RankLancr Authentication
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#E5E5E5] transition-colors cursor-pointer text-[#737373] hover:text-[#1A1A1A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-7">
          {/* Title & Subtitle */}
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
              {isLogin ? 'Sign into your account' : 'Create creator account'}
            </h2>
            <p className="text-xs text-[#525252] mt-1 font-normal">
              {isLogin
                ? 'Access your challenge entries and Top Developer Rail positions'
                : 'Join skill challenges, contest the rail, and earn verified visibility'}
            </p>
          </div>

          {/* Square UI Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 mb-5 p-1 bg-[#FAFAF9] border border-[#E5E5E5]">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-2 text-xs font-semibold transition-colors cursor-pointer ${
                isLogin
                  ? 'bg-white text-[#1A1A1A] shadow-xs'
                  : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-2 text-xs font-semibold transition-colors cursor-pointer ${
                !isLogin
                  ? 'bg-white text-[#1A1A1A] shadow-xs'
                  : 'text-[#737373] hover:text-[#1A1A1A]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="w-full py-2.5 px-4 bg-white border border-[#E5E5E5] hover:bg-[#FAFAF9] text-[#1A1A1A] flex items-center justify-center gap-2.5 text-xs font-semibold transition-colors cursor-pointer mb-4"
          >
            <GoogleIcon className="w-4 h-4 shrink-0" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-[#E5E5E5] w-full" />
            <span className="bg-white px-2 text-[10px] text-[#737373] uppercase tracking-wider relative font-semibold">
              OR EMAIL
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#1A1A1A] focus:bg-white focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#1A1A1A] focus:bg-white focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-[#FAFAF9] border border-[#E5E5E5] text-xs text-[#1A1A1A] focus:bg-white focus:outline-hidden focus:border-[#FF5A1F] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#1A1A1A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E54E17] text-white text-xs font-semibold transition-colors cursor-pointer border border-[#FF5A1F] mt-2"
            >
              {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
