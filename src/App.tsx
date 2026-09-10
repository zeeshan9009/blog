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

function MainApp() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'processing' | 'dashboard' | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#login' || hash === '#signin') {
        setAuthMode('signin');
      } else if (hash === '#signup' || hash === '#get-started' || hash === '#start-building') {
        setAuthMode('signup');
      } else if (hash === '#processing' || hash === '#verify') {
        setAuthMode('processing');
      } else if (hash === '#dashboard' || hash === '#app') {
        setAuthMode('dashboard');
      } else {
        setAuthMode(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'dashboard') => {
    if (mode === 'signin') {
      window.location.hash = '#login';
      setAuthMode('signin');
    } else if (mode === 'signup') {
      window.location.hash = '#signup';
      setAuthMode('signup');
    } else if (mode === 'dashboard') {
      window.location.hash = '#dashboard';
      setAuthMode('dashboard');
    }
  };

  const handleCloseAuth = () => {
    window.location.hash = '';
    setAuthMode(null);
  };

  if (authMode === 'dashboard') {
    return <DashboardPage onBackToHome={handleCloseAuth} />;
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
      <Navbar onOpenAuth={handleOpenAuth} />

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
