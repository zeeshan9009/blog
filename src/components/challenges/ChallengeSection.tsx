import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, ArrowRight, ShieldCheck, Award, Building2, Vote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ChallengeCard } from './ChallengeCard';
import { ChallengeSubmitModal } from './ChallengeSubmitModal';
import { SponsorChallengeModal } from './SponsorChallengeModal';
import type { Challenge } from '../../types/challenge';
import toast from 'react-hot-toast';

export const ChallengeSection: React.FC = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChallengeForSubmit, setSelectedChallengeForSubmit] = useState<Challenge | null>(null);
  const [selectedChallengeForSponsor, setSelectedChallengeForSponsor] = useState<Challenge | null>(null);

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/challenges');
      if (res.ok) {
        const data = await res.json();
        if (data.challenges && data.challenges.length > 0) {
          setChallenges(data.challenges);
        }
      }
    } catch (e) {
      console.warn('Failed to load challenges feed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleEnter = (challenge: Challenge) => {
    navigate(`/arena?challenge=${challenge.id}&action=enter`);
  };

  return (
    <section className="py-20 bg-slate-50/60 border-y border-slate-200/80 relative overflow-hidden font-sans">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-400/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-semibold text-amber-900">
              <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>SKILL ARENA // $5 ENTRY • EARNED VISIBILITY REWARDS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-heading">
              Challenge Arena: <span className="text-[#e8622c]">Compete & Earn Spotlight.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
              Join focused 3-day skill prompts for $5. Public community votes crown the top creator. Top 3 earn 72 hours in our site-wide Top Developer Rail and verified profile badges.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/arena"
              className="px-5 py-2.5 bg-slate-900 hover:bg-[#e8622c] text-white font-sans text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.length > 0 ? (
            challenges.map((ch) => (
              <ChallengeCard
                key={ch.id}
                challenge={ch}
                onEnterChallenge={handleEnter}
                onSubmitWork={(c) => setSelectedChallengeForSubmit(c)}
                onSponsorChallenge={(c) => setSelectedChallengeForSponsor(c)}
                onViewDetails={(c) => navigate(`/arena?challenge=${c.id}`)}
              />
            ))
          ) : (
            <div className="col-span-full bg-white border-2 border-black p-10 sm:p-14 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 bg-amber-100 border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Trophy className="w-7 h-7 text-amber-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black font-mono text-black uppercase tracking-tight">
                  Next Skill Challenge Dropping Soon
                </h4>
                <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-md mx-auto leading-relaxed">
                  Our next 3-day engineering prompt is currently being prepared. Check back shortly to pay the $5 entry, submit your project, and compete for the 72-hour Top Developer Rail!
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/pricing"
                  className="px-4 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold uppercase transition border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  [ View Pricing & Rules ]
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 3 Value Props Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs font-mono">
          <div className="p-3 bg-white border border-black flex items-start gap-2.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-black block">100% Merit-Based Voting</span>
              <span className="text-[11px] text-slate-600">Pure public votes with fingerprint deduplication. Zero pay-to-win.</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-black flex items-start gap-2.5 shadow-xs">
            <Award className="w-4 h-4 text-[#e8622c] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-black block">72h Top Developer Rail</span>
              <span className="text-[11px] text-slate-600">Top 3 finishers receive exclusive high-impact homepage placement.</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-black flex items-start gap-2.5 shadow-xs">
            <Building2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-black block">3-Tier Brand Sponsorship</span>
              <span className="text-[11px] text-slate-600">Companies sponsor challenges; Gold sponsors co-brand with the winner.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Submit Modal */}
      {selectedChallengeForSubmit && (
        <ChallengeSubmitModal
          challenge={selectedChallengeForSubmit}
          isOpen={Boolean(selectedChallengeForSubmit)}
          onClose={() => setSelectedChallengeForSubmit(null)}
          onSubmitted={() => {
            setSelectedChallengeForSubmit(null);
            fetchChallenges();
            toast.success('Project submission recorded!');
          }}
        />
      )}

      {/* Sponsor Modal */}
      {selectedChallengeForSponsor && (
        <SponsorChallengeModal
          challengeId={selectedChallengeForSponsor.id}
          challengeTitle={selectedChallengeForSponsor.title}
          isOpen={Boolean(selectedChallengeForSponsor)}
          onClose={() => setSelectedChallengeForSponsor(null)}
          onSuccess={() => {
            setSelectedChallengeForSponsor(null);
            fetchChallenges();
          }}
        />
      )}

    </section>
  );
};

export default ChallengeSection;
