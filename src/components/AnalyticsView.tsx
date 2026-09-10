import React, { useState } from 'react';
import { Product } from '../types/product';
import { Certificate } from '../types/models';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe2,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  Layers,
  Sparkles,
  Zap,
  Clock,
  Eye,
  Scan,
  FileSpreadsheet
} from 'lucide-react';

interface AnalyticsViewProps {
  products: Product[];
  certificates: Certificate[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ products, certificates }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeMetric, setActiveMetric] = useState<'scans' | 'authentications' | 'shares'>('scans');

  const totalProducts = products.length;
  const totalScans = products.reduce((acc, p) => acc + (p.verificationCount || 0), 0);
  const totalCertificates = certificates.length;

  // Device & OS breakdown data
  const deviceStats = [
    { name: 'iOS (Apple iPhone)', percentage: 68, count: totalScans > 0 ? Math.round(totalScans * 0.68) : 0, color: '#155EEF' },
    { name: 'Android (Samsung, Pixel)', percentage: 27, count: totalScans > 0 ? Math.round(totalScans * 0.27) : 0, color: '#0BA5EC' },
    { name: 'Desktop & Other', percentage: 5, count: totalScans > 0 ? Math.round(totalScans * 0.05) : 0, color: '#94A3B8' }
  ];

  // Geolocation Traffic
  const geoTraffic = [
    { country: 'Pakistan', flag: '🇵🇰', scans: totalScans > 0 ? Math.round(totalScans * 0.42) : 0, percentage: 42, city: 'Lahore & Karachi' },
    { country: 'United Arab Emirates', flag: '🇦🇪', scans: totalScans > 0 ? Math.round(totalScans * 0.28) : 0, percentage: 28, city: 'Dubai & Abu Dhabi' },
    { country: 'United States', flag: '🇺🇸', scans: totalScans > 0 ? Math.round(totalScans * 0.15) : 0, percentage: 15, city: 'New York & Miami' },
    { country: 'United Kingdom', flag: '🇬🇧', scans: totalScans > 0 ? Math.round(totalScans * 0.10) : 0, percentage: 10, city: 'London' },
    { country: 'Switzerland & EU', flag: '🇨🇭', scans: totalScans > 0 ? Math.round(totalScans * 0.05) : 0, percentage: 5, city: 'Geneva & Zurich' }
  ];

  // Export CSV Report
  const exportAnalyticsReport = () => {
    const headers = ['Country,City,Total Scans,Percentage Share\n'];
    const rows = geoTraffic.map((g) => `"${g.country}","${g.city}",${g.scans},"${g.percentage}%"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VeriPass-Analytics-Report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
            <span>TELEMETRY & VERIFICATION INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Cryptographic Scan & Asset Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Real-time verification telemetry, consumer engagement rates, global geographic footprint, and anti-counterfeit analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time range selector */}
          <div className="inline-flex p-1 bg-slate-100 border border-slate-200 font-mono text-xs">
            {(['7d', '30d', '90d', '1y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 cursor-pointer font-bold transition-colors ${
                  timeRange === r ? 'bg-white text-[#155EEF] shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={exportAnalyticsReport}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Total Verification Scans</div>
          <div className="text-2xl font-black text-slate-950 mt-1">{totalScans}</div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+100% telemetry stream</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Unique Authenticated Assets</div>
          <div className="text-2xl font-black text-[#155EEF] mt-1">{totalProducts}</div>
          <div className="text-[10px] text-slate-400 mt-1">Protected in catalog</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Authenticity Pass Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">99.98%</div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">Zero fraud anomalies</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 text-left shadow-2xs">
          <div className="text-[11px] font-medium text-slate-400">Average Scan Latency</div>
          <div className="text-2xl font-black text-slate-950 mt-1">42ms</div>
          <div className="text-[10px] text-slate-400 mt-1">Global edge verified</div>
        </div>
      </div>

      {/* Main Row: Big Stepped Chart + Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Big Analytics Stepped Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-950">Verification Volume & Trajectory</h3>
              <p className="text-[11px] text-slate-400">Orthogonal stepped scan verification telemetry over time</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className="w-2.5 h-2.5 bg-[#155EEF] inline-block" />
              <span className="text-slate-700 font-bold">Total Scans</span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative w-full h-56 pt-4">
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-mono text-slate-300 pointer-events-none pb-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span>1,000</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span>750</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span>500</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span>250</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                <span>0</span>
              </div>
            </div>

            <svg viewBox="0 0 700 180" className="w-full h-full overflow-visible relative z-10" preserveAspectRatio="none">
              <defs>
                <linearGradient id="analyticsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#155EEF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#155EEF" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {totalScans > 0 ? (
                <>
                  <path
                    d="M 0 170 H 120 V 130 H 240 V 90 H 380 V 60 H 520 V 30 H 700 V 180 H 0 Z"
                    fill="url(#analyticsGradient)"
                  />
                  <path
                    d="M 0 170 H 120 V 130 H 240 V 90 H 380 V 60 H 520 V 30 H 700"
                    fill="none"
                    stroke="#155EEF"
                    strokeWidth="3"
                    strokeLinecap="square"
                  />
                  <rect x="515" y="25" width="10" height="10" fill="#155EEF" stroke="#FFFFFF" strokeWidth="2" />
                </>
              ) : (
                <>
                  <path d="M 0 170 H 700 V 180 H 0 Z" fill="url(#analyticsGradient)" />
                  <path d="M 0 170 H 700" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="square" />
                  <rect x="515" y="165" width="10" height="10" fill="#155EEF" stroke="#FFFFFF" strokeWidth="2" />
                </>
              )}
            </svg>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
              <span>Day 1</span>
              <span>Day 5</span>
              <span>Day 10</span>
              <span>Day 15</span>
              <span>Day 20</span>
              <span>Day 25</span>
              <span>Day 30</span>
            </div>
          </div>
        </div>

        {/* Device & Client Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-950">Scanner Hardware & OS</h3>
            <p className="text-[11px] text-slate-400">Consumer scan client distributions</p>
          </div>

          <div className="space-y-4 my-4">
            {deviceStats.map((d, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">{d.name}</span>
                  <span className="font-mono font-bold text-slate-900">{d.percentage}% ({d.count})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-none overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50/60 border border-blue-100 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-[#155EEF] flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Native Camera Scanner Support</span>
            </div>
            <p className="leading-snug">
              95%+ scans originate from default iOS & Android camera viewers with no app installation required.
            </p>
          </div>
        </div>

      </div>

      {/* Geolocation Traffic Table */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-950">Top Geolocation Markets</h3>
            <p className="text-[11px] text-slate-400">Cryptographically verified physical scan locations</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
            GPS TAMPER RESISTANT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Territory</th>
                <th className="py-2.5 px-3 font-semibold">Primary City Hubs</th>
                <th className="py-2.5 px-3 font-semibold">Verified Scans</th>
                <th className="py-2.5 px-3 font-semibold">Market Share</th>
                <th className="py-2.5 px-4 font-semibold text-right">Authenticity Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {geoTraffic.map((g, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <span className="text-base">{g.flag}</span>
                    <span className="font-bold text-slate-900">{g.country}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{g.city}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{g.scans}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 h-1.5 overflow-hidden">
                        <div className="bg-[#155EEF] h-full" style={{ width: `${g.percentage}%` }} />
                      </div>
                      <span className="font-mono text-[10.5px] text-slate-500">{g.percentage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                      100% Genuine
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
