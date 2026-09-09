import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OneUrl } from './components/OneUrl';
import { HowItWorks } from './components/HowItWorks';
import { LifetimeData } from './components/LifetimeData';
import { GlobalReach } from './components/GlobalReach';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* 1. Header / Navbar */}
      <Navbar />

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

      {/* 7. Call To Action & Brand Banner */}
      <CtaBanner />

      {/* 8. Bottom Footer */}
      <Footer />
    </div>
  );
}
