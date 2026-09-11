import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export interface CtaBannerProps {
  onOpenAuth?: (mode: 'signin' | 'signup' | 'dashboard') => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenAuth }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onOpenAuth) {
      onOpenAuth('signup');
    } else {
      window.location.hash = '#signup';
    }
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-14 lg:py-20 border-b border-neutral-200">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="bg-[#051C14] border border-[#144733] rounded-2xl p-8 sm:p-12 lg:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#65F09D]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12 relative z-10">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 font-sans">
                Ready to get started?
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base font-normal leading-relaxed">
                Create your first 1,000 product passports in under two minutes with zero code.
              </p>
            </div>

            <form 
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#0A261C] border border-[#144733] p-1.5 rounded-xl shadow-lg focus-within:border-[#65F09D]/50 transition-colors"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="flex-1 px-4 py-3 bg-transparent text-white text-sm placeholder:text-neutral-500 focus:outline-none font-sans"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#65F09D] hover:bg-[#52df8c] active:bg-[#43cd7c] text-[#051C14] font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
