import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Product } from '../types/product';
import {
  ArrowLeft,
  Box,
  QrCode,
  ShieldCheck,
  Sparkles,
  Calendar,
  Globe,
  Tag,
  Hash,
  FileText,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Eye
} from 'lucide-react';

interface AddProductPageProps {
  onBack: () => void;
  onAddProduct: (product: Product) => void;
  defaultCategory?: string;
  defaultBrand?: string;
}

export const AddProductPage: React.FC<AddProductPageProps> = ({
  onBack,
  onAddProduct,
  defaultCategory = 'Luxury & Fine Jewelry',
  defaultBrand = 'VeriPass Enterprise',
}) => {
  // Helper to generate random crypto seed
  const generateRandomHex = (length: number) => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomId = () => {
    const prefix = 'VP';
    const num = Math.floor(100000 + Math.random() * 900000);
    const suffix = 'X' + Math.floor(10 + Math.random() * 90);
    return `${prefix}-${num}-${suffix}`;
  };

  // Form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState(defaultBrand);
  const [category, setCategory] = useState(defaultCategory);
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [serialNumber, setSerialNumber] = useState(`SN-${generateRandomHex(8).toUpperCase()}`);
  const [batchNumber, setBatchNumber] = useState(`BATCH-${new Date().getFullYear()}-0${Math.floor(1 + Math.random() * 9)}`);
  const [manufacturingDate, setManufacturingDate] = useState(new Date().toISOString().split('T')[0]);
  const [originCountry, setOriginCountry] = useState('Switzerland');
  const [description, setDescription] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('24');
  const [securityLevel, setSecurityLevel] = useState<'standard' | 'hologram' | 'quantum'>('quantum');
  const [tempId] = useState(generateRandomId());
  const [tempHash] = useState(`0x${generateRandomHex(40)}`);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const [copied, setCopied] = useState(false);

  const previewUrl = `https://useveripass.com/verify/${tempId}`;

  const handleRegenerateKeys = () => {
    setSerialNumber(`SN-${generateRandomHex(8).toUpperCase()}`);
    setBatchNumber(`BATCH-${new Date().getFullYear()}-0${Math.floor(1 + Math.random() * 9)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a valid Product Name.');
      return;
    }

    const newProduct: Product = {
      id: tempId,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      brand: brand.trim() || defaultBrand,
      category: category || defaultCategory,
      description: description.trim() || `Authentic ${name} registered on VeriPass cryptographic ledger.`,
      serialNumber: serialNumber.trim(),
      batchNumber: batchNumber.trim(),
      manufacturingDate: manufacturingDate,
      originCountry: originCountry.trim() || 'Global',
      status: 'verified',
      passportHash: tempHash,
      verificationCount: 0,
      qrCodeUrl: previewUrl,
      createdAt: new Date().toISOString().split('T')[0],
      warrantyMonths: parseInt(warrantyMonths) || 24,
    };

    onAddProduct(newProduct);
    setCreatedProduct(newProduct);
    setIsSuccess(true);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(tempHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If successfully created, show full-page confirmation state
  if (isSuccess && createdProduct) {
    return (
      <div className="space-y-6 text-left animate-fade-in max-w-4xl mx-auto">
        
        {/* Success Header */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest font-bold text-emerald-600">
                PASSPORT ISSUED SUCCESSFULLY
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                {createdProduct.name} is Now Protected
              </h1>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            A unique cryptographic passport and high-resolution QR matrix have been generated and anchored to your inventory.
          </p>

          {/* Success Card Body with QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 pt-6 border-t border-slate-100">
            
            {/* Left QR Matrix */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200">
              <div className="bg-white p-4 border border-slate-200 shadow-sm">
                <QRCodeSVG
                  id={`success-qr-${createdProduct.id}`}
                  value={createdProduct.qrCodeUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="mt-3 text-center">
                <span className="font-mono text-xs font-bold text-slate-900">{createdProduct.id}</span>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Scan to verify authenticity</p>
              </div>
            </div>

            {/* Right Passport Summary */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Brand & Origin</span>
                  <span className="font-bold text-slate-900">{createdProduct.brand} ({createdProduct.originCountry})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Category</span>
                  <span className="font-semibold text-slate-800">{createdProduct.category}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Serial Number</span>
                  <span className="font-mono font-bold text-slate-900">{createdProduct.serialNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Batch Number</span>
                  <span className="font-mono text-slate-700">{createdProduct.batchNumber}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-medium">Cryptographic Hash</span>
                  <span className="font-mono text-[11px] text-blue-600 truncate max-w-[200px]">{createdProduct.passportHash}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={onBack}
                  className="px-5 py-2.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go to Products Inventory</span>
                </button>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setName('');
                    setDescription('');
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#155EEF]" />
                  <span>Add Another Product</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Top Navigation & Action Bar */}
      <div className="bg-white border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Back to previous page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400">
              <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
              <span>PRODUCT ONBOARDING STUDIO</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Register New Product & Issue Passport
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Passport & Generate QR</span>
          </button>
        </div>
      </div>

      {/* Main Full Page Form Layout (2 Columns: Left Form + Right Live QR Card Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================= */}
        {/* LEFT 7 COLUMNS: FULL FORM */}
        {/* ======================================================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6 text-xs text-slate-800">
          
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Core Specs */}
          <div className="space-y-4">
            <div className="font-bold text-slate-950 text-xs uppercase tracking-wider font-mono border-b border-slate-200 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Box className="w-4 h-4 text-[#155EEF]" />
                <span>1. Product Core Information</span>
              </span>
              <span className="text-[10px] text-blue-600 font-normal">Required Fields</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Solitaire Diamond Ring"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Brand / Manufacturer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Albadar Jewellers"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Industry Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="Luxury & Fine Jewelry">💎 Luxury & Fine Jewelry</option>
                  <option value="Watches & Horology">⌚ Watches & Horology</option>
                  <option value="Fashion, Apparel & Luxury Goods">👜 Fashion & Apparel</option>
                  <option value="Electronics & Smart Devices">⚡ Electronics & Hardware</option>
                  <option value="Pharmaceuticals & Healthcare">🧬 Pharmaceuticals & Health</option>
                  <option value="Wine & Spirits">🍷 Wine & Spirits</option>
                  <option value="Automotive & Industrial Parts">🏎️ Automotive & Industrial</option>
                  <option value="General Consumer Goods">📦 General Consumer Goods</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Internal SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Manufacturing & Traceability */}
          <div className="space-y-4 pt-2">
            <div className="font-bold text-slate-950 text-xs uppercase tracking-wider font-mono border-b border-slate-200 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#155EEF]" />
                <span>2. Manufacturing & Provenance Traceability</span>
              </span>
              <button
                type="button"
                onClick={handleRegenerateKeys}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-mono flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Auto-generate serials</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Batch / Lot #
                </label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Country of Origin
                </label>
                <input
                  type="text"
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  value={manufacturingDate}
                  onChange={(e) => setManufacturingDate(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Warranty Coverage (Months)
                </label>
                <input
                  type="number"
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Description / Certificate Notes
              </label>
              <textarea
                rows={3}
                placeholder="Details regarding materials, carat, specifications, authenticity notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: Cryptographic Security Level */}
          <div className="space-y-4 pt-2">
            <div className="font-bold text-slate-950 text-xs uppercase tracking-wider font-mono border-b border-slate-200 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#155EEF]" />
                <span>3. Cryptographic Security Level</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">256-Bit Encrypted</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setSecurityLevel('standard')}
                className={`p-3.5 border text-left cursor-pointer transition-all ${
                  securityLevel === 'standard'
                    ? 'border-[#155EEF] bg-[#EFF8FF] shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs">Standard QR</div>
                <div className="text-[10.5px] text-slate-500 mt-1">Static digital passport URL for general inventory</div>
              </div>

              <div
                onClick={() => setSecurityLevel('hologram')}
                className={`p-3.5 border text-left cursor-pointer transition-all ${
                  securityLevel === 'hologram'
                    ? 'border-[#155EEF] bg-[#EFF8FF] shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs">Dynamic Seal</div>
                <div className="text-[10.5px] text-slate-500 mt-1">Live geolocation telemetry and tamper checking</div>
              </div>

              <div
                onClick={() => setSecurityLevel('quantum')}
                className={`p-3.5 border text-left cursor-pointer transition-all ${
                  securityLevel === 'quantum'
                    ? 'border-[#155EEF] bg-[#EFF8FF] shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>Quantum Ledger</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 font-mono">Max</span>
                </div>
                <div className="text-[10.5px] text-slate-500 mt-1">SHA-256 zero-knowledge cryptographic proof</div>
              </div>
            </div>
          </div>

          {/* Bottom Submit Bar inside Form */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              ID will be: <strong className="text-slate-800">{tempId}</strong>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Passport & Generate QR</span>
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================= */}
        {/* RIGHT 5 COLUMNS: LIVE CRYPTOGRAPHIC PASSPORT & QR PREVIEW */}
        {/* ======================================================= */}
        <div className="lg:col-span-5 space-y-5 sticky top-20">
          
          {/* Live Passport Card Preview */}
          <div className="bg-white border border-slate-200 shadow-sm p-6 text-left space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#155EEF] font-mono text-[9.5px] font-bold uppercase">
                <ShieldCheck className="w-3 h-3" />
                <span>Live Passport Preview</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">READY TO ISSUE</span>
            </div>

            {/* Product Title on Card */}
            <div>
              <h3 className="text-lg font-black text-slate-950 tracking-tight">
                {name || 'Product Name Placeholder'}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                {brand || defaultBrand} • {category}
              </p>
            </div>

            {/* Centered QR Matrix Canvas */}
            <div className="bg-slate-50 border border-slate-200 p-5 flex flex-col items-center justify-center">
              <div className="bg-white p-3 border border-slate-200 shadow-2xs">
                <QRCodeSVG
                  value={previewUrl}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-600 mt-2.5">
                {tempId}
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                https://useveripass.com/verify/{tempId}
              </span>
            </div>

            {/* Dynamic Metadata Specs */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Serial:</span>
                <span className="font-mono font-bold text-slate-800">{serialNumber}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Batch:</span>
                <span className="font-mono text-slate-800">{batchNumber}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Origin:</span>
                <span className="font-semibold text-slate-800">{originCountry}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Security Tier:</span>
                <span className="font-bold text-blue-600 uppercase">{securityLevel}</span>
              </div>
            </div>

            {/* Cryptographic Hash Box */}
            <div className="bg-slate-900 text-white p-3 font-mono text-[10px] space-y-1">
              <div className="text-slate-400 flex items-center justify-between">
                <span>SHA-256 PROOF HASH</span>
                <span className="text-emerald-400">IMMUTABLE</span>
              </div>
              <div className="flex items-center justify-between gap-1 text-slate-300">
                <span className="truncate">{tempHash}</span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="p-1 hover:text-white shrink-0 cursor-pointer"
                  title="Copy Hash"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

          </div>

          {/* Helper Tips Box */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 p-4 text-left">
            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>Cryptographic Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Once registered, this product receives a tamper-proof digital passport with worldwide geolocation scan verification.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
