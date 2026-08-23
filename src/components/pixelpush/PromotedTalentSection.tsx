import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Zap, MapPin, CheckCircle2, ArrowRight, Clock, UserPlus } from 'lucide-react';
import { useTalent } from '../../context/TalentContext';
import { PromoteModal } from '../modals/PromoteModal';

export const PromotedTalentSection: React.FC = () => {
  const navigate = useNavigate();
  const { professionals, currentProfile } = useTalent();
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  // Filter only REAL promoted professionals from database
  const sponsoredTalents = useMemo(() => {
    return professionals.filter(p => p.isPromoted);
  }, [professionals]);

  // Helper to format real time left from promotionExpiresAt
  const formatTimeLeft = (expiresAt?: string) => {
    if (!expiresAt) return '24h 00m';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expiring';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
  };

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
              Verified professionals currently boosted with active $1 / 24-hour sponsored placement.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (currentProfile) {
                  setIsPromoteOpen(true);
                } else {
                  navigate('/create-profile');
                }
              }}
              className="px-6 py-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <Zap className="w-4 h-4 text-[#e8622c]" />
              <span>Boost Your Profile for $1</span>
            </button>
          </div>
        </div>

        {/* Dynamic Sponsored Grid or Real Empty State */}
        {sponsoredTalents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {sponsoredTalents.map((talent) => (
              <div
                key={talent.id}
                className="bg-white border-2 border-black p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl hover:border-[#e8622c] transition-all duration-200 group"
              >
                <div className="space-y-5">
                  
                  {/* Card Top: Live $1 Sponsored Tag & Real Countdown */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-900 font-black text-[10px] uppercase tracking-wider">
                      <Zap className="w-3 h-3 text-[#e8622c] fill-[#e8622c]" />
                      <span>$1 Sponsored</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-500">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatTimeLeft(talent.promotionExpiresAt)}</span>
                    </span>
                  </div>

                  {/* Avatar & Core Profile Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={talent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(talent.name)}`}
                        alt={talent.name}
                        className="w-16 h-16 object-cover border-2 border-black group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white" title="Online now" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-black text-base truncate">
                          {talent.name}
                        </h3>
                        {talent.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#e8622c] shrink-0" />
                        <span className="truncate">{talent.location || talent.country || 'Global'}</span>
                      </div>

                      {/* ProRank Score & Rating */}
                      <div className="flex items-center gap-2 pt-0.5 text-xs">
                        <span className="font-black text-[#e8622c] font-mono">
                          {talent.score || 85}/100 Score
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-0.5 text-slate-700 font-bold">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {talent.rating || 5.0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Title */}
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {talent.title}
                    </h4>
                  </div>

                  {/* Skills Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(talent.skills || []).slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Rate & View Profile */}
                <div className="pt-4 border-t-2 border-black flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Rate</div>
                    <div className="font-extrabold text-black text-sm sm:text-base font-mono">
                      ${talent.hourlyRate}/hr
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/developers?q=${encodeURIComponent(talent.name)}`)}
                    className="px-4 py-2 bg-black hover:bg-[#e8622c] text-white text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-black bg-orange-50/30 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-black text-[#e8622c] mx-auto flex items-center justify-center">
              <Zap className="w-6 h-6 fill-[#e8622c]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-black">No Active Sponsored Specialists Right Now</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Be the first verified professional to activate 24-hour top search placement for only $1 USD.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate('/create-profile')}
                className="px-5 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <UserPlus className="w-4 h-4" />
                <span>[ CREATE YOUR PROFILE & PROMOTE ]</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Promotion Modal */}
      {isPromoteOpen && currentProfile && (
        <PromoteModal
          isOpen={isPromoteOpen}
          onClose={() => setIsPromoteOpen(false)}
          professional={currentProfile}
        />
      )}
    </section>
  );
};

export default PromotedTalentSection;
