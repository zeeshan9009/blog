import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react';

export const DevInfrastructure: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `{
  "product_id": "VP-2026-8F4K29",
  "status": "verified",
  "passport_url": "veripass.com/p/8F4K29"
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pillTags = [
    'REST API',
    'WEBHOOKS',
    'SDK',
    'QR API',
    'NFC READY'
  ];

  const features = [
    'RESTful API',
    'Real-time Webhooks',
    'Comprehensive SDKs',
    'Detailed Documentation'
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#030712] text-white py-12 sm:py-16 border-t border-b border-cyan-950/80">
      {/* Background Cyber Grid & Glow Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70d_1px,transparent_1px),linear-gradient(to_bottom,#0284c70d_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Ambient glowing radial light */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-stretch">
          
          {/* ========================================================= */}
          {/* COLUMN 1 (Left): Headline, Subtext & Pills */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 flex flex-col justify-between items-start text-left">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] tracking-widest uppercase font-semibold mb-4 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <span>DEVELOPERS</span>
                <span className="text-[9px] text-cyan-400/70">◎</span>
                <span>DEVELOPERS</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black tracking-tight uppercase leading-[1.08] mb-3.5 font-sans">
                <span className="text-white block">BUILT AS</span>
                <span className="text-white block">INFRASTRUCTURE.</span>
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed mb-6 max-w-sm">
                Simple, powerful APIs for seamless integration.<br />
                Get started in minutes.
              </p>
            </div>

            {/* Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {pillTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-default select-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 2 (Center): Code Snippet Terminal */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="w-full bg-[#060D18]/90 border border-cyan-500/30 rounded-lg overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.08)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0A1424] border-b border-cyan-950/80">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span className="text-emerald-400 font-bold">POST</span>
                  <span className="text-slate-300">/v1/products</span>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Content */}
              <div className="p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-slate-300">
                <div className="text-slate-400 font-sans">&#123;</div>
                <div className="pl-4">
                  <span className="text-cyan-400">"product_id"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-300">"VP-2026-8F4K29"</span>
                  <span className="text-slate-400">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">"status"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-300">"verified"</span>
                  <span className="text-slate-400">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-cyan-400">"passport_url"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-300">"veripass.com/p/8F4K29"</span>
                </div>
                <div className="text-slate-400 font-sans">&#125;</div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 3 (Middle-Right): Easy Integration & Checklist */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 flex flex-col justify-between items-start text-left pl-0 lg:pl-2">
            <div>
              <h3 className="text-cyan-400 font-sans font-semibold text-sm sm:text-base tracking-wide mb-4">
                Easy Integration
              </h3>

              <ul className="space-y-2.5 mb-6">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-300 font-medium">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 stroke-[2.5]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#api-docs"
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <span>View API Docs</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 4 (Far Right): Scale Card Box */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 flex items-stretch">
            <div className="w-full bg-[#060D18]/80 border border-cyan-500/30 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)]">
              
              {/* Inner ambient shine */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

              <p className="text-slate-200 text-sm sm:text-base font-medium leading-snug tracking-tight">
                Scale from<br />
                thousands<br />
                to millions<br />
                of products.
              </p>

              <div className="flex justify-end pt-6">
                <div className="w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
