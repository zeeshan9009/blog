import React, { useState, useEffect } from 'react';
import { GlobalScanMap } from './GlobalScanMap';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Box,
  QrCode,
  FileCheck2,
  Users,
  UserCheck,
  BarChart3,
  ScrollText,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Scan,
  FileText,
  TrendingUp,
  MoreHorizontal,
  ExternalLink,
  Sparkles,
  ArrowUp,
  ArrowLeft,
  Activity,
  Layers,
  ChevronRight,
  Lock,
  Globe2,
  Check,
  LogOut
} from 'lucide-react';

interface DashboardPageProps {
  onBackToHome?: () => void;
  initialCategory?: string;
}

// Business categories data structure
interface BusinessData {
  id: string;
  categoryName: string;
  companyName: string;
  companyId: string;
  icon: string;
  latestProduct: {
    title: string;
    id: string;
    category: string;
  };
  heroImage: string;
  fallbackEmoji: string;
  products: Array<{
    name: string;
    id: string;
    category: string;
    status: string;
    date: string;
    icon: string;
  }>;
}

const businessCategories: Record<string, BusinessData> = {
  jewelry: {
    id: 'jewelry',
    categoryName: 'Luxury & Fine Jewelry',
    companyName: 'Albadar Jewellers',
    companyId: 'COMP-8472',
    icon: '💎',
    latestProduct: {
      title: '18K Diamond Ring',
      id: 'VP-2026-BF4K29',
      category: 'Ring'
    },
    heroImage: '/hero-3d-pedestal.png',
    fallbackEmoji: '💍',
    products: [
      { name: '18K Diamond Ring', id: 'VP-2026-BF4K29', category: 'Ring', status: 'Verified', date: 'Sep 28, 2026', icon: '💍' },
      { name: 'Gold Necklace', id: 'VP-2026-GN3921', category: 'Necklace', status: 'Verified', date: 'Sep 27, 2026', icon: '📿' },
      { name: 'Luxury Watch', id: 'VP-2026-WT7710', category: 'Watch', status: 'Verified', date: 'Sep 26, 2026', icon: '⌚' },
      { name: 'Diamond Earrings', id: 'VP-2026-ER6654', category: 'Earrings', status: 'Pending', date: 'Sep 25, 2026', icon: '✨' },
      { name: 'Gold Bracelet', id: 'VP-2026-BR4432', category: 'Bracelet', status: 'Verified', date: 'Sep 24, 2026', icon: '💫' },
      { name: "Men's Ring", id: 'VP-2026-MR1187', category: 'Ring', status: 'Verified', date: 'Sep 23, 2026', icon: '🔘' }
    ]
  },
  watches: {
    id: 'watches',
    categoryName: 'Watches & Horology',
    companyName: 'Chronos Genève',
    companyId: 'COMP-9912',
    icon: '⌚',
    latestProduct: {
      title: 'Tourbillon Titanium 42mm',
      id: 'VP-2026-WT9012',
      category: 'Chronograph'
    },
    heroImage: '/hero-3d-pedestal.png',
    fallbackEmoji: '⌚',
    products: [
      { name: 'Tourbillon Titanium 42mm', id: 'VP-2026-WT9012', category: 'Chronograph', status: 'Verified', date: 'Sep 28, 2026', icon: '⌚' },
      { name: 'Nautilus Rose Gold', id: 'VP-2026-NR4419', category: 'Dress Watch', status: 'Verified', date: 'Sep 27, 2026', icon: '⏱️' },
      { name: 'Carbon Diver 300M', id: 'VP-2026-CD1104', category: 'Diver', status: 'Verified', date: 'Sep 26, 2026', icon: '🌊' },
      { name: 'Perpetual Calendar', id: 'VP-2026-PC8802', category: 'Complication', status: 'Pending', date: 'Sep 25, 2026', icon: '📅' },
      { name: 'Ceramic Skeleton', id: 'VP-2026-CS3319', category: 'Skeleton', status: 'Verified', date: 'Sep 24, 2026', icon: '⚙️' },
      { name: 'Vintage Heritage 1958', id: 'VP-2026-VH5501', category: 'Vintage', status: 'Verified', date: 'Sep 23, 2026', icon: '🕰️' }
    ]
  },
  fashion: {
    id: 'fashion',
    categoryName: 'Fashion, Apparel & Luxury Goods',
    companyName: 'AURA Haute Couture',
    companyId: 'COMP-3410',
    icon: '👜',
    latestProduct: {
      title: 'Monogram Leather Tote',
      id: 'VP-2026-HC8821',
      category: 'Leather Goods'
    },
    heroImage: '/hero-3d-pedestal.png',
    fallbackEmoji: '👜',
    products: [
      { name: 'Monogram Leather Tote', id: 'VP-2026-HC8821', category: 'Leather Goods', status: 'Verified', date: 'Sep 28, 2026', icon: '👜' },
      { name: 'Silk Evening Gown', id: 'VP-2026-SG7702', category: 'Couture', status: 'Verified', date: 'Sep 27, 2026', icon: '👗' },
      { name: 'Cashmere Tailored Coat', id: 'VP-2026-CC1049', category: 'Outerwear', status: 'Verified', date: 'Sep 26, 2026', icon: '🧥' },
      { name: 'Hand-stitched Oxford', id: 'VP-2026-HO9932', category: 'Footwear', status: 'Pending', date: 'Sep 25, 2026', icon: '👞' },
      { name: 'Silk Twill Scarf', id: 'VP-2026-ST4410', category: 'Accessories', status: 'Verified', date: 'Sep 24, 2026', icon: '🧣' },
      { name: 'Velvet Clutch Noir', id: 'VP-2026-VC6621', category: 'Handbags', status: 'Verified', date: 'Sep 23, 2026', icon: '👛' }
    ]
  },
  electronics: {
    id: 'electronics',
    categoryName: 'Electronics & Smart Devices',
    companyName: 'Nexus Quantum',
    companyId: 'COMP-1084',
    icon: '⚡',
    latestProduct: {
      title: 'Neural AR Headset Pro',
      id: 'VP-2026-EQ4033',
      category: 'Hardware'
    },
    heroImage: '/sidebar-cylinder.jpg',
    fallbackEmoji: '⚡',
    products: [
      { name: 'Neural AR Headset Pro', id: 'VP-2026-EQ4033', category: 'Hardware', status: 'Verified', date: 'Sep 28, 2026', icon: '🥽' },
      { name: 'Quantum Core Processor', id: 'VP-2026-QC9910', category: 'Semiconductor', status: 'Verified', date: 'Sep 27, 2026', icon: '💻' },
      { name: 'Spatial Audio Nodes', id: 'VP-2026-SA4419', category: 'Audio', status: 'Verified', date: 'Sep 26, 2026', icon: '🎧' },
      { name: 'Haptic Glove Sensor', id: 'VP-2026-HG2201', category: 'Sensory', status: 'Pending', date: 'Sep 25, 2026', icon: '🧤' },
      { name: 'Zero-Latency Hub', id: 'VP-2026-ZL8809', category: 'Network', status: 'Verified', date: 'Sep 24, 2026', icon: '📡' },
      { name: 'Biometric Smart Ring', id: 'VP-2026-BR1190', category: 'Wearable', status: 'Verified', date: 'Sep 23, 2026', icon: '💍' }
    ]
  },
  pharma: {
    id: 'pharma',
    categoryName: 'Pharmaceuticals & Healthcare',
    companyName: 'BioVeda Labs',
    companyId: 'COMP-7731',
    icon: '🧬',
    latestProduct: {
      title: 'Cellular Peptide Serum',
      id: 'VP-2026-PH5512',
      category: 'Biotech'
    },
    heroImage: '/hero-3d-pedestal.png',
    fallbackEmoji: '🧬',
    products: [
      { name: 'Cellular Peptide Serum', id: 'VP-2026-PH5512', category: 'Biotech', status: 'Verified', date: 'Sep 28, 2026', icon: '🧪' },
      { name: 'Genomic Therapy Vial', id: 'VP-2026-GT8819', category: 'Therapeutics', status: 'Verified', date: 'Sep 27, 2026', icon: '💉' },
      { name: 'Neuro-Enhancer Formulation', id: 'VP-2026-NE2201', category: 'Nootropic', status: 'Verified', date: 'Sep 26, 2026', icon: '💊' },
      { name: 'Immune Complex Vaccine', id: 'VP-2026-IC9904', category: 'Immunology', status: 'Pending', date: 'Sep 25, 2026', icon: '🔬' },
      { name: 'Regenerative Stem Bio-Gel', id: 'VP-2026-RS3311', category: 'RegenMed', status: 'Verified', date: 'Sep 24, 2026', icon: '🧬' },
      { name: 'Cold-Chain Insulin Batch', id: 'VP-2026-CI4420', category: 'Clinical', status: 'Verified', date: 'Sep 23, 2026', icon: '❄️' }
    ]
  },
  wine: {
    id: 'wine',
    categoryName: 'Wine & Spirits',
    companyName: 'Château Grand Reserve',
    companyId: 'COMP-6041',
    icon: '🍷',
    latestProduct: {
      title: 'Vintage 2018 Grand Cru',
      id: 'VP-2026-WN3390',
      category: 'Bordeaux'
    },
    heroImage: '/hero-3d-pedestal.png',
    fallbackEmoji: '🍷',
    products: [
      { name: 'Vintage 2018 Grand Cru', id: 'VP-2026-WN3390', category: 'Bordeaux', status: 'Verified', date: 'Sep 28, 2026', icon: '🍷' },
      { name: 'Single Malt 30Y Highland', id: 'VP-2026-SM9901', category: 'Whisky', status: 'Verified', date: 'Sep 27, 2026', icon: '🥃' },
      { name: 'Prestige Cuvée Blanc', id: 'VP-2026-PC1120', category: 'Champagne', status: 'Verified', date: 'Sep 26, 2026', icon: '🍾' },
      { name: 'Limited Mezcal Ancestral', id: 'VP-2026-MA8802', category: 'Artisanal', status: 'Pending', date: 'Sep 25, 2026', icon: '🏺' },
      { name: 'Cabernet Franc Reserve', id: 'VP-2026-CF4419', category: 'Red Wine', status: 'Verified', date: 'Sep 24, 2026', icon: '🍇' },
      { name: 'Aged Cognac XO Imperial', id: 'VP-2026-AC6631', category: 'Cognac', status: 'Verified', date: 'Sep 23, 2026', icon: '🍸' }
    ]
  },
  automotive: {
    id: 'automotive',
    categoryName: 'Automotive & Industrial Parts',
    companyName: 'Apex Dynamics',
    companyId: 'COMP-2209',
    icon: '🏎️',
    latestProduct: {
      title: 'Carbon Ceramic Rotor',
      id: 'VP-2026-AP7721',
      category: 'Motorsport'
    },
    heroImage: '/hero-3d-pedestal.png',
    fallbackEmoji: '🏎️',
    products: [
      { name: 'Carbon Ceramic Rotor', id: 'VP-2026-AP7721', category: 'Motorsport', status: 'Verified', date: 'Sep 28, 2026', icon: '⚙️' },
      { name: 'Forged Titanium Con-Rod', id: 'VP-2026-TC1109', category: 'Powertrain', status: 'Verified', date: 'Sep 27, 2026', icon: '🔩' },
      { name: 'Aero Carbon Wing Mk.IV', id: 'VP-2026-AW8820', category: 'Aerodynamics', status: 'Verified', date: 'Sep 26, 2026', icon: '🏎️' },
      { name: 'Inconel Exhaust Manifold', id: 'VP-2026-IE4412', category: 'Exhaust', status: 'Pending', date: 'Sep 25, 2026', icon: '🔥' },
      { name: 'Sequential Gearset 6-Speed', id: 'VP-2026-SG9904', category: 'Transmission', status: 'Verified', date: 'Sep 24, 2026', icon: '🕹️' },
      { name: 'Electronic Differential ECU', id: 'VP-2026-ED3301', category: 'Electronics', status: 'Verified', date: 'Sep 23, 2026', icon: '⚡' }
    ]
  }
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onBackToHome, initialCategory = 'jewelry' }) => {
  const { user, profile, signOut } = useAuth();
  const [currentCategoryKey, setCurrentCategoryKey] = useState<string>(initialCategory);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'qrcodes' | 'certificates' | 'customers' | 'ownership' | 'analytics' | 'logs' | 'settings'>('dashboard');
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Dynamically map registered business type to visual category
  useEffect(() => {
    if (profile?.businessType) {
      const bt = profile.businessType.toLowerCase();
      if (bt.includes('watch')) setCurrentCategoryKey('watches');
      else if (bt.includes('fashion') || bt.includes('apparel')) setCurrentCategoryKey('fashion');
      else if (bt.includes('electronic')) setCurrentCategoryKey('electronics');
      else if (bt.includes('pharma') || bt.includes('health')) setCurrentCategoryKey('pharma');
      else if (bt.includes('wine') || bt.includes('spirit')) setCurrentCategoryKey('wine');
      else if (bt.includes('auto')) setCurrentCategoryKey('automotive');
      else if (bt.includes('jewel')) setCurrentCategoryKey('jewelry');
    }
  }, [profile?.businessType]);

  const currentBusiness = businessCategories[currentCategoryKey] || businessCategories.jewelry;

  const displayName = profile?.fullName || user?.user_metadata?.full_name || 'Ahmed Khan';
  const displayCompany = profile?.companyName || user?.user_metadata?.company_name || currentBusiness.companyName;
  const displayCompanyId = profile?.companyId || user?.user_metadata?.company_id || currentBusiness.companyId;
  const displayEmail = profile?.email || user?.email || 'admin@veripass.id';
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AK';

  // Sidebar items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Box },
    { id: 'qrcodes', label: 'QR Codes', icon: QrCode },
    { id: 'certificates', label: 'Certificates', icon: FileCheck2 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'ownership', label: 'Ownership', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Scan Logs', icon: ScrollText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Metric Stats
  const stats = [
    {
      title: 'Total Products',
      value: '1,250',
      change: '+12%',
      trend: 'vs last 30 days',
      icon: Box,
      sparkline: 'M0 24 H 30 V 18 H 60 V 12 H 90 V 6 H 120',
      color: '#155EEF'
    },
    {
      title: 'Verified Products',
      value: '1,180',
      change: '+10%',
      trend: 'vs last 30 days',
      icon: ShieldCheck,
      sparkline: 'M0 24 H 25 V 20 H 55 V 14 H 85 V 8 H 120',
      color: '#155EEF'
    },
    {
      title: 'Total Scans',
      value: '8,430',
      change: '+28%',
      trend: 'vs last 30 days',
      icon: Scan,
      sparkline: 'M0 26 H 25 V 22 H 50 V 16 H 80 V 10 H 120',
      color: '#155EEF'
    },
    {
      title: 'Active QR Codes',
      value: '1,250',
      change: '+14%',
      trend: 'vs last 30 days',
      icon: QrCode,
      sparkline: 'M0 25 H 30 V 20 H 60 V 15 H 90 V 8 H 120',
      color: '#155EEF'
    }
  ];

  // Recent Activity Feed Data
  const recentActivities = [
    {
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      title: 'Product verified',
      desc: `${currentBusiness.latestProduct.title} (${currentBusiness.latestProduct.id})`,
      time: '2 hours ago'
    },
    {
      icon: QrCode,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
      title: 'QR scanned',
      desc: 'By Customer in Dubai, UAE',
      time: '3 hours ago'
    },
    {
      icon: Plus,
      iconBg: 'bg-teal-50 text-teal-600 border border-teal-200',
      title: 'New product added',
      desc: `${currentBusiness.products[1]?.name || 'Item'} (${currentBusiness.products[1]?.id || 'VP-2026'})`,
      time: '5 hours ago'
    },
    {
      icon: UserCheck,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
      title: 'Ownership transfer',
      desc: 'Verified on VeriPass Public Ledger',
      time: '1 day ago'
    },
    {
      icon: FileText,
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-200',
      title: 'Certificate verified',
      desc: 'Cryptographic Authenticity Key (#DIA-8842)',
      time: '1 day ago'
    },
    {
      icon: AlertTriangle,
      iconBg: 'bg-red-50 text-red-600 border border-red-200',
      title: 'Suspicious activity detected',
      desc: 'Multiple scans from unusual IP location',
      time: '1 day ago'
    }
  ];

  // Global Scan Locations Data
  const scanLocations = [
    { country: 'Pakistan', flag: '🇵🇰', count: '3,482', percent: 41 },
    { country: 'UAE', flag: '🇦🇪', count: '1,842', percent: 22 },
    { country: 'USA', flag: '🇺🇸', count: '1,205', percent: 14 },
    { country: 'UK', flag: '🇬🇧', count: '842', percent: 10 },
    { country: 'Others', flag: '🌐', count: '1,059', percent: 13 }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex antialiased selection:bg-[#155EEF] selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR */}
      {/* ========================================================= */}
      <aside className="w-[230px] xl:w-[240px] shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between min-h-screen sticky top-0 h-screen overflow-y-auto z-30">
        
        {/* Top Section */}
        <div>
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div 
              onClick={onBackToHome}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-7 h-7 bg-[#155EEF] rounded-none flex items-center justify-center text-white shadow-xs group-hover:bg-[#124bbf] transition-colors">
                <div className="w-3.5 h-3.5 border-2 border-white rounded-none border-r-transparent border-b-transparent rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-slate-950 font-sans leading-none">
                  VeriPass
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-wider mt-0.5 uppercase">
                  PRODUCT IDENTITY INFRASTRUCTURE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 text-[13px] font-medium transition-all text-left cursor-pointer rounded-none ${
                    isActive
                      ? 'bg-[#EFF8FF] text-[#155EEF] font-semibold shadow-2xs border-l-2 border-[#155EEF]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#155EEF]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 space-y-3 relative">
          
          {/* Futuristic Promo Card (Cylinder 3D device) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] border border-slate-200 p-3 text-left group">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 shrink-0 rounded-xs overflow-hidden border border-slate-200/80 bg-white flex items-center justify-center shadow-2xs">
                <img 
                  src="/sidebar-cylinder.jpg" 
                  alt="Digital Future" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-900 leading-tight">
                  Your products have a digital future.
                </p>
                <button className="text-[10.5px] font-bold text-[#155EEF] hover:text-[#124bbf] flex items-center gap-1 mt-1 transition-colors">
                  <span>Upgrade Plan</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Organization Switcher Dropdown Button */}
          <div className="relative">
            <div 
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="bg-white border border-slate-200 p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentBusiness.icon}
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[12px] font-bold text-slate-900 truncate">{currentBusiness.companyName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{currentBusiness.categoryName}</div>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOrgDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Interactive Category Selector Popover */}
            {isOrgDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-slate-200 shadow-xl z-50 p-1.5 space-y-1 max-h-64 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Business Industry
                </div>
                {Object.values(businessCategories).map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => {
                      setCurrentCategoryKey(biz.id);
                      setIsOrgDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                      currentCategoryKey === biz.id ? 'bg-[#EFF8FF] text-[#155EEF] font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{biz.icon}</span>
                      <div className="truncate">
                        <div className="truncate leading-tight font-semibold">{biz.companyName}</div>
                        <div className="text-[10px] text-slate-400 truncate">{biz.categoryName}</div>
                      </div>
                    </div>
                    {currentCategoryKey === biz.id && <Check className="w-3.5 h-3.5 text-[#155EEF] shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Version Info */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1 font-mono">
            <span>VeriPass</span>
            <span>v1.0.0</span>
          </div>

        </div>

      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* ======================================================= */}
        {/* TOP NAVBAR / HEADER */}
        {/* ======================================================= */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search products, IDs, or scan records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#155EEF] text-xs pl-9 pr-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-none"
            />
          </div>

          {/* Right Header Actions (Notification + User Profile) */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-6 w-[1px] bg-slate-200" />

            {/* User Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-bold text-xs flex items-center justify-center font-mono ring-2 ring-transparent group-hover:ring-[#155EEF] transition-all">
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-medium">
                    {displayCompany}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 shadow-xl z-50 p-2 text-left rounded-none">
                  <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{displayName}</div>
                    <div className="text-[10.5px] font-mono text-slate-400 truncate">{displayEmail}</div>
                    <div className="text-[10px] text-[#155EEF] font-semibold mt-0.5">{displayCompany}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer rounded-none"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* ======================================================= */}
        {/* MAIN BODY DASHBOARD GRIDS */}
        {/* ======================================================= */}
        <main className="flex-1 p-5 sm:p-6 lg:p-7 space-y-6 max-w-[1580px] w-full mx-auto">
          
          {/* ===================================================== */}
          {/* ROW 1: WELCOME HERO CARD + 2x2 STATS GRID */}
          {/* ===================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* 1A. Welcome Hero Card (Seamless 3D Geometric Architectural Stage) */}
            <div className="lg:col-span-6 xl:col-span-7 bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[260px]">
              
              {/* ===================================================== */}
              {/* SEAMLESS 3D ARCHITECTURAL GEOMETRIC BACKGROUND (RIGHT) */}
              {/* ===================================================== */}
              <div className="absolute top-0 right-0 bottom-0 h-full w-full sm:w-[55%] md:w-[50%] lg:w-[48%] pointer-events-none select-none overflow-hidden flex items-center justify-end">
                
                {/* 3D Geometric Image Overlay with Left Alpha Mask for perfect seamless blending */}
                {currentCategoryKey === 'jewelry' || currentCategoryKey === 'watches' || currentCategoryKey === 'fashion' || currentCategoryKey === 'pharma' || currentCategoryKey === 'wine' || currentCategoryKey === 'automotive' ? (
                  <div 
                    className="relative w-full h-full flex items-center justify-end"
                    style={{
                      maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,1) 40%)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,1) 40%)'
                    }}
                  >
                    <img 
                      src="/hero-3d-pedestal.png" 
                      alt="Product 3D Pedestal Stage" 
                      className="w-full h-full object-cover object-right"
                    />
                  </div>
                ) : (
                  /* High-Tech Quantum Cylinder for Electronics */
                  <div 
                    className="relative w-full h-full flex items-center justify-end"
                    style={{
                      maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,1) 40%)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, rgba(0,0,0,1) 40%)'
                    }}
                  >
                    <img 
                      src="/sidebar-cylinder.jpg" 
                      alt="Quantum Cyber Device Stage" 
                      className="w-full h-full object-cover object-right"
                    />
                  </div>
                )}

              </div>

              {/* Top Text Content (Left Aligned with high z-index) */}
              <div className="relative z-10 max-w-[65%] text-left">
                {/* Tag */}
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-2">
                  <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
                  <span>BUSINESS OVERVIEW</span>
                </div>

                {/* Headline */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  Welcome back, {displayName.split(' ')[0]} 👋
                </h1>
                <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1 leading-relaxed">
                  Here’s what’s happening with your product identity system today.
                </p>
              </div>

              {/* Bottom Row inside Hero: Organization Tag (Left) + Floating Latest Product Badge (Right) */}
              <div className="mt-8 flex items-end justify-between gap-4 relative z-10">
                
                {/* Organization ID Tag (Bottom Left) */}
                <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 p-3 flex items-center justify-between gap-3 max-w-[280px] w-full shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-sm">
                      {currentBusiness.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900">{displayCompany}</div>
                      <div className="text-[10px] font-mono text-slate-400">Company ID: {displayCompanyId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-none flex items-center gap-1">
                      <span>👑</span> Active Plan
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Floating "Latest Product" Card (Bottom Right over 3D Pedestal) */}
                <div className="hidden sm:block bg-white/95 backdrop-blur-md border border-slate-200/90 p-2.5 sm:p-3 shadow-md text-left max-w-[200px] w-full">
                  <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Latest Product</div>
                  <div className="text-[11.5px] font-bold text-slate-900 flex items-center gap-1.5 mt-0.5 truncate">
                    <span className="text-xs">◎</span>
                    <span className="truncate">{currentBusiness.latestProduct.title}</span>
                  </div>
                  <div className="text-[10.5px] font-mono font-semibold text-[#155EEF] flex items-center gap-1 mt-1">
                    <span>{currentBusiness.latestProduct.id}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

              </div>

            </div>

            {/* 1B. 2x2 Metric Stats Grid (Right 6 Columns) */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between space-y-3">
              
              {/* Date Filter Dropdown */}
              <div className="flex items-center justify-end">
                <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50">
                  <span className="font-mono text-[11px]">Sep 1, 2026 - Sep 30, 2026</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 flex-1">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-slate-200 p-4 flex flex-col justify-between relative overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-8 h-8 rounded-none bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF]">
                          <Icon className="w-4 h-4" />
                        </div>
                        {/* Mini Sparkline SVG */}
                        <div className="w-16 h-7">
                          <svg viewBox="0 0 120 30" className="w-full h-full overflow-visible">
                            <path
                              d={stat.sparkline}
                              fill="none"
                              stroke="#155EEF"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-3 text-left">
                        <div className="text-[11px] font-medium text-slate-500">{stat.title}</div>
                        <div className="text-xl font-black text-slate-950 tracking-tight mt-0.5">{stat.value}</div>
                        <div className="flex items-center gap-1 text-[10.5px] mt-1">
                          <span className="font-bold text-emerald-600 flex items-center">
                            <ArrowUp className="w-2.5 h-2.5 mr-0.5" />
                            {stat.change}
                          </span>
                          <span className="text-slate-400">{stat.trend}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* ===================================================== */}
          {/* ROW 2: SCAN ANALYTICS + PRODUCT STATUS + GLOBAL LOCATIONS */}
          {/* ===================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* 2A. Scan Analytics (Area Chart) - 6 Columns */}
            <div className="lg:col-span-6 bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-950">Scan Analytics</h3>
                  <p className="text-[11px] text-slate-400">Total scans over the last 30 days</p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs text-slate-700 cursor-pointer hover:bg-slate-100">
                  <span className="text-[11px] font-medium">{timeRange}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </div>

              {/* Chart Canvas with SVG Line & Gradient */}
              <div className="relative w-full h-48 sm:h-52 pt-4">
                
                {/* Y-Axis Grid Lines & Values */}
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-mono text-slate-300 pointer-events-none pb-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span>2K</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span>1.5K</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span>1K</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span>500</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span>0</span>
                  </div>
                </div>

                {/* SVG Area & Square Stepped Line */}
                <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="scanSquareGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#155EEF" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#155EEF" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Square Stepped Area Fill */}
                  <path
                    d="M 0 138 
                       H 60 V 132 
                       H 120 V 122 
                       H 180 V 110 
                       H 240 V 92 
                       H 300 V 70 
                       H 360 V 48 
                       H 420 V 32 
                       H 480 V 58 
                       H 540 V 46 
                       H 600 
                       V 150 H 0 Z"
                    fill="url(#scanSquareGradient)"
                  />

                  {/* Square Stepped Line Stroke */}
                  <path
                    d="M 0 138 
                       H 60 V 132 
                       H 120 V 122 
                       H 180 V 110 
                       H 240 V 92 
                       H 300 V 70 
                       H 360 V 48 
                       H 420 V 32 
                       H 480 V 58 
                       H 540 V 46 
                       H 600"
                    fill="none"
                    stroke="#155EEF"
                    strokeWidth="3"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  />

                  {/* Square Step Nodes */}
                  <rect x="57" y="129" width="6" height="6" fill="#155EEF" />
                  <rect x="117" y="119" width="6" height="6" fill="#155EEF" />
                  <rect x="177" y="107" width="6" height="6" fill="#155EEF" />
                  <rect x="237" y="89" width="6" height="6" fill="#155EEF" />
                  <rect x="297" y="67" width="6" height="6" fill="#155EEF" />
                  <rect x="357" y="45" width="6" height="6" fill="#155EEF" />
                  <rect x="477" y="55" width="6" height="6" fill="#155EEF" />
                  <rect x="537" y="43" width="6" height="6" fill="#155EEF" />

                  {/* Active Square Tooltip Pin at Sep 22 */}
                  <rect x="415" y="27" width="10" height="10" fill="#155EEF" stroke="#FFFFFF" strokeWidth="2.5" />
                </svg>

                {/* Floating Square Tooltip over Sep 22 */}
                <div 
                  className="absolute z-20 bg-slate-950 text-white px-2.5 py-1 text-[10.5px] font-mono shadow-lg -translate-x-1/2 -translate-y-full pointer-events-none rounded-none border border-slate-700"
                  style={{ left: '70%', top: '26%' }}
                >
                  <div className="text-slate-400 text-[9px] font-medium">Sep 22, 2026</div>
                  <div className="font-bold text-white text-xs mt-0.5">1,482 scans</div>
                  <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700" />
                </div>

                {/* X-Axis labels */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
                  <span>Sep 1</span>
                  <span>Sep 5</span>
                  <span>Sep 10</span>
                  <span>Sep 15</span>
                  <span className="font-bold text-[#155EEF]">Sep 20</span>
                  <span>Sep 25</span>
                  <span>Sep 30</span>
                </div>

              </div>

            </div>

            {/* 2B. Product Status Donut Chart - 3 Columns */}
            <div className="lg:col-span-3 bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              
              <div className="text-left mb-2">
                <h3 className="text-sm font-bold text-slate-950">Product Status</h3>
              </div>

              {/* Donut Chart Graphics */}
              <div className="relative w-36 h-36 mx-auto my-2 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Gray background ring */}
                  <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                  {/* Verified Ring (Green 94%) */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#10B981" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="15" 
                    strokeLinecap="round" 
                  />
                  {/* Pending Ring (Yellow 4%) */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#F59E0B" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="241" 
                    strokeLinecap="round" 
                  />
                  {/* Flagged Ring (Red 1%) */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="#EF4444" 
                    strokeWidth="12" 
                    fill="none" 
                    strokeDasharray="251.2" 
                    strokeDashoffset="248" 
                    strokeLinecap="round" 
                  />
                </svg>

                {/* Donut Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black text-slate-950 leading-none">1,250</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">Total Products</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 text-xs text-left pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span className="text-slate-600">Verified</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">1,180 <span className="font-normal text-slate-400">(94%)</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span className="text-slate-600">Pending</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">45 <span className="font-normal text-slate-400">(4%)</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="text-slate-600">Flagged</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">12 <span className="font-normal text-slate-400">(1%)</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-slate-600">Expired</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">13 <span className="font-normal text-slate-400">(1%)</span></span>
                </div>
              </div>

            </div>

            {/* 2C. Global Scan Locations - 3 Columns */}
            <div className="lg:col-span-3 bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-950">Global Scan Locations</h3>
                <button className="text-[11px] font-bold text-[#155EEF] hover:text-[#124bbf] flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Interactive World Map with Realtime Simulated Supabase Scans */}
              <GlobalScanMap />

              {/* Country Breakdown Rows */}
              <div className="space-y-1.5 text-xs text-left pt-2 border-t border-slate-100">
                {scanLocations.map((loc, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11.5px]">
                    <div className="flex items-center gap-2">
                      <span>{loc.flag}</span>
                      <span className="text-slate-700 font-medium">{loc.country}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">{loc.count}</span>
                      <span className="text-slate-400 text-[10px] w-7 text-right">{loc.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* ===================================================== */}
          {/* ROW 3: RECENT PRODUCTS TABLE + ACTIVITY FEED + BULK QR */}
          {/* ===================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* 3A. Recent Products Table - 6 Columns */}
            <div className="lg:col-span-6 bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-950">Recent Products</h3>
                <button className="text-[11px] font-bold text-[#155EEF] hover:text-[#124bbf] flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10.5px] font-mono text-slate-400 uppercase tracking-wider">
                      <th className="pb-2 font-semibold">Product</th>
                      <th className="pb-2 font-semibold">ID</th>
                      <th className="pb-2 font-semibold">Category</th>
                      <th className="pb-2 font-semibold">Status</th>
                      <th className="pb-2 font-semibold">Created</th>
                      <th className="pb-2 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentBusiness.products.map((prod, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        
                        {/* Product Thumbnail & Name */}
                        <td className="py-2.5 flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-slate-100 border border-slate-200 flex items-center justify-center text-xs shrink-0">
                            {prod.icon}
                          </div>
                          <span className="font-bold text-slate-900 truncate max-w-[130px]">{prod.name}</span>
                        </td>

                        {/* ID */}
                        <td className="py-2.5 font-mono text-[11px] text-slate-500">
                          {prod.id}
                        </td>

                        {/* Category */}
                        <td className="py-2.5 text-slate-600 text-[11.5px]">
                          {prod.category}
                        </td>

                        {/* Status Badge */}
                        <td className="py-2.5">
                          {prod.status === 'Verified' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                              <span>✓</span> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5">
                              <span>★</span> Pending
                            </span>
                          )}
                        </td>

                        {/* Created Date */}
                        <td className="py-2.5 font-mono text-[11px] text-slate-400">
                          {prod.date}
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 text-right">
                          <button className="text-slate-400 hover:text-slate-800 p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* 3B. Recent Activity Feed - 3 Columns */}
            <div className="lg:col-span-3 bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-950">Recent Activity</h3>
                <button className="text-[11px] font-bold text-[#155EEF] hover:text-[#124bbf] flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Feed items */}
              <div className="space-y-3 text-left">
                {recentActivities.map((act, idx) => {
                  const Icon = act.icon;
                  return (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className={`w-6 h-6 rounded-none flex items-center justify-center shrink-0 mt-0.5 ${act.iconBg}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-slate-900 leading-tight truncate">
                          {act.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {act.desc}
                        </div>
                        <div className="text-[9.5px] font-mono text-slate-400 mt-0.5">
                          {act.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* 3C. Right Stack: Bulk QR Card + Quick Actions - 3 Columns */}
            <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
              
              {/* Generate QR Codes in Bulk (Dark Card) */}
              <div className="bg-slate-950 text-white border border-slate-800 p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
                
                {/* Background QR Card Image */}
                <div className="absolute right-0 top-0 bottom-0 w-28 opacity-40 overflow-hidden pointer-events-none">
                  <img 
                    src="/bulk-qr-tag.jpg" 
                    alt="Bulk QR Tag" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>

                <div className="relative z-10 text-left">
                  <h4 className="text-sm font-bold text-white leading-tight">
                    Generate<br />QR Codes in Bulk
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[170px] leading-relaxed">
                    Save hours of manual work. Create and download QR codes for all your products at once.
                  </p>
                </div>

                <div className="relative z-10 mt-4">
                  <button className="px-3 py-1.5 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
                    <span>Bulk Generate</span>
                    <ArrowRight className="w-3 h-3 text-[#155EEF]" />
                  </button>
                </div>

              </div>

              {/* Quick Actions 2x2 Grid */}
              <div className="bg-white border border-slate-200 p-4 shadow-xs text-left">
                <div className="text-xs font-bold text-slate-900 mb-2.5">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer">
                    <Plus className="w-3.5 h-3.5 text-[#155EEF]" />
                    <span>Add Product</span>
                  </button>

                  <button className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer">
                    <Scan className="w-3.5 h-3.5 text-[#155EEF]" />
                    <span>Scan QR</span>
                  </button>

                  <button className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer">
                    <FileText className="w-3.5 h-3.5 text-[#155EEF]" />
                    <span>Upload Certificates</span>
                  </button>

                  <button className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer">
                    <BarChart3 className="w-3.5 h-3.5 text-[#155EEF]" />
                    <span>View Reports</span>
                  </button>
                </div>
              </div>

              {/* System Status Pill */}
              <div className="bg-white border border-slate-200 p-2.5 flex items-center justify-between text-[10.5px] font-mono text-slate-500 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-slate-800 font-bold">All Systems Operational</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>API 99.99%</span>
                  <span>•</span>
                  <span>SSL</span>
                </div>
              </div>

            </div>

          </div>

          {/* ===================================================== */}
          {/* ROW 4: BOTTOM WIDE BANNER (More Trust. More Value.) */}
          {/* ===================================================== */}
          <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-[#0F172A] border border-slate-800 p-6 sm:p-7 relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Background geometric lighting */}
            <div className="absolute top-0 right-1/4 w-72 h-full bg-[#155EEF]/10 blur-3xl pointer-events-none" />

            <div className="text-left relative z-10">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                More Trust. More Value.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1 max-w-xl">
                Digital product passports build trust, reduce counterfeits and unlock new lifecycle revenue opportunities for luxury brands.
              </p>
              <div className="mt-4">
                <button className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs">
                  <span>Explore Features</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#155EEF]" />
                </button>
              </div>
            </div>

            {/* Right Metallic Card Emblem */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-36 h-20 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 border border-slate-700 p-3 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">VERIPASS</span>
                  <span className="text-xs">🔒</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold text-[#155EEF] tracking-widest">VP-PASS</span>
                </div>
              </div>
            </div>

          </div>

        </main>

      </div>

    </div>
  );
};
