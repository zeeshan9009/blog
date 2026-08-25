import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Sparkles, ArrowRight, ShieldCheck, DollarSign, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChallengeCard } from './ChallengeCard';
import { ChallengeSubmitModal } from './ChallengeSubmitModal';
import { ChallengeBidModal } from './ChallengeBidModal';
import type { Challenge } from '../../types/challenge';

export const ChallengeSection: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChallengeForSubmit, setSelectedChallengeForSubmit] = useState<Challenge | null>(null);
  const [selectedChallengeForBid, setSelectedChallengeForBid] = useState<Challenge | null>(null);

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/challenges?status=open');
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

  return (
    <section className="py-16 bg-[#fffdfa] border-y-2 border-black relative overflow-hidden">
      
      {/* Background Micro Dots */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-black pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-400 font-mono text-xs font-bold text-amber-900 uppercase">
              <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>COMMUNITY SKILL COMPETITION // FIXED $2 BID POOL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight leading-tight">
              CHALLENGE ARENA: <span className="text-[#e8622c] underline decoration-4 underline-offset-4">WIN ON MERIT.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl font-medium">
              Weekly skill prompts for top builders. The public grows the shared prize pool via fixed $2 boosts, while community votes and expert client judges determine the champion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/arena"
              className="px-4 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-2 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <span>[ EXPLORE ALL CHALLENGES ]</span>
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
                onOpenSubmitModal={(c) => setSelectedChallengeForSubmit(c)}
                onOpenBidModal={(c) => setSelectedChallengeForBid(c)}
              />
            ))
          ) : (
            <div className="col-span-full bg-white border-2 border-black p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <Trophy className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="text-sm font-black text-black">New Weekly Challenge Opening Soon</h4>
              <p className="text-xs text-slate-600">The next category prompt is being curated. Check back shortly!</p>
            </div>
          )}
        </div>

        {/* Feature Guarantees Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs font-mono">
          <div className="p-3 bg-white border border-black flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-black block">100% Merit Winner</span>
              <span className="text-[11px] text-slate-600">60% community vote + 40% judge score. Zero pay-to-win.</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-black flex items-start gap-2.5">
            <DollarSign className="w-4 h-4 text-[#e8622c] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-black block">Fixed $2 Pool Expansion</span>
              <span className="text-[11px] text-slate-600">Repeatable $2 contributions grow the prize pool for builders.</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-black flex items-start gap-2.5">
            <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-black block">Viral Social Spotlight</span>
              <span className="text-[11px] text-slate-600">Winners auto-published to official RankLancr X, LinkedIn & IG.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      <ChallengeSubmitModal
        challenge={selectedChallengeForSubmit}
        isOpen={Boolean(selectedChallengeForSubmit)}
        onClose={() => setSelectedChallengeForSubmit(null)}
        onSubmitted={() => {
          setSelectedChallengeForSubmit(null);
          fetchChallenges();
        }}
      />

      <ChallengeBidModal
        challenge={selectedChallengeForBid}
        isOpen={Boolean(selectedChallengeForBid)}
        onClose={() => setSelectedChallengeForBid(null)}
        onBidComplete={() => {
          setSelectedChallengeForBid(null);
          fetchChallenges();
        }}
      />

    </section>
  );
};
