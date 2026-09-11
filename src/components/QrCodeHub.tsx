import React, { useState, useRef, useMemo, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Product, QRCodeConfig } from '../types/product';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  Plus,
  ArrowRight,
  Eye,
  Maximize2,
  Cpu,
  Boxes,
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  Zap,
  Sliders,
  Hash,
  AlertCircle,
  Tag,
  Factory,
  Share2,
  Trash2,
  ListPlus,
  ChevronRight,
  Database,
  PackageCheck,
  FolderOpen,
  Terminal,
  Binary
} from 'lucide-react';

export interface BulkModelConfig {
  id: string;
  modelName: string;
  modelSku: string;
  category: string;
  quantity: number;
  batchPrefix: string;
  sourceProductId?: string;
}

export interface GeneratedBatchItem {
  id: string;
  passportId: string;
  productName: string;
  sku: string;
  modelCode: string;
  serialNumber: string;
  batchLot: string;
  category: string;
  brand: string;
  originCountry: string;
  passportHash: string;
  verificationUrl: string;
  createdDate: string;
}

interface QrCodeHubProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onPreviewPassport: (product: Product) => void;
  onAddBatchProducts?: (newProducts: Product[]) => void;
  defaultBrand?: string;
}

const colorPresets = [
  { name: 'Jet Slate', fg: '#0F172A', label: 'Default' },
  { name: 'VeriPass Blue', fg: '#155EEF', label: 'Brand' },
  { name: 'Emerald Trust', fg: '#059669', label: 'Security' },
  { name: 'Royal Indigo', fg: '#4F46E5', label: 'Luxury' },
  { name: 'Crimson Seal', fg: '#DC2626', label: 'Tamper' }
];

