import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OneUrl } from './components/OneUrl';
import { HowItWorks } from './components/HowItWorks';
import { LifetimeData } from './components/LifetimeData';
import { GlobalReach } from './components/GlobalReach';
import { DevInfrastructure } from './components/DevInfrastructure';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { PricingPage } from './components/PricingPage';

function MainApp() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'processing' | 'dashboard' | 'pricing' | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
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
      } else if (hash === '#processing' || hash === '#verify') {
        setAuthMode('processing');
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

  if (authMode === 'dashboard') {
    return <DashboardPage onBackToHome={handleCloseAuth} />;
  }

  if (authMode === 'pricing') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#155EEF] selection:text-white flex flex-col font-sans">
        <Navbar onOpenAuth={handleOpenAuth} onOpenPricing={handleOpenPricing} />
        <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
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
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* 1. Header / Navbar */}
      <Navbar onOpenAuth={handleOpenAuth} onOpenPricing={handleOpenPricing} />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. One URL Section */}
      <OneUrl />

      {/* 4. How It Works Section */}
      <HowItWorks />

      {/* 5. One Product. A Lifetime of Data Section */}
      <LifetimeData />

      {/* 6. Global Reach Section */}
      <GlobalReach />

      {/* 7. Developer / Infrastructure Section */}
      <DevInfrastructure />

      {/* 8. Call To Action & Brand Banner */}
      <CtaBanner />

      {/* 9. Bottom Footer */}
      <Footer />
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
