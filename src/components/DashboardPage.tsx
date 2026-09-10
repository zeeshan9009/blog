import React, { useState, useEffect } from 'react';
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
import { SettingsView, EnterpriseSettings } from './SettingsView';
import { CommandPaletteModal } from './CommandPaletteModal';
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
  Trash2,
  Zap,
  ShieldAlert,
  Cpu,
  Fingerprint,
  Radio,
  Clock,
  Key,
  Copy,
  CheckCheck,
  Download,
  Filter
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
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | 'all'>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K Command Palette Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Real-Time Enterprise Settings state
  const [settings, setSettings] = useState<EnterpriseSettings>(() => {
    try {
      const saved = localStorage.getItem('veripass_enterprise_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      brandName: '',
      brandSubdomain: 'albadar',
      contactEmail: '',
      defaultOrigin: 'Switzerland',
      currency: 'USD ($)',
      antiCounterfeitMode: 'strict',
      quantumProofEnabled: true,
      geoFenceAlert: true,
      brandColor: '#155EEF',
      passportTheme: 'luxury_dark'
    };
  });

  const handleUpdateSetting = <K extends keyof EnterpriseSettings>(key: K, value: EnterpriseSettings[K]) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('veripass_enterprise_settings', JSON.stringify(updated));
      return updated;
    });
  };

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

  // Add Batch Products Handler
  const handleAddBatchProducts = (newBatch: Product[]) => {
    const updated = [...newBatch, ...products];
    setProducts(updated);
    localStorage.setItem('veripass_products', JSON.stringify(updated));

    const newActivity = {
      id: `act-${Date.now()}`,
      title: `Generated batch of ${newBatch.length} cryptographic units (${newBatch[0]?.name || 'Series'})`,
      productId: newBatch[0]?.id || 'BATCH-RUN',
      timestamp: 'Just now',
      type: 'issue'
    };
    const updatedActivities = [newActivity, ...activities].slice(0, 10);
    setActivities(updatedActivities);
    localStorage.setItem('veripass_activities', JSON.stringify(updatedActivities));
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
    // 1. Update Customers (remove product from old owner, add to new owner)
    let recipientFound = false;
    const updatedCustomers = customers.map((c) => {
      if (c.id === transfer.fromCustomerId) {
        const filteredIds = (c.ownedProductIds || []).filter((pid) => pid !== transfer.productId);
        return {
          ...c,
          ownedProductsCount: Math.max(0, (c.ownedProductsCount || 1) - 1),
          ownedProductIds: filteredIds
        };
      }
      if (c.id === transfer.toCustomerId) {
        recipientFound = true;
        const currentIds = c.ownedProductIds || [];
        const nextIds = currentIds.includes(transfer.productId) ? currentIds : [...currentIds, transfer.productId];
        return {
          ...c,
          ownedProductsCount: nextIds.length,
          ownedProductIds: nextIds
        };
      }
      return c;
    });

    let finalCustomers = updatedCustomers;
    if (!recipientFound) {
      const newRecipient: Customer = {
        id: transfer.toCustomerId,
        fullName: transfer.toCustomerName,
        email: transfer.toCustomerEmail,
        country: 'Pakistan',
        city: 'Verified Location',
        tier: 'Verified Buyer',
        registeredDate: transfer.transferDate,
        ownedProductsCount: 1,
        ownedProductIds: [transfer.productId],
        status: 'verified'
      };
      finalCustomers = [newRecipient, ...updatedCustomers];
    }
    setCustomers(finalCustomers);
    localStorage.setItem('veripass_customers', JSON.stringify(finalCustomers));

    // 2. Update Product (current owner + append ownership history)
    const updatedProducts = products.map((p) => {
      if (p.id === transfer.productId) {
        const newHistoryRecord = {
          id: `hist-${Date.now()}`,
          date: transfer.transferDate,
          fromName: transfer.fromCustomerName,
          toName: transfer.toCustomerName,
          eventType: 'transfer' as const,
          notes: transfer.notes || 'Secondary market verified ownership transfer'
        };
        const existingHistory = p.ownershipHistory || [];
        return {
          ...p,
          currentOwnerId: transfer.toCustomerId,
          currentOwnerName: transfer.toCustomerName,
          currentOwnerEmail: transfer.toCustomerEmail,
          ownershipHistory: [newHistoryRecord, ...existingHistory]
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('veripass_products', JSON.stringify(updatedProducts));

    // 3. Update certificates status if linked
    const updatedCertificates = certificates.map((cert) => {
      if (cert.productId === transfer.productId) {
        return { ...cert, status: 'transferred' as CertificateStatus, recipientName: transfer.toCustomerName, recipientEmail: transfer.toCustomerEmail };
      }
      return cert;
    });
    setCertificates(updatedCertificates);
    localStorage.setItem('veripass_certificates', JSON.stringify(updatedCertificates));

    // 4. Register Activity
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

  const copyPassportId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentBusiness = businessCategories[currentCategoryKey] || businessCategories.jewelry;

  const displayName = profile?.fullName || user?.user_metadata?.full_name || 'Admin User';
  const displayCompany = settings.brandName.trim() || profile?.companyName || user?.user_metadata?.company_name || currentBusiness.companyName;
  const displayCompanyId = profile?.companyId || user?.user_metadata?.company_id || currentBusiness.companyId;
  const displayEmail = settings.contactEmail.trim() || profile?.email || user?.email || 'admin@veripass.id';
  const userInitials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'VP';

  // Dynamic calculations
  const totalProductsCount = products.length;
  const verifiedProductsCount = products.filter((p) => p.status === 'verified').length;
  const totalScansCount = products.reduce((sum, p) => sum + (p.verificationCount || 0), 0);
  const activeQrCount = products.length;
  const certificatesCount = certificates.length;
  const customersCount = customers.length;

  const latestProduct = products.length > 0 ? products[0] : null;

  // Sidebar navigation configuration
  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: 'Live' },
    { id: 'products', label: 'Products & Passports', icon: Box, count: totalProductsCount },
    { id: 'qrcodes', label: 'QR Vector Studio', icon: QrCode, count: activeQrCount },
    { id: 'certificates', label: 'Authenticity Certs', icon: FileCheck2, count: certificatesCount },
    { id: 'customers', label: 'Custodians & VIPs', icon: Users, count: customersCount },
    { id: 'ownership', label: 'Ownership Ledger', icon: UserCheck },
    { id: 'analytics', label: 'Telemetry & BI', icon: BarChart3 },
    { id: 'logs', label: 'Security Audit Trail', icon: ScrollText },
    { id: 'settings', label: 'Enterprise Config', icon: Settings },
  ];

  // Dynamic Metric KPI Deck
  const stats = [
    {
      title: 'Cryptographic Passports',
      subtitle: 'Anchored Inventory',
      value: totalProductsCount.toString(),
      change: totalProductsCount > 0 ? '+100%' : '0%',
      trend: 'ACTIVE',
      icon: Box,
      textColor: 'text-[#155EEF]',
      bgColor: 'bg-[#EFF8FF] border-blue-200',
      sparkline: totalProductsCount > 0 ? 'M0 24 Q 30 18, 60 12 T 120 4' : 'M0 24 H 120'
    },
    {
      title: 'Consumer Verifications',
      subtitle: 'Real-time Scans',
      value: totalScansCount.toString(),
      change: totalScansCount > 0 ? '100% Valid' : '0 Scans',
      trend: 'TAMPER-FREE',
      icon: ShieldCheck,
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50 border-emerald-200',
      sparkline: totalScansCount > 0 ? 'M0 24 Q 30 16, 60 10 T 120 2' : 'M0 24 H 120'
    },
    {
      title: 'Active Digital Hangtags',
      subtitle: 'SVG / PNG Vector QR',
      value: activeQrCount.toString(),
      change: activeQrCount > 0 ? 'Print Ready' : 'Standby',
      trend: 'HIGH-RES',
      icon: QrCode,
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50 border-indigo-200',
      sparkline: activeQrCount > 0 ? 'M0 24 Q 30 18, 60 12 T 120 4' : 'M0 24 H 120'
    },
    {
      title: 'Authenticity Certificates',
      subtitle: 'Immutable Ownership Seals',
      value: certificatesCount.toString(),
      change: certificatesCount > 0 ? 'Anchored' : '0 Issued',
      trend: 'VERIFIED',
      icon: FileCheck2,
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
      sparkline: certificatesCount > 0 ? 'M0 24 Q 30 18, 60 12 T 120 4' : 'M0 24 H 120'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex antialiased selection:bg-[#155EEF] selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. LEFT SHARP PRECISION SIDEBAR */}
      {/* ========================================================= */}
      <aside className="w-[235px] xl:w-[250px] shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between min-h-screen sticky top-0 h-screen overflow-y-auto z-30 rounded-none">
        
        {/* Top Section */}
        <div>
          {/* Logo & Brand Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div 
              onClick={onBackToHome}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-[#155EEF] rounded-none flex items-center justify-center text-white shadow-xs group-hover:bg-[#124bbf] transition-colors">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-slate-950 font-sans leading-none">
                    VeriPass
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-[#EFF8FF] text-[#155EEF] border border-blue-200 px-1 py-0.2 rounded-none">
                    PRO
                  </span>
                </div>
                <span className="text-[8px] font-bold text-slate-400 tracking-wider mt-0.5 uppercase">
                  CRYPTOGRAPHIC SUITE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 pt-3 pb-1 text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-widest text-left">
            Main Management
          </div>
          <nav className="p-2 space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'products' && activeTab === 'add-product');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-all text-left cursor-pointer rounded-none ${
                    isActive
                      ? 'bg-[#EFF8FF] text-[#155EEF] font-semibold border-l-2 border-[#155EEF]'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#155EEF]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[10px] font-mono font-bold bg-blue-100 text-[#155EEF] px-1.5 py-0.2 rounded-none">
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 animate-pulse" />
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 space-y-2.5 relative border-t border-slate-100 bg-slate-50/50 rounded-none">
          
          {/* Square Precision Node Card */}
          <div className="bg-white border border-slate-200 p-3 text-left rounded-none shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9.5px] font-mono font-bold text-slate-500 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                Ledger Node #104
              </span>
              <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded-none">
                SYNCED
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-900 leading-tight">
              SHA-256 Tamper Guard
            </p>
            <p className="text-[9px] font-mono text-slate-400 mt-0.5">
              Network Latency: 24ms
            </p>
          </div>

          {/* Organization Switcher Dropdown Button */}
          <div className="relative">
            <div 
              onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
              className="p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-none flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 bg-slate-100 border border-slate-200 rounded-none flex items-center justify-center font-bold text-xs shrink-0">
                  {currentBusiness.icon}
                </div>
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                    {displayCompany}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 truncate">
                    {displayCompanyId}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOrgDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Interactive Category Selector Popover */}
            {isOrgDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-none shadow-xl z-50 p-1 space-y-0.5 max-h-64 overflow-y-auto">
                <div className="px-2 py-1 text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Business Industry
                </div>
                {Object.values(businessCategories).map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => {
                      setCurrentCategoryKey(biz.id);
                      setIsOrgDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-xs text-left transition-colors cursor-pointer rounded-none ${
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
          <div className="flex items-center justify-between text-[9.5px] text-slate-400 px-0.5 font-mono">
            <span>VeriPass Enterprise</span>
            <span>v2.4.0</span>
          </div>

        </div>

      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* TOP NAVBAR / HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0 rounded-none">
          
          {/* Search Bar with Keyboard Shortcut & Command Palette Trigger */}
          <div 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative w-full max-w-md cursor-pointer group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-[#155EEF] absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <input 
              type="text"
              readOnly
              placeholder="Search products, certificates, customers, commands... (Ctrl+K)"
              value={searchQuery}
              className="w-full bg-slate-50 hover:bg-slate-100/80 group-hover:border-[#155EEF] border border-slate-200 text-xs pl-9 pr-14 py-2 text-slate-800 placeholder-slate-400 focus:outline-none transition-all rounded-none shadow-2xs cursor-pointer select-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9.5px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded-none text-slate-400 group-hover:text-[#155EEF] group-hover:border-blue-200 shadow-2xs transition-colors">
              Ctrl+K
            </kbd>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Action Add Product */}
            <button
              onClick={() => setActiveTab('add-product')}
              className="px-3.5 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer rounded-none shadow-2xs active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Product</span>
            </button>

            {/* Quick QR Studio */}
            <button
              onClick={() => setActiveTab('qrcodes')}
              className="hidden md:flex px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs items-center gap-1.5 transition-colors cursor-pointer rounded-none"
            >
              <QrCode className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>QR Studio</span>
            </button>

            {/* Notification Bell with pulse indicator */}
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-none transition-colors cursor-pointer border border-transparent hover:border-slate-200">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#155EEF] rounded-none ring-2 ring-white" />
            </button>

            <div className="h-6 w-[1px] bg-slate-200" />

            {/* User Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 cursor-pointer group p-1 rounded-none hover:bg-slate-50 transition-all"
              >
                <div className="w-8 h-8 rounded-none bg-slate-950 text-white font-bold text-xs flex items-center justify-center font-mono border border-slate-800 group-hover:border-[#155EEF] transition-all shadow-xs">
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                    {displayCompany}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-none shadow-xl z-50 p-2 text-left">
                  <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{displayName}</div>
                    <div className="text-[10.5px] font-mono text-slate-400 truncate">{displayEmail}</div>
                    <div className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-[#155EEF] bg-blue-50 px-1.5 py-0.5 rounded-none mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{displayCompany}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-none transition-colors font-medium cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-none transition-colors font-medium cursor-pointer mt-1"
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
        <main className="flex-1 p-5 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] w-full mx-auto">
          
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
              onAddBatchProducts={handleAddBatchProducts}
              defaultBrand={displayCompany}
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
              onViewPassport={(p) => setSelectedPassportProduct(p)}
            />
          )}

          {/* TAB 6: DASHBOARD MAIN OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* ========================================================= */}
              {/* EXECUTIVE COMMAND HERO BAR (SQUARE HIGH-TECH STYLE) */}
              {/* ========================================================= */}
              <div className="relative overflow-hidden bg-slate-950 border border-slate-800 rounded-none p-6 sm:p-7 text-white shadow-lg">
                
                {/* Square Background Geometric Grid Accent */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-10 select-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  
                  {/* Left Greeting & Organization Status */}
                  <div className="text-left max-w-xl">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#155EEF]/20 text-[#53B1FD] border border-[#155EEF]/40">
                        <span className="w-1.5 h-1.5 rounded-none bg-[#53B1FD] animate-pulse" />
                        VAULT ONLINE
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {displayCompany} • ID: {displayCompanyId}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                      Welcome back, {displayName.split(' ')[0]} 👋
                    </h1>
                    <p className="text-xs sm:text-[13px] text-slate-300 font-normal mt-1 leading-relaxed">
                      Real-time cryptographic passport infrastructure, digital asset twin custody, and tamper-proof verification ledger.
                    </p>

                    {/* Quick Launch Action Pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
                      <button
                        onClick={() => setActiveTab('add-product')}
                        className="px-3.5 py-1.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs rounded-none flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Issue Passport</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('qrcodes')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#53B1FD]" />
                        <span>QR Studio</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('certificates')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Issue Certificate</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('logs')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-none flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ScrollText className="w-3.5 h-3.5 text-amber-400" />
                        <span>Security Logs</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Holographic Live Telemetry Badge */}
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-none min-w-[240px] text-left">
                      <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-[#53B1FD]" />
                          Security Score
                        </span>
                        <span className="text-emerald-400 font-bold">100% SECURE</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-none overflow-hidden mb-2">
                        <div className="bg-[#155EEF] h-full w-full rounded-none" />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Quantum Guard: Active</span>
                        <span className="text-[#53B1FD] font-semibold">{totalProductsCount} Assets</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* ========================================================= */}
              {/* ROW 1: 4-COLUMN SQUARE STATS DECK */}
              {/* ========================================================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-white border border-slate-200 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-xs hover:border-slate-300 transition-colors text-left rounded-none group"
                    >
                      <div className="flex items-start justify-between">
                        <div className={`w-9 h-9 rounded-none border flex items-center justify-center ${stat.bgColor} ${stat.textColor} shadow-2xs`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {/* Mini Sparkline SVG */}
                        <div className="w-18 h-7">
                          <svg viewBox="0 0 120 30" className="w-full h-full overflow-visible">
                            <path
                              d={stat.sparkline}
                              fill="none"
                              stroke="#155EEF"
                              strokeWidth="2.5"
                              strokeLinecap="square"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-[11px] font-medium text-slate-500">{stat.title}</div>
                        <div className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">{stat.value}</div>
                        <div className="flex items-center justify-between text-[10.5px] mt-2 pt-2 border-t border-slate-100">
                          <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                            <ArrowUp className="w-3 h-3" />
                            {stat.change}
                          </span>
                          <span className="text-slate-400 font-mono text-[9.5px] uppercase tracking-wider">{stat.subtitle}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ========================================================= */}
              {/* ROW 2: SQUARE TELEMETRY (8 COLS) + INTEGRITY GAUGE (4 COLS) */}
              {/* ========================================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* 2A. Real-time Telemetry & Verification Volume (8 Columns) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between rounded-none">
                  
                  {/* Header & Timeframe Switcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div className="text-left">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#155EEF] font-bold uppercase tracking-wider mb-0.5">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Live Verification Stream</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-950">Cryptographic Verification Trajectory</h3>
                      <p className="text-xs text-slate-400">Authentications, QR handshakes, and cryptographic nonce matching</p>
                    </div>

                    {/* Timeframe Filter Tabs */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-none text-xs font-semibold text-slate-600 self-start sm:self-auto border border-slate-200">
                      {(['24h', '7d', '30d', '90d', 'all'] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-3 py-1 rounded-none text-xs transition-all cursor-pointer uppercase font-mono ${
                            timeRange === range
                              ? 'bg-[#155EEF] text-white font-bold shadow-2xs'
                              : 'hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Canvas with Smooth Stepped Area Curve */}
                  <div className="relative w-full h-56 sm:h-64 pt-4">
                    
                    {/* Y-Axis Grid Lines & Values */}
                    <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-mono text-slate-300 pointer-events-none pb-7">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span>2,500</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span>1,875</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span>1,250</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span>625</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span>0</span>
                      </div>
                    </div>

                    {/* SVG Area & Smooth Stepped Line */}
                    <svg viewBox="0 0 700 180" className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="telemetryBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#155EEF" stopOpacity="0.16" />
                          <stop offset="100%" stopColor="#155EEF" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {totalScansCount > 0 ? (
                        <>
                          <path
                            d="M 0 170 H 100 V 135 H 220 V 95 H 360 V 65 H 490 V 35 H 610 V 15 H 700 V 180 H 0 Z"
                            fill="url(#telemetryBlueGradient)"
                          />
                          <path
                            d="M 0 170 H 100 V 135 H 220 V 95 H 360 V 65 H 490 V 35 H 610 V 15 H 700"
                            fill="none"
                            stroke="#155EEF"
                            strokeWidth="2.5"
                            strokeLinecap="square"
                          />
                          <rect x="606" y="11" width="8" height="8" fill="#155EEF" stroke="#FFFFFF" strokeWidth="2" />
                        </>
                      ) : (
                        <>
                          <path d="M 0 175 H 700 V 180 H 0 Z" fill="url(#telemetryBlueGradient)" />
                          <path d="M 0 175 H 700" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="square" />
                          <rect x="550" y="171" width="8" height="8" fill="#94A3B8" stroke="#FFFFFF" strokeWidth="2" />
                        </>
                      )}
                    </svg>

                    {/* Floating Pulse Indicator */}
                    <div 
                      className="absolute z-20 bg-slate-950 text-white px-2.5 py-1 text-xs font-mono shadow-xl -translate-x-1/2 -translate-y-full pointer-events-none rounded-none border border-slate-700"
                      style={{ left: '85%', top: totalScansCount > 0 ? '15%' : '88%' }}
                    >
                      <div className="text-slate-400 text-[9px]">Peak Telemetry</div>
                      <div className="font-bold text-white text-xs mt-0.5">{totalScansCount} scans</div>
                      <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700" />
                    </div>

                    {/* X-Axis labels */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
                      <span>Day 1</span>
                      <span>Day 5</span>
                      <span>Day 10</span>
                      <span>Day 15</span>
                      <span>Day 20</span>
                      <span className="font-bold text-[#155EEF]">Today</span>
                    </div>

                  </div>

                  {/* Summary Metric Strip Underneath Chart */}
                  <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 text-left">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Avg Response Time</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">24 ms</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Tamper Flag Rate</div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">0.00% (Clean)</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Integrity Confidence</div>
                      <div className="text-sm font-bold text-[#155EEF] mt-0.5">99.98% Cryptographic</div>
                    </div>
                  </div>

                </div>

                {/* 2B. Cryptographic Security & Identity Health Gauge (4 Columns) */}
                <div className="lg:col-span-4 bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between text-left rounded-none">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-950">Security Health Index</h3>
                      <p className="text-[11px] text-slate-400">Cryptographic sub-systems check</p>
                    </div>
                    <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none">
                      100% ARMED
                    </span>
                  </div>

                  {/* Circular Radial Gauge */}
                  <div className="relative w-38 h-38 mx-auto my-3 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="11" fill="none" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#155EEF"
                        strokeWidth="11"
                        fill="none"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 * (1 - (totalProductsCount > 0 ? verifiedProductsCount / totalProductsCount : 1))}
                        strokeLinecap="butt"
                      />
                    </svg>

                    {/* Donut Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <ShieldCheck className="w-5 h-5 text-[#155EEF] mb-0.5" />
                      <span className="text-xl font-black text-slate-950 leading-none">100%</span>
                      <span className="text-[9.5px] text-slate-400 font-medium mt-0.5">Tamper Proof</span>
                    </div>
                  </div>

                  {/* Subsystems Checklist */}
                  <div className="space-y-1.5 text-xs pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between p-2 rounded-none bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-700 font-medium">SHA-256 Nonce Matching</span>
                      </div>
                      <span className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded-none">VALID</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-none bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-700 font-medium">Geo-Fence Guard</span>
                      </div>
                      <span className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded-none">ARMED</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-none bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-700 font-medium">DID Custody Protocol</span>
                      </div>
                      <span className="font-mono text-[9px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded-none">ACTIVE</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* ========================================================= */}
              {/* ROW 3: RECENT PASSPORTS (7 COLS) + LIVE ACTIVITY STREAM (5 COLS) */}
              {/* ========================================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* 3A. Recent Cryptographic Passports (7 Columns) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between text-left rounded-none">
                  
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-950">Active Digital Passports</h3>
                      <p className="text-xs text-slate-400">Serialized luxury assets secured by cryptographic hashes</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-[#155EEF] hover:text-[#124bbf] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Passports</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4 border border-dashed border-slate-200 bg-slate-50/50 my-2 rounded-none">
                      <div className="w-11 h-11 rounded-none bg-[#EFF8FF] border border-blue-200 flex items-center justify-center text-[#155EEF] mb-3 shadow-xs">
                        <PackageOpen className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">No cryptographic products registered yet</h4>
                      <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
                        Register your first product to generate an immutable cryptographic passport and high-res vector QR code.
                      </p>
                      <button 
                        onClick={() => setActiveTab('add-product')}
                        className="mt-3.5 px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs rounded-none flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Issue First Passport</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                            <th className="pb-3 font-semibold">Product Name</th>
                            <th className="pb-3 font-semibold">Passport ID</th>
                            <th className="pb-3 font-semibold">Category</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {products.slice(0, 5).map((prod) => (
                            <tr key={prod.id} className="hover:bg-slate-50 transition-colors group">
                              <td className="py-3">
                                <div className="font-bold text-slate-900">{prod.name}</div>
                                <div className="text-[9.5px] font-mono text-slate-400">{prod.sku}</div>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[11px] text-[#155EEF] font-semibold">{prod.id}</span>
                                  <button
                                    onClick={() => copyPassportId(prod.id)}
                                    className="text-slate-300 hover:text-slate-600 p-0.5 cursor-pointer"
                                    title="Copy Passport ID"
                                  >
                                    {copiedId === prod.id ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 text-slate-600 text-[11px]">{prod.category}</td>
                              <td className="py-3">
                                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-none">
                                  <span>✓</span> {prod.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => setSelectedPassportProduct(prod)}
                                  className="text-slate-400 hover:text-[#155EEF] p-1 rounded-none hover:bg-blue-50 transition-colors cursor-pointer"
                                  title="Inspect Digital Passport"
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

                {/* 3B. Live Security Stream & Quick Launch (5 Columns) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4 text-left">
                  
                  {/* Live Security Events Feed */}
                  <div className="bg-white border border-slate-200 p-5 shadow-xs flex-1 rounded-none">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse" />
                        <h3 className="text-xs font-bold text-slate-950 uppercase font-mono tracking-wider">Live Security Audit Feed</h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('logs')}
                        className="text-[11px] font-semibold text-[#155EEF] hover:underline cursor-pointer"
                      >
                        All Logs
                      </button>
                    </div>

                    {activities.length === 0 ? (
                      <div className="py-7 flex flex-col items-center justify-center text-center px-4 bg-slate-50/50 rounded-none border border-slate-100">
                        <Activity className="w-4 h-4 text-slate-400 mb-1" />
                        <p className="text-[10.5px] text-slate-400">Telemetry feed standby</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-left max-h-52 overflow-y-auto pr-1">
                        {activities.slice(0, 4).map((act) => (
                          <div key={act.id} className="flex items-start gap-2.5 p-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-none transition-colors">
                            <div className="w-5 h-5 rounded-none bg-blue-100 text-[#155EEF] flex items-center justify-center shrink-0 mt-0.5">
                              <ShieldCheck className="w-3 h-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[11.5px] font-bold text-slate-900 truncate">{act.title}</div>
                              <div className="text-[9.5px] font-mono text-slate-400 flex items-center justify-between mt-0.5">
                                <span className="text-[#155EEF] font-semibold">{act.productId}</span>
                                <span>{act.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Operations Matrix */}
                  <div className="bg-white border border-slate-200 p-4 shadow-xs rounded-none">
                    <div className="text-xs font-bold text-slate-900 mb-2.5">Core Operations</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setActiveTab('add-product')}
                        className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 rounded-none text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>Add Product</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('qrcodes')}
                        className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 rounded-none text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <Scan className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>QR Studio</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('certificates')}
                        className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 rounded-none text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>Certificates</span>
                      </button>

                      <button 
                        onClick={() => setActiveTab('customers')}
                        className="flex items-center gap-2 p-2 border border-slate-200 hover:border-[#155EEF] hover:bg-blue-50/50 rounded-none text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-[#155EEF]" />
                        <span>Custodians</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* ========================================================= */}
              {/* ROW 4: ENTERPRISE TRUST & VALUE BANNER (SQUARE) */}
              {/* ========================================================= */}
              <div className="w-full bg-slate-950 border border-slate-800 rounded-none p-6 sm:p-7 relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
                <div className="absolute top-0 right-1/4 w-80 h-full bg-[#155EEF]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[9.5px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10 mb-2">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    IMMUTABLE PROVENANCE
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Secure Product Authenticity & Secondary Value
                  </h2>
                  <p className="text-xs sm:text-[13px] text-slate-400 font-normal mt-1 leading-relaxed">
                    VeriPass cryptographic digital twins eradicate counterfeits, verify secondary market transfers, and build lasting consumer confidence.
                  </p>
                  <div className="mt-4">
                    <button 
                      onClick={() => setActiveTab('add-product')}
                      className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-none flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Deploy New Cryptographic Passport</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#155EEF]" />
                    </button>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-44 h-24 bg-slate-900 border border-slate-800 rounded-none p-3 flex flex-col justify-between shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] font-mono text-slate-400">VERIPASS VAULT</span>
                      <ShieldCheck className="w-4 h-4 text-[#53B1FD]" />
                    </div>
                    <div className="text-right">
                      <div className="text-[9.5px] font-mono text-emerald-400 font-bold">256-BIT SHA</div>
                      <div className="text-[11px] font-mono font-bold text-[#155EEF] tracking-widest">VP-SECURED</div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 7: ANALYTICS MANAGEMENT */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              products={products}
              certificates={certificates}
            />
          )}

          {/* TAB 8: LOGS & SECURITY TELEMETRY */}
          {activeTab === 'logs' && (
            <LogsView
              products={products}
            />
          )}

          {/* TAB 9: SETTINGS & ENTERPRISE CONFIG */}
          {activeTab === 'settings' && (
            <SettingsView
              companyName={displayCompany}
              companyId={displayCompanyId}
              settings={{
                ...settings,
                brandName: settings.brandName || displayCompany,
                contactEmail: settings.contactEmail || displayEmail
              }}
              onUpdateSetting={handleUpdateSetting}
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

      {/* GLOBAL COMMAND PALETTE SEARCH MODAL (CTRL+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        products={products}
        certificates={certificates}
        customers={customers}
        onSelectProduct={(p) => setSelectedPassportProduct(p)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

    </div>
  );
};
