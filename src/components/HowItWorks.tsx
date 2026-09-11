import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  Layers, 
  Check, 
  Building2, 
  Box, 
  Hash, 
  Radio, 
  Sparkles,
  ExternalLink,
  Lock,
  Search,
  ScanLine
} from 'lucide-react';
import { VeriPassLogo, VeriPassLogoIcon } from './ui/VeriPassLogo';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative w-full overflow-hidden bg-white py-16 sm:py-24 border-b border-neutral-200 font-sans">
      
      {/* Subtle Background Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none -z-10" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* ========================================================= */}
        {/* TOP HEADER SECTION (Square UI) */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12 sm:mb-16 border-b border-neutral-200 pb-10">
          
          {/* Left: Brand Identity */}
          <div className="hidden lg:flex flex-col items-start w-72 shrink-0">
            <VeriPassLogo size="md" showDomain={true} />
            <div className="mt-2 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
              Verification Protocol v2.4
            </div>
          </div>

          {/* Center: Main Section Title & Headline */}
          <div className="flex-1 text-center max-w-2xl mx-auto">
            {/* Square UI Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold tracking-wider uppercase mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 bg-[#155EEF] animate-pulse" />
              Simple • Secure • Transparent
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 uppercase leading-none mb-3">
              How It <span className="text-[#155EEF]">Works.</span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-bold text-neutral-900 mb-1.5">
              From product to passport in 6 simple steps.
            </p>

            {/* Sub-description */}
            <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed max-w-xl mx-auto">
              VeriPass connects your physical products with a secure, digital identity — built for trust, transparency and authenticity.
            </p>
          </div>

          {/* Right: Signature Stamp */}
          <div className="hidden lg:flex flex-col items-end w-72 shrink-0">
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 text-right shadow-2xs">
              <div className="flex items-center justify-end gap-2 text-blue-600 mb-1">
                <span className="font-serif italic font-bold text-base sm:text-lg tracking-tight text-neutral-900">
                  Real Products.
                </span>
                <QrCode className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-serif italic font-bold text-base sm:text-lg tracking-tight text-[#155EEF] block">
                Real Trust.
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 6 STEP CARDS GRID IN SQUARE UI (Sharp Borders & Real Imagery) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ========================================================= */}
          {/* STEP 01: COMPANY CONNECTS */}
          {/* ========================================================= */}
          <div className="bg-white border border-neutral-300 p-5 sm:p-6 shadow-2xs hover:border-[#155EEF] hover:shadow-md transition-all duration-150 flex flex-col justify-between group">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-neutral-950 text-white font-mono font-bold text-xs mb-3 border border-black">
                01
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase text-neutral-950 tracking-tight font-sans mb-1.5">
                Company Connects
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                Create your business account and dashboard. Set up your brand, branches and team.
              </p>
            </div>

            {/* Square UI Visual Mockup 01 */}
            <div className="w-full bg-neutral-50 border border-neutral-200 p-3 my-2 shadow-2xs">
              <div className="flex gap-2">
                {/* Mini Form Card */}
                <div className="flex-1 bg-white border border-neutral-200 p-2.5 shadow-2xs">
                  <div className="flex items-center justify-center mb-1.5">
                    <VeriPassLogoIcon className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-black text-center text-neutral-900 mb-1.5 uppercase font-sans">
                    Create Your Account
                  </div>
                  <div className="space-y-1">
                    <div className="h-4.5 bg-neutral-50 border border-neutral-200 px-1.5 flex items-center text-[8px] text-neutral-500 font-mono">
                      Company Name
                    </div>
                    <div className="h-4.5 bg-neutral-50 border border-neutral-200 px-1.5 flex items-center text-[8px] text-neutral-500 font-mono">
                      Email Address
                    </div>
                    <div className="h-4.5 bg-neutral-50 border border-neutral-200 px-1.5 flex items-center text-[8px] text-neutral-500 font-mono">
                      Password
                    </div>
                    <div className="h-5 bg-[#155EEF] text-white flex items-center justify-center text-[8px] font-mono font-bold uppercase tracking-wider">
                      Get Started
                    </div>
                  </div>
                </div>

                {/* Mini Dashboard Nav Sidebar */}
                <div className="w-22 bg-neutral-950 text-white p-2 flex flex-col justify-between text-[8px] font-mono border border-black">
                  <div className="space-y-1">
                    <div className="bg-[#155EEF] text-white px-1.5 py-0.5 font-bold uppercase">Dashboard</div>
                    <div className="text-neutral-400 px-1.5 py-0.5">Products</div>
                    <div className="text-neutral-400 px-1.5 py-0.5">QR Studio</div>
                    <div className="text-neutral-400 px-1.5 py-0.5">Customers</div>
                  </div>
                  <div className="text-emerald-400 px-1.5 text-[7px] font-bold uppercase tracking-wider">● Online</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[#155EEF] text-xs font-mono font-bold uppercase group-hover:translate-x-1 transition-transform">
              <span>Setup Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP 02: PRODUCT ENTERS DATABASE */}
          {/* ========================================================= */}
          <div className="bg-white border border-neutral-300 p-5 sm:p-6 shadow-2xs hover:border-[#155EEF] hover:shadow-md transition-all duration-150 flex flex-col justify-between group">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-neutral-950 text-white font-mono font-bold text-xs mb-3 border border-black">
                02
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase text-neutral-950 tracking-tight font-sans mb-1.5">
                Product Enters Database
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                Add product details, certificates and warranty information.
              </p>
            </div>

            {/* Square UI Visual Mockup 02 */}
            <div className="w-full bg-neutral-50 border border-neutral-200 p-3 my-2 shadow-2xs">
              <div className="bg-white border border-neutral-200 p-2.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 mb-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-950 uppercase">Add Product Spec</span>
                  <span className="text-[8px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 border border-blue-200 font-bold">SQL / API</span>
                </div>

                <div className="flex gap-2 items-center">
                  {/* Real Product Thumbnail */}
                  <div className="w-16 h-14 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                    <img
                      src="/how-it-works/step5-real-product.jpg"
                      alt="Haier Unit"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Form fields */}
                  <div className="flex-1 space-y-1 text-[8px] font-mono">
                    <div className="bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 text-neutral-900 truncate">
                      Name: <span className="font-bold">Haier Inverter AC</span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 text-neutral-700 truncate">
                      Model: <span className="font-semibold">HSU-18HNS</span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 text-neutral-700 truncate">
                      Serial: <span className="font-semibold text-blue-600">HR-AC-000123</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 h-5 bg-[#155EEF] text-white flex items-center justify-center text-[8px] font-mono font-bold uppercase tracking-wider">
                  Save Product
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[#155EEF] text-xs font-mono font-bold uppercase group-hover:translate-x-1 transition-transform">
              <span>Register Data</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP 03: UNIQUE DIGITAL ID CREATED */}
          {/* ========================================================= */}
          <div className="bg-white border border-neutral-300 p-5 sm:p-6 shadow-2xs hover:border-[#155EEF] hover:shadow-md transition-all duration-150 flex flex-col justify-between group">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-neutral-950 text-white font-mono font-bold text-xs mb-3 border border-black">
                03
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase text-neutral-950 tracking-tight font-sans mb-1.5">
                Unique Digital ID Created
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                System generates a permanent product ID with a 256-bit cryptographic hash.
              </p>
            </div>

            {/* Square UI Visual Mockup 03 */}
            <div className="w-full bg-neutral-50 border border-neutral-200 p-3 my-2 shadow-2xs">
              <div className="bg-white border border-neutral-200 p-2.5 shadow-2xs flex items-center gap-3">
                {/* Dynamic QR Stamp */}
                <div className="w-14 h-14 bg-blue-50 border-2 border-[#155EEF] flex items-center justify-center p-1 shrink-0 shadow-2xs">
                  <QrCode className="w-10 h-10 text-[#155EEF]" />
                </div>

                {/* ID and SHA-256 Hash Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-mono text-neutral-500 uppercase">Product Passport ID</div>
                  <div className="text-[11px] font-mono font-bold text-neutral-950 truncate">
                    VP-HR-AC-000123
                  </div>
                  <div className="text-[8px] font-mono text-neutral-500 mt-0.5 truncate">
                    SHA-256: <span className="text-[#155EEF] font-bold">3f4a8e2c9d7e6f...</span>
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-300 text-emerald-700 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase">
                    <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                    <span>Hash Generated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[#155EEF] text-xs font-mono font-bold uppercase group-hover:translate-x-1 transition-transform">
              <span>View Cryptographic Proof</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP 04: QR / NFC IDENTITY GENERATED */}
          {/* ========================================================= */}
          <div className="bg-white border border-neutral-300 p-5 sm:p-6 shadow-2xs hover:border-[#155EEF] hover:shadow-md transition-all duration-150 flex flex-col justify-between group">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-neutral-950 text-white font-mono font-bold text-xs mb-3 border border-black">
                04
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase text-neutral-950 tracking-tight font-sans mb-1.5">
                QR / NFC Identity Generated
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                Dynamic QR code is created for each product (or batch).
              </p>
            </div>

            {/* Square UI Visual Mockup 04 with Real Scanner Imagery */}
            <div className="w-full bg-neutral-50 border border-neutral-200 p-2.5 my-2 shadow-2xs overflow-hidden relative">
              <div className="relative h-28 w-full bg-neutral-900 border border-neutral-300 overflow-hidden group/scan">
                <img
                  src="/how-it-works/step4-scanning.jpg"
                  alt="Dynamic QR / NFC Tag Scanning"
                  className="w-full h-full object-cover opacity-90 group-hover/scan:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Holographic scanner overlay overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-1.5 left-1.5 bg-neutral-950/90 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 border border-white/20 flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 text-blue-400 animate-pulse" />
                  <span>Dynamic QR / NFC</span>
                </div>

                {/* Bottom Tag */}
                <div className="absolute bottom-1.5 right-1.5 bg-[#155EEF] text-white font-mono text-[8px] font-bold px-1.5 py-0.5">
                  100% Tamper-Proof
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[#155EEF] text-xs font-mono font-bold uppercase group-hover:translate-x-1 transition-transform">
              <span>Inspect QR Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP 05: PRODUCT ENTERS THE REAL WORLD */}
          {/* ========================================================= */}
          <div className="bg-white border border-neutral-300 p-5 sm:p-6 shadow-2xs hover:border-[#155EEF] hover:shadow-md transition-all duration-150 flex flex-col justify-between group">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-neutral-950 text-white font-mono font-bold text-xs mb-3 border border-black">
                05
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase text-neutral-950 tracking-tight font-sans mb-1.5">
                Product Enters The Real World
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                QR tag on product or packaging. Ready for scanning.
              </p>
            </div>

            {/* Square UI Visual Mockup 05 with Photorealistic Physical Unit */}
            <div className="w-full bg-neutral-50 border border-neutral-200 p-2.5 my-2 shadow-2xs overflow-hidden relative">
              <div className="relative h-28 w-full bg-neutral-100 border border-neutral-300 overflow-hidden group/prod">
                <img
                  src="/how-it-works/step5-real-product.jpg"
                  alt="Real Physical Product with QR tag"
                  className="w-full h-full object-cover group-hover/prod:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Tag Callout Overlay */}
                <div className="absolute top-1.5 left-1.5 bg-neutral-950/90 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 border border-white/20">
                  Physical Real World
                </div>

                <div className="absolute bottom-1.5 left-1.5 bg-blue-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5">
                  Affixed QR Tag: HR-AC-000123
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[#155EEF] text-xs font-mono font-bold uppercase group-hover:translate-x-1 transition-transform">
              <span>Explore Tag Options</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP 06: CUSTOMER SCANS & VERIFIES */}
          {/* ========================================================= */}
          <div className="bg-white border border-neutral-300 p-5 sm:p-6 shadow-2xs hover:border-[#155EEF] hover:shadow-md transition-all duration-150 flex flex-col justify-between group">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-neutral-950 text-white font-mono font-bold text-xs mb-3 border border-black">
                06
              </div>
              <h3 className="text-base sm:text-lg font-black uppercase text-neutral-950 tracking-tight font-sans mb-1.5">
                Customer Scans & Verifies
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-normal">
                Views public passport instantly, with full product details.
              </p>
            </div>

            {/* Square UI Visual Mockup 06 with Real Verified Passport Screen */}
            <div className="w-full bg-neutral-50 border border-neutral-200 p-2.5 my-2 shadow-2xs overflow-hidden relative">
              <div className="relative h-28 w-full bg-neutral-100 border border-neutral-300 overflow-hidden group/pass">
                <img
                  src="/how-it-works/step6-verified-passport.jpg"
                  alt="Verified Digital Product Passport"
                  className="w-full h-full object-cover group-hover/pass:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Status Badges Overlay */}
                <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 flex items-center gap-1 shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  <span>Authentic & Verified</span>
                </div>

                <div className="absolute bottom-1.5 right-1.5 bg-neutral-950 text-white font-mono text-[8px] font-bold px-1.5 py-0.5">
                  Public Passport Live
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[#155EEF] text-xs font-mono font-bold uppercase group-hover:translate-x-1 transition-transform">
              <span>View Live Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default HowItWorks;
