import React, { useState, useRef } from 'react';
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
  Maximize2
} from 'lucide-react';

interface QrCodeHubProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onPreviewPassport: (product: Product) => void;
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
  onPreviewPassport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom QR settings state
  const [qrConfig, setQrConfig] = useState<QRCodeConfig>({
    size: 200,
    fgColor: '#0F172A',
    bgColor: '#FFFFFF',
    includeMargin: true,
    level: 'H',
    includeLogo: true,
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  // Handle Copy URL
  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Download SVG
  const downloadSvg = (productId: string, productName: string) => {
    const svgElement = document.getElementById(`qr-svg-${productId}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VeriPass-QR-${productName.replace(/\s+/g, '-')}-${productId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download PNG (via Canvas conversion)
  const downloadPng = (productId: string, productName: string) => {
    const svgElement = document.getElementById(`qr-svg-${productId}`);
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    img.onload = () => {
      ctx.fillStyle = qrConfig.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `VeriPass-QR-${productName.replace(/\s+/g, '-')}-${productId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  // Print Label Handler
  const printLabel = (product: Product) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const svgElement = document.getElementById(`qr-svg-${product.id}`);
    const svgHtml = svgElement ? svgElement.outerHTML : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>VeriPass Tag - ${product.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; text-align: center; }
            .label-card { border: 2px solid #0F172A; max-width: 320px; margin: 0 auto; padding: 20px; }
            .brand { font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #155EEF; text-transform: uppercase; margin-bottom: 8px; }
            .product-name { font-size: 16px; font-weight: bold; color: #0F172A; margin: 6px 0; }
            .sku { font-family: monospace; font-size: 11px; color: #64748B; margin-bottom: 15px; }
            .qr-box { margin: 10px auto; width: 180px; height: 180px; }
            .qr-box svg { width: 100%; height: 100%; }
            .footer { font-family: monospace; font-size: 9px; color: #94A3B8; margin-top: 12px; border-top: 1px dashed #CBD5E1; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="brand">VERIPASS SECURE PASSPORT</div>
            <div class="product-name">${product.name}</div>
            <div class="sku">ID: ${product.id} • SKU: ${product.sku}</div>
            <div class="qr-box">${svgHtml}</div>
            <div class="footer">Scan with any smartphone camera to verify authenticity.</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Bulk Print Sheet Handler
  const printBulkSheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cardsHtml = filteredProducts.map((product) => {
      const svgElement = document.getElementById(`qr-svg-${product.id}`);
      const svgHtml = svgElement ? svgElement.outerHTML : '';
      return `
        <div style="border: 1px solid #CBD5E1; padding: 12px; text-align: center; page-break-inside: avoid; background: #fff;">
          <div style="font-size: 9px; font-weight: bold; color: #155EEF; text-transform: uppercase; letter-spacing: 0.5px;">VERIPASS PASSPORT</div>
          <div style="font-size: 12px; font-weight: bold; color: #0F172A; margin: 4px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${product.name}</div>
          <div style="font-family: monospace; font-size: 9px; color: #64748B; margin-bottom: 6px;">${product.id}</div>
          <div style="width: 120px; height: 120px; margin: 0 auto;">${svgHtml}</div>
          <div style="font-family: monospace; font-size: 8px; color: #94A3B8; margin-top: 6px;">Authentic Original</div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>VeriPass Bulk QR Print Sheet</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; margin: 0; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div style="margin-bottom: 16px; border-bottom: 2px solid #0F172A; padding-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 900; font-size: 16px;">VeriPass Production QR Sheet</span>
            <span style="font-family: monospace; font-size: 11px;">Total Codes: ${filteredProducts.length}</span>
          </div>
          <div class="grid">${cardsHtml}</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
            <span>CRYPTOGRAPHIC QR MATRIX</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            QR Code Management & Print Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Generate high-resolution cryptographic QR labels, custom brand vectors, printable hangtags, and real-time verification routes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`px-3.5 py-2 border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              isConfigOpen
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize QR Design</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* QR Customization Toolbar (Expandable) */}
      {isConfigOpen && (
        <div className="bg-white border border-slate-200 p-5 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>QR Vector Styling & Configuration</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Live vector recalculation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            
            {/* Color Presets */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Foreground Color Palette
              </label>
              <div className="flex items-center gap-1.5">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.fg}
                    onClick={() => setQrConfig({ ...qrConfig, fgColor: preset.fg })}
                    className={`w-7 h-7 border-2 cursor-pointer transition-transform ${
                      qrConfig.fgColor === preset.fg
                        ? 'scale-110 border-[#155EEF] shadow-sm'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: preset.fg }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Error Correction Level */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Error Correction (ECC)
              </label>
              <select
                value={qrConfig.level}
                onChange={(e) => setQrConfig({ ...qrConfig, level: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none cursor-pointer font-mono"
              >
                <option value="L">L - 7% damage recovery</option>
                <option value="M">M - 15% damage recovery</option>
                <option value="Q">Q - 25% damage recovery</option>
                <option value="H">H - 30% Ultra Resilience (Best)</option>
              </select>
            </div>

            {/* Margin Option */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Quiet Zone Margin
              </label>
              <button
                onClick={() => setQrConfig({ ...qrConfig, includeMargin: !qrConfig.includeMargin })}
                className={`w-full py-1.5 px-3 border text-xs font-semibold cursor-pointer transition-colors text-center ${
                  qrConfig.includeMargin
                    ? 'bg-blue-50 border-[#155EEF] text-[#155EEF]'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {qrConfig.includeMargin ? 'Margin Enabled (Safe Print)' : 'Tight Fit (Zero Margin)'}
              </button>
            </div>

            {/* Bulk Print Action */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Batch Printing Sheet
              </label>
              <button
                disabled={filteredProducts.length === 0}
                onClick={printBulkSheet}
                className="w-full py-1.5 px-3 bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print All Labels ({filteredProducts.length})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#155EEF] text-xs pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] font-mono text-slate-500">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {products.length} QR codes
          </span>
        </div>
      </div>

      {/* QR Codes Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF] mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No QR codes generated yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Register your first product to generate high-resolution, cryptographically signed QR codes.
          </p>
          <button
            onClick={onOpenAddProduct}
            className="mt-4 px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Product</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const verifyUrl = product.qrCodeUrl || `https://veripass.id/verify/${product.id}`;

            return (
              <div
                key={product.id}
                className="bg-white border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                
                {/* Card Top: Title & Status */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[9.5px] font-mono uppercase font-bold text-[#155EEF] bg-blue-50 border border-blue-100 px-1.5 py-0.5">
                        {product.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-[220px]">
                        {product.name}
                      </h3>
                      <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                        ID: {product.id} • SKU: {product.sku}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 shrink-0">
                      <span>✓</span> Active
                    </span>
                  </div>

                  {/* QR Canvas Container */}
                  <div className="bg-slate-50 border border-slate-200/80 p-4 my-3 flex flex-col items-center justify-center relative group/qr">
                    <div className="bg-white p-2.5 border border-slate-200 shadow-xs">
                      <QRCodeSVG
                        id={`qr-svg-${product.id}`}
                        value={verifyUrl}
                        size={150}
                        level={qrConfig.level}
                        fgColor={qrConfig.fgColor}
                        bgColor={qrConfig.bgColor}
                        includeMargin={qrConfig.includeMargin}
                      />
                    </div>

                    {/* Quick Preview Hover Overlay */}
                    <button
                      onClick={() => onPreviewPassport(product)}
                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/qr:opacity-100 backdrop-blur-2xs flex flex-col items-center justify-center text-white transition-opacity cursor-pointer p-2"
                    >
                      <Eye className="w-5 h-5 mb-1" />
                      <span className="text-[11px] font-bold">Simulate Scan Verification</span>
                      <span className="text-[9px] text-slate-300 font-mono">View Digital Passport</span>
                    </button>
                  </div>

                  {/* Verification URL Pill */}
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-[10.5px] font-mono text-slate-600 mb-3">
                    <span className="truncate pr-2">{verifyUrl}</span>
                    <button
                      onClick={() => handleCopy(verifyUrl, product.id)}
                      className="text-slate-400 hover:text-slate-900 shrink-0 cursor-pointer p-0.5"
                      title="Copy Link"
                    >
                      {copiedId === product.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Card Bottom: Export Action Buttons */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => downloadPng(product.id, product.name)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10.5px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>PNG</span>
                  </button>

                  <button
                    onClick={() => downloadSvg(product.id, product.name)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10.5px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>SVG</span>
                  </button>

                  <button
                    onClick={() => printLabel(product)}
                    className="py-1.5 px-2 bg-slate-900 hover:bg-black text-white font-bold text-[10.5px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
