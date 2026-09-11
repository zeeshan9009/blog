import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Menu, X, LayoutDashboard, LogOut, ShieldCheck, Sparkles, Layers, Cpu, Globe, BookOpen, Compass, Puzzle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VeriPassLogoIcon } from './ui/VeriPassLogo';

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
  }[];
}

const navItems: NavItem[] = [
  {
    label: 'Products',
    href: '#products',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Digital Product Passports',
        description: 'Permanent cryptographic IDs & DPP compliance for physical goods.',
        icon: ShieldCheck,
        href: '#passport'
      },
      {
        title: 'Dynamic QR & NFC Serials',
        description: 'Instant redirect management & tamper-proof authentication.',
        icon: Sparkles,
        href: '#dynamic-qr'
      },
      {
        title: 'Provenance & Warranty Ledger',
        description: 'Immutable lifecycle, repair tracking, and secondary ownership.',
        icon: Layers,
        href: '#warranty'
      }
    ]
  },
  {
    label: 'Templates',
    href: '#templates',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Luxury Goods & Watches',
        description: 'High-security serials, certificates of origin & anti-counterfeiting.',
        icon: Compass,
        href: '#templates-luxury'
      },
      {
        title: 'Electronics & Hardware',
        description: 'Warranty registration, manuals & serial activation workflows.',
        icon: Cpu,
        href: '#templates-electronics'
      },
      {
        title: 'EU DPP 2026 Compliance',
        description: 'Pre-formatted carbon, material, and circularity passport templates.',
        icon: FileText,
        href: '#templates-dpp'
      }
    ]
  },
  {
    label: 'Integrations',
    href: '#integrations',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Shopify Plus & Commerce',
        description: 'Auto-generate passports on order fulfillment and shipping.',
        icon: Puzzle,
        href: '#shopify'
      },
      {
        title: 'SAP & Oracle SCM',
        description: 'Enterprise ERP sync for factory batch production & serials.',
        icon: Cpu,
        href: '#sap'
      },
      {
        title: 'REST API & Webhooks',
        description: 'Programmatic issuance with sub-100ms global latency.',
        icon: Globe,
        href: '#api-docs'
      }
    ]
  },
  {
    label: 'Resources',
    href: '#resources',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Developer Documentation',
        description: 'Complete guides, SDKs, and code samples.',
        icon: BookOpen,
        href: '#docs'
      },
      {
        title: 'EU DPP 2026 Guide',
        description: 'Everything brands need to know about EU regulations.',
        icon: FileText,
        href: '#dpp-guide'
      }
    ]
  },
  {
    label: 'Pricing',
    href: '#pricing'
  }
];

interface NavbarProps {
  onOpenAuth?: (mode: 'signin' | 'signup' | 'dashboard') => void;
  onOpenPricing?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenPricing }) => {
  const { user, signOut } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-[1240px] mx-auto pointer-events-auto">
        
        {/* Floating Rounded Pill Bar (Exact match to Fillout reference style) */}
        <div className="bg-white/90 backdrop-blur-md border border-neutral-200/90 rounded-2xl shadow-sm px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
          
          {/* Left Brand Logo */}
          <div className="flex items-center gap-2.5">
            <a href="#" className="flex items-center gap-2.5 group focus:outline-none">
              <VeriPassLogoIcon className="w-8 h-8 sm:w-8.5 sm:h-8.5 object-contain group-hover:scale-105 transition-transform" />
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-900 font-sans">
                VeriPass
              </span>
            </a>
          </div>

          {/* Center Navigation Links with Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.label === 'Pricing') {
                      e.preventDefault();
                      if (onOpenPricing) onOpenPricing();
                      else window.location.hash = '#pricing';
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeDropdown === item.label
                      ? 'text-neutral-950 bg-neutral-100'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-150 ${
                        activeDropdown === item.label ? 'rotate-180 text-neutral-700' : ''
                      }`}
                    />
                  )}
                </a>

                {/* Dropdown Popup */}
                {item.hasDropdown && activeDropdown === item.label && item.dropdownItems && (
                  <div className="absolute top-full left-0 pt-2 w-72 sm:w-80">
                    <div className="bg-white rounded-xl border border-neutral-200 shadow-xl p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="space-y-1">
                        {item.dropdownItems.map((subItem) => {
                          const Icon = subItem.icon;
                          return (
                            <a
                              key={subItem.title}
                              href={subItem.href}
                              className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
                            >
                              <div className="p-1.5 rounded-md bg-blue-50 text-[#155EEF] group-hover:bg-[#155EEF] group-hover:text-white transition-colors shrink-0 mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-neutral-900 group-hover:text-[#155EEF] transition-colors">
                                  {subItem.title}
                                </div>
                                <div className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 leading-snug">
                                  {subItem.description}
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('dashboard') : (window.location.hash = '#dashboard')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] transition-all shadow-xs cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => signOut()}
                  className="text-xs font-semibold text-neutral-500 hover:text-red-600 px-2.5 py-2 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth('signin') : (window.location.hash = '#login')}
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Log in
                </button>

                <button
                  onClick={() => onOpenAuth ? onOpenAuth('signup') : (window.location.hash = '#get-started')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#222222] hover:bg-black active:bg-neutral-900 transition-all shadow-sm cursor-pointer group"
                >
                  <span>Get started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Popup */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (item.label === 'Pricing') {
                        e.preventDefault();
                        if (onOpenPricing) onOpenPricing();
                        else window.location.hash = '#pricing';
                      }
                    }}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-neutral-800 hover:text-[#155EEF] hover:bg-neutral-50 transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && <ChevronDown className="w-4 h-4 text-neutral-400" />}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-col gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('dashboard');
                      else window.location.hash = '#dashboard';
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#155EEF] hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('signin');
                    }}
                    className="w-full text-center py-2 text-sm font-medium text-neutral-800 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('signup');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#222222] hover:bg-black transition-colors cursor-pointer"
                  >
                    <span>Get started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
