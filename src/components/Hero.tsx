import React from 'react';
import { ArrowRight, Check, Sparkles, ShieldCheck, QrCode } from 'lucide-react';
import { MorphText } from './ui/morph-text';

interface HeroProps {
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAuth }) => {
  const handleGetStarted = () => {
    if (onOpenAuth) {
      onOpenAuth('signup');
    } else {
      window.location.hash = '#signup';
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-sky-400 min-h-[840px] lg:min-h-[900px] flex items-center pt-28 sm:pt-36 lg:pt-38 pb-16 lg:pb-24">

      {/* 1. Full Hero Background Image (public/hero.jpeg) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/hero.jpeg')" }}
      >
        {/* Soft overlay gradient for ideal text contrast and vibrancy */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/20 via-transparent to-sky-900/15" />
      </div>

      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ========================================================= */}
          {/* LEFT COLUMN: Animated Headline + Subtext + Get Started CTA */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-xs mb-6 text-white text-xs font-semibold">
              <span className="px-2 py-0.5 rounded-full bg-neutral-950 text-[#65F09D] font-bold text-[10px] tracking-wide uppercase">
                New
              </span>
              <span className="font-medium text-white drop-shadow-sm">VeriPass AI Agent Protocol</span>
            </div>

            {/* Main Headline with Smooth Morph Animation */}
            <div className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-black tracking-tight text-white leading-[1.08] mb-6 font-sans drop-shadow-md">
              <span className="block">The Internet for</span>
              <div className="mt-2.5 flex items-center">
                <MorphText
                  words={[
                    "Physical Products.",
                    "Authentic Luxury.",
                    "Smart QR Serials.",
                    "Digital Passports.",
                    "Supply Chains."
                  ]}
                  interval={2600}
                  fontSize="clamp(2.1rem, 4.8vw, 3.6rem)"
                  fontFamily="inherit"
                  className="items-start text-left"
                  textClassName="inline-flex items-center justify-start bg-neutral-950/85 backdrop-blur-md text-[#65F09D] px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-xl font-black tracking-tight border border-white/25"
                />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-white/95 font-medium leading-relaxed max-w-xl mb-8 drop-shadow-sm">
              Every physical product gets a permanent digital identity, unique QR/NFC code, verifiable warranty history, and cryptographic anti-counterfeit protection.
            </p>

            {/* Single High-Converting Get Started Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-neutral-950 hover:bg-black active:scale-[0.98] text-white font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-2xl border border-white/20 group cursor-pointer"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4 text-[#65F09D] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  window.location.hash = '#p/VP-2026-8F4K29';
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/30 hover:bg-white/40 active:bg-white/50 backdrop-blur-md border border-white/40 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span>View Live Demo</span>
              </button>
            </div>

            {/* Micro Benefits & Compliance Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-white/95 font-semibold drop-shadow-sm">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#65F09D] stroke-[3]" />
                <span>No hardware redesign</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#65F09D] stroke-[3]" />
                <span>EU DPP 2026 Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#65F09D] stroke-[3]" />
                <span>SOC2 & ISO 27001 Certified</span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Global Map & Verification Network (map.png) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end relative">
            <div className="relative max-w-[480px] sm:max-w-[540px] lg:max-w-[620px] w-full flex items-center justify-center">
              
              {/* Ambient Glow Effect Behind Map */}
              <div className="absolute inset-0 bg-white/30 rounded-3xl blur-3xl pointer-events-none -z-10 scale-95" />
              
              {/* Global Verification Map Mockup from public/map.png */}
              <img
                src="/map.png"
                alt="VeriPass Global Product Verification Network Map"
                className="w-full h-auto max-h-[580px] sm:max-h-[640px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)] select-none hover:scale-[1.02] transition-transform duration-300 rounded-2xl"
              />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
