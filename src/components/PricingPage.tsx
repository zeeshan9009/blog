import React, { useState } from 'react';
import {
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Building2,
  Factory,
  Boxes,
  Crown,
  Lock,
  ChevronDown,
  ChevronUp,
  Infinity,
  QrCode,
  FileCheck2,
  Users,
  RefreshCw,
  BarChart3,
  ScrollText,
  FileSpreadsheet,
  Globe2,
  ArrowLeft
} from 'lucide-react';

interface PricingPageProps {
  onBack?: () => void;
  onSelectPlan?: (planId: string) => void;
  currentPlanId?: string;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onBack,
  onSelectPlan,
  currentPlanId = 'starter'
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      badge: 'Testing',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Ideal for testing, prototypes, and indie makers evaluating VeriPass.',
      productLimit: '10 Products',
      highlight: false,
      ctaText: 'Start for Free',
      ctaVariant: 'outline',
      features: [
        '10 Digital Product Passports',
        'Unlimited Consumer QR Scans',
        'Public Verifiable Passport Page',
        'Standard Vector QR Generator',
        'Basic Client Record Binding',
        'Basic Scan Count Analytics',
        'Community Support'
      ]
    },
    {
      id: 'starter',
      name: 'Starter',
      badge: 'Small Shops',
      priceMonthly: 9,
      priceYearly: 7,
      description: 'For boutique brands, jewelry shops, and local specialized merchants.',
      productLimit: '100 Products',
      highlight: false,
      ctaText: 'Get Starter Plan',
      ctaVariant: 'outline',
      features: [
        '100 Digital Product Passports',
        'Unlimited Consumer QR Scans',
        'Industrial Bulk QR Generation',
        'Authenticity Certificates (Gold/Slate)',
        'Warranty & Custody Tracking',
        'Customer Directory Management',
        'Secondary Market Ownership Transfer',
        'Stepped Telemetry & Scan Analytics',
        'CSV & Production Data Export'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      badge: 'Most Popular ⭐',
      priceMonthly: 29,
      priceYearly: 24,
      description: 'The core engine for growing consumer brands, fashion, and HVAC manufacturers.',
      productLimit: '1,000 Products',
      highlight: true,
      ctaText: 'Launch Business Plan',
      ctaVariant: 'primary',
      features: [
        '1,000 Digital Product Passports',
        'Unlimited Consumer QR Scans',
        'Multi-Model Series Matrix Generator',
        'Immutable Ownership History Ledger',
        'Custom Brand Vector QR Palettes',
        'Official Digital Security Seals',
        'Full Customer Directory & Assets View',
        'Advanced Device & Regional Telemetry',
        'Factory Production CSV / ERP Manifest',
        'Real-Time Security Nonce Audit Logs',
        '3 Team Member Seats',
        'Priority Email & Chat Support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      badge: 'Established Brands',
      priceMonthly: 79,
      priceYearly: 65,
      description: 'For established mid-market enterprises managing large multi-branch inventory.',
      productLimit: '10,000 Products',
      highlight: false,
      ctaText: 'Upgrade to Professional',
      ctaVariant: 'outline',
      features: [
        '10,000 Digital Product Passports',
        'Unlimited Consumer QR Scans',
        'High-Speed Automated Batch Engine',
        'Multi-Brand & Subsidiary Management',
        'White-Label Passport & Custom Subdomain',
        'Custom Domain Binding (verify.yourbrand.com)',
        'Comprehensive Compliance Audit Exports',
        '10 Team Member Seats',
        'Dedicated Technical Account Manager'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      badge: 'Industrial Scale',
      priceMonthly: 199,
      priceYearly: 169,
      description: 'For national & multinational manufacturers needing custom limits & SAP/ERP links.',
      productLimit: 'Unlimited / Custom',
      highlight: false,
      ctaText: 'Contact Enterprise Sales',
      ctaVariant: 'dark',
      features: [
        'Unlimited Cryptographic Passports',
        'Unlimited Consumer QR Scans',
        'Direct SAP, Oracle & ERP API Integration',
        'Custom On-Premises or Private Cloud Sync',
        'Custom Security Seals & Nonce Governance',
        '99.99% Uptime SLA Agreement',
        'Unlimited Team Seats & Role Permissions',
        '24/7 Dedicated Support & Custom Onboarding'
      ]
    }
  ];

  const comparisonCategories = [
    {
      category: 'Product Passports & QR Engine',
      features: [
        { name: 'Active Cryptographic Passports', free: '10', starter: '100', business: '1,000', pro: '10,000', ent: 'Unlimited' },
        { name: 'Consumer QR Scans Limit', free: 'Unlimited', starter: 'Unlimited', business: 'Unlimited', pro: 'Unlimited', ent: 'Unlimited' },
        { name: 'Industrial Bulk QR Generator (1-Click)', free: '—', starter: '✓ (Up to 100)', business: '✓ (Up to 1,000)', pro: '✓ (Up to 10,000)', ent: '✓ Unlimited' },
        { name: 'Multi-Model Series Matrix (Variants)', free: '—', starter: '—', business: '✓ Full Engine', pro: '✓ Full Engine', ent: '✓ Custom Matrix' },
        { name: 'Custom QR Vector Palettes', free: 'Default Only', starter: '3 Presets', business: 'All 5 Presets', pro: 'Custom Hex Colors', ent: 'Custom Branding' },
        { name: 'High-Res SVG & PNG Vector Downloads', free: '✓', starter: '✓', business: '✓', pro: '✓', ent: '✓' }
      ]
    },
    {
      category: 'Ownership & Customer Management',
      features: [
        { name: 'Customer Directory & VIP Tiers', free: 'Basic (10)', starter: '✓ 100 Clients', business: '✓ 1,000 Clients', pro: '✓ 10,000 Clients', ent: '✓ Unlimited' },
        { name: 'Customer Owned Assets Inspection Drawer', free: '✓', starter: '✓', business: '✓', pro: '✓', ent: '✓' },
        { name: 'Secondary Market Ownership Transfer', free: '—', starter: '✓ Included', business: '✓ Instant Transfer', pro: '✓ Instant Transfer', ent: '✓ Automated API' },
        { name: 'Passport Ownership History Timeline', free: '—', starter: 'Last Transfer', business: '✓ Full Lifecycle', pro: '✓ Full Lifecycle', ent: '✓ Full Lifecycle' }
      ]
    },
    {
      category: 'Certificates & Security Governance',
      features: [
        { name: 'Official Authenticity Certificates', free: '—', starter: '✓ Up to 100', business: '✓ Up to 1,000', pro: '✓ Up to 10,000', ent: '✓ Unlimited' },
        { name: 'Printable Gold & Slate Layouts', free: '—', starter: '✓ Included', business: '✓ Included', pro: '✓ Included', ent: '✓ Custom Seal' },
        { name: 'SHA-256 Nonce Matching & Security Logs', free: 'Basic', starter: 'Standard Trail', business: '✓ Live Audit Stream', pro: '✓ Full Audit Vault', ent: '✓ SIEM / SOC 2 Ready' },
        { name: 'Anti-Counterfeit Strict Mode Guard', free: '✓', starter: '✓', business: '✓', pro: '✓', ent: '✓' }
      ]
    },
    {
      category: 'Analytics, Data & Integrations',
      features: [
        { name: 'Scan & Telemetry Analytics', free: 'Total Count', starter: '30-Day Trend', business: '✓ Full BI Suite', pro: '✓ Advanced BI', ent: '✓ Real-time Telemetry' },
        { name: 'Factory CSV / ERP Manifest Export', free: '—', starter: '✓ CSV Export', business: '✓ Factory Manifest', pro: '✓ Factory Manifest', ent: '✓ Direct API Sync' },
        { name: 'Team Member Seats', free: '1 Seat', starter: '1 Seat', business: '3 Seats', pro: '10 Seats', ent: 'Unlimited' },
        { name: 'Custom Domain (verify.yourbrand.com)', free: '—', starter: '—', business: 'Subdomain', pro: '✓ Custom Domain', ent: '✓ Multi-Domain' }
      ]
    }
  ];

  const faqs = [
    {
      q: 'Why are consumer QR verification scans unlimited on all plans?',
      a: 'We believe product authenticity should never be penalized by consumer popularity. You only pay for the number of physical products / serialized passports you register in your inventory.'
    },
    {
      q: 'How does the $29/mo Business plan handle bulk batches?',
      a: 'The Business plan unlocks the complete Industrial Bulk QR Engine and Multi-Model Series Matrix. You can generate up to 1,000 unique serialized passports (e.g. 1,000 Haier AC units or Dawlance Inverter series) in one automated click with full CSV manifests for factory printing.'
    },
    {
      q: 'Can I upgrade, downgrade, or cancel at any time?',
      a: 'Yes, absolutely. Upgrades take effect immediately with pro-rated billing. Downgrades or cancellations take effect at the end of the current billing cycle.'
    },
    {
      q: 'How does ownership transfer work when a customer resells a product?',
      a: 'Through the Customer Directory, simply select the product and transfer it to the new buyer’s email. The digital twin instantly updates to display the new registered owner and records the date in the immutable ownership history.'
    },
    {
      q: 'Do you offer custom pricing for large industrial manufacturers?',
      a: 'Yes, our Enterprise plan ($199+/mo) is tailored for national and international manufacturers with over 100,000+ units, multi-subsidiary requirements, and SAP/Oracle ERP pipeline integrations.'
    }
  ];

  return (
    <div className="space-y-10 text-left animate-fade-in pb-12 max-w-[1500px] mx-auto">
      
      {/* ========================================================= */}
      {/* 1. HERO PRICING BANNER */}
      {/* ========================================================= */}
      <div className="bg-slate-950 border border-slate-800 text-white p-8 sm:p-12 relative overflow-hidden rounded-none shadow-xl text-center">
        
        {/* Background Grid Accent */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10 select-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-6 left-6 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 text-slate-300 transition-colors cursor-pointer rounded-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        )}

        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#155EEF]/20 border border-[#155EEF]/40 text-[#53B1FD] font-mono text-[11px] font-bold uppercase tracking-widest rounded-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TRANSPARENT ENTERPRISE PRICING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Simple, Scalable Pricing for Modern Brands
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Monetize serialized product volume with zero hidden fees. <strong className="text-white">Every plan includes 100% unlimited consumer verification scans.</strong>
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="pt-5 flex items-center justify-center gap-3">
            <div className="inline-flex items-center bg-slate-900 border border-slate-800 p-1 rounded-none shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-none ${
                  billingCycle === 'monthly'
                    ? 'bg-[#155EEF] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-none flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#155EEF] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[9.5px] font-mono font-black bg-amber-400 text-slate-950 px-1 py-0.2 rounded-none">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. PRICING CARDS GRID (5 TIERS) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-stretch">
        {plans.map((p) => {
          const price = billingCycle === 'monthly' ? p.priceMonthly : p.priceYearly;
          const isCurrent = currentPlanId === p.id;

          return (
            <div
              key={p.id}
              className={`bg-white border flex flex-col justify-between relative rounded-none p-5 transition-all text-left shadow-xs ${
                p.highlight
                  ? 'border-[#155EEF] ring-2 ring-[#155EEF]/20 shadow-md bg-gradient-to-b from-blue-50/20 to-white'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Highlight Tag */}
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#155EEF] text-white font-mono font-black text-[9.5px] uppercase tracking-widest px-3 py-0.5 rounded-none shadow-xs">
                  {p.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-black text-slate-950">{p.name}</span>
                  {!p.highlight && (
                    <span className="text-[9.5px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded-none">
                      {p.badge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 min-h-[32px] leading-tight">
                  {p.description}
                </p>

                {/* Price Display */}
                <div className="my-4 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-950 tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / month
                    </span>
                  </div>
                  <div className="text-[10.5px] font-mono font-bold text-[#155EEF] mt-0.5">
                    Includes {p.productLimit}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Included Features:</div>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11.5px] leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onSelectPlan && onSelectPlan(p.id)}
                  className={`w-full py-2.5 text-xs font-bold transition-all cursor-pointer rounded-none flex items-center justify-center gap-1.5 ${
                    p.highlight
                      ? 'bg-[#155EEF] hover:bg-[#124bbf] text-white shadow-xs'
                      : p.ctaVariant === 'dark'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-800'
                  }`}
                >
                  <span>{p.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 3. GUARANTEE STRIP */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-slate-200 p-6 rounded-none shadow-xs text-left">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-blue-50 border border-blue-200 text-[#155EEF] flex items-center justify-center shrink-0">
            <Infinity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase font-mono">Unlimited Consumer Scans</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Never worry about scan limits. Whether 100 or 1,000,000 consumers scan your QR codes, you pay nothing extra.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase font-mono">256-Bit SHA Tamper Proof</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Every digital passport is cryptographically signed with unique serial nonces to stop counterfeit duplications.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase font-mono">Secondary Ownership Ledger</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Built-in ownership transfer and history tracking to unlock secondary market brand value.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. FULL FEATURE COMPARISON MATRIX TABLE */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-none overflow-hidden text-left">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-base font-black text-slate-950">Detailed Feature-by-Feature Comparison</h3>
          <p className="text-xs text-slate-500 mt-0.5">Complete breakdown of all VeriPass platform capabilities across tiers.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-[10.5px] font-mono text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-bold w-1/3">Platform Features</th>
                <th className="py-3.5 px-3 font-semibold text-center">Free ($0)</th>
                <th className="py-3.5 px-3 font-semibold text-center">Starter ($9)</th>
                <th className="py-3.5 px-3 font-bold text-center text-[#155EEF] bg-blue-50/80">Business ($29) ⭐</th>
                <th className="py-3.5 px-3 font-semibold text-center">Pro ($79)</th>
                <th className="py-3.5 px-3 font-semibold text-center">Enterprise ($199+)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {comparisonCategories.map((cat, cIdx) => (
                <React.Fragment key={cIdx}>
                  <tr className="bg-slate-50 border-t border-b border-slate-200">
                    <td colSpan={6} className="py-2.5 px-4 font-mono font-bold text-[11px] text-slate-900 uppercase tracking-wider">
                      {cat.category}
                    </td>
                  </tr>
                  {cat.features.map((f, fIdx) => (
                    <tr key={fIdx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800">{f.name}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-mono text-[11px]">{f.free}</td>
                      <td className="py-3 px-3 text-center text-slate-700 font-mono text-[11px]">{f.starter}</td>
                      <td className="py-3 px-3 text-center font-bold text-[#155EEF] font-mono text-[11px] bg-blue-50/30">
                        {f.business}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-800 font-mono text-[11px]">{f.pro}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-950 font-mono text-[11px]">{f.ent}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-xs text-left space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">FAQ</div>
          <h3 className="text-xl font-black text-slate-950">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-none overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
