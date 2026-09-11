import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Award, FileText } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section className="w-full bg-[#FAFAFA] py-16 lg:py-24 border-b border-neutral-200">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="bg-[#051C14] border border-[#144733] rounded-2xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#65F09D]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#144733] text-[#65F09D] text-xs font-mono font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-4 h-4 text-[#65F09D]" />
                <span>ENTERPRISE SECURITY</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-tight mb-4 font-sans">
                Enterprise Ready.<br />
                Certified & Secure.
              </h2>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                Engineered for Fortune 500 supply chains, military-grade provenance, and strict international consumer data regulations.
              </p>

              <div className="space-y-3 font-mono text-xs text-neutral-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#65F09D] shrink-0" />
                  <span>SOC 2 Type II and ISO/IEC 27001:2022 audited</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#65F09D] shrink-0" />
                  <span>Zero-knowledge cryptographic scan proofs & tamper alarms</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-[#0A261C] border border-[#144733] rounded-xl p-5 flex flex-col items-center text-center justify-center min-h-[140px]">
                <ShieldCheck className="w-8 h-8 text-[#65F09D] mb-2" />
                <div className="font-mono text-sm font-black text-white">SOC 2</div>
                <div className="font-mono text-[10px] text-neutral-400">TYPE II CERTIFIED</div>
              </div>
              <div className="bg-[#0A261C] border border-[#144733] rounded-xl p-5 flex flex-col items-center text-center justify-center min-h-[140px]">
                <Award className="w-8 h-8 text-[#65F09D] mb-2" />
                <div className="font-mono text-sm font-black text-white">ISO 27001</div>
                <div className="font-mono text-[10px] text-neutral-400">AUDITED</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
