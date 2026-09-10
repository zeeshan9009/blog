import React, { useState, useEffect } from 'react';
import { GlobalScanMap } from './GlobalScanMap';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/product';
import { Certificate, CertificateStatus, Customer, OwnershipTransfer } from '../types/models';
import { AddProductPage } from './AddProductPage';
import { ProductPassportModal } from './ProductPassportModal';
import { QrCodeHub } from './QrCodeHub';
import { ProductsView } from './ProductsView';
import { CertificatesView } from './CertificatesView';
import { CustomersView } from './CustomersView';
import { AnalyticsView } from './AnalyticsView';
import { LogsView } from './LogsView';
import { SettingsView } from './SettingsView';
import { supabase } from '../lib/supabase';
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
  LogOut,
  PackageOpen,
  Inbox,
  Eye,
  Trash2
} from 'lucide-react';

interface DashboardPageProps {
  onBackToHome?: () => void;
  initialCategory?: string;
}

// Business categories data structure for visual themes
interface BusinessData {
  id: string;
  categoryName: string;
  companyName: string;
  companyId: string;
  icon: string;
  heroImage: string;
}

const businessCategories: Record<string, BusinessData> = {
  jewelry: {
    id: 'jewelry',
    categoryName: 'Luxury & Fine Jewelry',
    companyName: 'Albadar Jewellers',
    companyId: 'COMP-8472',
    icon: '💎',
    heroImage: '/hero-3d-pedestal.png'
  },
  watches: {
    id: 'watches',
    categoryName: 'Watches & Horology',
    companyName: 'Chronos Genève',
    companyId: 'COMP-9912',
    icon: '⌚',
    heroImage: '/hero-3d-pedestal.png'
  },
  fashion: {
    id: 'fashion',
    categoryName: 'Fashion, Apparel & Luxury Goods',
    companyName: 'AURA Haute Couture',
    companyId: 'COMP-3410',
    icon: '👜',
    heroImage: '/hero-3d-pedestal.png'
  },
  electronics: {
    id: 'electronics',
    categoryName: 'Electronics & Smart Devices',
    companyName: 'Nexus Quantum',
    companyId: 'COMP-1084',
    icon: '⚡',
    heroImage: '/sidebar-cylinder.jpg'
  },
  pharma: {
    id: 'pharma',
    categoryName: 'Pharmaceuticals & Healthcare',
    companyName: 'BioVeda Labs',
    companyId: 'COMP-7731',
    icon: '🧬',
    heroImage: '/hero-3d-pedestal.png'
  },
  wine: {
    id: 'wine',
    categoryName: 'Wine & Spirits',
    companyName: 'Château Grand Reserve',
    companyId: 'COMP-6041',
    icon: '🍷',
    heroImage: '/hero-3d-pedestal.png'
  },
  automotive: {
    id: 'automotive',
    categoryName: 'Automotive & Industrial Parts',
    companyName: 'Apex Dynamics',
    companyId: 'COMP-2209',
    icon: '🏎️',
    heroImage: '/hero-3d-pedestal.png'
  }
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onBackToHome, initialCategory = 'jewelry' }) => {
  const { user, profile, signOut } = useAuth();
  const [currentCategoryKey, setCurrentCategoryKey] = useState<string>(initialCategory);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'add-product' | 'qrcodes' | 'certificates' | 'customers' | 'ownership' | 'analytics' | 'logs' | 'settings'>('dashboard');
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Passport preview modal state
  const [selectedPassportProduct, setSelectedPassportProduct] = useState<Product | null>(null);

  // Dynamic Products state (LocalStorage cache & zero default)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('veripass_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic Certificates state
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem('veripass_certificates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic Customers state
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('veripass_customers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activities, setActivities] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('veripass_activities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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

  // Load from Supabase on mount if authenticated
  useEffect(() => {
    const fetchSupabaseProducts = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((d) => ({
            id: d.id || d.passport_id,
            sku: d.sku || 'SKU-DEFAULT',
            name: d.name,
            brand: d.brand || currentBusiness.companyName,
            category: d.category || currentBusiness.categoryName,
            description: d.description || '',
            serialNumber: d.serial_number || 'SN-00',
            batchNumber: d.batch_number || 'BATCH-01',
            manufacturingDate: d.manufacturing_date || new Date().toISOString().split('T')[0],
            originCountry: d.origin_country || 'Global',
            status: d.status || 'verified',
            passportHash: d.passport_hash || '0x000',
            verificationCount: d.verification_count || 0,
            qrCodeUrl: d.qr_code_url || `https://veripass.id/verify/${d.id}`,
            createdAt: d.created_at || new Date().toISOString().split('T')[0],
          }));
          setProducts(mapped);
          localStorage.setItem('veripass_products', JSON.stringify(mapped));
        }
      } catch (err) {
        // Fallback to local storage state
      }
    };

    fetchSupabaseProducts();
  }, [user]);

  // Add Product Handler
  const handleAddProduct = async (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('veripass_products', JSON.stringify(updated));

    // Register Activity
    const newActivity = {
      id: `act-${Date.now()}`,
      title: `Issued cryptographic passport for ${newProduct.name}`,
      productId: newProduct.id,
      timestamp: 'Just now',
      type: 'issue'
    };
    const updatedActivities = [newActivity, ...activities].slice(0, 10);
    setActivities(updatedActivities);
    localStorage.setItem('veripass_activities', JSON.stringify(updatedActivities));

    // Sync to Supabase in background
    try {
      if (user) {
        await supabase.from('products').insert([
          {
            id: newProduct.id,
            name: newProduct.name,
            sku: newProduct.sku,
            brand: newProduct.brand,
            category: newProduct.category,
            description: newProduct.description,
            serial_number: newProduct.serialNumber,
            batch_number: newProduct.batchNumber,
            manufacturing_date: newProduct.manufacturingDate,
            origin_country: newProduct.originCountry,
            status: newProduct.status,
            passport_hash: newProduct.passportHash,
            qr_code_url: newProduct.qrCodeUrl,
            user_id: user.id
          }
        ]);
      }
    } catch {
      // Offline / LocalStorage is already persisted
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    localStorage.setItem('veripass_products', JSON.stringify(updated));
  };

  // Issue Certificate Handler
  const handleIssueCertificate = (newCert: Certificate) => {
    const updated = [newCert, ...certificates];
    setCertificates(updated);
    localStorage.setItem('veripass_certificates', JSON.stringify(updated));

    const newActivity = {
      id: `act-${Date.now()}`,
      title: `Issued Authenticity Certificate to ${newCert.recipientName}`,
      productId: newCert.productId,
      timestamp: 'Just now',
      type: 'certificate'
    };
    const updatedActivities = [newActivity, ...activities].slice(0, 10);
    setActivities(updatedActivities);
    localStorage.setItem('veripass_activities', JSON.stringify(updatedActivities));
  };

  // Update Certificate Status Handler
  const handleUpdateCertificateStatus = (id: string, status: CertificateStatus) => {
    const updated = certificates.map((c) => (c.id === id ? { ...c, status } : c));
    setCertificates(updated);
    localStorage.setItem('veripass_certificates', JSON.stringify(updated));
  };

  // Delete Certificate Handler
  const handleDeleteCertificate = (id: string) => {
    const updated = certificates.filter((c) => c.id !== id);
    setCertificates(updated);
    localStorage.setItem('veripass_certificates', JSON.stringify(updated));
  };

  // Add Customer Handler
  const handleAddCustomer = (newCustomer: Customer) => {
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    localStorage.setItem('veripass_customers', JSON.stringify(updated));

    const newActivity = {
      id: `act-${Date.now()}`,
      title: `Registered new asset custodian ${newCustomer.fullName}`,
      productId: newCustomer.id,
      timestamp: 'Just now',
      type: 'customer'
    };
    const updatedActivities = [newActivity, ...activities].slice(0, 10);
    setActivities(updatedActivities);
    localStorage.setItem('veripass_activities', JSON.stringify(updatedActivities));
  };

  // Transfer Ownership Handler
  const handleTransferOwnership = (transfer: OwnershipTransfer) => {
    // Add new customer if needed or update counts
    const updatedCustomers = customers.map((c) => {
      if (c.id === transfer.fromCustomerId) {
        return { ...c, ownedProductsCount: Math.max(0, (c.ownedProductsCount || 1) - 1) };
      }
      return c;
    });

    const newRecipient: Customer = {
      id: transfer.toCustomerId,
      fullName: transfer.toCustomerName,
      email: `${transfer.toCustomerName.toLowerCase().replace(/\s+/g, '.')}@privateclient.id`,
      country: 'Global Verified',
      city: 'Capital',
      tier: 'Verified Buyer',
      registeredDate: transfer.transferDate,
      ownedProductsCount: 1,
      ownedProductIds: [transfer.productId],
      totalScans: 0,
      status: 'active',
      walletAddress: `0x${transfer.txHash.slice(0, 10)}...${transfer.txHash.slice(-6)}`
    };

    const finalCustomers = [newRecipient, ...updatedCustomers];
    setCustomers(finalCustomers);
    localStorage.setItem('veripass_customers', JSON.stringify(finalCustomers));

    // Update certificates status if linked
    const updatedCertificates = certificates.map((cert) => {
      if (cert.productId === transfer.productId) {
        return { ...cert, status: 'transferred' as CertificateStatus };
      }
      return cert;
    });
    setCertificates(updatedCertificates);
    localStorage.setItem('veripass_certificates', JSON.stringify(updatedCertificates));

    const newActivity = {
      id: `act-${Date.now()}`,
      title: `Transferred ownership of ${transfer.productName} to ${transfer.toCustomerName}`,
      productId: transfer.productId,
      timestamp: 'Just now',
      type: 'transfer'
    };
    const updatedActivities = [newActivity, ...activities].slice(0, 10);
    setActivities(updatedActivities);
    localStorage.setItem('veripass_activities', JSON.stringify(updatedActivities));
  };

  // Delete Customer Handler
  const handleDeleteCustomer = (id: string) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    localStorage.setItem('veripass_customers', JSON.stringify(updated));
  };

  const currentBusiness = businessCategories[currentCategoryKey] || businessCategories.jewelry;

  const displayName = profile?.fullName || user?.user_metadata?.full_name || 'Admin User';
  const displayCompany = profile?.companyName || user?.user_metadata?.company_name || currentBusiness.companyName;
  const displayCompanyId = profile?.companyId || user?.user_metadata?.company_id || currentBusiness.companyId;
  const displayEmail = profile?.email || user?.email || 'admin@veripass.id';
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AU';

  // Dynamic calculations
  const totalProductsCount = products.length;
  const verifiedProductsCount = products.filter((p) => p.status === 'verified').length;
  const totalScansCount = products.reduce((sum, p) => sum + (p.verificationCount || 0), 0);
  const activeQrCount = products.length;
  const certificatesCount = certificates.length;
  const customersCount = customers.length;

  const latestProduct = products.length > 0 ? products[0] : null;

  // Sidebar items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Box, count: totalProductsCount },
    { id: 'qrcodes', label: 'QR Codes', icon: QrCode, count: activeQrCount },
    { id: 'certificates', label: 'Certificates', icon: FileCheck2, count: certificatesCount },
    { id: 'customers', label: 'Customers', icon: Users, count: customersCount },
    { id: 'ownership', label: 'Ownership', icon: UserCheck },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'logs', label: 'Scan Logs', icon: ScrollText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Dynamic Metric Stats
  const stats = [
    {
      title: 'Total Products',
      value: totalProductsCount.toString(),
      change: totalProductsCount > 0 ? '+100%' : '0%',
      trend: 'vs last 30 days',
      icon: Box,
      sparkline: totalProductsCount > 0 ? 'M0 24 Q 30 18, 60 12 T 120 4' : 'M0 24 H 120',
      color: '#155EEF'
    },
    {
      title: 'Verified Products',
      value: verifiedProductsCount.toString(),
      change: verifiedProductsCount > 0 ? '+100%' : '0%',
      trend: 'vs last 30 days',
      icon: ShieldCheck,
      sparkline: verifiedProductsCount > 0 ? 'M0 24 Q 30 18, 60 12 T 120 4' : 'M0 24 H 120',
      color: '#155EEF'
    },
    {
      title: 'Total Scans',
      value: totalScansCount.toString(),
      change: totalScansCount > 0 ? '+100%' : '0%',
      trend: 'vs last 30 days',
      icon: Scan,
      sparkline: totalScansCount > 0 ? 'M0 24 Q 30 16, 60 10 T 120 2' : 'M0 24 H 120',
      color: '#155EEF'
    },
    {
      title: 'Active QR Codes',
      value: activeQrCount.toString(),
      change: activeQrCount > 0 ? '+100%' : '0%',
      trend: 'vs last 30 days',
      icon: QrCode,
      sparkline: activeQrCount > 0 ? 'M0 24 Q 30 18, 60 12 T 120 4' : 'M0 24 H 120',
      color: '#155EEF'
    }
  ];

  // Country Breakdown
  const scanLocations = [
    { country: 'Pakistan', flag: '🇵🇰', count: '0', percent: 0 },
    { country: 'UAE', flag: '🇦🇪', count: '0', percent: 0 },
    { country: 'USA', flag: '🇺🇸', count: '0', percent: 0 },
    { country: 'UK', flag: '🇬🇧', count: '0', percent: 0 },
    { country: 'Others', flag: '🌐', count: '0', percent: 0 }
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
              const isActive = activeTab === item.id || (item.id === 'products' && activeTab === 'add-product');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-[13px] font-medium transition-all text-left cursor-pointer rounded-none ${
                    isActive
                      ? 'bg-[#EFF8FF] text-[#155EEF] font-semibold shadow-2xs border-l-2 border-[#155EEF]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#155EEF]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[10.5px] font-mono font-bold bg-blue-100 text-[#155EEF] px-1.5 py-0.2">
                      {item.count}
                    </span>
                  )}
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
                  <div className="text-[12px] font-bold text-slate-900 truncate">{displayCompany}</div>
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
        
        {/* TOP NAVBAR / HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
          
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search products, certificates, customers, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#155EEF] text-xs pl-9 pr-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-none"
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            <button
              onClick={() => setActiveTab('add-product')}
              className="px-3.5 py-1.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Product</span>
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
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
                  <div className="text-[10.5px] text-slate-400 font-medium truncate max-w-[120px]">
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
        {/* MAIN BODY DASHBOARD CONTENT BY TAB */}
        {/* ======================================================= */}
        <main className="flex-1 p-5 sm:p-6 lg:p-7 space-y-6 max-w-[1580px] w-full mx-auto">
          
          {/* TAB 1: ADD PRODUCT & QR FULL PAGE VIEW */}
          {activeTab === 'add-product' && (
            <AddProductPage
              onBack={() => setActiveTab('products')}
              onAddProduct={handleAddProduct}
              defaultCategory={currentBusiness.categoryName}
              defaultBrand={displayCompany}
            />
          )}

          {/* TAB 2: PRODUCTS FULL MANAGEMENT */}
          {activeTab === 'products' && (
            <ProductsView
              products={products}
              onOpenAddProduct={() => setActiveTab('add-product')}
              onPreviewPassport={(p) => setSelectedPassportProduct(p)}
              onOpenQrCodes={() => setActiveTab('qrcodes')}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {/* TAB 3: QR CODES MANAGEMENT HUB */}
          {activeTab === 'qrcodes' && (
            <QrCodeHub
              products={products}
              onOpenAddProduct={() => setActiveTab('add-product')}
              onPreviewPassport={(p) => setSelectedPassportProduct(p)}
            />
          )}

          {/* TAB 4: CERTIFICATES MANAGEMENT */}
          {activeTab === 'certificates' && (
            <CertificatesView
              products={products}
              certificates={certificates}
              onIssueCertificate={handleIssueCertificate}
              onUpdateCertificateStatus={handleUpdateCertificateStatus}
              onDeleteCertificate={handleDeleteCertificate}
              defaultIssuer={displayCompany}
            />
          )}

          {/* TAB 5: CUSTOMERS & OWNERSHIP MANAGEMENT */}
          {(activeTab === 'customers' || activeTab === 'ownership') && (
            <CustomersView
              customers={customers}
              products={products}
              onAddCustomer={handleAddCustomer}
              onTransferOwnership={handleTransferOwnership}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {/* TAB 6: DASHBOARD MAIN OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* ROW 1: WELCOME HERO CARD + 2x2 STATS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* 1A. Welcome Hero Card (Seamless 3D Geometric Architectural Stage) */}
                <div className="lg:col-span-6 xl:col-span-7 bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-xs min-h-[260px]">
                  
                  {/* SEAMLESS 3D ARCHITECTURAL GEOMETRIC BACKGROUND (RIGHT) */}
                  <div className="absolute top-0 right-0 bottom-0 h-full w-full sm:w-[55%] md:w-[50%] lg:w-[48%] pointer-events-none select-none overflow-hidden flex items-center justify-end">
                    
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

                  {/* Top Text Content (Left Aligned) */}
                  <div className="relative z-10 max-w-[65%] text-left">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-2">
                      <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
                      <span>BUSINESS OVERVIEW</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                      Welcome back, {displayName.split(' ')[0]} 👋
                    </h1>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1 leading-relaxed">
                      Your cryptographic passport infrastructure is online and operational.
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

                    {/* Floating "Latest Product" Card */}
                    <div 
                      onClick={() => latestProduct ? setSelectedPassportProduct(latestProduct) : setActiveTab('add-product')}
                      className="hidden sm:block bg-white/95 backdrop-blur-md border border-slate-200/90 p-2.5 sm:p-3 shadow-md text-left max-w-[200px] w-full cursor-pointer hover:border-[#155EEF] transition-colors"
                    >
                      <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Latest Product</div>
                      <div className="text-[11.5px] font-bold text-slate-900 flex items-center gap-1.5 mt-0.5 truncate">
                        <span className="text-xs">◎</span>
                        <span className="truncate">{latestProduct ? latestProduct.name : 'No Products Added'}</span>
                      </div>
                      <div className="text-[10.5px] font-mono font-semibold text-[#155EEF] flex items-center gap-1 mt-1">
                        <span>{latestProduct ? latestProduct.id : '+ Add Product'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>

                  </div>

                </div>

                {/* 1B. 2x2 Metric Stats Grid (Right 5 Columns) */}
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
                                  strokeWidth="2"
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

              {/* ROW 2: SCAN ANALYTICS + PRODUCT STATUS + GLOBAL LOCATIONS */}
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
                          <stop offset="0%" stopColor="#155EEF" stopOpacity="0.10" />
                          <stop offset="100%" stopColor="#155EEF" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {totalScansCount > 0 ? (
                        <>
                          <path
                            d="M 0 145 H 100 V 120 H 220 V 90 H 350 V 60 H 450 V 40 H 600 V 150 H 0 Z"
                            fill="url(#scanSquareGradient)"
                          />
                          <path
                            d="M 0 145 H 100 V 120 H 220 V 90 H 350 V 60 H 450 V 40 H 600"
                            fill="none"
                            stroke="#155EEF"
                            strokeWidth="2.5"
                            strokeLinecap="square"
                          />
                          <rect x="446" y="36" width="8" height="8" fill="#155EEF" stroke="#FFFFFF" strokeWidth="2" />
                        </>
                      ) : (
                        <>
                          <path d="M 0 145 H 600 V 150 H 0 Z" fill="url(#scanSquareGradient)" />
                          <path d="M 0 145 H 600" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="square" />
                          <rect x="420" y="141" width="8" height="8" fill="#155EEF" stroke="#FFFFFF" strokeWidth="2" />
                        </>
                      )}
                    </svg>

                    {/* Floating Square Tooltip */}
                    <div 
                      className="absolute z-20 bg-slate-950 text-white px-2.5 py-1 text-[10.5px] font-mono shadow-lg -translate-x-1/2 -translate-y-full pointer-events-none rounded-none border border-slate-700"
                      style={{ left: '71%', top: totalScansCount > 0 ? '35%' : '80%' }}
                    >
                      <div className="text-slate-400 text-[9px] font-medium">Sep 22, 2026</div>
                      <div className="font-bold text-white text-xs mt-0.5">{totalScansCount} scans</div>
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
                      <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                      {totalProductsCount > 0 && (
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#155EEF"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 * (1 - verifiedProductsCount / totalProductsCount)}
                          strokeLinecap="round"
                        />
                      )}
                    </svg>

                    {/* Donut Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-black text-slate-950 leading-none">{totalProductsCount}</span>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">Total Products</span>
                    </div>
                  </div>

                  {/* Legend List */}
                  <div className="space-y-1.5 text-xs text-left pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${verifiedProductsCount > 0 ? 'bg-[#155EEF]' : 'bg-slate-300'}`} />
                        <span className="text-slate-600">Verified</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {verifiedProductsCount} <span className="font-normal text-slate-400">({totalProductsCount > 0 ? Math.round((verifiedProductsCount / totalProductsCount) * 100) : 0}%)</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-slate-600">Pending</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">0 <span className="font-normal text-slate-400">(0%)</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-slate-600">Flagged</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">0 <span className="font-normal text-slate-400">(0%)</span></span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-slate-600">Expired</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">0 <span className="font-normal text-slate-400">(0%)</span></span>
                    </div>
                  </div>

                </div>

                {/* 2C. Global Scan Locations - 3 Columns */}
                <div className="lg:col-span-3 bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-950">Global Scan Locations</h3>
                    <button 
                      onClick={() => setActiveTab('logs')}
                      className="text-[11px] font-bold text-[#155EEF] hover:text-[#124bbf] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Interactive World Map */}
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

              {/* ROW 3: RECENT PRODUCTS TABLE + ACTIVITY FEED + BULK QR */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* 3A. Recent Products Table - 6 Columns */}
                <div className="lg:col-span-6 bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-950">Recent Products</h3>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="text-[11px] font-bold text-[#155EEF] hover:text-[#124bbf] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="py-10 flex flex-col items-center justify-center text-center px-4 border border-dashed border-slate-200 bg-slate-50/50 my-2">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF] mb-2.5">
                        <PackageOpen className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">No products registered yet</h4>
                      <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                        Issue your first cryptographic passport to begin tracking product authenticity.
                      </p>
                      <button 
                        onClick={() => setActiveTab('add-product')}
                        className="mt-3 px-3 py-1.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Product</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10.5px] font-mono text-slate-400 uppercase tracking-wider">
                            <th className="pb-2 font-semibold">Product</th>
                            <th className="pb-2 font-semibold">ID</th>
                            <th className="pb-2 font-semibold">Category</th>
                            <th className="pb-2 font-semibold">Status</th>
                            <th className="pb-2 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {products.slice(0, 5).map((prod) => (
                            <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5">
                                <span className="font-bold text-slate-900">{prod.name}</span>
                              </td>
                              <td className="py-2.5 font-mono text-[11px] text-[#155EEF] font-semibold">{prod.id}</td>
                              <td className="py-2.5 text-slate-600 text-[11.5px]">{prod.category}</td>
                              <td className="py-2.5">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                                  <span>✓</span> {prod.status}
                                </span>
                              </td>
                              <td className="py-2.5 text-right">
                                <button
                                  onClick={() => setSelectedPassportProduct(prod)}
                                  className="text-slate-400 hover:text-[#155EEF] p-1 transition-colors cursor-pointer"
                                  title="View Passport"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

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

                  {activities.length === 0 ? (
                    <div className="py-10 flex flex-col items-center justify-center text-center px-4 border border-dashed border-slate-200 bg-slate-50/50 my-2">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                        <Activity className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">No activity recorded</h4>
                      <p className="text-[10.5px] text-slate-400 max-w-[180px] mt-0.5 leading-snug">
                        Live verifications and QR scans will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 text-left">
                      {activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-2.5 p-2 bg-slate-50/80 border border-slate-100">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-[#155EEF] flex items-center justify-center shrink-0 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold text-slate-900 truncate">{act.title}</div>
                            <div className="text-[9.5px] font-mono text-slate-400 flex items-center justify-between mt-0.5">
                              <span>{act.productId}</span>
                              <span>{act.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* 3C. Right Stack: Bulk QR Card + Quick Actions - 3 Columns */}
                <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
                  
                  {/* Generate QR Codes in Bulk */}
                  <div className="bg-slate-950 text-white border border-slate-800 p-4 relative overflow-hidden shadow-md flex flex-col justify-between">
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
                      <button 
                        onClick={() => setActiveTab('qrcodes')}
                        className="px-3 py-1.5 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Open QR Studio</span>
                        <ArrowRight className="w-3 h-3 text-[#155EEF]" />
                      </button>
                    </div>

                  </div>

                  {/* Quick Actions 2x2 Grid */}
                  <div className="bg-white border border-slate-200 p-4 shadow-xs text-left">
                    <div className="text-xs font-bold text-slate-900 mb-2.5">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setActiveTab('add-product')}
                        className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>Add Product</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('certificates')}
                        className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>Certificates</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('customers')}
                        className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>Customers</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('analytics')}
                        className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>Reports</span>
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

              {/* ROW 4: BOTTOM WIDE BANNER */}
              <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-[#0F172A] border border-slate-800 p-6 sm:p-7 relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="absolute top-0 right-1/4 w-72 h-full bg-[#155EEF]/10 blur-3xl pointer-events-none" />

                <div className="text-left relative z-10">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    More Trust. More Value.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1 max-w-xl">
                    Digital product passports build trust, reduce counterfeits and unlock new lifecycle revenue opportunities for luxury brands.
                  </p>
                  <div className="mt-4">
                    <button 
                      onClick={() => setActiveTab('add-product')}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Issue New Passport</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#155EEF]" />
                    </button>
                  </div>
                </div>

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
            </>
          )}

          {/* TAB 6: ANALYTICS MANAGEMENT */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              products={products}
              certificates={certificates}
            />
          )}

          {/* TAB 7: LOGS & SECURITY TELEMETRY */}
          {activeTab === 'logs' && (
            <LogsView
              products={products}
            />
          )}

          {/* TAB 8: SETTINGS & ENTERPRISE CONFIG */}
          {activeTab === 'settings' && (
            <SettingsView
              companyName={displayCompany}
              companyId={displayCompanyId}
            />
          )}

        </main>

      </div>

      {/* CONSUMER DIGITAL PASSPORT MODAL */}
      <ProductPassportModal
        isOpen={!!selectedPassportProduct}
        product={selectedPassportProduct}
        onClose={() => setSelectedPassportProduct(null)}
      />

    </div>
  );
};
