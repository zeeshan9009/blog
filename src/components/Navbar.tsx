import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Menu, X, ShieldCheck, Sparkles, Layers, Cpu, Globe, Lock, BookOpen } from 'lucide-react';

export interface NavItem {
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
    label: 'Product',
    href: '#product',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Identity Verification',
        description: 'Automated biometric & document authentication with sub-second latency.',
        icon: ShieldCheck,
        href: '#identity-verification'
      },
      {
        title: 'Real-Time Fraud Prevention',
        description: 'AI-driven synthetic ID & anomaly detection engine.',
        icon: Sparkles,
        href: '#fraud-prevention'
      },
      {
        title: 'Global Compliance',
        description: 'Instant AML, KYC, and sanctions screening across 190+ countries.',
        icon: Globe,
        href: '#compliance'
      }
    ]
  },
  {
    label: 'How It Works',
    href: '#how-it-works'
  },
  {
    label: 'Industries',
    href: '#industries',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'Fintech & Banking',
        description: 'Frictionless customer onboarding with bank-grade security.',
        icon: Lock,
        href: '#fintech'
      },
      {
        title: 'E-Commerce & Marketplaces',
        description: 'Verify buyer and seller trust without dropping conversion rates.',
        icon: Layers,
        href: '#ecommerce'
      },
      {
        title: 'Enterprise & SaaS',
        description: 'Scale SSO, passkey verification, and multi-tenant access control.',
        icon: Cpu,
        href: '#enterprise'
      }
    ]
  },
  {
    label: 'Pricing',
    href: '#pricing'
  },
  {
    label: 'Developers',
    href: '#developers',
    hasDropdown: true,
    dropdownItems: [
      {
        title: 'API Reference',
        description: 'Comprehensive REST & GraphQL endpoint documentation.',
        icon: BookOpen,
        href: '#docs'
      },
      {
        title: 'SDKs & Libraries',
        description: 'React, Node.js, Python, iOS, and Android drop-in packages.',
        icon: Cpu,
        href: '#sdks'
      }
    ]
  }
];

interface NavbarProps {
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-colors duration-150 font-sans ${isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-300 shadow-xs'
          : 'bg-white border-b border-neutral-200'
        }`}
    >
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Square UI Brand / Logo */}
          <div className="flex items-center">
            <a href="#" className="group flex items-center gap-3 focus:outline-none">
              {/* Sharp Square Geometric Icon */}
              <div className="w-8 h-8 rounded-none bg-black border border-black flex items-center justify-center transition-all duration-150 group-hover:bg-neutral-800">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3" y="3" width="18" height="18" fill="currentColor" />
                  <rect x="7" y="7" width="10" height="10" fill="#000000" />
                  <rect x="10" y="10" width="4" height="4" fill="#2563EB" />
                </svg>
              </div>

              {/* Brand Typography */}
              <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-black">
                VeriPass
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links - Square Style */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-medium transition-colors rounded-none border border-transparent ${activeDropdown === item.label
                      ? 'text-neutral-950 bg-neutral-100 border-neutral-300'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50 hover:border-neutral-200'
                    }`}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-150 ${activeDropdown === item.label ? 'rotate-180 text-neutral-700' : ''
                        }`}
                    />
                  )}
                </a>

                {/* Dropdown Menu - Sharp Square Geometry */}
                {item.hasDropdown && activeDropdown === item.label && item.dropdownItems && (
                  <div className="absolute top-full left-0 pt-1 w-80">
                    <div className="bg-white rounded-none border border-neutral-300 shadow-lg p-2 overflow-hidden">
                      <div className="space-y-1">
                        {item.dropdownItems.map((subItem) => {
                          const Icon = subItem.icon;
                          return (
                            <a
                              key={subItem.title}
                              href={subItem.href}
                              className="group flex items-start gap-3 p-2.5 rounded-none border border-transparent hover:border-neutral-200 hover:bg-neutral-50 transition-colors"
                            >
                              <div className="p-1.5 rounded-none bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors shrink-0 mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                                  {subItem.title}
                                </div>
                                <div className="text-xs text-neutral-500 line-clamp-2 mt-0.5 leading-relaxed font-normal">
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
          </div>

          {/* Right Action Buttons - Square UI */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onOpenAuth ? onOpenAuth('signin') : (window.location.hash = '#login')}
              className="text-[14px] font-medium text-neutral-700 hover:text-neutral-950 px-4 py-2 rounded-none border border-transparent hover:border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Log in
            </button>

            <button
              onClick={() => onOpenAuth ? onOpenAuth('signup') : (window.location.hash = '#get-started')}
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-none text-sm font-semibold text-white bg-[#155EEF] hover:bg-[#124bbf] active:bg-[#0f3ea3] border border-[#155EEF] transition-all duration-150 hover:shadow-xs active:translate-y-0.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Mobile Menu Button - Square */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-none border border-neutral-200 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown - Square UI */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-300 bg-white px-4 pt-3 pb-6">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-none border border-transparent hover:border-neutral-200 hover:bg-neutral-50 text-sm font-medium text-neutral-800 hover:text-blue-600 transition-colors"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAuth) onOpenAuth('signin');
              }}
              className="w-full text-center py-2.5 text-sm font-semibold text-neutral-800 rounded-none border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAuth) onOpenAuth('signup');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-none text-sm font-semibold text-white bg-[#155EEF] hover:bg-blue-700 border border-[#155EEF] transition-colors cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
