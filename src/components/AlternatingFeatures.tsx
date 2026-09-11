import React from 'react';
import { 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  QrCode, 
  Layers, 
  BarChart3, 
  FileCheck, 
  Activity, 
  Cpu, 
  CheckCircle2
} from 'lucide-react';

export const AlternatingFeatures: React.FC = () => {
  return (
    <section className="w-full bg-[#FAFAFA] py-20 lg:py-28 border-b border-neutral-200">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* ========================================================= */}
        {/* BIG ACCENT HEADLINE */}
        {/* ========================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-28">
          <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-[#155EEF] leading-tight uppercase font-sans">
            Your products create value. Now your digital identity protects it.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 font-normal max-w-2xl mx-auto">
            A comprehensive cryptographic infrastructure purpose-built for high-value brands, luxury goods, industrial hardware, and modern manufacturers.
          </p>
        </div>

        {/* ========================================================= */}
        {/* 6 ALTERNATING STORY CARDS */}
        {/* ========================================================= */}
        <div className="space-y-16 lg:space-y-24">
          
          {/* CARD 1: Dynamic Identifiers */}
          <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-8 sm:p-12 lg:p-14 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#155EEF] text-xs font-mono font-bold mb-5 uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Dynamic Identifiers</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-snug mb-4">
                  Future-proof monetization with smart cryptopassports without a single line of code.
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  Attach dynamic QR, NFC, or RFID tags to luxury goods, industrial equipment, or electronics. Configure custom dynamic redirects, authenticate supply chains, and enable secondary market royalties effortlessly.
                </p>
                <div className="space-y-2.5 mb-6 text-xs text-neutral-700 font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#155EEF]" />
                    <span>Dynamic destination routing post-printing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#155EEF]" />
                    <span>Zero-Knowledge scan authenticity verification</span>
                  </div>
                </div>
                <a href="#signup" className="inline-flex items-center gap-2 text-xs font-bold text-[#155EEF] hover:text-blue-800 uppercase tracking-wider font-mono group">
                  <span>Explore identifier engine</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#155EEF]" />
                      <span className="font-mono text-xs font-bold text-neutral-900">VERIPASS MINT v2.4</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">ACTIVE</span>
                  </div>
                  <div className="py-4">
                    <div className="text-[11px] font-mono text-neutral-500 uppercase mb-1">UNIT PRICING VALUE</div>
                    <div className="text-2xl font-black text-neutral-950 mb-3 font-mono">
                      1 passport = $0.005 <span className="text-xs text-neutral-400 font-normal">/ item</span>
                    </div>
                    <div className="space-y-2 font-mono text-xs text-neutral-600 bg-neutral-50 p-3 rounded border border-neutral-100 mb-4">
                      <div className="flex justify-between">
                        <span>Batch SKU Size:</span>
                        <span className="font-bold text-neutral-900">50,000 Units</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dynamic URL:</span>
                        <span className="text-[#155EEF] font-semibold">useveripass.com/p/8921</span>
                      </div>
                    </div>
                    <button onClick={() => window.location.hash = '#signup'} className="w-full py-2.5 bg-[#051C14] hover:bg-[#082E21] text-[#65F09D] text-xs font-bold font-mono uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer">
                      <span>+ Mint Verification Rule</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Fraud Shield */}
          <div className="bg-white rounded-xl border border-neutral-200/90 shadow-sm p-8 sm:p-12 lg:p-14 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
                <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                    <span className="font-mono text-xs font-bold text-neutral-800">TRANSACTION & AUTH PROOF</span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold">VERIFIED LOG</span>
                  </div>
                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                      <span className="text-neutral-500">Authenticity Scans</span>
                      <span className="font-bold text-neutral-900">9,410</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-neutral-100">
                      <span className="text-neutral-500">Warranty Registrations</span>
                      <span className="font-bold text-neutral-900">1,720</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 text-sm font-bold">
                      <span className="text-neutral-900">Protected Value Total:</span>
                      <span className="text-emerald-600 font-mono">$4,280,000</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-6 flex flex-col items-start text-left order-1 lg:order-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#155EEF] text-xs font-mono font-bold mb-5 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Fraud & Authenticity Shield</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight leading-snug mb-4">
                  Nail the pilot & the authenticity by showing customers the value your brand delivers.
                </h3>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  Give buyers undeniable, real-time cryptographic proof that your physical merchandise is 100% original. Every scan generates instant confidence and protects secondary resale value.
                </p>
                <a href="#verify" className="inline-flex items-center gap-2 text-xs font-bold text-[#155EEF] hover:text-blue-800 uppercase tracking-wider font-mono group">
                  <span>See scan audit trail</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
