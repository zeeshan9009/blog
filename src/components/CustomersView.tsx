import React, { useState } from 'react';
import { Customer, OwnershipTransfer } from '../types/models';
import { Product } from '../types/product';
import {
  Users,
  UserCheck,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Box,
  RefreshCw,
  Award,
  Crown,
  Trash2,
  ArrowLeft,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ExternalLink,
  History
} from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  products: Product[];
  onAddCustomer: (customer: Customer) => void;
  onTransferOwnership: (transfer: OwnershipTransfer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  products,
  onAddCustomer,
  onTransferOwnership,
  onDeleteCustomer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'VIP Collector' | 'Verified Buyer' | 'Standard' | 'Institutional'>('all');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add Customer Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [city, setCity] = useState('Dubai');
  const [tier, setTier] = useState<'Standard' | 'VIP Collector' | 'Institutional' | 'Verified Buyer'>('VIP Collector');
  const [initialProductId, setInitialProductId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Ownership Transfer Form States
  const [transferProductId, setTransferProductId] = useState(products[0]?.id || '');
  const [fromCustomerId, setFromCustomerId] = useState(customers[0]?.id || '');
  const [toCustomerName, setToCustomerName] = useState('');
  const [toCustomerEmail, setToCustomerEmail] = useState('');
  const [transferNotes, setTransferNotes] = useState('');

  // Handle Add Customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setFormError('Name and Email are required.');
      return;
    }

    const newCustId = `CUST-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCustomer: Customer = {
      id: newCustId,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || '+971 50 123 4567',
      country: country.trim() || 'Global',
      city: city.trim() || 'Capital',
      tier: tier,
      registeredDate: new Date().toISOString().split('T')[0],
      ownedProductsCount: initialProductId ? 1 : 0,
      ownedProductIds: initialProductId ? [initialProductId] : [],
      totalScans: 0,
      status: 'active',
      walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
    };

    onAddCustomer(newCustomer);
    setIsAddingCustomer(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setInitialProductId('');
    setFormError(null);
  };

  // Handle Ownership Transfer
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toCustomerName.trim() || !toCustomerEmail.trim()) {
      setFormError('New recipient name and email are required.');
      return;
    }

    const prod = products.find((p) => p.id === transferProductId);
    const fromCust = customers.find((c) => c.id === fromCustomerId);

    const transferRecord: OwnershipTransfer = {
      id: `TX-${Date.now()}`,
      productId: transferProductId,
      productName: prod?.name || 'Luxury Asset',
      fromCustomerId: fromCustomerId,
      fromCustomerName: fromCust?.fullName || 'Previous Owner',
      toCustomerId: `CUST-TRANSFERRED-${Math.floor(1000 + Math.random() * 9000)}`,
      toCustomerName: toCustomerName.trim(),
      transferDate: new Date().toISOString().split('T')[0],
      txHash: `0x${Math.random().toString(16).slice(2, 18)}${Math.random().toString(16).slice(2, 18)}`,
      status: 'completed'
    };

    onTransferOwnership(transferRecord);
    setIsTransferring(false);
    setToCustomerName('');
    setToCustomerEmail('');
  };

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Dynamic Metrics
  const totalCustomers = customers.length;
  const vipCount = customers.filter((c) => c.tier === 'VIP Collector' || c.tier === 'Institutional').length;
  const totalAssetsOwned = customers.reduce((sum, c) => sum + (c.ownedProductsCount || 0), 0);

  // Export CSV Handler
  const exportCsv = () => {
    const headers = ['Customer ID,Full Name,Email,Phone,Country,City,Tier,Owned Assets,Registered Date\n'];
    const rows = filteredCustomers.map((c) =>
      `"${c.id}","${c.fullName}","${c.email}","${c.phone || ''}","${c.country}","${c.city}","${c.tier}",${c.ownedProductsCount},"${c.registeredDate}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VeriPass-Customers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // FULL PAGE: Add Customer Form
  if (isAddingCustomer) {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        <div className="bg-white border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingCustomer(false)}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400">
                <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
                <span>CUSTOMER & OWNER REGISTRY</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Register New Asset Owner / Customer
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddingCustomer(false)}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCustomer}
              className="px-5 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <UserCheck className="w-4 h-4" />
              <span>Save Customer Profile</span>
            </button>
          </div>
        </div>

        {/* Customer Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 text-xs text-slate-800">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-medium">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div className="font-bold text-slate-900 text-xs uppercase font-mono border-b border-slate-100 pb-2">
                1. Personal & Contact Credentials
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander von Rosenberg"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alexander@rosenberg-estates.ch"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+41 22 819 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Country of Residence</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="font-bold text-slate-900 text-xs uppercase font-mono border-b border-slate-100 pb-2">
                2. Membership Tier & Initial Asset Assignment
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Customer Classification</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as any)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="VIP Collector">👑 VIP Luxury Collector</option>
                    <option value="Verified Buyer">✓ Verified Buyer</option>
                    <option value="Institutional">🏛️ Institutional / Gallery</option>
                    <option value="Standard">👤 Standard Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Assign Registered Product (Optional)</label>
                  <select
                    value={initialProductId}
                    onChange={(e) => setInitialProductId(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">No asset assigned yet</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddingCustomer(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomer}
                className="px-5 py-2.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>Register Customer</span>
              </button>
            </div>

          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 p-6 shadow-xs text-left space-y-4">
            <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#155EEF]" />
              <span>Decentralized Identity (DID)</span>
            </div>
            <p className="text-[11.5px] text-slate-500 leading-relaxed">
              Every customer profile is provisioned with a cryptographic wallet identity enabling peer-to-peer provenance transfer and ownership validation.
            </p>
          </div>
        </div>

      </div>
    );
  }

  // FULL PAGE: Ownership Transfer Form
  if (isTransferring) {
    return (
      <div className="space-y-6 text-left animate-fade-in">
        <div className="bg-white border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTransferring(false)}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400">
                <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
                <span>SECONDARY MARKET OWNERSHIP PROTOCOL</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Initiate Cryptographic Ownership Transfer
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsTransferring(false)}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteTransfer}
              className="px-5 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Execute Transfer & Anchor Ledger</span>
            </button>
          </div>
        </div>

        {/* Transfer Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5 text-xs text-slate-800">
            
            <div className="space-y-4">
              <div className="font-bold text-slate-900 text-xs uppercase font-mono border-b border-slate-100 pb-2">
                1. Select Asset & Current Custodian
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Select Product Passport <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={transferProductId}
                    onChange={(e) => setTransferProductId(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Current Registered Owner
                  </label>
                  <select
                    value={fromCustomerId}
                    onChange={(e) => setFromCustomerId(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="font-bold text-slate-900 text-xs uppercase font-mono border-b border-slate-100 pb-2">
                2. New Recipient / Buyer Credentials
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    New Buyer / Custodian Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Duke Henry of Lancaster"
                    value={toCustomerName}
                    onChange={(e) => setToCustomerName(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    New Buyer Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. buyer@privatemail.co.uk"
                    value={toCustomerEmail}
                    onChange={(e) => setToCustomerEmail(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Transfer Reason / Transaction Memo
                </label>
                <textarea
                  rows={2}
                  placeholder="Secondary market sale via authorized luxury auction house."
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsTransferring(false)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-5 py-2.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Confirm Ownership Transfer</span>
              </button>
            </div>

          </div>

          <div className="lg:col-span-4 bg-slate-900 text-white p-6 shadow-xl text-left space-y-3 font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-400 font-bold">SMART CONTRACT ESCROW</span>
              <span className="text-emerald-400">INSTANT</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Upon confirmation, the previous owner's private certificate is marked as Transferred, and a fresh cryptographic ownership passport is anchored for the new recipient.
            </p>
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
            <span>CUSTOMER & OWNERSHIP REGISTRY</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Customer Directory & Asset Custodians
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Track verified product owners, high-net-worth luxury collectors, warranty registrations, and secondary ownership transfers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTransferring(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#155EEF]" />
            <span>Transfer Ownership</span>
          </button>

          <button
            onClick={() => setIsAddingCustomer(true)}
            className="px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Customer</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Total Registered Owners</div>
          <div className="text-2xl font-black text-slate-950 mt-1">{totalCustomers}</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">Verified KYC Identity</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">VIP Luxury Collectors</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{vipCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">High-value clientele</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Total Assets Under Custody</div>
          <div className="text-2xl font-black text-[#155EEF] mt-1">{totalAssetsOwned}</div>
          <div className="text-[10px] text-slate-400 mt-1">Active cryptographic passes</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Customer Trust Score</div>
          <div className="text-2xl font-black text-slate-950 mt-1">99.8%</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">Zero counterfeit disputes</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, country, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#155EEF] text-xs pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 text-slate-700 focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">All Tiers</option>
            <option value="VIP Collector">VIP Collector</option>
            <option value="Verified Buyer">Verified Buyer</option>
            <option value="Institutional">Institutional</option>
            <option value="Standard">Standard</option>
          </select>

          <button
            onClick={exportCsv}
            disabled={filteredCustomers.length === 0}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            Total: <strong className="text-slate-900">{filteredCustomers.length}</strong>
          </span>
        </div>
      </div>

      {/* Customers Table / Empty State */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF] mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No customers or asset owners registered</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Register your buyers to establish direct warranty links, VIP authentication, and peer-to-peer ownership verification.
          </p>
          <button
            onClick={() => setIsAddingCustomer(true)}
            className="mt-4 px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register First Customer</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Customer / Owner</th>
                <th className="py-3 px-3 font-semibold">Contact & Location</th>
                <th className="py-3 px-3 font-semibold">Classification</th>
                <th className="py-3 px-3 font-semibold">Assets Owned</th>
                <th className="py-3 px-3 font-semibold">Registered Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Name & ID */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{cust.fullName}</span>
                      {cust.tier === 'VIP Collector' && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{cust.id}</div>
                  </td>

                  {/* Email & Location */}
                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-mono text-[11px]">{cust.email}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{cust.city}, {cust.country}</span>
                    </div>
                  </td>

                  {/* Classification Tier */}
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 ${
                      cust.tier === 'VIP Collector'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : cust.tier === 'Institutional'
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : 'bg-blue-50 text-[#155EEF] border border-blue-200'
                    }`}>
                      {cust.tier}
                    </span>
                  </td>

                  {/* Assets Owned */}
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5">
                      {cust.ownedProductsCount} Assets
                    </span>
                  </td>

                  {/* Registered Date */}
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {cust.registeredDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-[#155EEF] border border-slate-200 text-slate-700 text-[10.5px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => onDeleteCustomer(cust.id)}
                        className="p-1 text-slate-300 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Customer"
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

      {/* Customer Profile Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#155EEF] flex items-center justify-center font-bold text-xs text-white">
                  {selectedCustomer.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{selectedCustomer.fullName}</h3>
                  <div className="text-[10px] font-mono text-slate-400">{selectedCustomer.id}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-800">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono text-slate-800">{selectedCustomer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-slate-800">{selectedCustomer.city}, {selectedCustomer.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Membership Tier:</span>
                  <span className="font-bold text-amber-600">{selectedCustomer.tier}</span>
                </div>
              </div>

              <div>
                <div className="font-bold text-slate-900 uppercase font-mono text-[10px] mb-2">
                  Cryptographic Wallet & DID
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 font-mono text-[10.5px] text-slate-700 truncate">
                  {selectedCustomer.walletAddress || '0x4892c948924b2910482938a109849204'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
