import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Wrench, 
  AlertCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  ChevronRight, 
  Plus, 
  FileText, 
  Eye, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Warranty, WarrantyClaim, ClaimStatus } from '../types/models';

interface WarrantyViewProps {
  onInspectProduct?: (productId: string) => void;
}

export const WarrantyView: React.FC<WarrantyViewProps> = ({ onInspectProduct }) => {
  const [activeTab, setActiveTab] = useState<'claims' | 'warranties' | 'policies'>('claims');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Data state
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<WarrantyClaim | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignedTech, setAssignedTech] = useState('Marc Delacroix (Senior Tech)');

  useEffect(() => {
    // Load initial claims and warranties from localStorage or initialize with rich realistic data
    const loadData = () => {
      try {
        const savedW = localStorage.getItem('veripass_warranties');
        if (savedW) {
          setWarranties(JSON.parse(savedW));
        } else {
          const defaultWarranties: Warranty[] = [
            {
              id: 'WAR-VP-HR-001',
              productId: 'VP-HR-AC-000001',
              productName: 'Haier Thunder Inverter 1.5 Ton T3 AC',
              brand: 'Haier Pakistan',
              serialNumber: 'HR-AC-HSU-18HNS-000001',
              customerId: 'CUST-001',
              customerName: 'Muhammad Bilal Khan',
              customerEmail: 'bilal.khan@example.pk',
              customerPhone: '+92 300 8472910',
              purchaseDate: '2026-03-01',
              startDate: '2026-03-01',
              endDate: '2028-03-01',
              durationMonths: 24,
              status: 'active',
              warrantyType: 'Standard Factory',
              dealerName: 'Haier Official Store - Gulberg Lahore',
              invoiceNumber: 'INV-HR-2026-8819',
              claimCount: 0
            },
            {
              id: 'WAR-VP-DIA-002',
              productId: 'VP-2026-8F4K29',
              productName: 'Solitaire 18K White Gold Diamond Ring',
              brand: 'VeriPass Horology & Jewelry',
              serialNumber: 'SN-DIA-99214-X81',
              customerId: 'CUST-002',
              customerName: 'Sophia Al-Mansoor',
              customerEmail: 'sophia.m@example.com',
              customerPhone: '+971 50 1234567',
              purchaseDate: '2026-02-14',
              startDate: '2026-02-14',
              endDate: '2036-02-14',
              durationMonths: 120,
              status: 'active',
              warrantyType: 'Lifetime Authenticity',
              dealerName: 'Geneva Haute Horlogerie Flagship',
              invoiceNumber: 'INV-GEN-2026-014',
              claimCount: 1
            },
            {
              id: 'WAR-VP-DW-003',
              productId: 'VP-DW-REF-000412',
              productName: 'Dawlance Chrome Glass Refrigerator 9199',
              brand: 'Dawlance Pakistan',
              serialNumber: 'DW-REF-9199-000412',
              customerId: 'CUST-003',
              customerName: 'Tariq Mehmood',
              customerEmail: 'tariq.m@example.pk',
              purchaseDate: '2025-01-10',
              startDate: '2025-01-10',
              endDate: '2026-01-10',
              durationMonths: 12,
              status: 'expired',
              warrantyType: 'Standard Factory',
              dealerName: 'Dawlance Flagship Saddar Karachi',
              claimCount: 0
            }
          ];
          setWarranties(defaultWarranties);
          localStorage.setItem('veripass_warranties', JSON.stringify(defaultWarranties));
        }

        const savedC = localStorage.getItem('veripass_warranty_claims');
        if (savedC) {
          setClaims(JSON.parse(savedC));
        } else {
          const defaultClaims: WarrantyClaim[] = [
            {
              id: 'CLM-2026-091',
              warrantyId: 'WAR-VP-DIA-002',
              productId: 'VP-2026-8F4K29',
              productName: 'Solitaire 18K White Gold Diamond Ring',
              serialNumber: 'SN-DIA-99214-X81',
              customerName: 'Sophia Al-Mansoor',
              customerEmail: 'sophia.m@example.com',
              customerPhone: '+971 50 1234567',
              issueCategory: 'Cosmetic Damage',
              issueDescription: 'Claw tension slight play observed after 6 months; requesting ultrasonic polish and micro-prong calibration.',
              claimDate: '2026-09-02',
              status: 'under_review',
              assignedTechnician: 'Marc Delacroix (Senior Tech)'
            },
            {
              id: 'CLM-2026-088',
              warrantyId: 'WAR-VP-HR-001',
              productId: 'VP-HR-AC-000001',
              productName: 'Haier Thunder Inverter 1.5 Ton T3 AC',
              serialNumber: 'HR-AC-HSU-18HNS-000001',
              customerName: 'Muhammad Bilal Khan',
              customerEmail: 'bilal.khan@example.pk',
              customerPhone: '+92 300 8472910',
              issueCategory: 'Electronic Malfunction',
              issueDescription: 'E7 communication error displayed on outdoor PCB unit following heavy thunderstorm.',
              claimDate: '2026-09-08',
              status: 'pending'
            }
          ];
          setClaims(defaultClaims);
          localStorage.setItem('veripass_warranty_claims', JSON.stringify(defaultClaims));
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadData();
  }, []);

  const handleUpdateClaimStatus = (claimId: string, newStatus: ClaimStatus) => {
    const updated = claims.map((c) => {
      if (c.id === claimId) {
        return {
          ...c,
          status: newStatus,
          resolutionNotes: resolutionNotes || c.resolutionNotes,
          resolvedDate: newStatus === 'resolved' || newStatus === 'approved' ? new Date().toISOString().split('T')[0] : c.resolvedDate,
          assignedTechnician: assignedTech || c.assignedTechnician
        };
      }
      return c;
    });

    setClaims(updated);
    localStorage.setItem('veripass_warranty_claims', JSON.stringify(updated));
    setSelectedClaim(null);
    setResolutionNotes('');
  };

  // Metrics
  const activeCount = warranties.filter((w) => w.status === 'active').length;
  const pendingClaimsCount = claims.filter((c) => c.status === 'pending' || c.status === 'under_review').length;
  const totalClaimsCount = claims.length;

  const filteredClaims = claims.filter((c) => {
    const matchesSearch = c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Warranty & Service Claims Center
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#155EEF] font-mono text-[10px] font-bold uppercase">
              Automated SLA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage manufacturer warranty durations, customer registration bonds, and process RMA / repair tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('claims')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer border ${
              activeTab === 'claims' 
                ? 'bg-[#155EEF] text-white border-[#155EEF]' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Claims Inbox ({pendingClaimsCount})
          </button>
          <button 
            onClick={() => setActiveTab('warranties')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer border ${
              activeTab === 'warranties' 
                ? 'bg-[#155EEF] text-white border-[#155EEF]' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Active Warranties
          </button>
          <button 
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer border ${
              activeTab === 'policies' 
                ? 'bg-[#155EEF] text-white border-[#155EEF]' 
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Tier Policies
          </button>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs uppercase font-mono font-medium">
            <span>Active Coverages</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% Guaranteed Protocol</span>
        </div>

        <div className="bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs uppercase font-mono font-medium">
            <span>Pending Claims</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{pendingClaimsCount}</div>
          <span className="text-[11px] text-amber-600 font-semibold">Action required within 24h</span>
        </div>

        <div className="bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs uppercase font-mono font-medium">
            <span>Total Claims Handled</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalClaimsCount}</div>
          <span className="text-[11px] text-slate-500">Avg resolution: 1.8 days</span>
        </div>

        <div className="bg-white p-4 border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs uppercase font-mono font-medium">
            <span>Protection Ratio</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">99.4%</div>
          <span className="text-[11px] text-purple-600 font-semibold">Zero Counterfeit Breaches</span>
        </div>
      </div>

      {/* 3. CLAIMS TAB */}
      {activeTab === 'claims' && (
        <div className="bg-white border border-slate-200 shadow-xs space-y-4">
          
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-3 bg-slate-50">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by customer, claim ID, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#155EEF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 px-3 py-2 text-xs text-slate-700 font-mono focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Claim Ticket</th>
                  <th className="py-3 px-4">Product / Serial</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No warranty claims found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {claim.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{claim.productName}</div>
                        <div className="font-mono text-[11px] text-slate-400">{claim.serialNumber}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{claim.customerName}</div>
                        <div className="text-[11px] text-slate-500">{claim.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px]">
                          {claim.issueCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {claim.claimDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                          claim.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : claim.status === 'under_review' 
                            ? 'bg-blue-100 text-blue-800'
                            : claim.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {claim.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedClaim(claim);
                            setResolutionNotes(claim.resolutionNotes || '');
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-[#155EEF] text-white font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 4. ACTIVE WARRANTIES TAB */}
      {activeTab === 'warranties' && (
        <div className="bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Registered Manufacturer Warranties</h3>
            <span className="font-mono text-xs text-slate-500">{warranties.length} Products Bound</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Warranty ID</th>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Registered Owner</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {warranties.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-[#155EEF]">{w.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{w.productName}</div>
                      <div className="font-mono text-[11px] text-slate-400">{w.serialNumber} • {w.brand}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{w.customerName}</div>
                      <div className="text-[11px] text-slate-500">{w.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {w.durationMonths} Months ({w.warrantyType})
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{w.endDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                        w.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. POLICIES TAB */}
      {activeTab === 'policies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 space-y-3">
            <span className="text-[10px] font-mono text-blue-600 font-bold uppercase bg-blue-50 px-2 py-0.5 border border-blue-200">
              Electronics Tier
            </span>
            <h4 className="font-bold text-base text-slate-900">24-Month Standard Inverter & PCB Protection</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Covers compressor replacement, PCB electronic failure, gas leakages, and certified technician dispatch with zero customer deductibles.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs font-mono text-slate-700">
              SLA Resolution: &lt; 48 Hours
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 space-y-3">
            <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              Fine Jewelry & Luxury
            </span>
            <h4 className="font-bold text-base text-slate-900">10-Year Master Authenticity & Prong Shield</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lifetime conflict-free diamond guarantee, complimentary annual ultrasonic steam polishing, claw re-tipping, and laser inscription verification.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs font-mono text-slate-700">
              SLA Resolution: Express 24h
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 space-y-3">
            <span className="text-[10px] font-mono text-purple-600 font-bold uppercase bg-purple-50 px-2 py-0.5 border border-purple-200">
              Enterprise Custom
            </span>
            <h4 className="font-bold text-base text-slate-900">Commercial Heavy-Duty Warranty SLA</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Designed for B2B fleet equipment and industrial manufacturing appliances with on-premise inspection logs and spare-parts inventory binding.
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs font-mono text-slate-700">
              SLA Resolution: Same-Day Critical
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: CLAIM REVIEW */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-300 max-w-lg w-full p-6 text-left space-y-5 shadow-2xl rounded-none">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#155EEF] font-bold">{selectedClaim.id}</span>
                <h3 className="text-base font-black text-slate-900">Review Warranty Claim</h3>
              </div>
              <button 
                onClick={() => setSelectedClaim(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Product:</span>
                <span className="font-bold text-slate-900">{selectedClaim.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Serial Number:</span>
                <span className="font-mono text-slate-900">{selectedClaim.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="text-slate-900 font-medium">{selectedClaim.customerName} ({selectedClaim.customerPhone})</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">Issue Description:</span>
                <p className="text-slate-800 bg-white p-2 border border-slate-200 leading-relaxed italic">
                  "{selectedClaim.issueDescription}"
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Assign Certified Technician / Service Center</label>
                <input
                  type="text"
                  value={assignedTech}
                  onChange={(e) => setAssignedTech(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Resolution & Authorization Notes</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Enter RMA dispatch notes, approved replacement parts, or instructions..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-[#155EEF] resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap justify-end gap-2 text-xs">
              <button
                onClick={() => handleUpdateClaimStatus(selectedClaim.id, 'rejected')}
                className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-bold uppercase cursor-pointer"
              >
                Reject Claim
              </button>
              <button
                onClick={() => handleUpdateClaimStatus(selectedClaim.id, 'under_review')}
                className="px-3 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 font-bold uppercase cursor-pointer"
              >
                Mark Under Review
              </button>
              <button
                onClick={() => handleUpdateClaimStatus(selectedClaim.id, 'approved')}
                className="px-4 py-2 bg-[#155EEF] hover:bg-blue-700 text-white font-bold uppercase cursor-pointer"
              >
                Approve & Dispatch RMA
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
