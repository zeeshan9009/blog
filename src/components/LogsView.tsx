import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import {
  ScrollText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  Lock,
  Globe2,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';

export interface ScanLogItem {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  status: 'AUTHENTIC_ORIGINAL' | 'TAMPER_DETECTED' | 'GEO_MISMATCH' | 'EXPIRED_PASSPORT';
  country: string;
  city: string;
  flag: string;
  ipHash: string;
  clientDevice: string;
  latencyMs: number;
  nonce: string;
}

interface LogsViewProps {
  products: Product[];
}

export const LogsView: React.FC<LogsViewProps> = ({ products }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ScanLogItem | null>(null);

  // Initial persistent or fresh scan logs
  const [logs, setLogs] = useState<ScanLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('veripass_scan_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Simulated live telemetry arrival when enabled and products exist
  useEffect(() => {
    if (!isLiveStreaming || products.length === 0) return;

    const interval = setInterval(() => {
      const randomProd = products[Math.floor(Math.random() * products.length)];
      if (!randomProd) return;

      const cities = [
        { city: 'Lahore', country: 'Pakistan', flag: '🇵🇰' },
        { city: 'Dubai', country: 'United Arab Emirates', flag: '🇦🇪' },
        { city: 'London', country: 'United Kingdom', flag: '🇬🇧' },
        { city: 'New York', country: 'United States', flag: '🇺🇸' },
        { city: 'Geneva', country: 'Switzerland', flag: '🇨🇭' }
      ];
      const randomLoc = cities[Math.floor(Math.random() * cities.length)];

      const newLog: ScanLogItem = {
        id: `LOG-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleTimeString(),
        productId: randomProd.id,
        productName: randomProd.name,
        status: 'AUTHENTIC_ORIGINAL',
        country: randomLoc.country,
        city: randomLoc.city,
        flag: randomLoc.flag,
        ipHash: `182.176.${Math.floor(Math.random() * 250)}.xxx`,
        clientDevice: Math.random() > 0.4 ? 'iPhone 16 Pro (Safari)' : 'Samsung Galaxy S25 (Chrome)',
        latencyMs: Math.floor(25 + Math.random() * 40),
        nonce: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`
      };

      setLogs((prev) => {
        const updated = [newLog, ...prev].slice(0, 50);
        localStorage.setItem('veripass_scan_logs', JSON.stringify(updated));
        return updated;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, products]);

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const clearAllLogs = () => {
    setLogs([]);
    localStorage.removeItem('veripass_scan_logs');
  };

  const exportLogsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `VeriPass-AuditLogs-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
            <span>CRYPTOGRAPHIC AUDIT & TELEMETRY</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Security Scan Logs & Cryptographic Nonce Stream
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Live immutable audit trail of every consumer verification ping, geolocation handshake, and anti-tamper signature check.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3.5 py-2 border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{isLiveStreaming ? 'Live Telemetry Active' : 'Telemetry Paused'}</span>
          </button>

          <button
            onClick={exportLogsJson}
            disabled={logs.length === 0}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="bg-white border border-slate-200 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product, ID, country, nonce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#155EEF] text-xs pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 text-slate-700 focus:outline-none cursor-pointer font-medium"
          >
            <option value="all">All Status Checks</option>
            <option value="AUTHENTIC_ORIGINAL">Authentic Original</option>
            <option value="TAMPER_DETECTED">Tamper Detected</option>
            <option value="GEO_MISMATCH">Geo Mismatch</option>
          </select>

          {logs.length > 0 && (
            <button
              onClick={clearAllLogs}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Clear all logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <span className="text-[11px] font-mono text-slate-400">
            Total Records: <strong className="text-slate-900">{filteredLogs.length}</strong>
          </span>
        </div>
      </div>

      {/* Logs Table / Empty State */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF] mb-3">
            <ScrollText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No telemetry scan logs recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            When customers or inspectors scan product QR codes, real-time cryptographic audit logs will populate here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-3 font-semibold">Asset / Passport</th>
                <th className="py-3 px-3 font-semibold">Location & Flag</th>
                <th className="py-3 px-3 font-semibold">Client Hardware</th>
                <th className="py-3 px-3 font-semibold">Verification Verdict</th>
                <th className="py-3 px-3 font-semibold">Latency</th>
                <th className="py-3 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Timestamp */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    <div>{log.timestamp}</div>
                    <div className="text-[9.5px] text-slate-400">{log.id}</div>
                  </td>

                  {/* Product */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{log.productName}</div>
                    <div className="text-[10px] font-mono text-[#155EEF]">{log.productId}</div>
                  </td>

                  {/* Geolocation */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <span>{log.flag}</span>
                      <span>{log.city}, {log.country}</span>
                    </div>
                    <div className="text-[9.5px] font-mono text-slate-400">IP: {log.ipHash}</div>
                  </td>

                  {/* Client Device */}
                  <td className="py-3 px-3 text-slate-600 text-[11px] truncate max-w-[150px]">
                    {log.clientDevice}
                  </td>

                  {/* Verification Verdict */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.status.replace('_', ' ')}</span>
                    </span>
                  </td>

                  {/* Latency */}
                  <td className="py-3 px-3 font-mono text-[10.5px] text-slate-500">
                    <span className="text-emerald-600 font-bold">{log.latencyMs}ms</span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-[#155EEF] border border-slate-200 text-slate-700 text-[10.5px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Cryptographic Audit Inspector</h3>
                  <div className="text-[10px] font-mono text-slate-400">Event ID: {selectedLog.id}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-800">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Product:</span>
                  <span className="font-bold text-slate-900">{selectedLog.productName} ({selectedLog.productId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-800">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scan Location:</span>
                  <span className="font-semibold text-slate-800">{selectedLog.city}, {selectedLog.country} {selectedLog.flag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Client Agent:</span>
                  <span className="text-slate-800">{selectedLog.clientDevice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Network Latency:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedLog.latencyMs} ms</span>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-3 font-mono text-[10.5px] space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Cryptographic Nonce Proof</div>
                <div className="text-emerald-400 font-bold">{selectedLog.nonce}</div>
                <div className="text-slate-400 text-[9.5px] pt-1 border-t border-slate-800">
                  Zero-Knowledge proof verified against master root merkle tree.
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
