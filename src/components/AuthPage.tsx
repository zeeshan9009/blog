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
  ChevronDown
} from 'lucide-react';
import { ProcessingPage } from './ProcessingPage';

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
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode === 'processing' ? 'signup' : initialMode);
  const [isProcessing, setIsProcessing] = useState<boolean>(initialMode === 'processing');
  const [signupStep, setSignupStep] = useState<number>(1);
  const totalSteps = 3;

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (signupStep === 1) {
      if (!companyName.trim()) {
        setErrorMessage('Please enter your company name.');
        return;
      }
      if (!businessEmail.trim() || !businessEmail.includes('@')) {
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
        setErrorMessage('Please select your business type.');
        return;
      }
      setSignupStep(3);
    } else if (signupStep === 3) {
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsProcessing(true);
    }, 800);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsProcessing(true);
    }, 800);
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
      {/* MAIN TWO-COLUMN BODY (Viewport-Fitted) */}
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
                Secure. Verifiable. Permanent. Give your products a digital passport with VeriPass.
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
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Multi-Step Form */}
                <form onSubmit={handleNextStep} className="space-y-3 text-left">
                  
                  {/* ===== STEP 1: Company Name & Business Email ===== */}
                  {signupStep === 1 && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      {/* Company Name */}
                      <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-neutral-700 mb-1">
                          Company name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            required
                            autoFocus
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter your company name"
                            className="w-full pl-9 pr-3 py-2 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors outline-none"
                          />
                        </div>
                      </div>

                      {/* Business Email */}
                      <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-neutral-700 mb-1">
                          Business email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="email"
                            required
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full pl-9 pr-3 py-2 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== STEP 2: Full Name, Phone, Business Type & Country ===== */}
                  {signupStep === 2 && (
                    <div className="space-y-2.5 animate-in fade-in duration-200">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Full name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            required
                            autoFocus
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full pl-9 pr-3 py-1.5 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors outline-none"
                          />
                        </div>
                      </div>

                      {/* Phone Number (Optional) */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Phone number <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+92 300 1234567"
                            className="w-full pl-9 pr-3 py-1.5 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors outline-none"
                          />
                        </div>
                      </div>

                      {/* Business Type */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Business type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <Briefcase className="w-3.5 h-3.5" />
                          </div>
                          <select
                            required
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            className="w-full pl-9 pr-8 py-1.5 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 bg-white transition-colors outline-none appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select business type</option>
                            {businessTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Country / Region */}
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                          Country / Region <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <select
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full pl-9 pr-8 py-1.5 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 bg-white transition-colors outline-none appearance-none cursor-pointer"
                          >
                            {countries.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== STEP 3: Password & Confirm Password ===== */}
                  {signupStep === 3 && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      {/* Password */}
                      <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-neutral-700 mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full pl-9 pr-8 py-2 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-[11px] sm:text-xs font-semibold text-neutral-700 mb-1">
                          Confirm password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="w-full pl-9 pr-8 py-2 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Action Buttons */}
                  <div className="flex items-center gap-2.5 pt-2">
                    {signupStep > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSignupStep(signupStep - 1);
                          setErrorMessage('');
                        }}
                        className="w-1/3 py-2 px-3 rounded-none border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        ← Back
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitted}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-none bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-xs cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : signupStep < totalSteps ? (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Complete Sign Up</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

                {/* Security Badge */}
                <div className="mt-4 flex items-center gap-2 text-slate-500 text-[11px] text-left bg-slate-50 border border-slate-200/80 p-2 rounded-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>
                    Your business information is encrypted with bank-grade 256-bit AES security.
                  </span>
                </div>
              </div>
            )}

            {/* ----------------- SIGN IN MODE ----------------- */}
            {mode === 'signin' && (
              <div>
                <div className="text-left mb-4">
                  <div className="font-mono text-[10.5px] uppercase tracking-wider text-[#155EEF] font-bold mb-1">
                    WELCOME BACK
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 font-sans">
                    Sign in to your account
                  </h2>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5 leading-normal">
                    Access your dashboard and manage your products, QR codes and digital passports.
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-3 text-left">
                  {/* Email address */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold text-neutral-700 mb-1">
                      Business email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full pl-9 pr-3 py-2 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] sm:text-xs font-semibold text-neutral-700">
                        Password
                      </label>
                      <a
                        href="#forgot-password"
                        onClick={(e) => {
                          e.preventDefault();
                          alert('Password reset link sent to your email.');
                        }}
                        className="text-[11px] font-semibold text-[#155EEF] hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-8 py-2 rounded-none border border-neutral-300 focus:border-[#155EEF] focus:ring-1 focus:ring-[#155EEF] text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 bg-white transition-colors outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isSubmitted}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-none bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-xs cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-neutral-400 font-mono text-[10px]">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social Logins */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => alert('Google sign-in demo')}
                    className="w-full flex items-center justify-center gap-2.5 py-2 px-3 rounded-none border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 text-neutral-800 text-xs font-semibold transition-all duration-150 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('Apple sign-in demo')}
                    className="w-full flex items-center justify-center gap-2.5 py-2 px-3 rounded-none border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 text-neutral-800 text-xs font-semibold transition-all duration-150 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-neutral-900" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.58-7.79-11.67-14.25-6.53-10.22-11.51-21.57-14.94-34.04-3.43-12.48-5.14-23.75-5.14-33.82 0-14.68 3.91-26.65 11.73-35.91 7.82-9.26 17.51-13.98 29.07-14.16 5.43 0 11.22 1.35 17.37 4.05 6.15 2.7 10.02 4.1 11.61 4.19 1.31 0 5.43-1.54 12.37-4.63 6.94-3.09 13.06-4.43 18.37-4.04 13.69.87 24.3 5.49 31.83 13.86-12.28 7.4-18.33 17.4-18.15 30 0 10.66 4.12 19.64 12.37 26.93 4.12 3.69 8.78 6.43 13.99 8.22-2.73 7.83-5.99 15.42-9.79 22.78zM119.22 31.86c0-7.39 2.66-14.38 7.98-20.97 5.32-6.59 12-10.45 20.04-11.59.33 1.2.49 2.29.49 3.28 0 7.39-2.78 14.47-8.34 21.24-5.56 6.77-12.29 10.6-20.17 11.49v-3.45z" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                </div>

                {/* Enterprise Security Trust Badge */}
                <div className="mt-4 flex items-center gap-2 text-slate-500 text-[11px] text-left bg-slate-50 border border-slate-200/80 p-2 rounded-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>
                    Your data is protected with enterprise-grade security and encryption.
                  </span>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Subtle Bottom Footer Info */}
      <footer className="w-full border-t border-neutral-100 py-2.5 px-6 text-center text-[11px] text-neutral-400 shrink-0">
        © 2026 VeriPass Technologies Inc. All rights reserved.
      </footer>

    </div>
  );
};