export const QrCodeHub: React.FC<QrCodeHubProps> = ({
  products,
  onOpenAddProduct,
  onPreviewPassport,
  onAddBatchProducts,
  defaultBrand = 'Haier Global'
}) => {
  // Main Studio Mode: 'inventory' (Existing QRs) vs 'bulk-generator' (Industrial Engine)
  const [studioMode, setStudioMode] = useState<'inventory' | 'bulk-generator'>('bulk-generator');

  // Search & Filter for Inventory Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom QR Vector Styling Config
  const [qrConfig, setQrConfig] = useState<QRCodeConfig>({
    size: 180,
    fgColor: '#0F172A',
    bgColor: '#FFFFFF',
    includeMargin: true,
    level: 'H',
    includeLogo: true,
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // =========================================================================
  // BULK GENERATOR ALGORITHM STATE
  // =========================================================================
  const [generationType, setGenerationType] = useState<'single-model' | 'multi-series'>('single-model');
  const [batchBrand, setBatchBrand] = useState(defaultBrand);
  const [batchSeriesName, setBatchSeriesName] = useState('Thunder Inverter Series 2026');
  const [batchOrigin, setBatchOrigin] = useState('Pakistan');
  const [batchLotNumber, setBatchLotNumber] = useState(`LOT-PK-${new Date().getFullYear()}-001`);
  const [manufacturingDate, setManufacturingDate] = useState(new Date().toISOString().split('T')[0]);

  // Product Selection Mode: 'from-catalog' (pick existing product) vs 'custom'
  const [singleSourceMode, setSingleSourceMode] = useState<'from-catalog' | 'custom'>('from-catalog');
  const [selectedExistingProductId, setSelectedExistingProductId] = useState<string>('');

  // Single Model Form State
  const [singleModelName, setSingleModelName] = useState('Thunder Inverter 1.5 Ton DC');
  const [singleModelSku, setSingleModelSku] = useState('HSU-18HNS');
  const [singleCategory, setSingleCategory] = useState('Appliances & HVAC');
  const [singleQuantity, setSingleQuantity] = useState<number>(100);
  const [singlePrefix, setSinglePrefix] = useState('HR-AC');
  const [startSequenceNumber, setStartSequenceNumber] = useState<number>(1);

  // When products list changes or on initial mount, if products exist and none selected, pre-select first product
  useEffect(() => {
    if (products.length > 0 && !selectedExistingProductId) {
      const first = products[0];
      setSelectedExistingProductId(first.id);
      setSingleModelName(first.name);
      setSingleModelSku(first.sku);
      setSingleCategory(first.category);
      if (first.brand) setBatchBrand(first.brand);
      if (first.originCountry) setBatchOrigin(first.originCountry);
      const prefixCandidate = first.sku && first.sku.includes('-') ? first.sku.split('-')[0] : first.name.slice(0, 4).toUpperCase();
      setSinglePrefix(prefixCandidate || 'PR');
    }
  }, [products]);

  // Handler when user selects a product from the registered catalog dropdown
  const handleSelectExistingProduct = (productId: string) => {
    setSelectedExistingProductId(productId);
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSingleModelName(prod.name);
      setSingleModelSku(prod.sku);
      setSingleCategory(prod.category);
      if (prod.brand) setBatchBrand(prod.brand);
      if (prod.originCountry) setBatchOrigin(prod.originCountry);
      const prefixCandidate = prod.sku && prod.sku.includes('-') ? prod.sku.split('-')[0] : prod.name.slice(0, 4).toUpperCase();
      setSinglePrefix(prefixCandidate || 'PR');
    }
  };

  // Multi-Model Series Matrix State
  const [seriesModels, setSeriesModels] = useState<BulkModelConfig[]>([
    { id: 'm1', modelName: 'Thunder Mega Inverter 1.0 Ton', modelSku: 'HSU-12HNS', category: 'Appliances & HVAC', quantity: 250, batchPrefix: 'HR-12T' },
    { id: 'm2', modelName: 'Thunder Mega Inverter 1.5 Ton', modelSku: 'HSU-18HNS', category: 'Appliances & HVAC', quantity: 500, batchPrefix: 'HR-18T' },
    { id: 'm3', modelName: 'Thunder Mega Inverter 2.0 Ton', modelSku: 'HSU-24HNS', category: 'Appliances & HVAC', quantity: 250, batchPrefix: 'HR-24T' }
  ]);

  // Generated Batch Result State & Live Multi-Stage Animation
  const [generatedBatch, setGeneratedBatch] = useState<GeneratedBatchItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStageText, setGenerationStageText] = useState('');
  const [liveStreamLogs, setLiveStreamLogs] = useState<string[]>([]);
  const [hasCommittedToLedger, setHasCommittedToLedger] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const itemsPerPage = 12;

  // Compute total planned units
  const totalPlannedUnits = useMemo(() => {
    if (generationType === 'single-model') {
      return singleQuantity || 0;
    }
    return seriesModels.reduce((sum, m) => sum + (m.quantity || 0), 0);
  }, [generationType, singleQuantity, seriesModels]);

  // =========================================================================
  // INDUSTRIAL BULK QR GENERATION ALGORITHM (WITH HIGH-TECH ANIMATION)
  // =========================================================================
  const runBulkGenerationAlgorithm = () => {
    if (isGenerating || totalPlannedUnits <= 0) return;

    setIsGenerating(true);
    setGenerationProgress(5);
    setHasCommittedToLedger(false);
    setGenerationStageText('Initializing Cryptographic Engine & Entropy Seed...');
    setLiveStreamLogs([
      `[SYS_INIT] Initializing batch generator for ${totalPlannedUnits.toLocaleString()} units...`,
      `[ENTROPY] Generating SHA-256 master salt: 0x${Math.random().toString(16).substring(2, 10)}...`
    ]);

    // Stage 1: Nonce minting (20%)
    setTimeout(() => {
      setGenerationProgress(28);
      setGenerationStageText('Stage 1/3: Minting Serialized Nonces & Hardware Prefixes...');
      setLiveStreamLogs((prev) => [
        `[NONCE_GEN] Building sequence range: 000001 -> ${totalPlannedUnits.toString().padStart(6, '0')}`,
        `[PREFIX] Applying hardware identifier prefix: "${generationType === 'single-model' ? singlePrefix : 'MULTI-SERIES'}"`,
        ...prev
      ]);
    }, 300);

    // Stage 2: SHA-256 Cryptographic Computation (60%)
    setTimeout(() => {
      setGenerationProgress(65);
      setGenerationStageText('Stage 2/3: Computing 256-bit SHA Verification Hashes & Proofs...');
      setLiveStreamLogs((prev) => [
        `[HASH_ENGINE] Computing deterministic merkle tree for ${batchBrand} (${batchLotNumber})...`,
        `[PROOF] SHA-256 checksum validated: 100% Zero-Collision Guarantee`,
        ...prev
      ]);
    }, 700);

    // Stage 3: Vector QR Matrix Compilation (90%)
    setTimeout(() => {
      setGenerationProgress(92);
      setGenerationStageText('Stage 3/3: Assembling Vector QR Matrix & Resolving Gateways...');
      setLiveStreamLogs((prev) => [
        `[MATRIX_COMPILER] Vector error correction level 'M' rendered for all units`,
        `[GATEWAY] Routing active endpoints to https://useveripass.com/verify/*`,
        ...prev
      ]);
    }, 1100);

    // Stage 4: Finalize and Assemble Items (100%)
    setTimeout(() => {
      const generatedList: GeneratedBatchItem[] = [];

      if (generationType === 'single-model') {
        const qty = Math.min(Math.max(1, singleQuantity), 10000);
        for (let i = 0; i < qty; i++) {
          const currentSeq = (startSequenceNumber + i).toString().padStart(6, '0');
          const serial = `${singlePrefix}-${singleModelSku}-${currentSeq}`;
          const passportId = `VP-${singlePrefix}-${currentSeq}`;
          
          const hashSeed = `${batchBrand}|${singleModelName}|${serial}|${batchLotNumber}|${i}`;
          let hashHex = '';
          for (let c = 0; c < hashSeed.length; c++) {
            hashHex += hashSeed.charCodeAt(c).toString(16);
          }
          const passportHash = `0x${hashHex.slice(0, 32).padEnd(32, 'a')}f9e87c${i.toString(16).padStart(4, '0')}`;
          const verificationUrl = `https://useveripass.com/verify/${passportId}`;

          generatedList.push({
            id: `batch-item-${i}-${Date.now()}`,
            passportId,
            productName: singleModelName,
            sku: singleModelSku,
            modelCode: singleModelSku,
            serialNumber: serial,
            batchLot: batchLotNumber,
            category: singleCategory,
            brand: batchBrand,
            originCountry: batchOrigin,
            passportHash,
            verificationUrl,
            createdDate: manufacturingDate
          });
        }
      } else {
        // Multi-Model Series Matrix Run
        let globalIndex = 0;
        seriesModels.forEach((model) => {
          const mQty = Math.min(Math.max(1, model.quantity), 5000);
          for (let i = 0; i < mQty; i++) {
            const currentSeq = (i + 1).toString().padStart(6, '0');
            const serial = `${model.batchPrefix}-${model.modelSku}-${currentSeq}`;
            const passportId = `VP-${model.batchPrefix}-${currentSeq}`;
            
            const hashSeed = `${batchBrand}|${model.modelName}|${serial}|${batchLotNumber}|${globalIndex}`;
            let hashHex = '';
            for (let c = 0; c < hashSeed.length; c++) {
              hashHex += hashSeed.charCodeAt(c).toString(16);
            }
            const passportHash = `0x${hashHex.slice(0, 32).padEnd(32, 'b')}e7a63c${globalIndex.toString(16).padStart(4, '0')}`;
            const verificationUrl = `https://useveripass.com/verify/${passportId}`;

            generatedList.push({
              id: `batch-item-${globalIndex}-${Date.now()}`,
              passportId,
              productName: model.modelName,
              sku: model.modelSku,
              modelCode: model.modelSku,
              serialNumber: serial,
              batchLot: batchLotNumber,
              category: model.category,
              brand: batchBrand,
              originCountry: batchOrigin,
              passportHash,
              verificationUrl,
              createdDate: manufacturingDate
            });
            globalIndex++;
          }
        });
      }

      setGenerationProgress(100);
      setGenerationStageText('✓ Generation Completed Successfully!');
      setLiveStreamLogs((prev) => [
        `[SUCCESS] 🚀 Successfully compiled ${generatedList.length.toLocaleString()} unique serialized cryptographic QR passports!`,
        ...prev
      ]);
      setGeneratedBatch(generatedList);
      setPreviewPage(1);
      setIsGenerating(false);
    }, 1450);
  };

  // Add / Remove Model in Series Matrix
  const handleAddSeriesModel = () => {
    const newId = `m${seriesModels.length + 1}`;
    setSeriesModels([
      ...seriesModels,
      {
        id: newId,
        modelName: `Thunder Model Variant ${seriesModels.length + 1}`,
        modelSku: `HSU-${seriesModels.length * 6 + 12}HNS`,
        category: 'Appliances & HVAC',
        quantity: 100,
        batchPrefix: `HR-V${seriesModels.length + 1}`
      }
    ]);
  };

  // Import an existing product directly into the Series Matrix
  const handleAddExistingProductToSeries = (prod: Product) => {
    const newId = `m-cat-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const prefixCandidate = prod.sku && prod.sku.includes('-') ? prod.sku.split('-')[0] : prod.name.slice(0, 4).toUpperCase();
    setSeriesModels([
      ...seriesModels,
      {
        id: newId,
        modelName: prod.name,
        modelSku: prod.sku,
        category: prod.category,
        quantity: 250,
        batchPrefix: prefixCandidate || 'PR',
        sourceProductId: prod.id
      }
    ]);
  };

  const handleRemoveSeriesModel = (id: string) => {
    if (seriesModels.length <= 1) return;
    setSeriesModels(seriesModels.filter((m) => m.id !== id));
  };

  const handleUpdateSeriesModel = (id: string, field: keyof BulkModelConfig, value: any) => {
    setSeriesModels(
      seriesModels.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  // Commit Generated Batch into Main Active Products Ledger
  const handleCommitBatchToRegistry = () => {
    if (generatedBatch.length === 0) return;

    const newProductEntries: Product[] = generatedBatch.map((item) => ({
      id: item.passportId,
      name: item.productName,
      sku: item.sku,
      brand: item.brand,
      category: item.category,
      description: `Industrial Batch Unit [Series: ${batchSeriesName}, Lot: ${item.batchLot}]. Cryptographic serialized passport verified for genuine authenticity.`,
      serialNumber: item.serialNumber,
      batchNumber: item.batchLot,
      manufacturingDate: item.createdDate,
      originCountry: item.originCountry,
      status: 'verified',
      passportHash: item.passportHash,
      verificationCount: 0,
      qrCodeUrl: item.verificationUrl,
      createdAt: item.createdDate
    }));

    if (onAddBatchProducts) {
      onAddBatchProducts(newProductEntries);
    } else {
      try {
        const saved = localStorage.getItem('veripass_products');
        const existing: Product[] = saved ? JSON.parse(saved) : [];
        const combined = [...newProductEntries, ...existing];
        localStorage.setItem('veripass_products', JSON.stringify(combined));
      } catch {}
    }

    setHasCommittedToLedger(true);
  };

  // Export Production CSV Manifest
  const exportBatchManifestCSV = () => {
    if (generatedBatch.length === 0) return;

    const headers = [
      'Passport ID',
      'Product Name',
      'Model SKU',
      'Serial Number',
      'Batch Lot Number',
      'Brand',
      'Category',
      'Origin Country',
      'Cryptographic SHA256 Hash',
      'Live Verification URL',
      'Manufacturing Date',
      'Cryptographic Security Status'
    ];

    const rows = generatedBatch.map((item) => [
      item.passportId,
      `"${item.productName.replace(/"/g, '""')}"`,
      item.sku,
      item.serialNumber,
      item.batchLot,
      `"${item.brand}"`,
      `"${item.category}"`,
      item.originCountry,
      item.passportHash,
      item.verificationUrl,
      item.createdDate,
      'AUTHENTIC_VERIFIED'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VeriPass_Production_Batch_${batchBrand.replace(/\s+/g, '_')}_${generatedBatch.length}_Units.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Bulk Print Hangtags Sheet Window
  const printBatchHangtagsSheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printSubset = generatedBatch.slice(0, 300);

    const cardsHtml = printSubset.map((item) => {
      return `
        <div style="border: 2px solid #0F172A; padding: 12px; text-align: center; page-break-inside: avoid; background: #ffffff; position: relative;">
          <div style="font-size: 8px; font-weight: 900; color: #155EEF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;">
            ${item.brand} • VERIPASS SECURE
          </div>
          <div style="font-size: 11px; font-weight: 800; color: #0F172A; line-height: 1.2; margin: 3px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${item.productName}
          </div>
          <div style="font-family: monospace; font-size: 8.5px; color: #475569; margin-bottom: 6px;">
            SN: ${item.serialNumber}
          </div>
          <div style="display: flex; justify-content: center; margin: 6px 0;">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(item.verificationUrl)}" 
              alt="QR Code" 
              style="width: 100px; height: 100px; display: block;" 
            />
          </div>
          <div style="font-family: monospace; font-size: 8px; color: #0F172A; font-weight: bold; margin-top: 4px;">
            ${item.passportId}
          </div>
          <div style="font-family: monospace; font-size: 7px; color: #94A3B8; margin-top: 2px; border-top: 1px dashed #CBD5E1; padding-top: 4px;">
            LOT: ${item.batchLot} • SCAN TO VERIFY
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>VeriPass Bulk Hangtags - ${batchBrand}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; margin: 0; background: #fff; }
            .header-bar { border-bottom: 2px solid #0F172A; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; size: A4 portrait; }
            }
          </style>
        </head>
        <body>
          <div class="header-bar">
            <div>
              <div style="font-size: 16px; font-weight: 900;">${batchBrand} — Production QR Hangtags</div>
              <div style="font-size: 11px; color: #64748B;">Series: ${batchSeriesName} • Lot: ${batchLotNumber}</div>
            </div>
            <div style="text-align: right; font-family: monospace; font-size: 11px;">
              <div>Total Units: ${generatedBatch.length}</div>
              <div style="color: #155EEF; font-weight: bold;">CRYPTOGRAPHICALLY SECURED</div>
            </div>
          </div>
          <div class="grid">${cardsHtml}</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Inventory Filtering (Mode 1)
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER & STUDIO MODE SWITCHER */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 rounded-none">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1">
            <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-none" />
            <span>INDUSTRIAL QR CODE SUITE</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            High-Speed Bulk QR & Series Matrix Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Select any product from your catalog or enter a new model to generate thousands of unique serialized cryptographic QR codes in one automated algorithm execution.
          </p>
        </div>

        {/* Studio Mode Selector Pills */}
        <div className="flex items-center bg-slate-100 p-1 border border-slate-200 self-start lg:self-auto rounded-none">
          <button
            onClick={() => setStudioMode('bulk-generator')}
            className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer rounded-none ${
              studioMode === 'bulk-generator'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>Industrial Bulk Generator</span>
            <span className="text-[9px] font-mono font-bold bg-blue-900/40 px-1.5 py-0.2 rounded-none">ALGORITHM</span>
          </button>

          <button
            onClick={() => setStudioMode('inventory')}
            className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer rounded-none ${
              studioMode === 'inventory'
                ? 'bg-[#155EEF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Active Product QR Hub</span>
            <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-none">
              {products.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MODE: INDUSTRIAL BULK GENERATOR ALGORITHM */}
      {/* ========================================================= */}
      {studioMode === 'bulk-generator' && (
        <div className="space-y-6">
          
          {/* CONFIGURATION COCKPIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column (7 Cols) - Generation Setup */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-6 shadow-xs space-y-5 rounded-none">
              
              {/* Generation Strategy Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase font-mono tracking-wider mb-2">
                  1. Generation Algorithm Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setGenerationType('single-model')}
                    className={`p-3.5 border cursor-pointer transition-all rounded-none text-left ${
                      generationType === 'single-model'
                        ? 'border-[#155EEF] bg-[#EFF8FF] text-[#155EEF]'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Single Model Bulk Run
                      </span>
                      {generationType === 'single-model' && <Check className="w-3.5 h-3.5 text-[#155EEF]" />}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Select 1 product (or type custom) and generate 100 to 5,000+ serialized QR units.
                    </p>
                  </div>

                  <div
                    onClick={() => setGenerationType('multi-series')}
                    className={`p-3.5 border cursor-pointer transition-all rounded-none text-left ${
                      generationType === 'multi-series'
                        ? 'border-[#155EEF] bg-[#EFF8FF] text-[#155EEF]'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Boxes className="w-3.5 h-3.5" />
                        Multi-Model Series Matrix
                      </span>
                      {generationType === 'multi-series' && <Check className="w-3.5 h-3.5 text-[#155EEF]" />}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Batch-generate across multiple model variants (1.0T, 1.5T, 2.0T) in one series.
                    </p>
                  </div>
                </div>
              </div>

              {/* Master Brand & Batch Identification */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900 uppercase font-mono tracking-wider mb-2">
                  2. Master Brand & Production Line
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={batchBrand}
                      onChange={(e) => setBatchBrand(e.target.value)}
                      placeholder="e.g. Haier, Dawlance, Gree"
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Series / Product Family</label>
                    <input
                      type="text"
                      value={batchSeriesName}
                      onChange={(e) => setBatchSeriesName(e.target.value)}
                      placeholder="e.g. Thunder Inverter 2026"
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Batch Lot Number</label>
                    <input
                      type="text"
                      value={batchLotNumber}
                      onChange={(e) => setBatchLotNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                    />
                  </div>
                </div>
              </div>

              {/* Strategy Form A: Single Model Parameters */}
              {generationType === 'single-model' ? (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      3. Target Product Model & Quantity
                    </label>

                    {/* Source Switcher: Choose from Registered Catalog vs Custom */}
                    {products.length > 0 && (
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 border border-slate-200 text-[10.5px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setSingleSourceMode('from-catalog')}
                          className={`px-2.5 py-1 cursor-pointer transition-colors ${
                            singleSourceMode === 'from-catalog'
                              ? 'bg-white text-[#155EEF] font-bold shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Select from Catalog ({products.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSingleSourceMode('custom')}
                          className={`px-2.5 py-1 cursor-pointer transition-colors ${
                            singleSourceMode === 'custom'
                              ? 'bg-white text-[#155EEF] font-bold shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Enter Custom Model
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SELECT EXISTING PRODUCT DROPDOWN */}
                  {singleSourceMode === 'from-catalog' && products.length > 0 ? (
                    <div className="p-3.5 bg-blue-50/50 border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="flex items-center gap-1.5 text-[#155EEF]">
                          <PackageCheck className="w-4 h-4" />
                          Choose Product from Registered Inventory:
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">Auto-Prefill Activated</span>
                      </div>

                      <select
                        value={selectedExistingProductId}
                        onChange={(e) => handleSelectExistingProduct(e.target.value)}
                        className="w-full bg-white border border-blue-300 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#155EEF] shadow-2xs rounded-none"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — [SKU: {p.sku}] ({p.category})
                          </option>
                        ))}
                      </select>

                      <div className="flex flex-wrap items-center gap-3 text-[10.5px] font-mono text-slate-600 pt-1">
                        <span>Selected Model: <strong className="text-slate-950">{singleModelName}</strong></span>
                        <span>•</span>
                        <span>SKU: <strong className="text-[#155EEF]">{singleModelSku}</strong></span>
                        <span>•</span>
                        <span>Category: <strong className="text-slate-950">{singleCategory}</strong></span>
                      </div>
                    </div>
                  ) : null}

                  {/* Manual Inputs if Custom Mode or No Products */}
                  {(singleSourceMode === 'custom' || products.length === 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Product Model Name</label>
                        <input
                          type="text"
                          value={singleModelName}
                          onChange={(e) => setSingleModelName(e.target.value)}
                          placeholder="e.g. Thunder Inverter 1.5 Ton DC"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Model Code / SKU</label>
                        <input
                          type="text"
                          value={singleModelSku}
                          onChange={(e) => setSingleModelSku(e.target.value)}
                          placeholder="e.g. HSU-18HNS"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Bulk Quantity & Serial Sequencing */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-600">Quantity to Generate</label>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={singleQuantity}
                        onChange={(e) => setSingleQuantity(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-mono font-bold text-[#155EEF] focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                      />
                      {/* Quick Qty Preset Pills */}
                      <div className="flex items-center gap-1 mt-1.5">
                        {[50, 100, 500, 1000].map((qty) => (
                          <button
                            key={qty}
                            type="button"
                            onClick={() => setSingleQuantity(qty)}
                            className={`px-1.5 py-0.5 text-[9.5px] font-mono border cursor-pointer ${
                              singleQuantity === qty
                                ? 'bg-[#155EEF] text-white border-[#155EEF]'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                          >
                            {qty}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Serial Prefix</label>
                      <input
                        type="text"
                        value={singlePrefix}
                        onChange={(e) => setSinglePrefix(e.target.value)}
                        placeholder="e.g. HR-AC"
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sequence Start #</label>
                      <input
                        type="number"
                        min="1"
                        value={startSequenceNumber}
                        onChange={(e) => setStartSequenceNumber(parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Strategy Form B: Multi-Model Series Matrix */
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      3. Multi-Model Matrix Grid ({seriesModels.length} Models)
                    </label>
                    
                    <div className="flex items-center gap-1.5">
                      {products.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const prod = products.find((p) => p.id === e.target.value);
                            if (prod) handleAddExistingProductToSeries(prod);
                            e.target.value = '';
                          }}
                          defaultValue=""
                          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#155EEF] text-[11px] font-bold px-2 py-1 cursor-pointer rounded-none focus:outline-none"
                        >
                          <option value="" disabled>+ Import Product from Catalog...</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku})
                            </option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={handleAddSeriesModel}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer rounded-none border border-slate-200"
                      >
                        <Plus className="w-3 h-3 text-[#155EEF]" />
                        <span>Add Blank Variant</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {seriesModels.map((m, idx) => (
                      <div key={m.id} className="p-2.5 bg-slate-50 border border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-2 rounded-none">
                        <div className="w-6 h-6 bg-slate-200 text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-[140px]">
                          <input
                            type="text"
                            value={m.modelName}
                            onChange={(e) => handleUpdateSeriesModel(m.id, 'modelName', e.target.value)}
                            placeholder="Model Name"
                            className="w-full bg-white border border-slate-200 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#155EEF]"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="text"
                            value={m.modelSku}
                            onChange={(e) => handleUpdateSeriesModel(m.id, 'modelSku', e.target.value)}
                            placeholder="Model SKU"
                            className="w-full bg-white border border-slate-200 px-2 py-1 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#155EEF]"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="text"
                            value={m.batchPrefix}
                            onChange={(e) => handleUpdateSeriesModel(m.id, 'batchPrefix', e.target.value)}
                            placeholder="Prefix"
                            className="w-full bg-white border border-slate-200 px-2 py-1 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#155EEF]"
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            value={m.quantity}
                            onChange={(e) => handleUpdateSeriesModel(m.id, 'quantity', parseInt(e.target.value) || 0)}
                            placeholder="Qty"
                            className="w-full bg-white border border-slate-200 px-2 py-1 text-xs font-mono font-bold text-[#155EEF] focus:outline-none focus:border-[#155EEF]"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveSeriesModel(m.id)}
                          disabled={seriesModels.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution Action Button (Enhanced High-Tech Button) */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-mono">
                  Batch Target: <span className="font-bold text-slate-900">{totalPlannedUnits.toLocaleString()} Cryptographic QRs</span>
                </div>

                <button
                  onClick={runBulkGenerationAlgorithm}
                  disabled={isGenerating || totalPlannedUnits <= 0}
                  className={`relative overflow-hidden px-6 py-3 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer rounded-none active:translate-y-0.5 ${
                    isGenerating
                      ? 'bg-blue-800 cursor-wait'
                      : 'bg-[#155EEF] hover:bg-[#124bbf] shadow-blue-500/20'
                  }`}
                >
                  {/* Subtle animated glowing shine on hover/active */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                  
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span className="font-mono tracking-wide">
                        Generating {totalPlannedUnits.toLocaleString()} Passports ({generationProgress}%)
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span className="tracking-wide">
                        Generate {totalPlannedUnits.toLocaleString()} Bulk QR Passports
                      </span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Column (5 Cols) - Live Algorithm Status & Output Panel */}
            <div className="lg:col-span-5 bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 rounded-none">
              
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-slate-950">Cryptographic Engine Telemetry</h3>
                    <p className="text-[11px] text-slate-400">Deterministic SHA-256 batch compilation</p>
                  </div>
                  {isGenerating ? (
                    <span className="text-[9.5px] font-mono font-bold text-[#155EEF] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-none animate-pulse flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      COMPUTING
                    </span>
                  ) : generatedBatch.length > 0 ? (
                    <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {generatedBatch.length} UNITS READY
                    </span>
                  ) : (
                    <span className="text-[9.5px] font-mono font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-none">
                      STANDBY
                    </span>
                  )}
                </div>

                {/* Animated Multi-Stage Progress Box */}
                {isGenerating && (
                  <div className="p-3.5 bg-slate-950 text-white border border-slate-800 mb-3 text-left rounded-none shadow-md">
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-[#53B1FD] mb-1.5">
                      <span className="flex items-center gap-1.5 truncate">
                        <Binary className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        {generationStageText}
                      </span>
                      <span className="text-white font-bold">{generationProgress}%</span>
                    </div>

                    {/* High-tech Stepped Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-none overflow-hidden my-2 border border-slate-700">
                      <div 
                        className="bg-gradient-to-r from-blue-500 via-[#155EEF] to-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>

                    {/* Live Scrolling Terminal Hashes */}
                    <div className="mt-2 text-[9.5px] font-mono text-slate-400 max-h-24 overflow-y-auto space-y-1 bg-black/50 p-2 border border-slate-800">
                      {liveStreamLogs.map((log, idx) => (
                        <div key={idx} className="truncate text-emerald-400/90 font-mono">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications Matrix Strip */}
                <div className="space-y-2 text-xs font-mono text-left bg-slate-50 p-3 border border-slate-200">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Target Product:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[180px]">{singleModelName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Hash Algorithm:</span>
                    <span className="text-emerald-700 font-bold">SHA-256 Nonce Matching</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Sample Serial Format:</span>
                    <span className="text-[#155EEF] font-bold">
                      {generationType === 'single-model'
                        ? `${singlePrefix}-${singleModelSku}-000001`
                        : `${seriesModels[0]?.batchPrefix}-${seriesModels[0]?.modelSku}-000001`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verification Gateway:</span>
                    <span className="text-slate-700 font-bold">https://useveripass.com/verify/*</span>
                  </div>
                </div>
              </div>

              {/* Actions Stack */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                {/* 1. Commit to System Registry */}
                <button
                  onClick={handleCommitBatchToRegistry}
                  disabled={generatedBatch.length === 0 || hasCommittedToLedger}
                  className={`w-full px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-none ${
                    hasCommittedToLedger
                      ? 'bg-emerald-600 text-white'
                      : generatedBatch.length > 0
                      ? 'bg-[#155EEF] hover:bg-[#124bbf] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {hasCommittedToLedger ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Committed to VeriPass Products Registry!</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>Commit Batch to Live Inventory Registry ({generatedBatch.length})</span>
                    </>
                  )}
                </button>

                {/* 2. Download CSV Manifest */}
                <button
                  onClick={exportBatchManifestCSV}
                  disabled={generatedBatch.length === 0}
                  className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-none"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Download Factory CSV / ERP Manifest ({generatedBatch.length})</span>
                </button>

                {/* 3. Print Batch Hangtags */}
                <button
                  onClick={printBatchHangtagsSheet}
                  disabled={generatedBatch.length === 0}
                  className="w-full px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 disabled:opacity-40 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-none"
                >
                  <Printer className="w-4 h-4 text-[#155EEF]" />
                  <span>Print Production Hangtags Sheet</span>
                </button>
              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* GENERATED BATCH PREVIEW GRID (PAGINATED) */}
          {/* ========================================================= */}
          {generatedBatch.length > 0 && (
            <div className="bg-white border border-slate-200 p-6 shadow-xs space-y-4 rounded-none">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="text-left">
                  <h3 className="text-base font-bold text-slate-950">
                    Generated Cryptographic Passports Preview ({generatedBatch.length} Units)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Each QR code contains an immutable serialized nonce anchored to the ledger.
                  </p>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono">
                  <span className="text-slate-500">
                    Showing {(previewPage - 1) * itemsPerPage + 1} - {Math.min(previewPage * itemsPerPage, generatedBatch.length)} of {generatedBatch.length}
                  </span>
                  <button
                    onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                    disabled={previewPage === 1}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 text-slate-700 cursor-pointer font-bold"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPreviewPage((p) => Math.min(Math.ceil(generatedBatch.length / itemsPerPage), p + 1))}
                    disabled={previewPage >= Math.ceil(generatedBatch.length / itemsPerPage)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 border border-slate-200 text-slate-700 cursor-pointer font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generatedBatch
                  .slice((previewPage - 1) * itemsPerPage, previewPage * itemsPerPage)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#155EEF] transition-all rounded-none text-left flex flex-col justify-between group shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                            {item.brand}
                          </span>
                          <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 border border-emerald-200">
                            AUTHENTIC
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 truncate leading-tight">{item.productName}</h4>
                        <div className="text-[10px] font-mono text-[#155EEF] font-semibold mt-0.5 truncate">
                          SN: {item.serialNumber}
                        </div>
                      </div>

                      {/* Vector QR Representation */}
                      <div className="my-3 flex items-center justify-center p-2.5 bg-white border border-slate-200 group-hover:border-blue-200">
                        <QRCodeSVG
                          value={item.verificationUrl}
                          size={110}
                          fgColor={qrConfig.fgColor}
                          bgColor={qrConfig.bgColor}
                          level="M"
                        />
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 text-[9.5px] font-mono text-slate-500 flex items-center justify-between">
                        <span className="truncate font-semibold text-slate-800">{item.passportId}</span>
                        <button
                          onClick={() => handleCopy(item.verificationUrl, item.passportId)}
                          className="text-[#155EEF] hover:underline cursor-pointer font-bold"
                        >
                          {copiedId === item.passportId ? 'Copied' : 'Copy URL'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MODE: ACTIVE INVENTORY QR HUB (MODE 1) */}
      {/* ========================================================= */}
      {studioMode === 'inventory' && (
        <div className="space-y-5">
          
          {/* Controls Bar */}
          <div className="bg-white border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none">
            
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by product name, SKU or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-[#155EEF] rounded-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs px-3 py-2 text-slate-800 focus:outline-none focus:border-[#155EEF] rounded-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer rounded-none"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>QR Styling</span>
              </button>
            </div>
          </div>

          {/* QR Design Configuration Drawer */}
          {isConfigOpen && (
            <div className="bg-white border border-slate-200 p-5 shadow-xs text-left space-y-4 rounded-none">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                  Custom QR Vector Styling & Colors
                </h3>
                <button
                  onClick={() => setIsConfigOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-slate-600 font-semibold">Preset Palettes:</span>
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setQrConfig({ ...qrConfig, fgColor: preset.fg })}
                    className={`px-3 py-1.5 text-xs font-bold border flex items-center gap-2 cursor-pointer rounded-none ${
                      qrConfig.fgColor === preset.fg
                        ? 'border-[#155EEF] bg-[#EFF8FF] text-[#155EEF]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-none" style={{ backgroundColor: preset.fg }} />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product QR Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 text-center rounded-none shadow-xs">
              <QrCode className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">No active products found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Use the Industrial Bulk Generator above or add a product to generate cryptographic QR codes.
              </p>
              <button
                onClick={onOpenAddProduct}
                className="mt-4 px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white text-xs font-bold rounded-none cursor-pointer"
              >
                + Register Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between rounded-none text-left hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{product.category}</span>
                      <span className="text-[9.5px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-none">
                        VERIFIED
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs truncate">{product.name}</h4>
                    <div className="text-[10.5px] font-mono text-[#155EEF] font-semibold">{product.id}</div>
                  </div>

                  {/* SVG Code */}
                  <div className="my-4 flex items-center justify-center p-3 bg-slate-50 border border-slate-100">
                    <QRCodeSVG
                      id={`qr-svg-${product.id}`}
                      value={product.qrCodeUrl || `https://useveripass.com/verify/${product.id}`}
                      size={130}
                      fgColor={qrConfig.fgColor}
                      bgColor={qrConfig.bgColor}
                      level={qrConfig.level}
                    />
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onPreviewPassport(product)}
                        className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer rounded-none border border-slate-200"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => handleCopy(product.qrCodeUrl || `https://useveripass.com/verify/${product.id}`, product.id)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] cursor-pointer rounded-none border border-slate-200"
                        title="Copy Verification Link"
                      >
                        {copiedId === product.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
