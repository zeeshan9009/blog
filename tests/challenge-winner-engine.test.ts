import { rankSubmissions } from '../src/services/challenges/challengeWinnerEngine';
import { SPONSORSHIP_PRICING } from '../src/services/challenges/sponsorshipService';
import { validateChallengeVote, resetVoteRateLimitStore } from '../src/services/challenges/challengeVoteService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

console.log('--- Running Challenge-First Unit Tests ---');

// Test 1: Pure Merit Ranking Algorithm (Vote count descending)
{
  const mockSubmissions = [
    { id: 'sub-1', profileId: 'user-1', voteCount: 15, createdAt: new Date('2026-08-25T10:00:00Z') },
    { id: 'sub-2', profileId: 'user-2', voteCount: 42, createdAt: new Date('2026-08-25T11:00:00Z') },
    { id: 'sub-3', profileId: 'user-3', voteCount: 28, createdAt: new Date('2026-08-25T09:00:00Z') },
  ];

  const ranked = rankSubmissions(mockSubmissions);
  assert(ranked.length === 3, 'Should rank all 3 submissions');
  assert(ranked[0].submissionId === 'sub-2' && ranked[0].rank === 1, 'Top vote getter must be Rank 1 (42 votes)');
  assert(ranked[1].submissionId === 'sub-3' && ranked[1].rank === 2, 'Second highest vote getter must be Rank 2 (28 votes)');
  assert(ranked[2].submissionId === 'sub-1' && ranked[2].rank === 3, 'Third highest vote getter must be Rank 3 (15 votes)');
  console.log('✓ Test 1: Pure merit ranking sorted by vote counts passed.');
}

// Test 2: Tie-Breaking by Submission Timestamp (Earlier submission wins)
{
  const mockTiedSubmissions = [
    { id: 'sub-late', profileId: 'user-late', voteCount: 30, createdAt: new Date('2026-08-25T14:00:00Z') },
    { id: 'sub-early', profileId: 'user-early', voteCount: 30, createdAt: new Date('2026-08-25T08:00:00Z') },
  ];

  const ranked = rankSubmissions(mockTiedSubmissions);
  assert(ranked[0].submissionId === 'sub-early' && ranked[0].rank === 1, 'Earlier timestamp must win in a tie');
  assert(ranked[1].submissionId === 'sub-late' && ranked[1].rank === 2, 'Later timestamp must place second in a tie');
  console.log('✓ Test 2: Tie-breaker by timestamp passed.');
}

// Test 3: 3-Tier Sponsorship Pricing
{
  assert(SPONSORSHIP_PRICING.bronze.amountCents === 5000, 'Bronze tier must be $50.00 (5000 cents)');
  assert(SPONSORSHIP_PRICING.silver.amountCents === 15000, 'Silver tier must be $150.00 (15000 cents)');
  assert(SPONSORSHIP_PRICING.gold.amountCents === 30000, 'Gold tier must be $300.00 (30000 cents)');
  console.log('✓ Test 3: 3-Tier Sponsorship pricing verified ($50, $150, $300).');
}

// Test 4: Voting Rate Limiter & Fingerprint Validation
{
  resetVoteRateLimitStore();

  const ip = '192.168.1.100';
  for (let i = 0; i < 5; i++) {
    const res = validateChallengeVote({ visitorIp: ip, userAgent: 'test-ua', clientProvidedFingerprint: 'fp-1' });
    assert(res.isValid, `Vote ${i + 1} within window should be valid`);
  }

  // 6th vote within same minute should be rejected by rate limiter
  const sixthVote = validateChallengeVote({ visitorIp: ip, userAgent: 'test-ua', clientProvidedFingerprint: 'fp-1' });
  assert(!sixthVote.isValid, '6th vote in 1 minute must be rejected by rate limiter');
  console.log('✓ Test 4: Voting rate limiter (5 votes/min) passed.');
}

console.log('--- All Challenge-First Unit Tests Passed Successfully! ---');
