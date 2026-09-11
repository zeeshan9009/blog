import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink, 
  ShieldX, 
  Radio, 
  Clock, 
  FileWarning, 
  Send,
  Flag
} from 'lucide-react';
import { FraudReport, IncidentStatus } from '../types/models';

interface FraudIncidentsViewProps {
  onTriggerRecall?: (serialNumber: string, reason: string) => void;
}

export const FraudIncidentsView: React.FC<FraudIncidentsViewProps> = ({ onTriggerRecall }) => {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<FraudReport | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    const loadReports = () => {
      try {
        const saved = localStorage.getItem('veripass_fraud_reports');
        if (saved) {
          setReports(JSON.parse(saved));
        } else {
          const defaultReports: FraudReport[] = [
            {
              id: 'FRAUD-2026-901',
              productId: 'VP-HR-AC-000001',
              productName: 'Haier Thunder Inverter 1.5 Ton T3 AC',
              serialNumber: 'HR-AC-HSU-18HNS-000001',
              reporterName: 'Kashif Riaz (Field Inspector)',
              reporterEmail: 'kashif.r@audit-agency.pk',
              reporterPhone: '+92 321 9988771',
              reason: 'duplicate_serial',
              locationCity: 'Rawalpindi Wholesale Market',
              locationCountry: 'Pakistan',
              dealerOrStoreName: 'Al-Madina Electronics Hub',
              description: 'Multiple outdoor compressor units discovered bearing identical serial stickers with blurred QR matrix.',
              reportDate: '2026-09-09',
              status: 'investigating',
              severity: 'critical'
            },
            {
              id: 'FRAUD-2026-884',
              productId: 'VP-2026-8F4K29',
              productName: 'Solitaire 18K White Gold Diamond Ring',
              serialNumber: 'SN-DIA-99214-X81',
              reporterName: 'Elena Rostova',
              reporterEmail: 'elena.rostova@example.com',
              reason: 'counterfeit_suspected',
              locationCity: 'Dubai Gold Souk',
              locationCountry: 'UAE',
              dealerOrStoreName: 'Unverified Third-Party Reseller',
              description: 'Prong hallmark indicates 14K instead of certified 18K white gold on physical inspection.',
              reportDate: '2026-09-05',
              status: 'investigating',
              severity: 'high'
            },
            {
              id: 'FRAUD-2026-742',
              productId: 'VP-DW-REF-000412',
              productName: 'Dawlance Chrome Glass Refrigerator',
              serialNumber: 'DW-REF-9199-000412',
              reporterName: 'Shoaib Ahmed',
              reporterEmail: 'shoaib.a@gmail.com',
              reason: 'tampered_seal',
              locationCity: 'Karachi Central',
              locationCountry: 'Pakistan',
              dealerOrStoreName: 'B-Grade Appliance Bazaar',
              description: 'Tamper seal was sliced open prior to customer delivery.',
              reportDate: '2026-08-28',
              status: 'resolved',
              severity: 'medium',
              adminNotes: 'Verified genuine distributor damaged in transit; replacement unit dispatched to customer.'
            }
          ];
          setReports(defaultReports);
          localStorage.setItem('veripass_fraud_reports', JSON.stringify(defaultReports));
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadReports();
  }, []);

  const handleUpdateStatus = (reportId: string, newStatus: IncidentStatus) => {
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        return {
          ...r,
          status: newStatus,
          adminNotes: adminNotes || r.adminNotes,
          investigatedDate: new Date().toISOString().split('T')[0],
          investigatedBy: 'Enterprise Security Lead'
        };
      }
      return r;
    });

    setReports(updated);
    localStorage.setItem('veripass_fraud_reports', JSON.stringify(updated));
    setSelectedReport(null);
    setAdminNotes('');
  };

  const criticalCount = reports.filter((r) => r.severity === 'critical' && r.status === 'investigating').length;
  const investigatingCount = reports.filter((r) => r.status === 'investigating').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved' || r.status === 'false_alarm').length;

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.serialNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.locationCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              Anti-Counterfeit & Fraud Incident Hub
            </h2>
            <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 font-mono text-[10px] font-bold uppercase">
              Live Threat Shield
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time anomaly detection, counterfeit reports submitted from public QR scans, and serial blacklist management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/10 border border-red-400 text-red-700 text-xs font-mono font-bold">
            <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            {criticalCount} Critical Alerts Active
          </span>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50/70 border border-red-200 p-4">
          <div className="flex justify-between items-center text-red-800 text-xs uppercase font-mono font-bold">
            <span>Critical Threat Incidents</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-900 mt-2">{criticalCount}</div>
          <span className="text-[11px] text-red-700 font-medium">Duplicate serial clones flagged</span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-4">
          <div className="flex justify-between items-center text-amber-800 text-xs uppercase font-mono font-bold">
            <span>Under Active Investigation</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">{investigatingCount}</div>
          <span className="text-[11px] text-amber-700 font-medium">Field auditors assigned</span>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 p-4">
          <div className="flex justify-between items-center text-emerald-800 text-xs uppercase font-mono font-bold">
            <span>Resolved / Neutralized</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">{resolvedCount}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Legal notices & recall actions completed</span>
        </div>
      </div>

      {/* 3. INCIDENTS TABLE */}
      <div className="bg-white border border-slate-200 shadow-xs space-y-4">
        
        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-3 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by serial, location, product, or report ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 px-3 py-2 text-xs text-slate-700 font-mono focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="investigating">Investigating</option>
              <option value="confirmed_counterfeit">Confirmed Counterfeit</option>
              <option value="false_alarm">False Alarm</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Flagged Product / Serial</th>
                <th className="py-3 px-4">Reported Reason</th>
                <th className="py-3 px-4">Location & Seller</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No fraud incidents found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {report.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{report.productName}</div>
                      <div className="font-mono text-[11px] text-red-600 font-semibold">{report.serialNumber || 'Unserialized'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] uppercase font-bold">
                        {report.reason.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{report.locationCity}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{report.dealerOrStoreName || 'Unregistered Seller'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                        report.severity === 'critical' 
                          ? 'bg-red-600 text-white' 
                          : report.severity === 'high' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                        report.status === 'investigating' 
                          ? 'bg-amber-100 text-amber-800' 
                          : report.status === 'confirmed_counterfeit' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setAdminNotes(report.adminNotes || '');
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-red-600 text-white font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 4. MODAL: INVESTIGATE & TAKE ACTION */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-red-300 max-w-lg w-full p-6 text-left space-y-5 shadow-2xl rounded-none">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-red-600 font-bold">{selectedReport.id}</span>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  Security Investigation Dossier
                </h3>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-red-50/50 p-4 border border-red-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Product:</span>
                <span className="font-bold text-slate-900">{selectedReport.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Serial Code:</span>
                <span className="font-mono font-bold text-red-700">{selectedReport.serialNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Reporter:</span>
                <span className="text-slate-900 font-medium">{selectedReport.reporterName} ({selectedReport.reporterEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Location:</span>
                <span className="text-slate-900 font-medium">{selectedReport.locationCity} • {selectedReport.dealerOrStoreName}</span>
              </div>
              <div className="pt-2 border-t border-red-200">
                <span className="text-slate-600 block mb-1">Incident Report Notes:</span>
                <p className="text-slate-800 bg-white p-2 border border-slate-200 leading-relaxed italic">
                  "{selectedReport.description}"
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-700 font-bold">Investigation Findings & Resolution Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Log investigative actions taken, law enforcement contact, or serial blacklisting..."
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap justify-end gap-2 text-xs">
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'false_alarm')}
                className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold uppercase cursor-pointer"
              >
                Mark False Alarm
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase cursor-pointer"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'confirmed_counterfeit')}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase cursor-pointer flex items-center gap-1.5"
              >
                <ShieldX className="w-3.5 h-3.5" />
                <span>Confirm Counterfeit & Blacklist</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
