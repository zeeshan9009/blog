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
    <section className="py-20 sm:py-24 bg-[#FAFAF9] border-y border-[#E5E5E5] font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E5E5] pb-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E5E5E5] text-[11px] font-semibold text-[#FF5A1F] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#FF5A1F] shrink-0" />
              <span>Skill Arena // $5 Entry • Earned Visibility</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              Challenge Arena: <span className="text-[#FF5A1F]">Compete & Earn Spotlight</span>
            </h2>

            <p className="text-sm sm:text-base text-[#525252] max-w-2xl font-normal leading-relaxed">
              Join focused 3-day skill prompts for $5. Public community votes crown the top creator. Top 3 earn 72 hours in our site-wide Top Developer Rail and verified profile badges.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/arena"
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#FF5A1F] text-white font-sans text-xs font-semibold transition-colors flex items-center gap-2 border border-[#1A1A1A] hover:border-[#FF5A1F] cursor-pointer"
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
            <div className="col-span-full bg-white border border-[#E5E5E5] p-10 sm:p-14 text-center space-y-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 bg-[#FAFAF9] border border-[#E5E5E5] flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-[#FF5A1F]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-[#1A1A1A]">
                  Next Skill Challenge Dropping Soon
                </h4>
                <p className="text-xs sm:text-sm text-[#525252] max-w-md mx-auto leading-relaxed">
                  Our next 3-day engineering prompt is currently being prepared. Check back shortly to pay the $5 entry, submit your project, and compete for the 72-hour Top Developer Rail.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      {selectedChallengeForSubmit && (
        <ChallengeSubmitModal
          challenge={selectedChallengeForSubmit}
          isOpen={true}
          onClose={() => setSelectedChallengeForSubmit(null)}
          onSubmitted={() => {
            fetchChallenges();
            toast.success('Project submitted successfully!');
          }}
        />
      )}

      {selectedChallengeForSponsor && (
        <SponsorChallengeModal
          challengeId={selectedChallengeForSponsor.id}
          challengeTitle={selectedChallengeForSponsor.title}
          isOpen={true}
          onClose={() => setSelectedChallengeForSponsor(null)}
          onSuccess={() => {
            fetchChallenges();
            toast.success('Sponsorship bid submitted!');
          }}
        />
      )}
    </section>
  );
};

export default ChallengeSection;
