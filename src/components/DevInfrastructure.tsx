import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy } from 'lucide-react';

export const DevInfrastructure: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `{
  "product_id": "VP-2026-8F4K29",
  "status": "verified",
  "passport_url": "useveripass.com/p/8F4K29"
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
    <section className="relative w-full overflow-hidden bg-white text-neutral-950 py-16 sm:py-20 border-b border-neutral-200 font-sans">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-stretch">
          
          {/* ========================================================= */}
          {/* COLUMN 1 (Left): Headline, Subtext & Pills */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 flex flex-col justify-between items-start text-left">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 border border-blue-200 text-[#155EEF] font-mono text-[10px] tracking-widest uppercase font-bold mb-4 shadow-2xs">
                <span>DEVELOPERS</span>
                <span className="text-[9px]">◎</span>
                <span>REST API</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-black tracking-tight uppercase leading-[1.08] mb-3.5 font-sans text-neutral-950">
                <span className="block">BUILT AS</span>
                <span className="text-[#155EEF] block">INFRASTRUCTURE.</span>
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-[13px] text-neutral-600 font-normal leading-relaxed mb-6 max-w-sm">
                Simple, powerful APIs for seamless integration.<br />
                Get started in minutes.
              </p>
            </div>

            {/* Pill Buttons (Square UI) */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {pillTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-neutral-50 border border-neutral-300 text-neutral-800 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all duration-150 hover:border-[#155EEF] hover:text-[#155EEF] hover:bg-white shadow-2xs cursor-default select-none"
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
            <div className="w-full bg-neutral-950 border border-neutral-900 rounded-none overflow-hidden shadow-xl">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-bold">POST</span>
                  <span className="text-slate-200">/v1/products</span>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                  <span className="text-sky-400">"product_id"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-300">"VP-2026-8F4K29"</span>
                  <span className="text-slate-400">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">"status"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-300">"verified"</span>
                  <span className="text-slate-400">,</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">"passport_url"</span>
                  <span className="text-slate-400">: </span>
                  <span className="text-emerald-300">"useveripass.com/p/8F4K29"</span>
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
              <h3 className="text-neutral-950 font-sans font-bold text-sm sm:text-base tracking-wide mb-4 uppercase">
                Easy Integration
              </h3>

              <ul className="space-y-2.5 mb-6">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs sm:text-[13px] text-neutral-700 font-medium">
                    <Check className="w-4 h-4 text-[#155EEF] shrink-0 stroke-[3]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#api-docs"
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-mono font-bold uppercase text-[#155EEF] hover:text-blue-800 transition-colors group"
            >
              <span>View API Docs</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>

          {/* ========================================================= */}
          {/* COLUMN 4 (Far Right): Scale Card Box (Square UI) */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 flex items-stretch">
            <div className="w-full bg-white border border-neutral-300 p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-150 hover:border-[#155EEF] hover:shadow-md">
              <p className="text-neutral-950 text-sm sm:text-base font-bold leading-snug tracking-tight uppercase font-sans">
                Scale from<br />
                thousands<br />
                to millions<br />
                of products.
              </p>

              <div className="flex justify-end pt-6">
                <div className="w-8 h-8 rounded-none border border-neutral-300 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 hover:border-neutral-900 transition-colors">
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
