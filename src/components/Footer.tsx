import React from 'react';
import { VeriPassLogoIcon } from './ui/VeriPassLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 pt-12 sm:pt-16 pb-8 overflow-hidden font-sans text-neutral-700">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* ========================================================= */}
        {/* UPPER ROW: Left Logo SVG + Horizontal Nav Links */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 sm:pb-16 border-b border-neutral-200">
          
          {/* Upper Left: Logo SVG + Brand Name */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group focus:outline-none" aria-label="VeriPass">
              <VeriPassLogoIcon className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-neutral-900 font-sans">
                VeriPass
              </span>
            </a>
          </div>

          {/* Upper Right: Horizontal Nav Links */}
          <nav className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3 text-sm font-medium text-neutral-600">
            <a href="#products" className="hover:text-neutral-950 transition-colors">
              Products
            </a>
            <a href="#templates" className="hover:text-neutral-950 transition-colors">
              Templates
            </a>
            <a href="#integrations" className="hover:text-neutral-950 transition-colors">
              Integrations
            </a>
            <a href="#pricing" className="hover:text-neutral-950 transition-colors">
              Pricing
            </a>
            <a href="#docs" className="hover:text-neutral-950 transition-colors">
              API Docs
            </a>
            <a href="#security" className="hover:text-neutral-950 transition-colors">
              Security
            </a>
            <a href="#privacy" className="hover:text-neutral-950 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-neutral-950 transition-colors">
              Terms
            </a>
          </nav>

        </div>

        {/* ========================================================= */}
        {/* CENTER / BOTTOM: Giant Bold Site Name Typography */}
        {/* ========================================================= */}
        <div className="py-8 sm:py-12 flex items-center justify-center overflow-hidden select-none">
          <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[130px] xl:text-[160px] font-black uppercase tracking-tighter text-neutral-900/90 leading-none text-center hover:text-neutral-950 transition-colors">
            VERIPASS
          </h2>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM METADATA BAR */}
        {/* ========================================================= */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
          <p>© 2026 VeriPass Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Physical Asset Protocol</span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">Systems 100% Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
