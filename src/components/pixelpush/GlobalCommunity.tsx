import React, { useState, useEffect } from 'react';

export const GlobalCommunity: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  // Smooth continuous rotation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      // Rotate smoothly across time
      setRotation(prev => (prev + delta * 14) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const creators = [
    { name: '@kenji.v', role: 'Commercial Director', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', initialAngle: 30, latitude: 0.3 },
    { name: '@leo.edits', role: 'Lead VFX Artist', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', initialAngle: 110, latitude: 0.45 },
    { name: '@maya.cuts', role: 'Agency Post Lead', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', initialAngle: 210, latitude: 0.25 },
    { name: '@alex.m', role: 'Motion & Color', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80', initialAngle: 290, latitude: 0.5 },
    { name: '@chloe.b', role: 'Showrunner', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80', initialAngle: 350, latitude: 0.35 }
  ];

  return (
    <section id="community" className="py-24 sm:py-32 bg-white border-b border-slate-200 text-center overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow with Orange Square Bullet */}
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#e8622c] mb-4">
          <span className="w-2 h-2 bg-[#e8622c] block" />
          <span>Global developer network</span>
        </div>

        {/* Updated Site-Specific Headline */}
        <h2 className="text-4xl sm:text-6xl font-black text-black tracking-[-0.03em] leading-tight mb-4">
          Powering engineers, <br />
          builders & creators everywhere
        </h2>

        {/* Tailored Subtext for RankLancr */}
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-16">
          From solo fullstack builders and AI engineers to high-growth tech teams, RankLancr benchmarks code, rewards skill, and showcases top engineering talent across 120+ countries.
        </p>

        {/* Real Rotating 3D Dotted Sphere with Glowing Warm Sunset Rim */}
        <div className="relative w-full max-w-4xl mx-auto h-[380px] sm:h-[460px] flex items-end justify-center">
          
          {/* Glowing Orange Upper Halo Rim */}
          <div className="absolute bottom-0 w-[580px] sm:w-[760px] h-[290px] sm:h-[380px] rounded-t-full border-t-4 border-[#e8622c] bg-gradient-to-b from-[#e8622c]/25 via-amber-400/10 to-transparent shadow-[0_-25px_60px_rgba(232,98,44,0.3)] z-0" />

          {/* Dotted Sphere Surface with Smooth Rotation Translation */}
          <div className="absolute bottom-0 w-[580px] sm:w-[760px] h-[290px] sm:h-[380px] rounded-t-full overflow-hidden bg-white/70 backdrop-blur-xs z-10">
            
            {/* Rotating Dotted Grid Layer */}
            <div
              className="absolute inset-0 w-[200%] h-full opacity-60 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
                transform: `translateX(-${(rotation % 100) * 0.5}%)`,
                transition: 'transform 0.05s linear'
              }}
            />

            {/* Latitude Overlay Lines */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.1)_50%,transparent_100%)] pointer-events-none" />
          </div>

          {/* Floating Video Editor Badges with Square Photos & Tags */}
          <div className="absolute bottom-0 w-[580px] sm:w-[760px] h-[290px] sm:h-[380px] z-20 pointer-events-none">
            {creators.map((c, idx) => {
              // Compute 3D circular orbit coordinates
              const currentAngle = (c.initialAngle + rotation) * (Math.PI / 180);
              const cosAngle = Math.cos(currentAngle);
              const sinAngle = Math.sin(currentAngle);

              // Only show when in front half of the sphere
              const isVisible = sinAngle > -0.2;
              const xPos = 50 + cosAngle * 42; // Percentage across sphere width
              const yPos = 85 - (c.latitude * 65) - (sinAngle * 10); // Perspective curve

              if (!isVisible) return null;

              return (
                <div
                  key={idx}
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity: Math.max(0.4, (sinAngle + 0.3) / 1.3)
                  }}
                  className="absolute pointer-events-auto flex items-center bg-white border border-slate-200/90 shadow-lg p-1 pr-2.5 rounded-none transition-transform hover:scale-105"
                >
                  {/* Square Avatar Photo */}
                  <img
                    src={c.img}
                    alt={c.name}
                    className="w-8 h-8 rounded-none object-cover mr-2 bg-slate-100"
                  />
                  
                  {/* Tag Name & Video Role */}
                  <div className="text-left">
                    <div className="text-[11px] font-black text-black tracking-tight font-mono leading-none">
                      {c.name}
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium mt-0.5">
                      {c.role}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default GlobalCommunity;
