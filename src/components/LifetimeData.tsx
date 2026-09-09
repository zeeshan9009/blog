import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  ShieldCheck, 
  FileCheck, 
  Wrench, 
  UserCheck, 
  Lock, 
  RotateCw,
  Check
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    icon: Sparkles,
    title: 'CREATED',
    description: 'Product registered'
  },
  {
    id: '2',
    icon: ShoppingBag,
    title: 'SOLD',
    description: 'To customer'
  },
  {
    id: '3',
    icon: ShieldCheck,
    title: 'VERIFIED',
    description: 'Authenticity check'
  },
  {
    id: '4',
    icon: FileCheck,
    title: 'WARRANTY',
    description: 'Activated'
  },
  {
    id: '5',
    icon: Wrench,
    title: 'SERVICED',
    description: 'Maintenance history'
  },
  {
    id: '6',
    icon: UserCheck,
    title: 'OWNERSHIP',
    description: 'Transferred'
  }
];

export const LifetimeData: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string>('3');

  return (
    <section className="relative w-full overflow-hidden bg-[#070A11] text-white py-12 sm:py-16 border-b border-neutral-800">
      
      {/* Subtle glowing ambient backdrop */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid line texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none -z-10" />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-10 xl:gap-12">
          
          {/* ========================================================= */}
          {/* LEFT: Headline & Connected Lifecycle Timeline */}
          {/* ========================================================= */}
          <div className="w-full xl:w-[50%] flex flex-col items-start text-left">
            
            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight uppercase leading-[1.06] mb-8 font-sans">
              <span className="text-white block">ONE PRODUCT.</span>
              <span className="text-white block">A LIFETIME OF DATA.</span>
            </h2>

            {/* Horizontal Lifecycle Timeline Track */}
            <div className="w-full overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin">
              <div className="flex items-center min-w-[560px] relative py-2">
                
                {/* Continuous Connecting Blue Line */}
                <div className="absolute top-5 left-6 right-6 h-[1.5px] bg-[#1E3A8A] -z-0" />

                {timelineEvents.map((event, idx) => {
                  const Icon = event.icon;
                  const isCurrent = activeStep === event.id;
                  const isLast = idx === timelineEvents.length - 1;

                  return (
                    <div 
                      key={event.id}
                      onClick={() => setActiveStep(event.id)}
                      className="flex-1 flex flex-col items-center text-center cursor-pointer group relative z-10 px-1"
                    >
                      {/* Timeline Glowing Node Icon */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 mb-3 border ${
                        isCurrent 
                          ? 'bg-[#155EEF] border-blue-400 text-white shadow-lg shadow-blue-500/40 scale-110'
                          : 'bg-[#0B1222] border-blue-900/80 text-blue-400 hover:border-blue-500 hover:text-white'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Node Title & Description */}
                      <div className="font-bold text-[10px] sm:text-[11px] text-white tracking-wider uppercase leading-snug">
                        {event.title}
                      </div>
                      <div className="text-[9px] text-slate-400 font-normal leading-tight mt-0.5">
                        {event.description}
                      </div>

                      {/* Small blue dot between nodes on the track */}
                      {!isLast && (
                        <div className="absolute top-4 -right-1 w-1.5 h-1.5 rounded-full bg-blue-500/60 hidden sm:block" />
                      )}
                    </div>
                  );
                })}

              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT: Live Digital Passport Browser Inspector Card */}
          {/* ========================================================= */}
          <div className="w-full xl:w-[48%] flex justify-center xl:justify-end shrink-0">
            
            <div className="w-full max-w-[620px] bg-white text-slate-900 rounded-none border border-slate-700/60 shadow-2xl overflow-hidden">
              
              {/* Browser Address Bar Header */}
              <div className="bg-[#f8fafc] border-b border-slate-200 px-3.5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-slate-700">
                  <div className="w-4 h-4 bg-emerald-500 rounded-none flex items-center justify-center">
                    <Lock className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span>veripass.com/p/VP-2026-8F4K29</span>
                </div>
                <div className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                  <RotateCw className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Passport Card Content */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  
                  {/* Product Ring Image */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-neutral-50 border border-slate-200 p-1.5 shrink-0 flex items-center justify-center">
                    <img
                      src="/diamond-ring.jpg"
                      alt="18K Diamond Ring"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Product Specs & Metadata */}
                  <div className="flex-1 w-full">
                    
                    {/* Verified Badge & Heading */}
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider rounded-none">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>VERIFIED AUTHENTIC PRODUCT</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-950 mb-3 font-sans">
                      18K Diamond Ring
                    </h3>

                    {/* Dual-Column Metadata Grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono border-t border-slate-100 pt-2">
                      
                      {/* Column 1 */}
                      <div>
                        <div className="text-slate-400 text-[9px] uppercase">Manufacturer</div>
                        <div className="font-semibold text-slate-800">Albedar</div>
                      </div>

                      {/* Column 2 */}
                      <div>
                        <div className="text-slate-400 text-[9px] uppercase">Stone</div>
                        <div className="font-semibold text-slate-800">Natural Diamond</div>
                      </div>

                      {/* Column 1 */}
                      <div>
                        <div className="text-slate-400 text-[9px] uppercase">Product ID</div>
                        <div className="font-semibold text-slate-800">VP-2026-8F4K29</div>
                      </div>

                      {/* Column 2 */}
                      <div>
                        <div className="text-slate-400 text-[9px] uppercase">Certificate</div>
                        <div className="font-semibold text-emerald-600">Verified</div>
                      </div>

                      {/* Column 1 */}
                      <div>
                        <div className="text-slate-400 text-[9px] uppercase">Gold</div>
                        <div className="font-semibold text-slate-800">18K / 750</div>
                      </div>

                      {/* Column 2 */}
                      <div>
                        <div className="text-slate-400 text-[9px] uppercase">Warranty</div>
                        <div className="font-semibold text-emerald-600">Active Until 2028</div>
                      </div>

                      {/* Column 1 */}
                      <div>
                        <div className="text-slate-400 text-[9px] uppercase">Weight</div>
                        <div className="font-semibold text-slate-800">8.5 grams</div>
                      </div>

                      {/* Column 2 */}
                      <div>
                        <div className="text-slate-400 text-[9px] uppercase">Ownership</div>
                        <div className="font-semibold text-slate-800">Registered</div>
                      </div>

                    </div>

                  </div>

                  {/* QR Code Matrix on Far Right */}
                  <div className="hidden sm:flex flex-col items-center justify-center p-1 border border-slate-200 shrink-0">
                    <svg
                      className="w-18 h-18 text-neutral-900"
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
                      <rect x="38" y="20" width="12" height="6" />
                      <rect x="54" y="20" width="8" height="8" />
                      <rect x="8" y="38" width="6" height="6" />
                      <rect x="38" y="38" width="8" height="8" fill="#155EEF" />
                      <rect x="50" y="38" width="14" height="6" />
                      <rect x="70" y="38" width="6" height="14" />
                      <rect x="38" y="70" width="14" height="6" />
                      <rect x="72" y="82" width="14" height="10" />
                    </svg>
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
