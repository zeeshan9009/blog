import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types/product';
import { Certificate, Customer } from '../types/models';
import {
  Search,
  Box,
  QrCode,
  FileCheck2,
  Users,
  BarChart3,
  ScrollText,
  Settings,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Command,
  X,
  Clock,
  ChevronRight,
  Radio
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  certificates: Certificate[];
  customers: Customer[];
  onSelectProduct: (product: Product) => void;
  onNavigateTab: (tab: 'dashboard' | 'products' | 'add-product' | 'qrcodes' | 'certificates' | 'customers' | 'ownership' | 'analytics' | 'logs' | 'settings') => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  products,
  certificates,
  customers,
  onSelectProduct,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open & reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Global actions list
  const actions = [
    {
      id: 'action-add-product',
      type: 'action',
      title: 'Issue New Cryptographic Passport',
      subtitle: 'Anchor physical inventory with 256-bit SHA passport',
      icon: Plus,
      badge: 'ACTION',
      color: 'text-[#155EEF] bg-[#EFF8FF] border-blue-200',
      action: () => {
        onNavigateTab('add-product');
        onClose();
      }
    },
    {
      id: 'action-qr-hub',
      type: 'action',
      title: 'Open QR Vector Studio & Batch Engine',
      subtitle: 'Generate single or multi-model bulk vector matrix',
      icon: QrCode,
      badge: 'STUDIO',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      action: () => {
        onNavigateTab('qrcodes');
        onClose();
      }
    },
    {
      id: 'action-certs',
      type: 'action',
      title: 'Issue Authenticity Certificate',
      subtitle: 'Create official gold or slate immutable seals',
      icon: FileCheck2,
      badge: 'CERT',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      action: () => {
        onNavigateTab('certificates');
        onClose();
      }
    },
    {
      id: 'action-customers',
      type: 'action',
      title: 'Customer Directory & Custodians',
      subtitle: 'Manage client registry & secondary market transfers',
      icon: Users,
      badge: 'CLIENTS',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      action: () => {
        onNavigateTab('customers');
        onClose();
      }
    },
    {
      id: 'action-analytics',
      type: 'action',
      title: 'Telemetry & Verification BI',
      subtitle: 'View live scan maps, device breakdown & traffic',
      icon: BarChart3,
      badge: 'METRICS',
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      action: () => {
        onNavigateTab('analytics');
        onClose();
      }
    },
    {
      id: 'action-logs',
      type: 'action',
      title: 'Security Audit Logs & Nonces',
      subtitle: 'Tamper-proof event logs and verification telemetry',
      icon: ScrollText,
      badge: 'VAULT',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      action: () => {
        onNavigateTab('logs');
        onClose();
      }
    },
    {
      id: 'action-settings',
      type: 'action',
      title: 'Enterprise Configuration',
      subtitle: 'Brand identity, origin, custom subdomains & guard mode',
      icon: Settings,
      badge: 'CONFIG',
      color: 'text-slate-700 bg-slate-100 border-slate-200',
      action: () => {
        onNavigateTab('settings');
        onClose();
      }
    }
  ];

  // Filtered entities based on search query
  const trimmed = query.trim().toLowerCase();

  const filteredProducts = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.sku.toLowerCase().includes(trimmed) ||
          (p.category && p.category.toLowerCase().includes(trimmed)) ||
          (p.brand && p.brand.toLowerCase().includes(trimmed)) ||
          p.id.toLowerCase().includes(trimmed)
      )
    : products.slice(0, 4);

  const filteredCertificates = trimmed
    ? certificates.filter(
        (c) =>
          c.certificateNumber.toLowerCase().includes(trimmed) ||
          c.productName.toLowerCase().includes(trimmed) ||
          (c.issuerName && c.issuerName.toLowerCase().includes(trimmed)) ||
          (c.recipientName && c.recipientName.toLowerCase().includes(trimmed)) ||
          (c.brand && c.brand.toLowerCase().includes(trimmed))
      )
    : certificates.slice(0, 3);

  const filteredCustomers = trimmed
    ? customers.filter(
        (c) =>
          c.fullName.toLowerCase().includes(trimmed) ||
          c.email.toLowerCase().includes(trimmed) ||
          (c.city && c.city.toLowerCase().includes(trimmed)) ||
          (c.country && c.country.toLowerCase().includes(trimmed)) ||
          c.id.toLowerCase().includes(trimmed)
      )
    : customers.slice(0, 3);

  const filteredActions = trimmed
    ? actions.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmed) ||
          a.subtitle.toLowerCase().includes(trimmed) ||
          a.badge.toLowerCase().includes(trimmed)
      )
    : actions;

  // Flattened searchable list for keyboard navigation
  type FlatItem =
    | { type: 'action'; data: (typeof actions)[0] }
    | { type: 'product'; data: Product }
    | { type: 'certificate'; data: Certificate }
    | { type: 'customer'; data: Customer };

  const flatItems: FlatItem[] = [
    ...filteredActions.map((a) => ({ type: 'action' as const, data: a })),
    ...filteredProducts.map((p) => ({ type: 'product' as const, data: p })),
    ...filteredCertificates.map((c) => ({ type: 'certificate' as const, data: c })),
    ...filteredCustomers.map((cust) => ({ type: 'customer' as const, data: cust }))
  ];

  // Keyboard navigation within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < flatItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems.length > 0 && selectedIndex < flatItems.length) {
        handleSelectItem(flatItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelectItem = (item: FlatItem) => {
    if (item.type === 'action') {
      item.data.action();
    } else if (item.type === 'product') {
      onSelectProduct(item.data);
      onClose();
    } else if (item.type === 'certificate') {
      onNavigateTab('certificates');
      onClose();
    } else if (item.type === 'customer') {
      onNavigateTab('customers');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs font-sans text-left animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-slate-300 shadow-2xl rounded-none overflow-hidden flex flex-col max-h-[80vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* ========================================================= */}
        {/* TOP SEARCH INPUT BAR */}
        {/* ========================================================= */}
        <div className="relative border-b border-slate-200 bg-white p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <Search className="w-4 h-4 text-[#155EEF]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, product name, serial, cert #, or customer..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-none cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-none shadow-2xs">
              ESC
            </kbd>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SCROLLABLE RESULTS BODY */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 max-h-[55vh]">
          {flatItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-semibold text-slate-600">No matching records found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a SKU, product name, or command</p>
            </div>
          ) : (
            <>
              {/* 1. QUICK ACTIONS / SHORTCUTS */}
              {filteredActions.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Commands & Quick Actions</span>
                    <span>{filteredActions.length}</span>
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    {filteredActions.map((action) => {
                      const itemIndex = flatItems.findIndex((it) => it.type === 'action' && (it.data as any).id === action.id);
                      const isSelected = itemIndex === selectedIndex;
                      const Icon = action.icon;

                      return (
                        <button
                          key={action.id}
                          onClick={() => handleSelectItem({ type: 'action', data: action })}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-none text-left transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-[#EFF8FF] border-[#155EEF]/30 text-slate-950'
                              : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-7 h-7 rounded-none border flex items-center justify-center shrink-0 ${action.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate leading-tight">{action.title}</div>
                              <div className="text-[10.5px] text-slate-400 truncate mt-0.5 font-normal">{action.subtitle}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none bg-slate-100 text-slate-600 border border-slate-200">
                              {action.badge}
                            </span>
                            {isSelected && <ChevronRight className="w-3.5 h-3.5 text-[#155EEF]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. PRODUCTS & PASSPORTS */}
              {filteredProducts.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
                    <span>Products & Passports</span>
                    <span>{filteredProducts.length}</span>
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    {filteredProducts.map((p) => {
                      const itemIndex = flatItems.findIndex((it) => it.type === 'product' && (it.data as any).id === p.id);
                      const isSelected = itemIndex === selectedIndex;

                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectItem({ type: 'product', data: p })}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-none text-left transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-[#EFF8FF] border-[#155EEF]/30 text-slate-950'
                              : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-none bg-blue-50 border border-blue-200 text-[#155EEF] flex items-center justify-center shrink-0">
                              <Box className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate leading-tight flex items-center gap-1.5">
                                <span>{p.name}</span>
                                <span className="text-[9.5px] font-mono text-slate-400">({p.sku})</span>
                              </div>
                              <div className="text-[10.5px] text-slate-400 truncate mt-0.5 font-mono">
                                ID: {p.id} • {p.category || 'Asset'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none bg-emerald-50 text-emerald-700 border border-emerald-200">
                              VERIFIED
                            </span>
                            {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#155EEF]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. CERTIFICATES */}
              {filteredCertificates.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
                    <span>Authenticity Certificates</span>
                    <span>{filteredCertificates.length}</span>
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    {filteredCertificates.map((c) => {
                      const itemIndex = flatItems.findIndex((it) => it.type === 'certificate' && (it.data as any).id === c.id);
                      const isSelected = itemIndex === selectedIndex;

                      return (
                        <button
                          key={c.id}
                          onClick={() => handleSelectItem({ type: 'certificate', data: c })}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-none text-left transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-[#EFF8FF] border-[#155EEF]/30 text-slate-950'
                              : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-none bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                              <FileCheck2 className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate leading-tight">
                                {c.productName}
                              </div>
                              <div className="text-[10.5px] text-slate-400 truncate mt-0.5 font-mono">
                                Cert #: {c.certificateNumber} • Issuer: {c.issuerName || c.brand}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none bg-amber-50 text-amber-800 border border-amber-200">
                              ISSUED
                            </span>
                            {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#155EEF]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. CUSTOMERS & CUSTODIANS */}
              {filteredCustomers.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
                    <span>Customers & Custodians</span>
                    <span>{filteredCustomers.length}</span>
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    {filteredCustomers.map((cust) => {
                      const itemIndex = flatItems.findIndex((it) => it.type === 'customer' && (it.data as any).id === cust.id);
                      const isSelected = itemIndex === selectedIndex;

                      return (
                        <button
                          key={cust.id}
                          onClick={() => handleSelectItem({ type: 'customer', data: cust })}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-none text-left transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-[#EFF8FF] border-[#155EEF]/30 text-slate-950'
                              : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-7 h-7 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate leading-tight">
                                {cust.fullName}
                              </div>
                              <div className="text-[10.5px] text-slate-400 truncate mt-0.5 font-mono">
                                {cust.email} • {cust.city || 'Global'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none bg-slate-100 text-slate-600 border border-slate-200">
                              {cust.ownedProductsCount || cust.ownedProductIds?.length || 0} Assets
                            </span>
                            {isSelected && <ArrowRight className="w-3.5 h-3.5 text-[#155EEF]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ========================================================= */}
        {/* MODAL FOOTER TELEMETRY / SHORTCUT HINTS */}
        {/* ========================================================= */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-200 px-1 py-0.2 rounded-none font-bold text-slate-700 shadow-2xs">↑</kbd>
              <kbd className="bg-white border border-slate-200 px-1 py-0.2 rounded-none font-bold text-slate-700 shadow-2xs">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-200 px-1.5 py-0.2 rounded-none font-bold text-slate-700 shadow-2xs">↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-200 px-1.5 py-0.2 rounded-none font-bold text-slate-700 shadow-2xs">ESC</kbd>
              <span>to exit</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            <span>VeriPass Quick Dispatch</span>
          </div>
        </div>

      </div>
    </div>
  );
};
