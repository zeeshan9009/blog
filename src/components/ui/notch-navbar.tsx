import React, { useState } from "react";
import {
  ArrowUpRight,
  Home,
  ShieldCheck,
  Layers,
  Code2,
  CreditCard,
  Menu,
  X,
  Sparkles,
  QrCode,
  LogIn,
  UserPlus
} from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { VeriPassLogoIcon } from "./VeriPassLogo";

export interface NotchNavbarProps extends React.HTMLAttributes<HTMLElement> {
  onOpenAuth?: (mode: 'signin' | 'signup' | 'dashboard') => void;
  onOpenPricing?: () => void;
  user?: any;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  onClick?: () => void;
}

export function NotchNavbar({
  className,
  onOpenAuth,
  onOpenPricing,
  user,
  ...props
}: NotchNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items configuration tailored to VeriPass
  const leftItems: NavItem[] = [
    { label: "Overview", href: "#overview", icon: Home },
    { label: "One URL", href: "#one-url", icon: QrCode },
    { label: "Provenance", href: "#provenance", icon: Layers }
  ];

  const rightItems: NavItem[] = [
    { label: "Developers", href: "#developers", icon: Code2 },
    { label: "Pricing", href: "#pricing", icon: CreditCard, onClick: onOpenPricing }
  ];

  return (
    <>
      <header className={cn("fixed top-0 inset-x-0 z-50 h-16 flex px-0 select-none", className)} {...props}>

        {/* Left Side Bar - Flexible width with cyber border lines */}
        <div className="flex-1 h-10 bg-white/95 backdrop-blur-md z-20 relative min-w-0 border-b border-neutral-200">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="#155EEF" strokeOpacity={0.12} strokeWidth={1} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="#000000" strokeOpacity={0.04} strokeWidth={0.5} />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px">

          {/* Left Slice (Corner Curve) */}
          <div className="w-[45px] sm:w-[50px] h-full relative shrink-0">
            <div
              className="absolute inset-0 bg-white/95 backdrop-blur-md shadow-xs"
              style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }}
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" fill="none" stroke="#155EEF" strokeOpacity={0.2} strokeWidth={1} />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" fill="none" stroke="#000000" strokeOpacity={0.05} strokeWidth={0.5} />
            </svg>
          </div>

          {/* Center Slice (Flexible Content & Links Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
            {/* Background & Bottom Outline */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-md shadow-xs">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="#155EEF" strokeOpacity={0.2} strokeWidth={1} />
                <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="#000000" strokeOpacity={0.05} strokeWidth={0.5} />
              </svg>
            </div>

            {/* Content Layer */}
            <div className="relative w-full h-full flex items-end justify-between pb-2.5 px-3 sm:px-6 md:px-8 gap-4 sm:gap-6">

              {/* Desktop Left Nav */}
              <nav className="hidden lg:flex gap-6 mb-0.5 shrink-0">
                {leftItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#155EEF] transition-colors whitespace-nowrap"
                    >
                      <Icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-[#155EEF]" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>

              {/* Mobile Menu Button (Left) */}
              <button
                className="lg:hidden mb-0.5 p-1 text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Central Brand Logo (Only Logo Icon, Full Size) */}
              <div className="flex justify-center shrink-0 mx-2 sm:mx-4 mb-0.5">
                <a
                  href="#"
                  className="flex items-center justify-center group cursor-pointer"
                  title="VeriPass Home"
                  aria-label="VeriPass"
                >
                  <VeriPassLogoIcon className="w-10 h-10 sm:w-11 sm:h-11 group-hover:scale-105 transition-transform duration-200 drop-shadow-xs" />
                </a>
              </div>

              {/* Desktop Right Nav & Actions */}
              <nav className="hidden lg:flex gap-5 items-center shrink-0 mb-0.5">
                {rightItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                      }}
                      className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#155EEF] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-[#155EEF]" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}

                <div className="flex gap-2 pl-3 border-l border-neutral-200 shrink-0 items-center">
                  <button
                    onClick={() => onOpenAuth ? onOpenAuth(user ? 'dashboard' : 'signin') : (window.location.hash = '#login')}
                    className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-950 uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {user ? 'Dashboard' : 'Sign In'}
                  </button>
                  <button
                    onClick={() => onOpenAuth ? onOpenAuth(user ? 'dashboard' : 'signup') : (window.location.hash = '#signup')}
                    className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#155EEF] hover:bg-[#124bbf] transition-all shadow-xs whitespace-nowrap cursor-pointer"
                  >
                    {user ? 'Open App' : 'Get Started'}
                  </button>
                </div>
              </nav>

              {/* Mobile Right Action */}
              <div className="lg:hidden flex items-center gap-1.5 mb-0.5">
                <button
                  onClick={() => onOpenAuth ? onOpenAuth(user ? 'dashboard' : 'signin') : (window.location.hash = '#login')}
                  className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white bg-[#155EEF] cursor-pointer"
                >
                  {user ? 'App' : 'Login'}
                </button>
              </div>

            </div>
          </div>

          {/* Right Slice (Corner Curve) */}
          <div className="w-[45px] sm:w-[50px] h-full relative shrink-0 -ml-px">
            <div
              className="absolute inset-0 bg-white/95 backdrop-blur-md shadow-xs"
              style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }}
            />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" fill="none" stroke="#155EEF" strokeOpacity={0.2} strokeWidth={1} />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" fill="none" stroke="#000000" strokeOpacity={0.05} strokeWidth={0.5} />
            </svg>
          </div>

        </div>

        {/* Right Side Bar - Flexible width with cyber border lines */}
        <div className="flex-1 h-10 bg-white/95 backdrop-blur-md z-20 relative min-w-0 -ml-px border-b border-neutral-200">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="#155EEF" strokeOpacity={0.12} strokeWidth={1} />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="#000000" strokeOpacity={0.04} strokeWidth={0.5} />
          </svg>
        </div>

      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-neutral-200 p-5 lg:hidden shadow-2xl text-left"
          >
            <nav className="flex flex-col gap-2 text-xs font-bold uppercase tracking-wider">
              {[...leftItems, ...rightItems].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 text-neutral-800 hover:text-[#155EEF] transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#155EEF]" />
                    <span>{item.label}</span>
                  </a>
                );
              })}

              <div className="h-px bg-neutral-200 my-2" />

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth(user ? 'dashboard' : 'signin');
                  }}
                  className="w-full py-2.5 text-center font-bold bg-slate-100 hover:bg-slate-200 text-neutral-900 uppercase tracking-wider"
                >
                  {user ? 'Go to Dashboard' : 'Sign In to Portal'}
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth(user ? 'dashboard' : 'signup');
                  }}
                  className="w-full py-2.5 text-center font-bold bg-[#155EEF] hover:bg-blue-700 text-white uppercase tracking-wider shadow-sm"
                >
                  {user ? 'Launch Cryptographic Suite' : 'Create Enterprise Account'}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NotchNavbar;
