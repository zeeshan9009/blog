import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing to ProRank updates!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0a0a0a] text-slate-400 border-t border-slate-900 pt-20 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Large Tagline Callout */}
        <div className="pb-16 border-b border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-[-0.03em]">
              Hire top talent the direct way.
            </h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Vetted developers, UI/UX designers, video editors, and growth specialists with zero commission cuts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollTo('talent')}
              className="px-6 py-3 bg-white hover:bg-orange-50 text-black font-bold text-xs transition shadow-md rounded-none cursor-pointer"
            >
              Explore Talent
            </button>
            <button
              onClick={() => scrollTo('pricing')}
              className="px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-slate-700 hover:border-white font-bold text-xs transition rounded-none cursor-pointer"
            >
              Promote for $1
            </button>
          </div>
        </div>

        {/* 4-Column Link Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Marketplace */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Talent Search
            </div>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => scrollTo('talent')} className="hover:text-white transition cursor-pointer">Web & App Developers</button></li>
              <li><button onClick={() => scrollTo('talent')} className="hover:text-white transition cursor-pointer">UI/UX & Brand Designers</button></li>
              <li><button onClick={() => scrollTo('talent')} className="hover:text-white transition cursor-pointer">Video Editors & Motion</button></li>
              <li><button onClick={() => scrollTo('talent')} className="hover:text-white transition cursor-pointer">AI & Machine Learning</button></li>
              <li><button onClick={() => scrollTo('talent')} className="hover:text-white transition cursor-pointer">Growth & Marketing</button></li>
            </ul>
          </div>

          {/* Col 2: Platform */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </div>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#features" className="hover:text-white transition">How ProRank Works</a></li>
              <li><a href="#pricing" className="hover:text-white transition">24h $1 Sponsored Boost</a></li>
              <li><button onClick={() => scrollTo('cta')} className="hover:text-white transition cursor-pointer">Create Free Profile</button></li>
              <li><a href="#faq" className="hover:text-white transition">ProRank 0-100 Scoring</a></li>
              <li><a href="#faq" className="hover:text-white transition">Zero Commission Model</a></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Resources
            </div>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#faq" className="hover:text-white transition">Frequently Asked Questions</a></li>
              <li><a href="mailto:support@prorank.io" className="hover:text-white transition">Direct Support Desk</a></li>
              <li><button onClick={() => scrollTo('talent')} className="hover:text-white transition cursor-pointer">Verified Talent Directory</button></li>
              <li><a href="#faq" className="hover:text-white transition">Security & Trust</a></li>
            </ul>
          </div>

          {/* Col 4 & 5: Newsletter Box */}
          <div className="lg:col-span-2 space-y-4 p-6 bg-slate-900/60 border border-slate-800 rounded-none">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Stay in the loop
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              New vetted talent additions and platform growth updates, once a month. No spam.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="w-full px-4 py-2.5 text-xs text-white bg-black border border-slate-700 rounded-none focus:outline-hidden focus:border-[#e8622c]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#e8622c] hover:bg-orange-500 text-white font-bold text-xs transition shrink-0 cursor-pointer rounded-none"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-[#e8622c] flex items-center justify-center text-white text-[10px] font-black rounded-none">
              P
            </div>
            <span>© 2026 ProRank Platform Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-white transition">Privacy Policy</a>
            <a href="#faq" className="hover:text-white transition">Terms of Service</a>
            <a href="#faq" className="hover:text-white transition">Commission Disclaimer</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400 font-mono text-xs font-bold">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition" aria-label="Twitter">
              [𝕏]
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition" aria-label="GitHub">
              [GH]
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition" aria-label="LinkedIn">
              [IN]
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-white transition" aria-label="Discord">
              [DC]
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
