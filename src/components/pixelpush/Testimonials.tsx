import React, { useState } from 'react';

export const Testimonials: React.FC = () => {
  // Diego Santos active by default matching the screenshot
  const [activeIndex, setActiveIndex] = useState(1);

  const creators = [
    {
      name: 'Maya Chen',
      company: 'Reel Co',
      role: 'Content Lead',
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      quote: '“We replaced three separate tools with ProRank. The whole team discovers verified engineers in minutes with zero platform friction.”'
    },
    {
      name: 'Diego Santos',
      company: 'Loop Media',
      role: 'Head of Video',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      quote: '“The auto-captions are scary good. Fifty languages, frame-accurate, and zero cleanup before we publish.”'
    },
    {
      name: 'Aisha Patel',
      company: 'Studio Nine',
      role: 'Creative Director',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      quote: '“The $2 for 24-hour sponsored visibility paid for itself 500x over. Two enterprise clients reached out directly within our first promotional boost.”'
    },
    {
      name: "Liam O'Connor",
      company: 'Frame Forge',
      role: 'Producer',
      img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      quote: '“Unlike traditional platforms with 20% markups, ProRank connects us directly with top talent. The 0-100 score makes screening effortless.”'
    },
    {
      name: 'Yuki Tanaka',
      company: 'Channel Yuki',
      role: 'Creator',
      img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      quote: '“As an independent developer and creator, having a transparent profile where clients can verify my GitHub and send inquiries directly is invaluable.”'
    }
  ];

  // 8-bit pixelated stepped corner clip-path for avatars
  const pixelAvatarClip = `polygon(
    0 12px, 3px 12px, 3px 8px, 6px 8px, 6px 4px, 9px 4px, 9px 0,
    calc(100% - 9px) 0, calc(100% - 9px) 4px, calc(100% - 6px) 4px, calc(100% - 6px) 8px, calc(100% - 3px) 8px, calc(100% - 3px) 12px, 100% 12px,
    100% calc(100% - 12px), calc(100% - 3px) calc(100% - 12px), calc(100% - 3px) calc(100% - 8px), calc(100% - 6px) calc(100% - 8px), calc(100% - 6px) calc(100% - 4px), calc(100% - 9px) calc(100% - 4px), calc(100% - 9px) 100%,
    9px 100%, 9px calc(100% - 4px), 6px calc(100% - 4px), 6px calc(100% - 8px), 3px calc(100% - 8px), 3px calc(100% - 12px), 0 calc(100% - 12px)
  )`;

  return (
    <section className="bg-white border-b border-slate-200">
      
      {/* Top Area: Large Centered Quote */}
      <div className="py-20 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="min-h-[90px] flex items-center justify-center">
          <p className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-black tracking-[-0.02em] leading-snug">
            {creators[activeIndex].quote}
          </p>
        </div>
      </div>

      {/* Bottom Area: Pinstripe Textured Strip with 5 Pixelated Avatars (Exact Screenshot Layout) */}
      <div className="border-t border-slate-200 bg-slate-50/70 bg-pinstripe py-12 sm:py-16 relative">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 items-start">
            {creators.map((c, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className="group flex flex-col items-center text-center cursor-pointer transition-all duration-200"
                >
                  {/* 8-Bit Pixel Stepped Avatar Frame */}
                  <div
                    style={{ clipPath: pixelAvatarClip }}
                    className={`w-28 h-28 sm:w-32 sm:h-32 p-0.5 transition-all duration-200 shadow-md ${
                      isActive ? 'bg-[#0a0a0a] scale-105' : 'bg-slate-300 group-hover:bg-slate-400'
                    }`}
                  >
                    <img
                      src={c.img}
                      alt={c.name}
                      style={{ clipPath: pixelAvatarClip }}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        isActive
                          ? 'filter-none'
                          : 'grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100'
                      }`}
                    />
                  </div>

                  {/* Active Orange Underline Bar */}
                  <div className="w-16 h-1 mt-4 mb-3">
                    {isActive && <div className="w-full h-full bg-[#e8622c]" />}
                  </div>

                  {/* Metadata: Company, Name, Role (Exact Matching Hierarchy) */}
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-black">
                      {c.company}
                    </div>
                    <div className={`text-xs ${isActive ? 'font-bold text-black' : 'font-medium text-slate-700'}`}>
                      {c.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      {c.role}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom-Right Small Orange Double Quote Mark (Matching Screenshot) */}
          <div className="absolute bottom-4 right-6 sm:right-10 select-none pointer-events-none">
            <div className="flex items-center gap-1 text-[#e8622c] font-black text-2xl font-serif leading-none">
              <span>“</span>
              <span className="-ml-1">“</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Testimonials;
