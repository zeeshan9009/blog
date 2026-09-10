import React from 'react';

export const AuthVectorVisual: React.FC = () => {
  return (
    <div className="w-full relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-50 border border-slate-200/80 p-6 sm:p-8 shadow-xs flex items-center justify-center min-h-[280px] sm:min-h-[320px] select-none">
      
      {/* Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Floating Geometric Blue and White Boxes */}
      <div className="relative w-full h-[220px] sm:h-[240px] flex items-center justify-center">
        
        {/* Ambient Soft Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Large Central White Card Box */}
        <div className="w-44 h-28 sm:w-52 sm:h-32 bg-white border border-slate-200/90 shadow-[0_12px_30px_rgba(0,0,0,0.06)] rounded-lg relative z-10 flex flex-col justify-between p-4 transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center justify-between">
            <div className="w-6 h-6 bg-[#155EEF] rounded-xs flex items-center justify-center">
              <div className="w-2.5 h-2.5 border-2 border-white rounded-xs border-r-transparent border-b-transparent rotate-45" />
            </div>
            <div className="w-12 h-2 bg-slate-100 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <div className="w-24 h-2.5 bg-slate-800 rounded-xs" />
            <div className="w-16 h-2 bg-slate-200 rounded-xs" />
          </div>
        </div>

        {/* Solid Blue Cube 1 (Top Left) */}
        <div className="absolute top-4 left-8 sm:left-14 w-12 h-12 bg-[#155EEF] shadow-lg shadow-blue-500/20 z-20 transition-transform hover:-translate-y-1 duration-300" />

        {/* Solid Blue Cube 2 (Bottom Right) */}
        <div className="absolute bottom-6 right-10 sm:right-16 w-9 h-9 bg-[#155EEF] shadow-md shadow-blue-500/25 z-20 transition-transform hover:translate-y-1 duration-300" />

        {/* Translucent / Glass White Box (Top Right) */}
        <div className="absolute top-2 right-12 sm:right-20 w-16 h-16 bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm z-0" />

        {/* Light Blue Accent Box (Bottom Left) */}
        <div className="absolute bottom-4 left-16 sm:left-24 w-10 h-10 bg-blue-100 border border-blue-200/80 z-0" />

        {/* Small Solid Blue Accent Square (Top Center) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#155EEF] z-20" />

        {/* Small Slate Accent Box */}
        <div className="absolute bottom-12 right-1/3 w-6 h-6 bg-slate-200/90 border border-slate-300 z-0" />

      </div>

    </div>
  );
};
