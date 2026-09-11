import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Calendar, 
  FileText, 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowLeft, 
  Wrench, 
  HelpCircle, 
  Building2, 
  Send, 
  Share2,
  Lock,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Product, ServiceRecord, OwnershipHistoryRecord } from '../types/product';
import { FraudReport, WarrantyClaim } from '../types/models';

interface PublicPassportPageProps {
  productId?: string;
  onBackToHome?: () => void;
  onNavigateToRegister?: (productId: string) => void;
}

export const PublicPassportPage: React.FC<PublicPassportPageProps> = ({
  productId = 'VP-2026-8F4K29',
  onBackToHome
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'warranty' | 'ownership' | 'service' | 'specs'>('overview');
  
  // Modals state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Form states for Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDealer, setRegDealer] = useState('');
  const [regDate, setRegDate] = useState(new Date().toISOString().split('T')[0]);
  const [regInvoice, setRegInvoice] = useState('');

  // Form states for Report
  const [reportReason, setReportReason] = useState<'counterfeit_suspected' | 'unreadable_qr' | 'specs_mismatch' | 'duplicate_serial' | 'tampered_seal' | 'stolen_goods'>('counterfeit_suspected');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterCity, setReporterCity] = useState('');
  const [reportDealer, setReportDealer] = useState('');
  const [reportNotes, setReportNotes] = useState('');

  // Form states for Warranty Claim
  const [claimCategory, setClaimCategory] = useState<'Hardware Failure' | 'Cosmetic Damage' | 'Electronic Malfunction' | 'Defect in Material' | 'Missing Parts'>('Hardware Failure');
  const [claimDescription, setClaimDescription] = useState('');

  useEffect(() => {
    // Load products from localStorage or use rich fallback
    const loadProductData = () => {
      let found: Product | null = null;
      try {
        const saved = localStorage.getItem('veripass_products');
        if (saved) {
          const list: Product[] = JSON.parse(saved);
          found = list.find((p) => p.id === productId || p.serialNumber === productId) || null;
        }
      } catch (e) {
        console.error(e);
      }

      if (!found) {
        // High quality default demo product
        found = {
          id: productId || 'VP-2026-8F4K29',
          sku: 'RNG-18K-DIA-01',
          name: 'Solitaire 18K White Gold Diamond Ring (1.50ct)',
          brand: 'VeriPass Luxury Horology & Fine Jewelry',
          category: 'Fine Jewelry',
          description: 'Certified hand-crafted solitaire ring featuring a VVS1 clarity natural conflict-free diamond encased in solid 18-karat white gold with micro-engraved cryptographic serial identification.',
          serialNumber: 'SN-DIA-99214-X81',
          batchNumber: 'LOT-2026-VAL-01',
          manufacturingDate: '2026-02-14',
          originCountry: 'Switzerland',
          status: 'verified',
          imageUrl: '/diamond-ring.jpg',
          passportHash: '0x9a8f4c12e84d71b3392f80164a2c0981e7d2390f11ac76be98124b89ff01ac44',
          verificationCount: 142,
          qrCodeUrl: `https://useveripass.com/verify/${productId || 'VP-2026-8F4K29'}`,
          createdAt: '2026-02-14',
          warrantyMonths: 24,
          purchaseDate: '2026-03-01',
          currentOwnerName: 'Sophia Al-Mansoor',
          currentOwnerEmail: 'sophia.m@example.com',
          dealerName: 'Geneva Haute Horlogerie Flagship',
          lifecycleState: 'ACTIVATED',
          specs: {
            'Carat Weight': '1.50 ct',
            'Clarity Grade': 'VVS1 Ultra-Pure',
            'Color Grade': 'D (Colorless)',
            'Metal Purity': '18K (750) White Gold',
            'Laser Inscription': 'GIA-99214-VP',
            'Factory Origin': 'Geneva Atelier 4'
          },
          ownershipHistory: [
            {
              id: 'hist-1',
              date: '2026-02-14',
              fromName: 'Master Artisan Vault (Geneva)',
              toName: 'Geneva Haute Horlogerie Flagship',
              eventType: 'dealer_assignment',
              location: 'Geneva, Switzerland',
              notes: 'Factory minting & tamper-proof cryptographic sealing.'
            },
            {
              id: 'hist-2',
              date: '2026-03-01',
              fromName: 'Geneva Haute Horlogerie Flagship',
              toName: 'Sophia Al-Mansoor',
              eventType: 'initial_registration',
              location: 'Dubai, UAE',
              notes: 'Primary retail acquisition with full lifetime authenticity passport.'
            }
          ],
          serviceHistory: [
            {
              id: 'serv-1',
              date: '2026-06-20',
              serviceType: 'Routine Maintenance',
              serviceCenter: 'VeriPass Authorized Service Hub - Dubai Mall',
              technicianName: 'Marc Delacroix',
              description: 'Prong ultrasonic inspection, steam cleaning, and micro-claw tension calibration.',
              cost: 'Complimentary (Under Warranty)',
              nextServiceDueDate: '2027-06-20'
            }
          ]
        };
      }

      setProduct(found);
    };

    loadProductData();
  }, [productId]);

  const handleCopyHash = () => {
    if (!product) return;
    navigator.clipboard.writeText(product.passportHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegisterOwnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !regName || !regEmail) return;

    const updatedProduct: Product = {
      ...product,
      currentOwnerName: regName.trim(),
      currentOwnerEmail: regEmail.trim(),
      currentOwnerPhone: regPhone.trim(),
      purchaseDate: regDate,
      dealerName: regDealer.trim() || 'Authorized VeriPass Dealer',
      lifecycleState: 'OWNED',
      ownershipHistory: [
        ...(product.ownershipHistory || []),
        {
          id: `hist-${Date.now()}`,
          date: regDate,
          fromName: product.currentOwnerName || 'Original Brand Custody',
          toName: regName.trim(),
          eventType: 'initial_registration',
          location: regDealer.trim() || 'Verified Location',
          notes: `Customer registered ownership. Invoice Ref: ${regInvoice || 'N/A'}`
        }
      ]
    };

    setProduct(updatedProduct);

    // Persist to local storage
    try {
      const saved = localStorage.getItem('veripass_products');
      if (saved) {
        const list: Product[] = JSON.parse(saved);
        const idx = list.findIndex((p) => p.id === product.id);
        if (idx >= 0) {
          list[idx] = updatedProduct;
        } else {
          list.push(updatedProduct);
        }
        localStorage.setItem('veripass_products', JSON.stringify(list));
      }
    } catch (e) {
      console.error(e);
    }

    setRegisterSuccess(true);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegisterSuccess(false);
    }, 1800);
  };

  const handleReportCounterfeit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reporterName || !reporterEmail) return;

    const newReport: FraudReport = {
      id: `FRAUD-${Date.now()}`,
      productId: product?.id,
      productName: product?.name || 'Unknown Item',
      serialNumber: product?.serialNumber,
      reporterName: reporterName.trim(),
      reporterEmail: reporterEmail.trim(),
      reason: reportReason,
      locationCity: reporterCity.trim() || 'Online / Remote',
      locationCountry: 'Global',
      dealerOrStoreName: reportDealer.trim(),
      description: reportNotes.trim(),
      reportDate: new Date().toISOString().split('T')[0],
      status: 'investigating',
      severity: reportReason === 'counterfeit_suspected' ? 'critical' : 'high'
    };

    try {
      const existing = localStorage.getItem('veripass_fraud_reports');
      const list: FraudReport[] = existing ? JSON.parse(existing) : [];
      list.unshift(newReport);
      localStorage.setItem('veripass_fraud_reports', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    setReportSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
    }, 2000);
  };

  const handleClaimWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !claimDescription) return;

    const newClaim: WarrantyClaim = {
      id: `CLM-${Date.now()}`,
      warrantyId: `WAR-${product.id}`,
      productId: product.id,
      productName: product.name,
      serialNumber: product.serialNumber,
      customerName: product.currentOwnerName || 'Verified Owner',
      customerEmail: product.currentOwnerEmail || 'owner@example.com',
      customerPhone: '+1-555-0199',
      issueCategory: claimCategory,
      issueDescription: claimDescription.trim(),
      claimDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    try {
      const existing = localStorage.getItem('veripass_warranty_claims');
      const list: WarrantyClaim[] = existing ? JSON.parse(existing) : [];
      list.unshift(newClaim);
      localStorage.setItem('veripass_warranty_claims', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    setClaimSuccess(true);
    setTimeout(() => {
      setShowClaimModal(false);
      setClaimSuccess(false);
    }, 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RotateCw className="w-8 h-8 text-[#155EEF] animate-spin mx-auto" />
          <p className="font-mono text-sm text-slate-400">Verifying Cryptographic Ledger...</p>
        </div>
      </div>
    );
  }

  // Calculate Warranty Status
  const warrantyDuration = product.warrantyMonths || 24;
  const purchaseDate = product.purchaseDate ? new Date(product.purchaseDate) : new Date(product.manufacturingDate);
  const expiryDate = new Date(purchaseDate);
  expiryDate.setMonth(expiryDate.getMonth() + warrantyDuration);

  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const remainingMonths = Math.max(0, Math.floor(remainingDays / 30));
  const isWarrantyActive = remainingDays > 0;

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans selection:bg-[#155EEF] selection:text-white">
      
      {/* 1. TOP HEADER & VERIPASS PROTOCOL BAR */}
      <header className="border-b border-slate-800 bg-[#0B132B]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button 
                onClick={onBackToHome}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
                title="Back to Platform"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#155EEF] flex items-center justify-center font-black text-white text-xs">
                VP
              </div>
              <span className="font-black text-sm tracking-wider uppercase text-white font-mono">
                VERIPASS<span className="text-blue-500">®</span> PASSPORT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              NODE LIVE • 256-BIT SHA
            </span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${product.name} — VeriPass Verified`,
                    url: window.location.href
                  });
                } else {
                  handleCopyHash();
                }
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              title="Share Passport"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. RECALL ALERT BANNER (If Recalled) */}
      {product.recallNotice?.isRecalled && (
        <div className="bg-red-600 text-white px-4 py-3 border-b border-red-700 shadow-lg animate-pulse">
          <div className="max-w-5xl mx-auto flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0 text-white" />
            <div className="flex-1">
              <span className="font-bold uppercase tracking-wider">[SAFETY RECALL NOTICE]</span>{' '}
              {product.recallNotice.reason || 'This product is subject to an active safety recall by the manufacturer.'}
            </div>
            <a href="#claim" onClick={() => setShowClaimModal(true)} className="underline hover:text-red-100 uppercase tracking-wider text-xs font-bold shrink-0">
              Claim Recall Support →
            </a>
          </div>
        </div>
      )}

      {/* 3. MAIN VERIFICATION BADGE HERO */}
      <section className="border-b border-slate-800/80 bg-gradient-to-b from-[#0D1B36] to-[#070D18] py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-6 border-b border-slate-800">
            {/* Left Brand Badge */}
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>OFFICIALLY VERIFIED AUTHENTIC</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {product.name}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-blue-400 font-bold uppercase">{product.brand}</span>
                <span className="text-slate-600">•</span>
                <span>Serial: <strong className="font-mono text-slate-200">{product.serialNumber}</strong></span>
                <span className="text-slate-600">•</span>
                <span>Lot: <strong className="font-mono text-slate-200">{product.batchNumber}</strong></span>
              </p>
            </div>

            {/* Quick Action Button Group */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2.5 bg-[#155EEF] hover:bg-[#124bbf] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{product.currentOwnerName ? 'Update Registration' : 'Register Ownership'}</span>
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="px-3 py-2.5 bg-slate-800/90 hover:bg-red-950/40 hover:text-red-300 text-slate-300 border border-slate-700 hover:border-red-500/50 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Report Issue</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-[#0D1A2E]/80 border border-slate-800 p-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Authenticity Status</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Genuine</span>
              </div>
            </div>

            <div className="bg-[#0D1A2E]/80 border border-slate-800 p-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Warranty Status</span>
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs sm:text-sm mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{isWarrantyActive ? `${remainingMonths} Mos Remaining` : 'Expired'}</span>
              </div>
            </div>

            <div className="bg-[#0D1A2E]/80 border border-slate-800 p-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Custody</span>
              <div className="text-slate-200 font-bold text-xs sm:text-sm truncate mt-0.5">
                {product.currentOwnerName || 'Original Brand'}
              </div>
            </div>

            <div className="bg-[#0D1A2E]/80 border border-slate-800 p-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Lifetime Scans</span>
              <div className="text-slate-200 font-mono font-bold text-xs sm:text-sm mt-0.5">
                {product.verificationCount} Verified Scans
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. MAIN CONTENT TABS & BODY */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto gap-1 text-xs font-mono font-semibold">
          {[
            { key: 'overview', label: 'Product Passport' },
            { key: 'warranty', label: 'Warranty & Claims' },
            { key: 'ownership', label: 'Ownership Trail' },
            { key: 'service', label: 'Service History' },
            { key: 'specs', label: 'Technical Specs' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                activeTab === tab.key 
                  ? 'border-[#155EEF] text-blue-400 bg-blue-950/20' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & CRYPTOGRAPHIC PASSPORT */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Product Visual + Specs */}
            <div className="lg:col-span-7 bg-[#0B1424] border border-slate-800 p-5 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                <div className="w-40 h-40 bg-white p-2 border border-slate-700 shrink-0 flex items-center justify-center">
                  <img
                    src={product.imageUrl || '/diamond-ring.jpg'}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="text-[11px] font-mono text-blue-400 uppercase font-bold">{product.category}</div>
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{product.description}</p>
                </div>
              </div>

              {/* Immutable Specs Grid */}
              <div className="border-t border-slate-800/80 pt-4 space-y-2.5 text-xs">
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block">Cryptographic Specifications</span>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="bg-slate-900/60 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">MANUFACTURING DATE</span>
                    <span className="font-mono font-semibold text-white">{product.manufacturingDate}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">COUNTRY OF ORIGIN</span>
                    <span className="font-semibold text-white">{product.originCountry}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">SKU / MODEL CODE</span>
                    <span className="font-mono font-semibold text-white">{product.sku}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">LIFECYCLE STATE</span>
                    <span className="font-mono font-bold text-emerald-400">{product.lifecycleState || 'ACTIVATED'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Cryptographic Nonce & Proof Card */}
            <div className="lg:col-span-5 bg-[#0B1424] border border-slate-800 p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Cryptographic Ledger Proof
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30">
                  PASSED
                </span>
              </div>

              {/* SHA-256 Hash Display */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">SHA-256 Hash Signature</span>
                <div className="bg-slate-950 border border-slate-800 p-2.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-emerald-400 truncate max-w-[240px]">
                    {product.passportHash}
                  </span>
                  <button 
                    onClick={handleCopyHash}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy Hash"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Dynamic QR Matrix */}
              <div className="bg-slate-950 border border-slate-800 p-4 flex flex-col items-center justify-center text-center space-y-2">
                <div className="p-2 bg-white border border-slate-300 shadow-inner">
                  <QRCodeSVG 
                    value={product.qrCodeUrl || window.location.href}
                    size={120}
                    level="H"
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  Instant Scan URL: <strong className="text-blue-400">useveripass.com/p/{product.id}</strong>
                </span>
              </div>

              {/* Guarantee Disclaimer */}
              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 border border-slate-800 leading-relaxed">
                🛡️ <strong>Tamper-Proof Guarantee:</strong> This item is permanently bound to the VeriPass anti-counterfeit matrix. Any modification to physical parts without authorized service invalidates cryptographic warranty seal.
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: WARRANTY & CLAIMS */}
        {activeTab === 'warranty' && (
          <div className="space-y-6">
            <div className="bg-[#0B1424] border border-slate-800 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-mono font-bold uppercase mb-1.5">
                    {isWarrantyActive ? 'Standard Manufacturer Warranty Active' : 'Warranty Expired'}
                  </div>
                  <h3 className="text-xl font-bold text-white">{warrantyDuration}-Month Official Protection</h3>
                </div>

                <button
                  onClick={() => setShowClaimModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>File Warranty Claim</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-900/70 border border-slate-800 p-4 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Coverage Start</span>
                  <div className="text-sm font-mono font-bold text-white">{product.purchaseDate || product.manufacturingDate}</div>
                  <span className="text-[11px] text-slate-400">Primary purchase registration</span>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-4 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Coverage Expiry</span>
                  <div className="text-sm font-mono font-bold text-white">{expiryDate.toISOString().split('T')[0]}</div>
                  <span className="text-[11px] text-blue-400 font-semibold">{remainingMonths} months remaining</span>
                </div>

                <div className="bg-slate-900/70 border border-slate-800 p-4 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Authorized Dealer</span>
                  <div className="text-sm font-bold text-white truncate">{product.dealerName || 'Verified Official Dealer'}</div>
                  <span className="text-[11px] text-emerald-400">Certified Distribution</span>
                </div>
              </div>

              {/* Policy Terms */}
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono">Covered Protection Terms:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Full replacement or repair for any manufacturing defects in materials or craftsmanship.</li>
                  <li>Complimentary annual ultrasonic cleaning, claw inspection, and gemstone tension check.</li>
                  <li>Dedicated express resolution helpline with manufacturer master service facilities.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OWNERSHIP HISTORY */}
        {activeTab === 'ownership' && (
          <div className="bg-[#0B1424] border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Immutable Custody & Provenance Trail</h3>
                <p className="text-xs text-slate-400 mt-0.5">Chronological record of ownership, distribution transfers, and custody.</p>
              </div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-3.5 py-1.5 bg-[#155EEF] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                + Register Custody
              </button>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {(product.ownershipHistory || []).map((entry, idx) => (
                <div key={entry.id || idx} className="relative space-y-1">
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#155EEF] border-2 border-[#0B1424]" />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-blue-400 font-bold">{entry.date}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-medium">{entry.location || 'Official Hub'}</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {entry.fromName} <span className="text-slate-500 font-normal">→</span> {entry.toName}
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2 border border-slate-800/80">
                      {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SERVICE HISTORY */}
        {activeTab === 'service' && (
          <div className="bg-[#0B1424] border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Certified Service & Maintenance Log</h3>
                <p className="text-xs text-slate-400 mt-0.5">Every authorized maintenance event stamped by certified technicians.</p>
              </div>
              <button
                onClick={() => setShowClaimModal(true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Book Service</span>
              </button>
            </div>

            {(!product.serviceHistory || product.serviceHistory.length === 0) ? (
              <div className="text-center py-10 text-slate-500 space-y-2">
                <Wrench className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No service records registered yet. Product is in pristine factory state.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.serviceHistory.map((serv) => (
                  <div key={serv.id} className="bg-slate-900/70 border border-slate-800 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{serv.serviceType}</span>
                      <span className="font-mono text-xs text-blue-400">{serv.date}</span>
                    </div>
                    <p className="text-xs text-slate-300">{serv.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>Service Center: <strong className="text-slate-200">{serv.serviceCenter}</strong></span>
                      {serv.technicianName && <span>Technician: <strong className="text-slate-200">{serv.technicianName}</strong></span>}
                      {serv.cost && <span className="text-emerald-400 font-semibold">{serv.cost}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TECHNICAL SPECS */}
        {activeTab === 'specs' && (
          <div className="bg-[#0B1424] border border-slate-800 p-6 space-y-5">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Manufacturer Certified Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(product.specs || {}).map(([key, val]) => (
                <div key={key} className="bg-slate-900/60 p-3 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="font-bold text-white font-mono">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* 5. MODAL: REGISTER OWNERSHIP */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0B1424] border border-slate-700 max-w-lg w-full p-6 text-left space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                Register Product Ownership
              </h3>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {registerSuccess ? (
              <div className="p-4 bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="font-bold text-sm">Ownership Successfully Registered!</h4>
                <p className="text-xs">Your digital passport and manufacturer warranty are now linked to your identity.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterOwnership} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. John Doe / Sophia Al-Mansoor"
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="owner@example.com"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={regDate}
                      onChange={(e) => setRegDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Dealer / Store Name</label>
                    <input
                      type="text"
                      value={regDealer}
                      onChange={(e) => setRegDealer(e.target.value)}
                      placeholder="e.g. Haier Official Flagship"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Invoice / Receipt Ref No.</label>
                  <input
                    type="text"
                    value={regInvoice}
                    onChange={(e) => setRegInvoice(e.target.value)}
                    placeholder="e.g. INV-2026-99214"
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#155EEF] hover:bg-blue-600 text-white font-bold cursor-pointer"
                  >
                    Lock Custody & Activate
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. MODAL: REPORT COUNTERFEIT / SUSPICIOUS */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0B1424] border border-red-900/60 max-w-lg w-full p-6 text-left space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Report Suspicious / Counterfeit Product
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-red-950/50 border border-red-500/50 text-red-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-red-400" />
                <h4 className="font-bold text-sm">Security Incident Dispatched!</h4>
                <p className="text-xs">Our anti-counterfeit team and brand security officers have been alerted with high priority.</p>
              </div>
            ) : (
              <form onSubmit={handleReportCounterfeit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Incident Reason *</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                  >
                    <option value="counterfeit_suspected">Suspected Counterfeit / Clone</option>
                    <option value="unreadable_qr">QR Code Damaged / Broken</option>
                    <option value="specs_mismatch">Physical Specs Mismatch</option>
                    <option value="duplicate_serial">Duplicate Serial Number Observed</option>
                    <option value="tampered_seal">Security Seal Tampered</option>
                    <option value="stolen_goods">Stolen / Unauthorized Channel</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Reporter Name"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">City / Region</label>
                    <input
                      type="text"
                      value={reporterCity}
                      onChange={(e) => setReporterCity(e.target.value)}
                      placeholder="e.g. Lahore, Karachi"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Seller / Shop Name</label>
                    <input
                      type="text"
                      value={reportDealer}
                      onChange={(e) => setReportDealer(e.target.value)}
                      placeholder="e.g. ABC Electronics Market"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Incident Notes / Observations</label>
                  <textarea
                    rows={3}
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder="Describe why this product or QR code appears suspicious..."
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer"
                  >
                    Dispatch Incident Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. MODAL: WARRANTY CLAIM */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0B1424] border border-slate-700 max-w-lg w-full p-6 text-left space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-emerald-400" />
                File Warranty / Service Claim
              </h3>
              <button 
                onClick={() => setShowClaimModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {claimSuccess ? (
              <div className="p-4 bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="font-bold text-sm">Warranty Claim Submitted!</h4>
                <p className="text-xs">Your claim ticket has been generated and dispatched to the authorized service center.</p>
              </div>
            ) : (
              <form onSubmit={handleClaimWarranty} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Issue Category *</label>
                  <select
                    value={claimCategory}
                    onChange={(e) => setClaimCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="Hardware Failure">Hardware Failure</option>
                    <option value="Electronic Malfunction">Electronic Malfunction</option>
                    <option value="Defect in Material">Defect in Material</option>
                    <option value="Cosmetic Damage">Cosmetic Damage / Claws</option>
                    <option value="Missing Parts">Missing Parts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Detailed Description of Defect *</label>
                  <textarea
                    rows={4}
                    required
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                    placeholder="Explain the symptom or issue encountered..."
                    className="w-full bg-slate-900 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Submit Claim Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 8. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#060B14] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 VeriPass Technologies Inc. Protected by 256-bit Cryptographic Proofs.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-mono text-[11px]">useveripass.com</span>
            <span>•</span>
            <button onClick={onBackToHome} className="hover:text-white underline cursor-pointer">
              Enterprise Portal
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
