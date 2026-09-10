import React, { useState, useEffect } from 'react';

export interface ScanLocationMarker {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  x: number; // percentage in map projection
  y: number;
  scans: number;
  isHighActivity?: boolean;
}

const defaultMarkers: ScanLocationMarker[] = [
  { id: 'pk-lahore', name: 'Pakistan', city: 'Lahore & Karachi', country: 'Pakistan', flag: '🇵🇰', x: 67.5, y: 44.5, scans: 3482, isHighActivity: true },
  { id: 'ae-dubai', name: 'UAE', city: 'Dubai & Abu Dhabi', country: 'UAE', flag: '🇦🇪', x: 62.5, y: 46.8, scans: 1842, isHighActivity: true },
  { id: 'us-nyc', name: 'USA', city: 'New York & Miami', country: 'USA', flag: '🇺🇸', x: 28.5, y: 39.5, scans: 1205 },
  { id: 'gb-london', name: 'UK', city: 'London', country: 'UK', flag: '🇬🇧', x: 48.5, y: 31.5, scans: 842 },
  { id: 'ch-geneva', name: 'Switzerland', city: 'Geneva & Zurich', country: 'Switzerland', flag: '🇨🇭', x: 50.8, y: 34.5, scans: 450 },
  { id: 'sg-singapore', name: 'Singapore', city: 'Singapore City', country: 'Singapore', flag: '🇸🇬', x: 78.5, y: 57.5, scans: 380 },
  { id: 'jp-tokyo', name: 'Japan', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', x: 86.8, y: 41.5, scans: 229 },
];

export const GlobalScanMap: React.FC = () => {
  const [hoveredMarker, setHoveredMarker] = useState<ScanLocationMarker | null>(null);
  const [activeRealtimePing, setActiveRealtimePing] = useState<{ x: number; y: number; city: string; flag: string } | null>(null);

  // Simulate Supabase Realtime scan events arriving every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMarker = defaultMarkers[Math.floor(Math.random() * defaultMarkers.length)];
      setActiveRealtimePing({
        x: randomMarker.x + (Math.random() * 2 - 1),
        y: randomMarker.y + (Math.random() * 2 - 1),
        city: randomMarker.city.split('&')[0].trim(),
        flag: randomMarker.flag
      });

      const clearTimer = setTimeout(() => {
        setActiveRealtimePing(null);
      }, 2400);

      return () => clearTimeout(clearTimer);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-32 sm:h-36 bg-[#F8FAFC] border border-slate-100 rounded-none overflow-hidden my-1 flex items-center justify-center select-none group">
      
      {/* Background World Map Vector Grid */}
      <svg 
        viewBox="0 0 1000 500" 
        className="w-full h-full object-contain pointer-events-none opacity-45"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="dotGrid" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="#94A3B8" opacity="0.35" />
          </pattern>
        </defs>

        <rect width="1000" height="500" fill="url(#dotGrid)" />

        {/* Simplified Continents Silhouette */}
        <g fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" strokeLinejoin="round" opacity="0.85">
          {/* North America */}
          <path d="M 120 120 Q 200 80, 320 110 Q 360 160, 310 240 Q 240 280, 200 240 Q 150 210, 120 120 Z" />
          {/* South America */}
          <path d="M 280 270 Q 360 280, 340 370 Q 310 450, 260 420 Q 250 340, 280 270 Z" />
          {/* Europe */}
          <path d="M 460 130 Q 560 110, 580 170 Q 530 220, 480 200 Q 440 160, 460 130 Z" />
          {/* Africa */}
          <path d="M 470 210 Q 570 200, 580 300 Q 540 400, 490 380 Q 450 280, 470 210 Z" />
          {/* Asia */}
          <path d="M 590 120 Q 750 90, 850 160 Q 880 250, 780 320 Q 660 300, 600 220 Z" />
          {/* Australia */}
          <path d="M 760 350 Q 850 330, 870 390 Q 830 440, 760 410 Z" />
          {/* UK & Islands */}
          <circle cx="465" cy="140" r="10" />
          <circle cx="830" cy="180" r="12" />
        </g>
      </svg>

      {/* Realtime Supabase live scan ripple animation */}
      {activeRealtimePing && (
        <div 
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${activeRealtimePing.x}%`, top: `${activeRealtimePing.y}%` }}
        >
          <span className="absolute w-8 h-8 -left-4 -top-4 rounded-full bg-emerald-500 opacity-60 animate-ping" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs block" />
          
          {/* Mini Live Pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-950 text-white font-mono text-[9px] px-1.5 py-0.5 whitespace-nowrap shadow-md flex items-center gap-1 border border-slate-700 animate-fade-in">
            <span>{activeRealtimePing.flag}</span>
            <span className="text-emerald-400 font-bold">LIVE SCAN</span>
          </div>
        </div>
      )}

      {/* Interactive Markers */}
      {defaultMarkers.map((marker) => (
        <div
          key={marker.id}
          onMouseEnter={() => setHoveredMarker(marker)}
          onMouseLeave={() => setHoveredMarker(null)}
          className="absolute z-10 cursor-pointer -translate-x-1/2 -translate-y-1/2 p-1 group/pin"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          {/* Outer glow ring */}
          {marker.isHighActivity && (
            <span className="absolute inset-0 rounded-full bg-[#155EEF]/30 animate-pulse pointer-events-none" />
          )}
          
          {/* Pin Core */}
          <div className="relative w-2.5 h-2.5 rounded-full bg-[#155EEF] group-hover/pin:bg-blue-700 ring-2 ring-white shadow-xs flex items-center justify-center transition-transform group-hover/pin:scale-125">
            <span className="w-1 h-1 rounded-full bg-white" />
          </div>

          {/* Hover Tooltip */}
          {hoveredMarker?.id === marker.id && (
            <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-950 text-white p-2 text-left text-xs font-mono shadow-xl whitespace-nowrap border border-slate-800 pointer-events-none">
              <div className="flex items-center gap-1.5 font-bold text-slate-100 text-[11px]">
                <span>{marker.flag}</span>
                <span>{marker.name}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{marker.city}</div>
              <div className="text-[10.5px] font-bold text-[#155EEF] mt-1 pt-1 border-t border-slate-800">
                {marker.scans.toLocaleString()} Total Scans
              </div>
              <div className="w-2 h-2 bg-slate-950 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
            </div>
          )}
        </div>
      ))}

      {/* Bottom subtle status label */}
      <div className="absolute bottom-1 right-2 flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Supabase Realtime Geolocation Stream</span>
      </div>

    </div>
  );
};
