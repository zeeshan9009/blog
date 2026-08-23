import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Zap, MapPin, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { useTalent } from '../../context/TalentContext';
import { PromoteModal } from '../modals/PromoteModal';

export const PromotedTalentSection: React.FC = () => {
  const navigate = useNavigate();
  const { currentProfile } = useTalent();
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  // Sponsored professionals in square UI with high ProRank scores
  const sponsoredTalents = [
    {
      id: 'ali-raza',
      name: 'Ali Raza',
      title: 'Lead Full-Stack & Next.js Architect',
      location: 'Pakistan (UTC+5)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      score: 98,
      rate: '$75/hr',
      rating: 4.98,
      reviewsCount: 64,
      skills: ['Next.js 15', 'React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      timeLeft: '18h 42m'
    },
    {
      id: 'sara-khan',
      name: 'Sara Khan',
      title: 'Principal UI/UX & Design Systems Lead',
      location: 'United Kingdom (UTC+0)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      score: 96,
      rate: '$90/hr',
      rating: 4.95,
      reviewsCount: 82,
      skills: ['Figma', 'Design Systems', 'Mobile UI', 'Webflow', 'Branding'],
      timeLeft: '21h 15m'
    },
    {
      id: 'marcus-chen',
      name: 'Marcus Chen',
      title: 'Senior AI & Python Systems Specialist',
      location: 'United States (UTC-7)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      score: 95,
      rate: '$110/hr',
      rating: 4.92,
      reviewsCount: 47,
      skills: ['Python', 'LangChain', 'FastAPI', 'PyTorch', 'AWS AI'],
      timeLeft: '14h 08m'
    },
    {
      id: 'elena-rostova',
      name: 'Elena Rostova',
      title: 'Commercial Video & Motion Director',
      location: 'Germany (UTC+1)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
      score: 94,
      rate: '$80/hr',
      rating: 4.96,
      reviewsCount: 53,
      skills: ['After Effects', 'Premiere Pro', 'DaVinci Resolve', '3D Motion', 'Color Grade'],
      timeLeft: '09h 50m'
    }
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#e8622c]">
              <span className="w-2 h-2 bg-[#e8622c] block animate-pulse" />
              <span>24-Hour Sponsored Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-black tracking-[-0.03em] leading-tight">
              Featured Sponsored Talent
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl">
              Top-rated verified professionals currently boosted in our 24-hour $1 sponsored placement.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPromoteOpen(true)}
              className="pixel-btn-black px-6 py-3 font-bold text-xs flex items-center gap-2 cursor-pointer select-none"
            >
              <Zap className="w-4 h-4 text-[#e8622c]" />
              <span>Boost Your Profile for $1</span>
            </button>
          </div>
        </div>

        {/* 4-Column Square Talent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {sponsoredTalents.map((talent) => (
            <div
              key={talent.id}
              className="bg-white border-2 border-black p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:border-[#e8622c] transition-all duration-200 rounded-none group"
            >
              <div className="space-y-5">
                
                {/* Card Top: Live $1 Sponsored Tag & 24h Remaining Timer */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-900 font-black text-[10px] uppercase tracking-wider rounded-none">
                    <Zap className="w-3 h-3 text-[#e8622c] fill-[#e8622c]" />
                    <span>$1 Sponsored</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{talent.timeLeft}</span>
                  </span>
                </div>

                {/* Avatar & Core Profile Info */}
                <div className="flex items-start gap-4">
                  {/* Square Avatar Photo with Sharp Border */}
                  <div className="relative shrink-0">
                    <img
                      src={talent.avatar}
                      alt={talent.name}
                      className="w-16 h-16 object-cover border-2 border-black rounded-none group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-none" title="Online now" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-black text-base truncate">
                        {talent.name}
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#e8622c] shrink-0" />
                      <span className="truncate">{talent.location}</span>
                    </div>

                    {/* ProRank Score & Rating */}
                    <div className="flex items-center gap-2 pt-0.5 text-xs">
                      <span className="font-black text-[#e8622c] font-mono">
                        {talent.score}/100 Score
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-0.5 text-slate-700 font-bold">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {talent.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Professional Title */}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {talent.title}
                  </h4>
                </div>

                {/* Verified Technical Skill Tags (Square Badges) */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {talent.skills.slice(0, 4).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold border border-slate-200 rounded-none"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

              </div>

              {/* Card Bottom: Hourly Rate & Action CTA */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Rate</div>
                  <div className="text-base font-black text-black font-mono">{talent.rate}</div>
                </div>

                <button
                  onClick={() => navigate(`/profile/${talent.id}`)}
                  className="px-4 py-2 bg-black hover:bg-[#e8622c] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer rounded-none"
                >
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
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

export default PromotedTalentSection;
