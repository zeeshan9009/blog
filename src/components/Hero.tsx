import React from 'react';
import { 
  ArrowRight, 
  Play, 
  Check, 
  Globe, 
  QrCode, 
  ShieldCheck, 
  FileText, 
  Scan
} from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 lg:py-16 xl:py-20 border-b border-neutral-200">
      
      {/* Background Floating Geometric Blue Accent Blocks (exact match to reference) */}
      <div className="absolute right-[44%] top-16 w-18 h-18 bg-[#155EEF] pointer-events-none hidden xl:block z-0" />
      <div className="absolute right-[47.5%] top-48 w-8 h-8 bg-[#155EEF] pointer-events-none hidden xl:block z-0" />
      <div className="absolute right-[46%] top-24 w-4 h-24 bg-[#155EEF]/20 pointer-events-none hidden xl:block z-0" />
      <div className="absolute right-[42%] bottom-16 w-10 h-10 bg-[#155EEF]/15 pointer-events-none hidden xl:block z-0" />

      {/* Grid line texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none -z-10" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 xl:gap-20">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: Clean, Exact Match to Reference Image */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[52%] xl:w-[50%] flex flex-col items-start text-left shrink-0">
            
            {/* Eyebrow Breadcrumb */}
            <div className="font-mono text-[11px] sm:text-xs tracking-wider text-neutral-500 uppercase font-medium mb-5">
              VERIPASS <span className="text-neutral-300 mx-1">/</span> PRODUCT IDENTITY INFRASTRUCTURE
            </div>

            {/* Main Headline (PHYSICAL & PRODUCTS together on Line 2) */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] xl:text-[58px] font-black tracking-tight text-neutral-950 uppercase leading-[1.06] mb-5 font-sans">
              THE INTERNET FOR<br />
              <span className="inline-flex items-center gap-2.5 sm:whitespace-nowrap mt-1">
                <span>PHYSICAL</span>
                <span className="inline-block bg-[#155EEF] text-white px-3 py-0.5 rounded-none shadow-xs">
                  PRODUCTS.
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-lg mb-8">
              Every physical product gets a permanent digital identity, unique URL, QR code, and verifiable history.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-14">
              <a
                href="#create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-none bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-xs active:translate-y-0.5 text-center"
              >
                <span>CREATE PRODUCT IDENTITY</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#passport-demo"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-none bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-bold text-xs uppercase tracking-wider transition-colors text-center shadow-xs"
              >
                <span>VIEW LIVE PASSPORT</span>
                <span className="w-4.5 h-4.5 rounded-full border border-neutral-800 flex items-center justify-center ml-0.5">
                  <Play className="w-2.5 h-2.5 fill-neutral-900 text-neutral-900 ml-0.5" />
                </span>
              </a>
            </div>

            {/* Bottom Indicator Bar */}
            <div className="w-full pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>GLOBAL PRODUCT VERIFICATION NETWORK</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
                <span>PHYSICAL OBJECT</span>
                <span>→</span>
                <span>DIGITAL RECORD</span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Full Showcase (Passport + Phone + Stat Cards) */}
          {/* Fits completely inside view without overflow/cutting off */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[50%] xl:w-[50%] flex justify-center lg:justify-end shrink-0">
            
            <div className="relative flex items-start gap-3 w-full max-w-[580px]">
              
              {/* 1. Main Digital Passport Card */}
              <div className="flex-1 bg-white rounded-none border border-neutral-300 shadow-lg p-5 sm:p-6 relative z-10">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-none bg-black flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-none" />
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-tight text-neutral-950 uppercase">
                        VERIPASS
                      </div>
                      <div className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase -mt-0.5">
                        PRODUCT PASSPORT
                      </div>
                    </div>
                  </div>

                  {/* Verified Badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00A86B] text-white text-[10px] font-bold tracking-wider uppercase rounded-none shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>VERIFIED</span>
                  </div>
                </div>

                {/* Ring Image & QR Code */}
                <div className="grid grid-cols-2 gap-3 py-4 items-center border-b border-neutral-200">
                  
                  {/* Luxury Product Visual */}
                  <div className="relative aspect-square bg-neutral-50/80 border border-neutral-200 p-1.5 flex items-center justify-center overflow-hidden">
                    <img
                      src="/diamond-ring.jpg"
                      alt="18K Diamond Ring"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center p-1 bg-white">
                    <svg
                      className="w-24 h-24 sm:w-28 sm:h-28 text-neutral-900"
                      viewBox="0 0 100 100"
                      fill="currentColor"
                    >
                      <rect x="5" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="13" y="13" width="12" height="12" fill="currentColor" />
                      <rect x="67" y="5" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="75" y="13" width="12" height="12" fill="currentColor" />
                      <rect x="5" y="67" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="13" y="75" width="12" height="12" fill="currentColor" />
                      
                      <rect x="38" y="8" width="6" height="6" />
                      <rect x="48" y="8" width="6" height="12" />
                      <rect x="58" y="8" width="5" height="6" />
                      <rect x="38" y="20" width="12" height="6" />
                      <rect x="54" y="20" width="8" height="8" />

                      <rect x="8" y="38" width="6" height="6" />
                      <rect x="20" y="38" width="6" height="12" />
                      <rect x="8" y="48" width="8" height="6" />

                      <rect x="38" y="38" width="8" height="8" fill="#155EEF" />
                      <rect x="50" y="38" width="14" height="6" />
                      <rect x="38" y="50" width="6" height="14" />
                      <rect x="48" y="48" width="10" height="10" />
                      <rect x="62" y="48" width="8" height="8" />

                      <rect x="70" y="38" width="6" height="14" />
                      <rect x="80" y="38" width="12" height="6" />
                      <rect x="82" y="48" width="10" height="14" />

                      <rect x="38" y="70" width="14" height="6" />
                      <rect x="56" y="70" width="6" height="14" />
                      <rect x="42" y="82" width="10" height="10" />
                      <rect x="70" y="70" width="8" height="8" />
                      <rect x="82" y="72" width="10" height="6" />
                      <rect x="72" y="82" width="14" height="10" />
                    </svg>
                  </div>

                </div>

                {/* Specs Table */}
                <div className="py-3 space-y-2 font-mono text-[11px]">
                  
                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100 relative">
                    <span className="text-neutral-500 uppercase font-semibold text-[10px] relative">
                      PRODUCT
                      <span className="absolute -bottom-1.5 left-0 w-6 h-[2px] bg-[#155EEF]" />
                    </span>
                    <span className="font-bold text-neutral-900 text-xs font-sans">
                      18K Diamond Ring
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500 uppercase font-semibold text-[10px]">
                      PRODUCT URL
                    </span>
                    <span className="text-neutral-700 font-mono text-[11px]">
                      veripass.com/p/BF4K29
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 uppercase font-semibold text-[10px]">
                      UNIQUE ID
                    </span>
                    <span className="text-neutral-900 font-bold font-mono text-[11px]">
                      VP-2026-8F4K29
                    </span>
                  </div>

                </div>

                {/* View Passport CTA */}
                <div className="pt-2">
                  <a
                    href="#view-passport"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0B0F17] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-none transition-colors"
                  >
                    <span>VIEW PASSPORT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

              {/* 2. Overlapping Smartphone Scanner Mockup */}
              <div className="absolute right-28 sm:right-32 -bottom-6 sm:-bottom-8 w-36 sm:w-40 bg-[#0F172A] rounded-2xl p-2 shadow-2xl border border-neutral-800 z-20">
                <div className="w-12 h-2.5 bg-neutral-900 rounded-full mx-auto mb-1.5" />

                <div className="relative bg-slate-900 rounded-xl p-2 border border-slate-800 text-center">
                  <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 mb-1">
                    <span className="animate-pulse">Scanning...</span>
                  </div>

                  <div className="w-10 h-10 mx-auto mb-1 flex items-center justify-center">
                    <img
                      src="/diamond-ring.jpg"
                      alt="Ring Preview"
                      className="w-9 h-9 object-contain brightness-95"
                    />
                  </div>

                  <div className="relative p-1.5 bg-slate-950 border border-slate-800 mx-auto w-18 h-18 flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400" />
                    <QrCode className="w-12 h-12 text-white opacity-90" />
                  </div>
                </div>
              </div>

              {/* 3. Stacked Stat Cards on Right Side (Natural flow, within width) */}
              <div className="flex flex-col gap-2.5 w-[130px] sm:w-[145px] shrink-0 z-10 pt-2">
                
                {/* Stat 1: Scan Verified */}
                <div className="bg-white rounded-none border border-neutral-200 p-3 shadow-sm flex items-center gap-2.5 hover:border-neutral-400 transition-colors">
                  <div className="p-1.5 bg-neutral-100 text-neutral-800 rounded-none shrink-0">
                    <Scan className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-neutral-500 uppercase font-semibold leading-tight">
                      SCAN VERIFIED
                    </div>
                    <div className="text-sm font-black text-neutral-900 leading-tight">
                      +8,430
                    </div>
                    <div className="text-[8px] font-mono text-neutral-400 uppercase leading-none">
                      SCANS
                    </div>
                  </div>
                </div>

                {/* Stat 2: Certificate Active */}
                <div className="bg-white rounded-none border border-neutral-200 p-3 shadow-sm flex items-center gap-2.5 hover:border-neutral-400 transition-colors">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-none shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-neutral-500 uppercase font-semibold leading-tight">
                      CERTIFICATE
                    </div>
                    <div className="text-xs font-black text-emerald-600 tracking-wide uppercase leading-tight">
                      ACTIVE
                    </div>
                  </div>
                </div>

                {/* Stat 3: Warranty */}
                <div className="bg-white rounded-none border border-neutral-200 p-3 shadow-sm flex items-center gap-2.5 hover:border-neutral-400 transition-colors">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-none shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-neutral-500 uppercase font-semibold leading-tight">
                      WARRANTY
                    </div>
                    <div className="text-[11px] font-black text-emerald-600 uppercase leading-tight">
                      UNTIL 2028
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
