import React from 'react';
import { 
  User, 
  Box, 
  CreditCard, 
  QrCode, 
  Package, 
  Smartphone,
  ArrowRight
} from 'lucide-react';

interface StepItem {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const steps: StepItem[] = [
  {
    number: '01',
    icon: User,
    title: 'COMPANY CONNECTS',
    description: 'Create your business account and dashboard.'
  },
  {
    number: '02',
    icon: Box,
    title: 'PRODUCT ENTERS DATABASE',
    description: 'Add product details, certificates and warranty.'
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'UNIQUE DIGITAL ID CREATED',
    description: 'System generates a permanent product ID.'
  },
  {
    number: '04',
    icon: QrCode,
    title: 'QR / NFC IDENTITY GENERATED',
    description: 'Dynamic QR code is created.'
  },
  {
    number: '05',
    icon: Package,
    title: 'PRODUCT ENTERS THE REAL WORLD',
    description: 'QR tag on product or packaging.'
  },
  {
    number: '06',
    icon: Smartphone,
    title: 'CUSTOMER SCANS & VERIFIES',
    description: 'Views public passport instantly.'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative w-full overflow-hidden bg-white py-10 sm:py-14 border-b border-neutral-200">
      
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none -z-10" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 xl:gap-8">
          
          {/* ========================================================= */}
          {/* LEFT: Section Title */}
          {/* ========================================================= */}
          <div className="w-full xl:w-[220px] flex flex-col items-start text-left shrink-0">
            <h2 className="text-3xl sm:text-4xl lg:text-[38px] font-black tracking-tight uppercase leading-[1.05] mb-3 font-sans">
              <span className="text-neutral-950 block">HOW IT</span>
              <span className="inline-block bg-[#155EEF] text-white px-2.5 py-0.5 mt-1 rounded-none shadow-xs">
                WORKS.
              </span>
            </h2>
            <p className="text-xs sm:text-[13px] text-neutral-500 font-normal leading-relaxed">
              From product to passport in 6 simple steps.
            </p>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: 6 Step Cards Horizontal Pipeline */}
          {/* ========================================================= */}
          <div className="w-full flex-1 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
            <div className="flex items-center min-w-[900px] gap-2.5 sm:gap-3">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isLast = idx === steps.length - 1;

                return (
                  <React.Fragment key={step.number}>
                    {/* Individual Step Card */}
                    <div className="flex-1 bg-white border border-slate-200/90 rounded-none p-4 sm:p-4.5 shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all duration-150 flex flex-col justify-between min-h-[165px] group">
                      
                      {/* Top: Step Number */}
                      <div className="font-mono text-xs font-bold text-slate-900 mb-3">
                        {step.number}
                      </div>

                      {/* Middle: Icon */}
                      <div className="text-neutral-900 mb-3">
                        <Icon className="w-6 h-6 stroke-[1.5] group-hover:text-blue-600 transition-colors" />
                      </div>

                      {/* Bottom: Title & Description */}
                      <div>
                        <h3 className="font-bold text-[11px] sm:text-xs text-neutral-950 tracking-tight uppercase leading-snug mb-1 font-sans">
                          {step.title}
                        </h3>
                        <p className="text-[10px] text-neutral-500 font-normal leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                    </div>

                    {/* Small Arrow between steps */}
                    {!isLast && (
                      <div className="text-slate-400 shrink-0 px-0.5">
                        <ArrowRight className="w-3.5 h-3.5 stroke-[1.75]" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
