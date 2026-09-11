import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandTicker } from './components/BrandTicker';
import { AlternatingFeatures } from './components/AlternatingFeatures';
import { SecuritySection } from './components/SecuritySection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { PricingPage } from './components/PricingPage';
import { PublicPassportPage } from './components/PublicPassportPage';
import { NotchNavbar } from './components/ui/notch-navbar';

function MainApp() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'processing' | 'dashboard' | 'pricing' | 'passport' | null>(null);
  const [currentPassportId, setCurrentPassportId] = useState<string>('VP-2026-8F4K29');
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // Public Passport Routing: #p/ID, #verify/ID, #passport/ID
      if (hash.startsWith('#p/') || hash.startsWith('#verify/') || hash.startsWith('#passport/')) {
        const parts = hash.split('/');
        const id = parts[1] || 'VP-2026-8F4K29';
        setCurrentPassportId(id);
        setAuthMode('passport');
        return;
      }

      if (hash === '#login' || hash === '#signin') {
        if (user) {
          window.location.hash = '#dashboard';
          setAuthMode('dashboard');
        } else {
          setAuthMode('signin');
        }
      } else if (hash === '#signup' || hash === '#get-started' || hash === '#start-building' || hash === '#create') {
        if (user) {
          window.location.hash = '#dashboard';
          setAuthMode('dashboard');
        } else {
          setAuthMode('signup');
        }
      } else if (hash === '#processing') {
        setAuthMode('processing');
      } else if (hash === '#verify') {
        setCurrentPassportId('VP-2026-8F4K29');
        setAuthMode('passport');
      } else if (hash === '#dashboard' || hash === '#app') {
        setAuthMode('dashboard');
      } else if (hash === '#pricing' || hash === '#plans') {
        setAuthMode('pricing');
      } else {
        setAuthMode(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'dashboard') => {
    if (mode === 'dashboard' || (user && (mode === 'signin' || mode === 'signup'))) {
      window.location.hash = '#dashboard';
      setAuthMode('dashboard');
      return;
    }
    if (mode === 'signin') {
      window.location.hash = '#login';
      setAuthMode('signin');
    } else if (mode === 'signup') {
      window.location.hash = '#signup';
      setAuthMode('signup');
    }
  };

  const handleOpenPricing = () => {
    window.location.hash = '#pricing';
    setAuthMode('pricing');
  };

  const handleCloseAuth = () => {
    window.location.hash = '';
    setAuthMode(null);
  };

  if (authMode === 'passport') {
    return (
      <PublicPassportPage
        productId={currentPassportId}
        onBackToHome={handleCloseAuth}
      />
    );
  }

  if (authMode === 'dashboard') {
    return <DashboardPage onBackToHome={handleCloseAuth} onOpenPublicPassport={(id) => {
      window.location.hash = `#p/${id}`;
      setCurrentPassportId(id);
      setAuthMode('passport');
    }} />;
  }

  if (authMode === 'pricing') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#155EEF] selection:text-white flex flex-col font-sans">
        <NotchNavbar onOpenAuth={handleOpenAuth} onOpenPricing={handleOpenPricing} user={user} />
        <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-8 pt-20 sm:pt-24 py-8 sm:py-12">
          <PricingPage
            onBack={handleCloseAuth}
            backButtonText="Back to Home"
            currentPlanId="business"
            onSelectPlan={(planId) => {
              if (user) {
                window.location.hash = '#dashboard';
                setAuthMode('dashboard');
              } else {
                window.location.hash = '#signup';
                setAuthMode('signup');
              }
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (authMode) {
    return (
      <AuthPage
        initialMode={authMode as 'signin' | 'signup' | 'processing'}
        onClose={handleCloseAuth}
        onCompleteToDashboard={() => {
          window.location.hash = '#dashboard';
          setAuthMode('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-neutral-900 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* Floating Fillout-style Header */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar onOpenAuth={handleOpenAuth} onOpenPricing={handleOpenPricing} />
      </div>

      {/* Landing Page Content */}
      <main className="flex-1 w-full flex flex-col">
        {/* 1. Hero with Anime Sky Background & Map Image */}
        <Hero onOpenAuth={handleOpenAuth} />

        {/* 2. Enterprise Brand Logo Ticker */}
        <BrandTicker />

        {/* 3. Alternating 6 Story Feature Cards */}
        <AlternatingFeatures />

        {/* 4. Enterprise Ready Certified & Secure Dark Container */}
        <SecuritySection />

        {/* 5. Pre-Footer "Ready to get started?" Action Box */}
        <CtaBanner onOpenAuth={handleOpenAuth} />

        {/* 6. Footer (Logo SVG + Horizontal Links + Giant VERIPASS Text) */}
        <Footer />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
