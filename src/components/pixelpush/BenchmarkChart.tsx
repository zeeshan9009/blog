import React, { useState } from 'react';

export const BenchmarkChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quality' | 'speed' | 'accuracy'>('quality');

  const benchmarkData = {
    quality: [
      { name: 'Unverified Web', score: 44.2, color: 'bg-[#c5c8cb]', isProRank: false },
      { name: 'Job Boards', score: 55.0, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'Gig Marketplaces', score: 60.3, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Direct Outreach', score: 64.1, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Staffing Agencies', score: 67.5, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'Vetted Portals', score: 70.2, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Boutique Studios', score: 76.4, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'RankLancr Finalists', score: 95.1, color: 'bg-white', isProRank: true }
    ],
    speed: [
      { name: 'Staffing Agencies', score: 40.5, color: 'bg-[#c5c8cb]', isProRank: false },
      { name: 'Job Boards', score: 54.0, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'Direct Outreach', score: 58.2, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Gig Marketplaces', score: 65.0, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Unverified Web', score: 68.5, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'Vetted Portals', score: 74.0, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Boutique Studios', score: 80.2, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'RankLancr Finalists', score: 98.4, color: 'bg-white', isProRank: true }
    ],
    accuracy: [
      { name: 'Unverified Web', score: 38.0, color: 'bg-[#c5c8cb]', isProRank: false },
      { name: 'Job Boards', score: 58.0, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'Gig Marketplaces', score: 66.2, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Direct Outreach', score: 70.5, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Staffing Agencies', score: 78.0, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'Boutique Studios', score: 84.0, color: 'bg-[#0a0a0a]', isProRank: false },
      { name: 'Vetted Portals', score: 88.5, color: 'bg-[#e8622c]', isProRank: false },
      { name: 'RankLancr Finalists', score: 99.2, color: 'bg-white', isProRank: true }
    ]
  };

  return (
    <section className="py-20 sm:py-28 bg-white border-b-2 border-black">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Main 2-Column Split: Left Sidebar & Right Square Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Benchmark Title, Legend, and Tabs */}
          <div className="lg:col-span-3 flex flex-col justify-between py-2 border-r-0 lg:border-r border-slate-200 lg:pr-8">
            
            {/* Top: Benchmark Title & Legend */}
            <div className="space-y-8">
              <h3 className="text-xl font-extrabold text-black tracking-tight font-sans">
                Skill & Code Benchmark
              </h3>

              {/* Legend List */}
              <div className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 bg-[#e8622c] block shrink-0" />
                  <span className="text-slate-800 font-bold">RankLancr Verified</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 bg-[#e8622c] block shrink-0" />
                  <span className="text-slate-600">Vetted Networks</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 bg-black block shrink-0" />
                  <span className="text-slate-600">Legacy Marketplaces</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 bg-[#c5c8cb] block shrink-0" />
                  <span className="text-slate-600">Unverified Web</span>
                </div>
              </div>
            </div>

            {/* Bottom: Tabs with underline on active tab */}
            <div className="space-y-3 pt-12 lg:pt-0">
              <button
                onClick={() => setActiveTab('quality')}
                className={`block text-xs font-bold transition text-left cursor-pointer ${
                  activeTab === 'quality'
                    ? 'text-black underline underline-offset-4 decoration-2 decoration-black'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                Talent quality score
              </button>
              <button
                onClick={() => setActiveTab('speed')}
                className={`block text-xs font-bold transition text-left cursor-pointer ${
                  activeTab === 'speed'
                    ? 'text-black underline underline-offset-4 decoration-2 decoration-black'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                Hiring turnaround speed
              </button>
              <button
                onClick={() => setActiveTab('accuracy')}
                className={`block text-xs font-bold transition text-left cursor-pointer ${
                  activeTab === 'accuracy'
                    ? 'text-black underline underline-offset-4 decoration-2 decoration-black'
                    : 'text-slate-500 hover:text-black'
                }`}
              >
                Client satisfaction rating
              </button>
            </div>

          </div>

          {/* Right Column: Square Benchmark Bar Chart */}
          <div className="lg:col-span-9 relative flex flex-col justify-end pt-8 pb-4">
            
            {/* Gridlines with 100 / 75 / 50 / 25 labels */}
            <div className="relative h-80 sm:h-96 w-full flex items-end">
              
              {/* Background Dashed Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-dashed border-slate-200 w-full flex items-center">
                  <span className="text-[11px] text-slate-400 font-mono -mt-4 pr-3">100</span>
                </div>
                <div className="border-b border-dashed border-slate-200 w-full flex items-center">
                  <span className="text-[11px] text-slate-400 font-mono -mt-4 pr-3">75</span>
                </div>
                <div className="border-b border-dashed border-slate-200 w-full flex items-center">
                  <span className="text-[11px] text-slate-400 font-mono -mt-4 pr-3">50</span>
                </div>
                <div className="border-b border-dashed border-slate-200 w-full flex items-center">
                  <span className="text-[11px] text-slate-400 font-mono -mt-4 pr-3">25</span>
                </div>
              </div>

              {/* Square Bars */}
              <div className="relative z-10 w-full h-full flex items-end justify-between gap-2.5 sm:gap-4 pl-8">
                {benchmarkData[activeTab].map((item, idx) => {
                  if (item.isProRank) {
                    // ProRank Highlight Card: Sharp Orange Border Outline Box with Black Square Icon Box inside
                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center justify-end h-full relative"
                      >
                        <div
                          style={{ height: `${item.score}%` }}
                          className="w-full border-2 border-[#e8622c] bg-white relative flex flex-col justify-between items-center p-3 shadow-xs rounded-none"
                        >
                          {/* Solid Black Square Box with Play Triangle */}
                          <div className="w-8 h-8 bg-black flex items-center justify-center text-white shadow-xs rounded-none">
                            <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-[#e8622c] ml-0.5" />
                          </div>

                          {/* Score number at bottom */}
                          <span className="text-xs font-black text-black font-mono">
                            {item.score}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Regular Solid Square Bar
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full"
                    >
                      <div
                        style={{ height: `${item.score}%` }}
                        className={`w-full ${item.color} flex items-end justify-center pb-3 transition-all duration-300 rounded-none`}
                      >
                        <span className="text-xs font-bold text-black font-mono">
                          {item.score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* X-Axis Channel Labels */}
            <div className="flex justify-between gap-2.5 sm:gap-4 pl-8 pt-4 border-t border-slate-300 text-center">
              {benchmarkData[activeTab].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex-1 text-[11px] sm:text-xs truncate ${
                    item.isProRank ? 'font-black text-[#e8622c]' : 'font-semibold text-slate-700'
                  }`}
                >
                  {item.name}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default BenchmarkChart;
