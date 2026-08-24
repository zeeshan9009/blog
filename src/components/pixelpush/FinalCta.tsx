import React, { useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import PixelMosaic from './PixelMosaic';
import { useTalent } from '../../context/TalentContext';
import { PromoteModal } from '../modals/PromoteModal';

export const FinalCta: React.FC = () => {
  const { currentProfile } = useTalent();
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&auto=format&fit=crop&q=80'
  ];

  return (
    <section id="start" className="relative py-24 sm:py-36 bg-[#0a0a0a] text-white overflow-hidden text-center border-t border-slate-900">
      
      {/* Decorative Pixel Mosaic Background Texture */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none -z-0">
        <PixelMosaic rows={10} cols={14} density="medium" className="w-full max-w-4xl h-full" />
      </div>

      {/* Ambient Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#e8622c]/20 blur-[120px] rounded-none pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e8622c]">
          <span className="w-2 h-2 bg-[#e8622c] block animate-pulse" />
          <span>Get started</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-[-0.03em] leading-tight">
          Make your next hire <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8622c] via-amber-300 to-[#e8622c]">
            in minutes, not weeks
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-slate-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed">
          Join thousands of fast-moving companies discovering top-tier verified talent or promote your profile for 24-hour sponsored placement.
        </p>

        {/* Two CTAs: White filled & Outline Square Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => {
              const el = document.getElementById('talent') || document.getElementById('discovery');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white hover:bg-orange-50 text-black font-black text-xs sm:text-sm transition-all shadow-xl flex items-center gap-2 cursor-pointer rounded-none"
          >
            <span>Explore All Talent</span>
            <ArrowRight className="w-4 h-4 text-[#e8622c]" />
          </button>

          <button
            onClick={() => setIsPromoteOpen(true)}
            className="px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 rounded-none"
          >
            <Zap className="w-4 h-4 text-[#e8622c]" />
            <span>Promote for $2</span>
          </button>
        </div>

        {/* Overlapping Square Avatar Row + Social Proof Caption */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400">
          <div className="flex items-center -space-x-1.5">
            {avatars.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Professional"
                className="w-8 h-8 object-cover border border-[#0a0a0a] ring-1 ring-[#e8622c]/50 rounded-none"
              />
            ))}
          </div>
          <span className="font-medium">
            Join <strong className="text-white font-bold">180k+ professionals & teams</strong> on ProRank
          </span>
        </div>

      </div>

      <PromoteModal
        isOpen={isPromoteOpen}
        onClose={() => setIsPromoteOpen(false)}
        professional={currentProfile}
      />
    </section>
  );
};

export default FinalCta;
