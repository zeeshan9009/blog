import React, { useState } from 'react';
import { Customer, OwnershipTransfer, CustomerTier } from '../types/models';
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
  History,
  Eye,
  Calendar,
  Tag,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

interface CustomersViewProps {
  customers: Customer[];
  products: Product[];
  onAddCustomer: (customer: Customer) => void;
  onTransferOwnership: (transfer: OwnershipTransfer) => void;
  onDeleteCustomer: (id: string) => void;
  onViewPassport?: (product: Product) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  products,
  onAddCustomer,
  onTransferOwnership,
  onDeleteCustomer,
  onViewPassport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | CustomerTier>('all');
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  
  // Selected Customer for Details Modal / Drawer
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add Customer Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [city, setCity] = useState('Lahore');
  const [tier, setTier] = useState<CustomerTier>('Verified Buyer');
  const [initialProductId, setInitialProductId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Ownership Transfer Form States
  const [transferProductId, setTransferProductId] = useState('');
  const [fromCustomerId, setFromCustomerId] = useState('');
  const [toRecipientMode, setToRecipientMode] = useState<'existing' | 'new'>('existing');
  const [toExistingCustomerId, setToExistingCustomerId] = useState('');
  const [toCustomerName, setToCustomerName] = useState('');
  const [toCustomerEmail, setToCustomerEmail] = useState('');
  const [toCustomerPhone, setToCustomerPhone] = useState('');
  const [toCustomerCity, setToCustomerCity] = useState('Karachi');
  const [toCustomerCountry, setToCustomerCountry] = useState('Pakistan');
  const [transferNotes, setTransferNotes] = useState('Secondary market resale - genuine verification transferred.');

  // Open Transfer modal pre-configured for a specific product & customer
  const handleOpenTransferModal = (customerId?: string, productId?: string) => {
    if (customerId) setFromCustomerId(customerId);
    else if (customers.length > 0) setFromCustomerId(customers[0].id);

    if (productId) {
      setTransferProductId(productId);
    } else if (products.length > 0) {
      setTransferProductId(products[0].id);
    }

    if (customers.length > 1) {
      const otherCust = customers.find((c) => c.id !== customerId);
      if (otherCust) setToExistingCustomerId(otherCust.id);
    }

    setIsTransferring(true);
  };

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
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      country: country.trim() || 'Pakistan',
      city: city.trim() || 'Lahore',
      tier: tier,
      registeredDate: new Date().toISOString().split('T')[0],
      ownedProductsCount: initialProductId ? 1 : 0,
      ownedProductIds: initialProductId ? [initialProductId] : [],
      status: 'verified'
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
    if (!transferProductId) {
      setFormError('Please select a product to transfer.');
      return;
    }

    const prod = products.find((p) => p.id === transferProductId);
    const fromCust = customers.find((c) => c.id === fromCustomerId);

    let finalToId = '';
    let finalToName = '';
    let finalToEmail = '';

    if (toRecipientMode === 'existing') {
      const targetExisting = customers.find((c) => c.id === toExistingCustomerId);
      if (!targetExisting) {
        setFormError('Please select a valid recipient customer from the directory.');
        return;
      }
      finalToId = targetExisting.id;
      finalToName = targetExisting.fullName;
      finalToEmail = targetExisting.email;
    } else {
      if (!toCustomerName.trim() || !toCustomerEmail.trim()) {
        setFormError('New recipient name and email are required.');
        return;
      }
      finalToId = `CUST-${Math.floor(10000 + Math.random() * 90000)}`;
      finalToName = toCustomerName.trim();
      finalToEmail = toCustomerEmail.trim().toLowerCase();
    }

    if (fromCustomerId === finalToId) {
      setFormError('Current owner and recipient cannot be the same customer.');
      return;
    }

    const transferRecord: OwnershipTransfer = {
      id: `TX-${Date.now().toString().slice(-6)}`,
      productId: transferProductId,
      productName: prod?.name || 'Verified Product',
      serialNumber: prod?.serialNumber || 'SN-VERIFIED',
      fromCustomerId: fromCustomerId || 'BRAND-INITIAL',
      fromCustomerName: fromCust?.fullName || 'Previous Owner',
      toCustomerId: finalToId,
      toCustomerName: finalToName,
      toCustomerEmail: finalToEmail,
      transferDate: new Date().toISOString().split('T')[0],
      status: 'completed',
      notes: transferNotes.trim()
    };

    onTransferOwnership(transferRecord);
    setIsTransferring(false);
    setSelectedCustomer(null);
    setFormError(null);
    setToCustomerName('');
    setToCustomerEmail('');
  };

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Dynamic Metrics
  const totalCustomers = customers.length;
  const verifiedCount = customers.filter((c) => c.status === 'verified' || c.status === 'active').length;
  const totalAssetsOwned = customers.reduce((sum, c) => sum + (c.ownedProductsCount || 0), 0);

