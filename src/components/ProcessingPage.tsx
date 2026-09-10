import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ArrowRight,
  ShieldCheck, 
  Check, 
  Lock, 
  Sparkles,
  Cpu,
  Server,
  Terminal,
  Activity,
  KeyRound,
  Database
} from 'lucide-react';
import { GeometricBoxLoader } from './Loader';

interface ProcessingPageProps {
  onClose?: () => void;
  onComplete?: () => void;
}

export const ProcessingPage: React.FC<ProcessingPageProps> = ({ 
  onClose,
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState<number>(2); // 1, 2, 3, 4, 5 (Done)
  const [progress, setProgress] = useState<number>(35);
  const [activeLog, setActiveLog] = useState<string>('Initiating cryptographic handshake...');
  const [logs, setLogs] = useState<string[]>([
    '[00:01] System initialized. TLS 1.3 socket established.',
    '[00:02] Querying corporate registry & business verification nodes...'
  ]);

  useEffect(() => {
    // Dynamic progressive validation simulation
    const t1 = setTimeout(() => {
      setCurrentStep(3);
      setProgress(68);
      setActiveLog('Minting zero-trust digital identity certificate...');
      setLogs(prev => [
        ...prev,
        '[00:03] Business authenticity verified. SHA-256 hash valid.',
        '[00:04] Generating cryptographic zero-trust passport keys...'
      ]);
    }, 2000);

    const t2 = setTimeout(() => {
      setCurrentStep(4);
      setProgress(90);
      setActiveLog('Configuring secure enterprise dashboard & nodes...');
      setLogs(prev => [
        ...prev,
        '[00:05] Identity keys minted successfully.',
        '[00:06] Provisioning distributed analytics pipeline...'
      ]);
    }, 4200);

    const t3 = setTimeout(() => {
      setCurrentStep(5);
      setProgress(100);
      setActiveLog('Verification completed. Enterprise environment ready.');
      setLogs(prev => [
        ...prev,
        '[00:07] All security audits passed (100%). Ready for deployment.'
      ]);
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: 'Company details validated',
      subtext: 'Registry and organization verified',
      icon: Database,
      time: '0.3s'
    },
    {
      id: 2,
      title: 'Business authenticity screening',
      subtext: 'Tax ID and global compliance check',
      icon: ShieldCheck,
      time: '0.8s'
    },
    {
      id: 3,
      title: 'Generating digital identity credentials',
      subtext: 'Minting zero-trust encryption keys',
      icon: KeyRound,
      time: currentStep === 3 ? 'In progress' : currentStep > 3 ? '1.1s' : 'Queued'
    },
    {
      id: 4,
      title: 'Configuring enterprise dashboard',
      subtext: 'Provisioning digital passport nodes',
      icon: Cpu,
      time: currentStep === 4 ? 'In progress' : currentStep > 4 ? '0.7s' : 'Waiting'
    }
  ];

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#FAFAFC] text-neutral-900 flex flex-col justify-between font-sans selection:bg-[#155EEF] selection:text-white">
      
      {/* ========================================================= */}
      {/* TOP HEADER (Compact & Fixed Height) */}
      {/* ========================================================= */}
      <header className="w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 shrink-0 shadow-2xs">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12 h-14 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={onClose}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 bg-[#155EEF] rounded-xs flex items-center justify-center text-white shadow-xs group-hover:bg-[#124bbf] transition-colors">
              <div className="w-3.5 h-3.5 border-2 border-white rounded-none border-r-transparent border-b-transparent rotate-45" />
            </div>
            <div className="flex items-center">
              <span className="text-lg font-black tracking-tight text-neutral-950 font-sans">
                VeriPass
              </span>
              <span className="text-[10px] ml-0.5 font-bold text-[#155EEF]">CORE</span>
            </div>
          </div>

          {/* Top Actions & Security Status */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden md:flex items-center gap-2 text-neutral-500 bg-neutral-100/80 px-2.5 py-1 rounded-none font-mono text-[11px] border border-neutral-200">
              <Activity className="w-3 h-3 text-[#155EEF] animate-pulse" />
              <span>EU-CENTRAL-1</span>
              <span className="text-neutral-300">|</span>
              <span className="text-emerald-600 font-bold">14ms</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-none font-mono text-[10.5px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-flex absolute" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-flex relative" />
              <span className="tracking-wide">TLS 1.3 SECURE</span>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-950 font-semibold px-2.5 py-1 rounded-none border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer text-xs"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Exit</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN SCREEN-FIT CONTENT CONTAINER */}
      {/* ========================================================= */}
      <main className="flex-1 min-h-0 flex items-center justify-center max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-12 py-3 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full">
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: Animated Geometric Loader & High-Tech Stage */}
          {/* ======================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center items-start text-left space-y-3.5">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-[#155EEF] font-mono text-[10.5px] uppercase tracking-widest font-bold shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#155EEF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#155EEF]" />
              </span>
              <span>LIVE CREDENTIAL VERIFICATION</span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-neutral-950 uppercase leading-[1.12] mb-1.5 font-sans">
                <span>We’re verifying your</span><br />
                <span className="text-[#155EEF] bg-gradient-to-r from-[#155EEF] to-[#0084FF] bg-clip-text text-transparent">
                  company credentials
                </span>
              </h1>
              <p className="text-xs sm:text-[13px] text-neutral-600 font-normal leading-relaxed max-w-lg">
                Automated protocol is validating registry records, minting cryptographic signatures, and provisioning zero-trust nodes.
              </p>
            </div>

            {/* High-Tech Stage with Custom Geometric Loader */}
            <div className="w-full relative overflow-hidden bg-white border border-neutral-200/90 rounded-none p-5 sm:p-6 shadow-xs flex flex-col items-center justify-center">
              
              {/* Subtle background tech grid */}
              <div 
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                  backgroundSize: '18px 18px'
                }}
              />

              {/* Corner crosshairs for technical aesthetic */}
              <span className="absolute top-2 left-2 text-neutral-300 font-mono text-xs select-none">+</span>
              <span className="absolute top-2 right-2 text-neutral-300 font-mono text-xs select-none">+</span>
              <span className="absolute bottom-2 left-2 text-neutral-300 font-mono text-xs select-none">+</span>
              <span className="absolute bottom-2 right-2 text-neutral-300 font-mono text-xs select-none">+</span>

              {/* Top stage telemetry indicator */}
              <div className="w-full flex items-center justify-between text-[10.5px] font-mono text-neutral-400 mb-3 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#155EEF] animate-ping" />
                  <span className="uppercase text-neutral-600 font-semibold tracking-wider">ASYNC_PROCESSOR_V2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-neutral-400" />
                  <span>HASH: 0x89F4...2E1C</span>
                </div>
              </div>

              {/* Loader Centerpiece */}
              <div className="py-2 flex flex-col items-center justify-center">
                <GeometricBoxLoader color="#155EEF" size={1} />
              </div>

              {/* Dynamic Status Ticker under Loader */}
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-50 border border-neutral-200 text-neutral-700 font-mono text-[11px]">
                  <Loader2 className="w-3 h-3 animate-spin text-[#155EEF]" />
                  <span>{activeLog}</span>
                </div>
              </div>

            </div>

            {/* Live Terminal Log Stream (Mini Console) */}
            <div className="w-full bg-neutral-950 text-neutral-300 border border-neutral-800 p-3 font-mono text-[11px] shadow-xs">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-800 text-[10px] text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-[#155EEF]" />
                  <span className="uppercase tracking-wider font-semibold text-neutral-400">Telemetry Stream</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-neutral-400 text-[9.5px]">LIVE</span>
                </div>
              </div>
              <div className="space-y-0.5 text-[11px] leading-snug max-h-12 overflow-hidden">
                {logs.slice(-2).map((log, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-neutral-300 truncate">
                    <span className="text-[#155EEF] select-none font-bold">›</span>
                    <span className={index === 1 ? 'text-white font-medium' : 'text-neutral-400'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: Live Verification Telemetry & Checklist */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center w-full">
            
            {/* Telemetry Card */}
            <div className="w-full bg-white border border-neutral-200 rounded-none p-5 sm:p-5.5 shadow-xs">
              
              {/* Card Header: Progress Bar */}
              <div className="mb-4 text-left">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5 text-[11.5px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#155EEF]" />
                    <span>Identity Provisioning</span>
                  </span>
                  <span className="font-bold text-[#155EEF] text-xs font-mono">{progress}%</span>
                </div>

                {/* Progress track */}
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#155EEF] via-[#2563EB] to-[#00C2FF] transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Vertical Timeline Steps */}
              <div className="space-y-3 relative text-left">
                
                {/* Vertical connecting line */}
                <div className="absolute top-3.5 bottom-3.5 left-[13px] w-[2px] bg-neutral-100 z-0" />

                {steps.map((step) => {
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  const isPending = currentStep < step.id;

                  return (
                    <div key={step.id} className="flex items-start gap-3 relative z-10">
                      
                      {/* Step Status Icon */}
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-400 text-emerald-600 flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-[#155EEF] text-[#155EEF] flex items-center justify-center shadow-xs animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-neutral-50 border border-neutral-300 text-neutral-300 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex items-start justify-between min-w-0">
                        <div className="pr-2 truncate">
                          <div className={`text-[12.5px] font-bold leading-tight truncate ${
                            isCompleted ? 'text-neutral-900' : isCurrent ? 'text-[#155EEF]' : 'text-neutral-400'
                          }`}>
                            {step.title}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-normal leading-tight mt-0.5 truncate">
                            {step.subtext}
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono shrink-0 px-2 py-0.5 rounded-xs ${
                          isCompleted ? 'bg-emerald-50 text-emerald-700 font-semibold' : isCurrent ? 'bg-blue-50 text-blue-700 font-bold animate-pulse' : 'bg-neutral-50 text-neutral-400'
                        }`}>
                          {step.time}
                        </span>
                      </div>

                    </div>
                  );
                })}

              </div>

              {/* Bottom Action Bar */}
              <div className="mt-4 pt-3.5 border-t border-neutral-100">
                {currentStep === 5 ? (
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-emerald-50 border border-emerald-200 shadow-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Verification complete!</span>
                    </div>
                    <button
                      onClick={onComplete || onClose}
                      className="px-3 py-1.5 bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] text-white font-bold rounded-none text-xs transition-all flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
                    >
                      <span>Dashboard</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50/80 border border-blue-200/70 text-[11.5px] text-[#175CD3] font-medium">
                    <Clock className="w-3.5 h-3.5 shrink-0 text-[#155EEF] animate-pulse" />
                    <span className="truncate">You’ll be redirected automatically when ready.</span>
                  </div>
                )}
              </div>

            </div>

            {/* Enterprise Trust & Security Badges */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="bg-white border border-neutral-200 py-1.5 px-2 flex flex-col items-center justify-center">
                <Lock className="w-3 h-3 text-[#155EEF] mb-0.5" />
                <span className="text-[9.5px] font-mono font-bold text-neutral-800">256-BIT SHA</span>
                <span className="text-[8.5px] text-neutral-500">Encrypted</span>
              </div>
              <div className="bg-white border border-neutral-200 py-1.5 px-2 flex flex-col items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-emerald-600 mb-0.5" />
                <span className="text-[9.5px] font-mono font-bold text-neutral-800">SOC2 TYPE II</span>
                <span className="text-[8.5px] text-neutral-500">Compliant</span>
              </div>
              <div className="bg-white border border-neutral-200 py-1.5 px-2 flex flex-col items-center justify-center">
                <Cpu className="w-3 h-3 text-indigo-600 mb-0.5" />
                <span className="text-[9.5px] font-mono font-bold text-neutral-800">ZERO-TRUST</span>
                <span className="text-[8.5px] text-neutral-500">Decentralized</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ========================================================= */}
      {/* PROFESSIONAL FOOTER (Compact) */}
      {/* ========================================================= */}
      <footer className="w-full border-t border-neutral-200 bg-white py-2 px-6 sm:px-10 lg:px-12 text-[11px] text-neutral-500 shrink-0">
        <div className="max-w-[1480px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-3 font-mono text-[10.5px]">
            <span>© 2026 VeriPass Technologies Inc.</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-400">Enterprise Engine v4.8</span>
          </div>
          <div className="flex items-center gap-3 text-[10.5px]">
            <span className="hover:text-neutral-800 transition-colors cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-neutral-800 transition-colors cursor-pointer">Privacy</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">All Systems Operational</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
