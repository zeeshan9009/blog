import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Certificate, CertificateStatus } from '../types/models';
import { Product } from '../types/product';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Eye,
  Award,
  Lock,
  Copy,
  Check,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  Trash2,
  Share2,
  RefreshCw,
  FileText
} from 'lucide-react';

interface CertificatesViewProps {
  products: Product[];
  certificates: Certificate[];
  onIssueCertificate: (cert: Certificate) => void;
  onUpdateCertificateStatus: (id: string, status: CertificateStatus) => void;
  onDeleteCertificate: (id: string) => void;
  defaultIssuer?: string;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  products,
  certificates,
  onIssueCertificate,
  onUpdateCertificateStatus,
  onDeleteCertificate,
  defaultIssuer = 'VeriPass Central Authority'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CertificateStatus>('all');
  const [isIssuing, setIsIssuing] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Form State for Issuing Certificate
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sealType, setSealType] = useState<'gold_standard' | 'quantum_vault' | 'holographic'>('gold_standard');
  const [notes, setNotes] = useState('');
  const [expiryYears, setExpiryYears] = useState('5');
  const [formError, setFormError] = useState<string | null>(null);

  // Helper random generator
  const generateRandomHex = (length: number) => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setFormError('Please enter recipient / owner name.');
      return;
    }

    const linkedProduct = products.find((p) => p.id === selectedProductId) || {
      id: `VP-${Math.floor(100000 + Math.random() * 900000)}`,
      name: 'Custom Luxury Asset',
      brand: 'VeriPass Enterprise',
      category: 'Luxury Goods'
    };

    const certId = `CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const issueDate = new Date().toISOString().split('T')[0];
    const expiryDate = new Date(Date.now() + parseInt(expiryYears) * 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const newCert: Certificate = {
      id: certId,
      certificateNumber: `VP-CERT-${generateRandomHex(8).toUpperCase()}`,
      productId: linkedProduct.id,
      productName: linkedProduct.name,
      brand: linkedProduct.brand || 'VeriPass Enterprise',
      category: linkedProduct.category || 'General',
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim() || 'owner@useveripass.com',
      issuerName: defaultIssuer,
      issueDate: issueDate,
      expiryDate: expiryDate,
      status: 'active',
      blockchainTxHash: `0x${generateRandomHex(64)}`,
      signatureHash: `SIG-${generateRandomHex(32).toUpperCase()}`,
      qrCodeUrl: `https://useveripass.com/certificate/${certId}`,
      sealType: sealType,
      notes: notes.trim() || `Official authenticity certificate issued to ${recipientName.trim()}.`
    };

    onIssueCertificate(newCert);
    setIsIssuing(false);
    setSelectedCert(newCert);
    setRecipientName('');
    setRecipientEmail('');
    setNotes('');
    setFormError(null);
  };

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filtered list
  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch =
      c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic Certificate Stats
  const totalIssued = certificates.length;
  const activeValid = certificates.filter((c) => c.status === 'active').length;
  const transferred = certificates.filter((c) => c.status === 'transferred').length;
  const revoked = certificates.filter((c) => c.status === 'revoked').length;

  // Print Official Certificate
  const printOfficialCertificate = (cert: Certificate) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authenticity Certificate - ${cert.certificateNumber}</title>
          <style>
            @page { size: landscape; margin: 0; }
            body { font-family: "Georgia", serif; margin: 0; padding: 40px; background: #fafafa; display: flex; justify-content: center; align-items: center; }
            .cert-frame { width: 900px; padding: 40px; background: #ffffff; border: 8px double #1E293B; outline: 2px solid #D97706; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .watermark { position: absolute; inset: 0; opacity: 0.03; background-image: radial-gradient(#000 2px, transparent 2px); background-size: 16px 16px; pointer-events: none; }
            .badge { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #D97706; text-transform: uppercase; margin-bottom: 8px; }
            .title { font-size: 32px; font-weight: bold; color: #0F172A; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 12px 0; }
            .subtitle { font-style: italic; color: #64748B; font-size: 14px; margin-bottom: 24px; }
            .recipient { font-size: 28px; font-weight: bold; color: #1E3A8A; margin: 10px 0; border-bottom: 1px solid #CBD5E1; display: inline-block; padding: 0 40px 6px; }
            .statement { font-size: 14px; color: #334155; line-height: 1.6; max-width: 650px; margin: 16px auto; }
            .grid { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: left; }
            .signatures { display: flex; gap: 40px; }
            .sig-block { border-top: 1px solid #0F172A; width: 180px; text-align: center; padding-top: 6px; font-size: 11px; color: #475569; }
            .seal { width: 90px; height: 90px; border-radius: 50%; border: 3px dashed #D97706; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; color: #D97706; text-align: center; }
            .footer-hash { font-family: monospace; font-size: 9px; color: #94A3B8; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="cert-frame">
            <div class="watermark"></div>
            <div class="badge">VERIPASS PROTOCOL • CERTIFICATE OF AUTHENTICITY</div>
            <h1 class="title">Certificate of Ownership & Origin</h1>
            <div class="subtitle">This document certifies the provenance and cryptographic verification of the registered asset.</div>
            
            <div>PROUDLY PRESENTED TO</div>
            <div class="recipient">${cert.recipientName}</div>
            
            <p class="statement">
              For the authentic ownership of <strong>${cert.productName}</strong> (Passport ID: <strong>${cert.productId}</strong>). 
              This item is permanently cataloged on the VeriPass cryptographic ledger with zero-knowledge tamper resistance.
            </p>

            <div class="grid">
              <div>
                <div style="font-size: 10px; color: #64748B;">CERTIFICATE NUMBER</div>
                <div style="font-family: monospace; font-weight: bold; font-size: 14px; color: #0F172A;">${cert.certificateNumber}</div>
                <div style="font-size: 10px; color: #64748B; margin-top: 6px;">DATE OF ISSUANCE: <strong>${cert.issueDate}</strong></div>
              </div>

              <div class="seal">
                VERIPASS<br>OFFICIAL<br>SEAL
              </div>

              <div class="signatures">
                <div class="sig-block">
                  <strong>${cert.issuerName}</strong><br>Authorized Signer
                </div>
              </div>
            </div>

            <div class="footer-hash">
              BLOCKCHAIN TX: ${cert.blockchainTxHash} • SHA-256 SIGNATURE: ${cert.signatureHash}
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // FULL PAGE: "Issue New Certificate" View
  if (isIssuing) {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        
        {/* Header Bar */}
        <div className="bg-white border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsIssuing(false)}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400">
                <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
                <span>CERTIFICATE ISSUANCE AUTHORITY</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Issue Authenticity Certificate & Warranty
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsIssuing(false)}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCertificate}
              className="px-5 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Award className="w-4 h-4" />
              <span>Issue Official Certificate</span>
            </button>
          </div>
        </div>

        {/* Issuance Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 text-xs text-slate-800">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-medium">
                {formError}
              </div>
            )}

            {/* Select Linked Product */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Select Registered Product to Certify <span className="text-red-500">*</span>
              </label>
              {products.length > 0 ? (
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.category}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-200 text-[#155EEF] text-[11.5px]">
                  No products registered yet. A default luxury asset passport will be generated with this certificate.
                </div>
              )}
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Recipient / Owner Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Jacqueline Sterling"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. owner@luxuryclient.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Seal & Validity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Official Cryptographic Seal
                </label>
                <select
                  value={sealType}
                  onChange={(e) => setSealType(e.target.value as any)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="gold_standard">👑 Gold Sovereign Seal</option>
                  <option value="quantum_vault">⚡ Quantum Ledger Vault</option>
                  <option value="holographic">🔮 Holographic Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Warranty & Guarantee Duration (Years)
                </label>
                <input
                  type="number"
                  value={expiryYears}
                  onChange={(e) => setExpiryYears(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Certificate Statement Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Certificate Clauses & Authenticity Notes
              </label>
              <textarea
                rows={3}
                placeholder="Certified genuine natural diamond with zero-counterfeit cryptographic signature."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsIssuing(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCertificate}
                className="px-5 py-2.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Award className="w-4 h-4" />
                <span>Issue Certificate Now</span>
              </button>
            </div>

          </div>

          {/* Right Live Preview */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white border border-slate-800 p-6 shadow-xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                OFFICIAL CERTIFICATE PREVIEW
              </span>
              <span className="text-xs">🔒 256-BIT PROOF</span>
            </div>

            <div className="text-center py-4 border border-slate-800/80 bg-slate-950/60 p-4">
              <div className="text-[9.5px] font-mono text-slate-400 uppercase tracking-widest">
                VERIPASS AUTHENTICITY LEDGER
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Certificate of Origin
              </h3>
              <div className="text-xs text-slate-300 italic mt-1">
                Conferred upon
              </div>
              <div className="text-base font-black text-amber-300 mt-0.5">
                {recipientName || 'Recipient Name'}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                For asset: <strong className="text-white">{products.find((p) => p.id === selectedProductId)?.name || 'Luxury Asset'}</strong>
              </div>
            </div>

            <div className="space-y-1 text-[10.5px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Issuer:</span>
                <span className="text-slate-200">{defaultIssuer}</span>
              </div>
              <div className="flex justify-between">
                <span>Seal:</span>
                <span className="text-amber-400 uppercase font-bold">{sealType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">IMMUTABLE VALID</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
            <span>AUTHENTICITY & WARRANTY REGISTRY</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Certificates of Authenticity & Ownership
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Issue, verify, download, and revoke cryptographic authenticity certificates, extended warranties, and provenance passports.
          </p>
        </div>

        <button
          onClick={() => setIsIssuing(true)}
          className="px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* 4 Metric Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Total Certificates Issued</div>
          <div className="text-2xl font-black text-slate-950 mt-1">{totalIssued}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">100% Cryptographically Verified</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Active & Valid</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{activeValid}</div>
          <div className="text-[10px] text-slate-400 mt-1">Currently protected</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Transferred Ownership</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{transferred}</div>
          <div className="text-[10px] text-slate-400 mt-1">Secondary market verified</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Revoked / Disputed</div>
          <div className="text-2xl font-black text-slate-400 mt-1">{revoked}</div>
          <div className="text-[10px] text-slate-400 mt-1">0% Fraud tolerance</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by cert number, owner, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#155EEF] text-xs pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 text-slate-700 focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active & Valid</option>
            <option value="transferred">Transferred</option>
            <option value="revoked">Revoked</option>
          </select>

          <span className="text-[11px] font-mono text-slate-400">
            Total: <strong className="text-slate-900">{filteredCertificates.length}</strong>
          </span>
        </div>
      </div>

      {/* Certificates Directory Table / Empty State */}
      {filteredCertificates.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF] mb-3">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No authenticity certificates issued</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Issue your first cryptographic certificate of ownership or extended warranty for luxury customers.
          </p>
          <button
            onClick={() => setIsIssuing(true)}
            className="mt-4 px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue First Certificate</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Certificate #</th>
                <th className="py-3 px-3 font-semibold">Asset Name</th>
                <th className="py-3 px-3 font-semibold">Certified Owner</th>
                <th className="py-3 px-3 font-semibold">Issue Date</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Certificate Number & Seal */}
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-[#155EEF] text-xs">{cert.certificateNumber}</div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {cert.sealType.replace('_', ' ')}
                    </div>
                  </td>

                  {/* Asset */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{cert.productName}</div>
                    <div className="text-[10px] font-mono text-slate-400">ID: {cert.productId}</div>
                  </td>

                  {/* Recipient */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{cert.recipientName}</div>
                    <div className="text-[10.5px] text-slate-400 font-mono">{cert.recipientEmail}</div>
                  </td>

                  {/* Issue Date */}
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    <div>{cert.issueDate}</div>
                    <div className="text-[9.5px] text-slate-400">Exp: {cert.expiryDate || 'Lifetime'}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    {cert.status === 'active' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Valid & Active</span>
                      </span>
                    )}
                    {cert.status === 'transferred' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5">
                        <RefreshCw className="w-3 h-3" />
                        <span>Transferred</span>
                      </span>
                    )}
                    {cert.status === 'revoked' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5">
                        <XCircle className="w-3 h-3" />
                        <span>Revoked</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-[#155EEF] border border-slate-200 text-slate-700 text-[10.5px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Certificate"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => printOfficialCertificate(cert)}
                        className="p-1 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Print Official Certificate"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteCertificate(cert.id)}
                        className="p-1 text-slate-300 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Certificate Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Official Certificate of Authenticity</h3>
                  <div className="text-[10px] font-mono text-slate-400">{selectedCert.certificateNumber}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800">
              <div className="border-2 border-slate-900 p-6 text-center bg-slate-50/50 space-y-3 relative">
                <div className="text-[9px] font-mono uppercase tracking-widest text-[#155EEF] font-bold">
                  VERIPASS PROTOCOL CERTIFIED
                </div>
                <h2 className="text-xl font-serif font-black text-slate-900 uppercase">
                  Certificate of Authenticity
                </h2>
                <div className="text-xs text-slate-500 italic">Issued to</div>
                <div className="text-lg font-bold text-[#155EEF]">{selectedCert.recipientName}</div>
                <p className="text-slate-600 max-w-md mx-auto text-[11px] leading-relaxed">
                  {selectedCert.notes}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-200 text-[10.5px] font-mono text-slate-500 text-left">
                  <div>Product: <strong className="text-slate-900">{selectedCert.productName}</strong></div>
                  <div>Asset ID: <strong className="text-slate-900">{selectedCert.productId}</strong></div>
                  <div>Issue Date: <strong className="text-slate-900">{selectedCert.issueDate}</strong></div>
                  <div>Expiry: <strong className="text-slate-900">{selectedCert.expiryDate || 'Permanent'}</strong></div>
                </div>
              </div>

              {/* Cryptographic Signatures */}
              <div className="bg-slate-900 text-white p-3 font-mono text-[10px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>TX HASH:</span>
                  <span className="text-emerald-400">BLOCKCHAIN ANCHORED</span>
                </div>
                <div className="truncate text-slate-300">{selectedCert.blockchainTxHash}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {selectedCert.status === 'active' ? (
                  <button
                    onClick={() => {
                      onUpdateCertificateStatus(selectedCert.id, 'revoked');
                      setSelectedCert({ ...selectedCert, status: 'revoked' });
                    }}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold cursor-pointer"
                  >
                    Revoke Certificate
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onUpdateCertificateStatus(selectedCert.id, 'active');
                      setSelectedCert({ ...selectedCert, status: 'active' });
                    }}
                    className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold cursor-pointer"
                  >
                    Re-activate Certificate
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => printOfficialCertificate(selectedCert)}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