  // Helper to find all products owned by a specific customer
  const getCustomerOwnedProducts = (customer: Customer): Product[] => {
    return products.filter((p) => {
      // Check if product has currentOwnerId or if customer.ownedProductIds contains product.id
      return (
        p.currentOwnerId === customer.id ||
        (customer.ownedProductIds && customer.ownedProductIds.includes(p.id)) ||
        (p.currentOwnerEmail && p.currentOwnerEmail.toLowerCase() === customer.email.toLowerCase())
      );
    });
  };

  // Export CSV Handler
  const exportCsv = () => {
    const headers = ['Customer ID,Full Name,Email,Phone,City,Country,Tier,Owned Products Count,Status,Joined Date\n'];
    const rows = filteredCustomers.map((c) =>
      `"${c.id}","${c.fullName}","${c.email}","${c.phone || ''}","${c.city}","${c.country}","${c.tier || 'Verified Buyer'}",${c.ownedProductsCount || 0},"${c.status}","${c.registeredDate}"\n`
    );
    const blob = new Blob([headers.join('') + rows.join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VeriPass_Customer_Directory_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER BANNER */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-none">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1">
            <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-none" />
            <span>OWNERSHIP & CLIENT DIRECTORY</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Customer Directory & Asset Ownership
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Maintain verified product buyers, track owned assets, and execute official secondary market ownership transfers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer rounded-none"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Directory</span>
          </button>

          <button
            onClick={() => handleOpenTransferModal()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer rounded-none shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#53B1FD]" />
            <span>Transfer Ownership</span>
          </button>

          <button
            onClick={() => setIsAddingCustomer(true)}
            className="px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer rounded-none shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Customer</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. STATS KPI DECK */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 shadow-xs rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Total Clients</span>
            <Users className="w-4 h-4 text-[#155EEF]" />
          </div>
          <div className="text-2xl font-black text-slate-950 tracking-tight mt-1">{totalCustomers}</div>
          <div className="text-[10.5px] text-emerald-700 font-semibold mt-1">✓ {verifiedCount} Verified Clients</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 shadow-xs rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Assigned Owned Assets</span>
            <Box className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-950 tracking-tight mt-1">{totalAssetsOwned}</div>
          <div className="text-[10.5px] text-slate-400 mt-1">Bound to customer passports</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 shadow-xs rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase font-mono">Ownership Transfers</span>
            <RefreshCw className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-950 tracking-tight mt-1">
            {products.filter((p) => p.ownershipHistory && p.ownershipHistory.length > 0).length}
          </div>
          <div className="text-[10.5px] text-indigo-700 font-semibold mt-1">Secondary market ledger active</div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FILTER & SEARCH TOOLBAR */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 rounded-none">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, ID or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-[#155EEF] rounded-none"
          />
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Tier:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs px-3 py-2 text-slate-800 focus:outline-none focus:border-[#155EEF] rounded-none cursor-pointer"
          >
            <option value="all">All Customer Tiers</option>
            <option value="Verified Buyer">Verified Buyer</option>
            <option value="VIP Collector">VIP Collector</option>
            <option value="Institutional">Institutional</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. CUSTOMER DIRECTORY TABLE */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-none overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No customers registered</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Register verified clients to bind product ownership and manage transfers.
            </p>
            <button
              onClick={() => setIsAddingCustomer(true)}
              className="mt-4 px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white text-xs font-bold rounded-none cursor-pointer"
            >
              + Register First Customer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Customer ID & Name</th>
                  <th className="py-3 px-4 font-semibold">Email & Phone</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Owned Assets</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredCustomers.map((cust) => {
                  const ownedItems = getCustomerOwnedProducts(cust);
                  const displayCount = Math.max(cust.ownedProductsCount || 0, ownedItems.length);

                  return (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-[#155EEF] transition-colors flex items-center gap-1.5">
                          <span>{cust.fullName}</span>
                          {cust.tier && cust.tier !== 'Standard' && (
                            <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-1 py-0.2 rounded-none">
                              {cust.tier}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">{cust.id}</div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <div className="text-slate-700">{cust.email}</div>
                        {cust.phone && (
                          <div className="text-[10.5px] text-slate-400 font-mono">{cust.phone}</div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{cust.city}</div>
                        <div className="text-[10.5px] text-slate-400">{cust.country}</div>
                      </td>

                      {/* Owned Assets */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#155EEF] bg-[#EFF8FF] border border-blue-200 px-2 py-0.5 rounded-none">
                          <Box className="w-3 h-3" />
                          <span>{displayCount} Owned {displayCount === 1 ? 'Product' : 'Products'}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none">
                          <span>✓</span> Verified Customer
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] rounded-none border border-slate-200 cursor-pointer"
                          >
                            View Assets
                          </button>
                          <button
                            onClick={() => handleOpenTransferModal(cust.id)}
                            className="p-1 text-slate-400 hover:text-[#155EEF] hover:bg-blue-50 rounded-none cursor-pointer"
                            title="Transfer Ownership"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCustomer(cust.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-none cursor-pointer"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 5. CUSTOMER DETAIL MODAL & OWNED ASSETS VIEWER */}
      {/* ========================================================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] text-left rounded-none">
            
            {/* Modal Header */}
            <div className="bg-slate-950 text-white p-5 flex items-start justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-white">{selectedCustomer.fullName}</h2>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2">
                    ✓ VERIFIED BUYER
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  ID: <span className="text-white font-bold">{selectedCustomer.id}</span> • Joined {selectedCustomer.registeredDate}
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details Content */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              
              {/* Contact Information Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 text-left">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Email Address</div>
                  <div className="font-bold text-slate-900 truncate mt-0.5">{selectedCustomer.email}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Phone Number</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedCustomer.phone || 'Not Specified'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">City / Country</div>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedCustomer.city}, {selectedCustomer.country}</div>
                </div>
              </div>

              {/* OWNED ASSETS SECTION */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                      Owned Product Assets ({getCustomerOwnedProducts(selectedCustomer).length})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Serialized units currently bound to this customer's cryptographic passport
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const owned = getCustomerOwnedProducts(selectedCustomer);
                      handleOpenTransferModal(selectedCustomer.id, owned[0]?.id);
                    }}
                    className="px-3 py-1.5 bg-[#155EEF] hover:bg-[#124bbf] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer rounded-none"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Transfer An Asset</span>
                  </button>
                </div>

                {getCustomerOwnedProducts(selectedCustomer).length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200">
                    <Box className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No active products bound yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Transfer or assign a product passport to this customer to track ownership.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {getCustomerOwnedProducts(selectedCustomer).map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3.5 bg-white border border-slate-200 hover:border-[#155EEF] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{prod.name}</span>
                            <span className="text-[9.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2">
                              ✓ VERIFIED
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            Serial: <strong className="text-slate-800">{prod.serialNumber}</strong> • SKU: {prod.sku}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Category: {prod.category} • Brand: {prod.brand} • Warranty: <span className="text-emerald-600 font-semibold">Active</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {onViewPassport && (
                            <button
                              onClick={() => {
                                onViewPassport(prod);
                                setSelectedCustomer(null);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer rounded-none border border-slate-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Passport</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              handleOpenTransferModal(selectedCustomer.id, prod.id);
                            }}
                            className="px-2.5 py-1.5 bg-[#155EEF] hover:bg-[#124bbf] text-white text-xs font-bold flex items-center gap-1 cursor-pointer rounded-none shadow-2xs"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Transfer</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-3.5 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold cursor-pointer rounded-none"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ADD CUSTOMER MODAL */}
      {/* ========================================================= */}
      {isAddingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-left rounded-none">
            
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-base font-black text-white">Register Verified Customer</h2>
              <button onClick={() => setIsAddingCustomer(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ahmed Khan"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmed@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bind Initial Product (Optional)</label>
                <select
                  value={initialProductId}
                  onChange={(e) => setInitialProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-[#155EEF] focus:outline-none rounded-none"
                >
                  <option value="">-- No initial product (Register empty profile) --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} [Serial: {p.serialNumber}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomer(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold rounded-none cursor-pointer shadow-xs"
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. OWNERSHIP TRANSFER MODAL (HIGH-PRECISION WORKFLOW) */}
      {/* ========================================================= */}
      {isTransferring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-left rounded-none">
            
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#53B1FD]" />
                <h2 className="text-base font-black text-white">Execute Ownership Transfer</h2>
              </div>
              <button onClick={() => setIsTransferring(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Step 1: Select Current Owner */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase font-mono mb-1">
                  1. Current Owner
                </label>
                <select
                  value={fromCustomerId}
                  onChange={(e) => setFromCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#155EEF] rounded-none"
                >
                  <option value="">-- Direct Brand / Initial Vault --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id}) — {c.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Product Asset */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase font-mono mb-1">
                  2. Select Product to Transfer
                </label>
                <select
                  required
                  value={transferProductId}
                  onChange={(e) => setTransferProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#155EEF] rounded-none"
                >
                  <option value="">-- Choose Product Asset --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} [Serial: {p.serialNumber}] (ID: {p.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: New Recipient Selection */}
              <div className="p-3 bg-blue-50/50 border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-[#155EEF] uppercase font-mono">
                    3. New Recipient / Buyer
                  </label>

                  <div className="flex items-center gap-1 text-[10px] font-semibold bg-white p-0.5 border border-blue-200">
                    <button
                      type="button"
                      onClick={() => setToRecipientMode('existing')}
                      className={`px-2 py-0.5 cursor-pointer ${
                        toRecipientMode === 'existing' ? 'bg-[#155EEF] text-white font-bold' : 'text-slate-600'
                      }`}
                    >
                      Existing Client
                    </button>
                    <button
                      type="button"
                      onClick={() => setToRecipientMode('new')}
                      className={`px-2 py-0.5 cursor-pointer ${
                        toRecipientMode === 'new' ? 'bg-[#155EEF] text-white font-bold' : 'text-slate-600'
                      }`}
                    >
                      New Client
                    </button>
                  </div>
                </div>

                {toRecipientMode === 'existing' ? (
                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">Select Existing Customer:</label>
                    <select
                      value={toExistingCustomerId}
                      onChange={(e) => setToExistingCustomerId(e.target.value)}
                      className="w-full bg-white border border-blue-300 px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#155EEF] rounded-none shadow-2xs"
                    >
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} ({c.email}) - {c.city}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">Recipient Full Name *</label>
                      <input
                        type="text"
                        required
                        value={toCustomerName}
                        onChange={(e) => setToCustomerName(e.target.value)}
                        placeholder="e.g. Tariq Mahmood"
                        className="w-full bg-white border border-blue-300 px-3 py-1.5 text-xs text-slate-900 focus:outline-none rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">Recipient Email *</label>
                      <input
                        type="email"
                        required
                        value={toCustomerEmail}
                        onChange={(e) => setToCustomerEmail(e.target.value)}
                        placeholder="tariq@domain.com"
                        className="w-full bg-white border border-blue-300 px-3 py-1.5 text-xs text-slate-900 focus:outline-none rounded-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Notes / Reason */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Transfer Notes / Reason</label>
                <input
                  type="text"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none rounded-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferring(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold rounded-none cursor-pointer shadow-xs"
                >
                  Confirm & Update Ownership
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
