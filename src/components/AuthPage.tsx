import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Search, 
  Globe, 
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Phone,
  Briefcase,
  MapPin,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { ProcessingPage } from './ProcessingPage';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup' | 'processing';
  onClose?: () => void;
  onCompleteToDashboard?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  initialMode = 'signin',
  onClose,
  onCompleteToDashboard 
}) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode === 'processing' ? 'signup' : initialMode);
  const [isProcessing, setIsProcessing] = useState<boolean>(initialMode === 'processing');
  const [signupStep, setSignupStep] = useState<number>(1);
  const totalSteps = 3;

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessType, setBusinessType] = useState('Luxury & Fine Jewelry');
  const [country, setCountry] = useState('Pakistan');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Business Types
  const businessTypes = [
    'Luxury & Fine Jewelry',
    'Fashion, Apparel & Luxury Goods',
    'Electronics & Smart Devices',
    'Watches & Horology',
    'Art & Collectibles',
    'Pharmaceuticals & Healthcare',
    'Automotive & Industrial Parts',
    'Wine & Spirits',
    'Other Enterprise'
  ];

  // Countries
  const countries = [
    'Pakistan',
    'United Arab Emirates',
    'United States',
    'United Kingdom',
    'Saudi Arabia',
    'Germany',
    'Canada',
    'Australia',
    'Singapore',
    'Switzerland',
    'France',
    'Italy',
    'Other / International'
  ];

  // Handle Step Advancement in Signup
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (signupStep === 1) {
      if (!companyName.trim()) {
        setErrorMessage('Please enter your company / organization name.');
        return;
      }
      if (!businessEmail.trim() || !businessEmail.includes('@') || !businessEmail.includes('.')) {
        setErrorMessage('Please enter a valid business email address.');
        return;
      }
      setSignupStep(2);
    } else if (signupStep === 2) {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!businessType) {
        setErrorMessage('Please select your primary industry vertical.');
        return;
      }
      setSignupStep(3);
    } else if (signupStep === 3) {
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your entries.');
        return;
      }
      handleFinalSignUp();
    }
  };

  // Final Signup Handler with Supabase
  const handleFinalSignUp = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await signUp({
        companyName,
        businessEmail,
        fullName,
        phoneNumber,
        businessType,
        country,
        password
      });

      setIsSubmitting(false);

      if (res.error) {
        setErrorMessage(res.error.message || 'Failed to create your account. Please check your credentials.');
        return;
      }

      // Show processing verification page
      setIsProcessing(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An unexpected error occurred during signup.');
    }
  };

  // Sign In Handler with Supabase
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!businessEmail.trim() || !businessEmail.includes('@')) {
      setErrorMessage('Please enter a valid business email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signIn(businessEmail, password);
      setIsSubmitting(false);

      if (res.error) {
        setErrorMessage(res.error.message || 'Invalid email or password. Please try again.');
        return;
      }

      setSuccessMessage('Authentication successful! Opening dashboard...');
      
      setTimeout(() => {
        if (onCompleteToDashboard) {
          onCompleteToDashboard();
        } else {
          window.location.hash = '#dashboard';
        }
      }, 500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An error occurred during authentication.');
    }
  };

  const featureItems = [
    {
      icon: ShieldCheck,
      title: 'Authenticity',
      subtitle: 'Verification'
    },
    {
      icon: Award,
      title: 'Warranty',
      subtitle: 'Management'
    },
    {
      icon: Search,
      title: 'Ownership',
      subtitle: 'Tracking'
    },
    {
      icon: Globe,
      title: 'Global',
      subtitle: 'Access'
    }
  ];

  if (isProcessing) {
    return (
      <ProcessingPage 
        onClose={onClose} 
        onComplete={onCompleteToDashboard || onClose} 
      />
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden bg-white text-neutral-900 flex flex-col justify-between font-sans selection:bg-[#155EEF] selection:text-white">
      
      {/* ========================================================= */}
      {/* TOP HEADER / NAVBAR (Compact) */}
      {/* ========================================================= */}
      <header className="w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={onClose}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 bg-[#155EEF] rounded-none flex items-center justify-center text-white shadow-xs group-hover:bg-[#124bbf] transition-colors">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-none border-r-transparent border-b-transparent rotate-45" />
            </div>
            <div className="flex items-center">
              <span className="text-lg sm:text-xl font-black tracking-tight text-neutral-950 font-sans">
                VeriPass
              </span>
              <span className="text-[10px] ml-0.5 font-normal text-neutral-400">®</span>
            </div>
          </div>

          {/* Right Action / Switch Mode */}
          <div className="flex items-center gap-4 text-xs sm:text-sm">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-950 font-medium px-3 py-1.5 rounded-none border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            )}

            <div className="text-neutral-600 text-xs sm:text-sm">
              {mode === 'signin' ? (
                <>
                  <span>Don't have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setSignupStep(1);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[#155EEF] hover:text-[#104ec4] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  <span>Already have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[#155EEF] hover:text-[#104ec4] font-bold hover:underline ml-1 cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN TWO-COLUMN BODY */}
      {/* ========================================================= */}
      <main className="flex-1 flex items-center max-w-[1480px] w-full mx-auto px-6 sm:px-10 lg:px-12 py-3 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: Brand Value & Features */}
          {/* ======================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center h-full space-y-6 lg:space-y-8 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-neutral-200 pb-6 lg:pb-0">
            
            {/* Typography Content */}
            <div className="text-left">
              <div className="font-mono text-[10.5px] uppercase tracking-widest text-slate-400 font-semibold mb-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#155EEF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#155EEF]" />
                </span>
                <span>PRODUCT IDENTITY INFRASTRUCTURE</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-black tracking-tight text-neutral-950 uppercase leading-[1.1] mb-2.5 font-sans">
                <span className="block text-neutral-950">
                  EVERY PRODUCT DESERVES
                </span>
                <span className="block text-[#155EEF] relative inline-block group">
                  <span className="bg-gradient-to-r from-[#155EEF] via-[#0284C7] to-[#2563EB] bg-clip-text text-transparent">
                    A DIGITAL IDENTITY.
                  </span>
                  <span className="absolute -bottom-1 left-0 w-24 sm:w-28 h-[2.5px] bg-gradient-to-r from-[#155EEF] to-transparent animate-pulse" />
                </span>
              </h1>

              <p className="text-xs sm:text-[13px] text-neutral-600 font-normal leading-relaxed max-w-sm">
                Secure. Verifiable. Permanent. Give your products a digital passport with VeriPass cloud identity network.
              </p>
            </div>

            {/* 4 Feature Items with Round Icons */}
            <div className="grid grid-cols-4 divide-x divide-neutral-200 pt-3 border-t border-neutral-100">
              {featureItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center px-1 first:pl-0 last:pr-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-neutral-700 mb-1.5 transition-transform hover:scale-105">
                      <IconComponent className="w-3.5 h-3.5 text-neutral-800 stroke-[1.8]" />
                    </div>
                    <span className="text-[10px] sm:text-[10.5px] font-bold text-neutral-900 leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[8.5px] sm:text-[9.5px] text-neutral-500 leading-tight">
                      {item.subtitle}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: Authentication Form (Step-By-Step Wizard) */}
          {/* ======================================================= */}
          <div className="lg:col-span-6 max-w-[420px] w-full mx-auto flex flex-col justify-center">
            
            {/* ----------------- SIGN UP MODE ----------------- */}
            {mode === 'signup' && (
              <div>
                {/* Step Progress Header */}
                <div className="mb-4 text-left">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
                    <span className="font-semibold uppercase tracking-wider text-[#155EEF]">
                      STEP {signupStep} OF {totalSteps}
                    </span>
                    <span className="text-[10.5px] text-slate-400">
                      {signupStep === 1 && 'Company Profile'}
                      {signupStep === 2 && 'Personal & Business Type'}
                      {signupStep === 3 && 'Security & Password'}
                    </span>
                  </div>

                  {/* Visual Progress Line */}
                  <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#155EEF] transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${(signupStep / totalSteps) * 100}%` }}
                    />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 font-sans mt-3">
                    {signupStep === 1 && 'Let’s start with your company'}
                    {signupStep === 2 && 'Tell us about your business'}
                    {signupStep === 3 && 'Secure your VeriPass account'}
                  </h2>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5 leading-normal">
                    {signupStep === 1 && 'Enter your organization name and official business email.'}
                    {signupStep === 2 && 'Provide contact information and your industry vertical.'}
                    {signupStep === 3 && 'Create a master password for your identity dashboard.'}
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-none flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Sign Up Form Steps */}
                <form onSubmit={handleNextStep} className="space-y-3.5 text-left">
                  
                  {/* STEP 1: Company Profile */}
                  {signupStep === 1 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">
                          Company Name *
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Albadar Jewellers, Chronos Watch"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">
                          Business Email *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="email"
                            required
                            placeholder="name@company.com"
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Personal Info & Industry Vertical */}
                  {signupStep === 2 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Ahmed Khan"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-neutral-900 mb-1">
                            Business Type *
                          </label>
                          <div className="relative">
                            <select
                              value={businessType}
                              onChange={(e) => setBusinessType(e.target.value)}
                              className="w-full pl-2.5 pr-7 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none bg-white appearance-none cursor-pointer"
                            >
                              {businessTypes.map((type, idx) => (
                                <option key={idx} value={type}>{type}</option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-900 mb-1">
                            Country *
                          </label>
                          <div className="relative">
                            <select
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full pl-2.5 pr-7 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none bg-white appearance-none cursor-pointer"
                            >
                              {countries.map((c, idx) => (
                                <option key={idx} value={c}>{c}</option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">
                          Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="tel"
                            placeholder="+92 300 1234567"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Password & Security */}
                  {signupStep === 3 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-9 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            placeholder="Re-type password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-9 pr-9 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-neutral-500 leading-tight">
                        By registering, you agree to VeriPass Terms of Service and Cryptographic Data Security Protocol.
                      </div>
                    </div>
                  )}

                  {/* Buttons Navigation */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    {signupStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSignupStep(signupStep - 1);
                          setErrorMessage('');
                        }}
                        className="px-3.5 py-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 px-4 bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Creating Identity Node...</span>
                        </>
                      ) : signupStep === 3 ? (
                        <>
                          <span>Complete & Create Account</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Continue to Step {signupStep + 1}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* ----------------- SIGN IN MODE ----------------- */}
            {mode === 'signin' && (
              <div>
                <div className="mb-4 text-left">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 font-sans">
                    Sign in to VeriPass
                  </h2>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5">
                    Enter your authorized business credentials to access your passport network.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-none flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-none flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSignInSubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-xs font-bold text-neutral-900 mb-1">
                      Business Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-900">
                        Password
                      </label>
                      <a href="#signin" className="text-[11px] text-[#155EEF] hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 text-xs border border-neutral-300 focus:border-[#155EEF] focus:outline-none rounded-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-70 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Authenticating Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* ========================================================= */}
      {/* PROFESSIONAL FOOTER */}
      {/* ========================================================= */}
      <footer className="w-full border-t border-neutral-100 py-3 px-6 text-center text-[11px] text-neutral-400 shrink-0">
        © 2026 VeriPass Technologies Inc. All rights reserved. • ISO 27001 & SOC2 Type II Certified
      </footer>

    </div>
  );
};
