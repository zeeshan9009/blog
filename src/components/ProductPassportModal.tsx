import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Product } from '../types/product';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Layers,
  Award,
  Globe2,
  Sparkles,
  QrCode,
  Share2
} from 'lucide-react';

interface ProductPassportModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductPassportModal: React.FC<ProductPassportModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(product.passportHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verifyUrl = product.qrCodeUrl || `https://veripass.id/verify/${product.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] text-left">
        
        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#155EEF] text-white p-5 sm:p-6 relative overflow-hidden flex items-start justify-between">
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-white/5 skew-x-12 pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authentic Digital Passport</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white mt-1">
              {product.name}
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              Passport ID: <span className="text-white font-bold">{product.id}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0 ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Passport Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {/* Top Section: QR code badge + Live Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 items-center">
            
            {/* Live QR Code Preview */}
            <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 shadow-2xs">
              <QRCodeSVG
                value={verifyUrl}
                size={110}
                level="H"
                fgColor="#0F172A"
                bgColor="#FFFFFF"
                className="w-full h-auto max-w-[110px]"
              />
              <span className="text-[9.5px] font-mono font-bold text-slate-500 mt-2">
                SCAN TO VERIFY
              </span>
            </div>

            {/* Product Quick Specs */}
            <div className="sm:col-span-2 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-400 font-medium text-[11px]">Brand / Origin</span>
                <span className="font-bold text-slate-900">{product.brand} ({product.originCountry})</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-400 font-medium text-[11px]">Category</span>
                <span className="font-semibold text-slate-800">{product.category}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-400 font-medium text-[11px]">Serial Number</span>
                <span className="font-mono font-bold text-slate-900">{product.serialNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium text-[11px]">Verification Status</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>VERIFIED ORIGINAL</span>
                </span>
              </div>
            </div>

          </div>

          {/* Description & Metadata */}
          {product.description && (
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider font-mono">
                Product Provenance & Overview
              </div>
              <p className="text-slate-600 leading-relaxed bg-white border border-slate-200 p-3">
                {product.description}
              </p>
            </div>
          )}

          {/* Cryptographic Ledger & Security Specs */}
          <div className="border border-slate-200 p-3.5 space-y-2.5 bg-slate-900 text-white font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <span className="flex items-center gap-1.5 text-blue-400">
                <Lock className="w-3 h-3" />
                <span>Cryptographic Proof Hash</span>
              </span>
              <span className="text-emerald-400">SHA-256 IMMUTABLE</span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 border border-slate-800">
              <span className="truncate text-slate-300 font-mono text-[10.5px]">
                {product.passportHash}
              </span>
              <button
                onClick={handleCopyHash}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] font-sans flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <div>
                <span>Batch: </span>
                <span className="text-slate-200 font-bold">{product.batchNumber}</span>
              </div>
              <div>
                <span>Mfg Date: </span>
                <span className="text-slate-200 font-bold">{product.manufacturingDate}</span>
              </div>
              <div>
                <span>Total Scans: </span>
                <span className="text-slate-200 font-bold">{product.verificationCount || 0}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-bold text-slate-900">VeriPass Protocol</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(verifyUrl, '_blank')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public URL</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
