/**
 * ProRank Sponsored Promotion & Ranking Engine Automated Test Suite
 */

import { calculateRelevanceScore, MINIMUM_SPONSORED_RELEVANCE_THRESHOLD } from '../src/services/ranking/relevanceScore';
import { calculateProfileQualityScore } from '../src/services/ranking/profileQualityScore';
import { calculateProfessionalScore } from '../src/services/ranking/professionalScore';
import { calculateFreshnessScore } from '../src/services/ranking/freshnessScore';
import { calculateFairnessScore } from '../src/services/ranking/fairnessScore';
import { calculateRotationFactor } from '../src/services/ranking/rotation';
import { rankSponsoredProfiles } from '../src/services/ranking/promotionRanker';
import { rankOrganicProfiles } from '../src/services/ranking/organicRanker';
import { executeProRankSearch } from '../src/services/ranking/searchEngine';
import { validateImpressionEvent, validateClickEvent, verifyProfilePromotionEligibility, isSponsoredEligible } from '../src/services/ranking/antiAbuse';
import type { Professional } from '../src/types/talent';

// Mock Profiles for Testing
const nodeDev: Professional = {
  id: 'node-ahmed',
  name: 'Ahmed Khan',
  title: 'Node.js Backend Developer',
  category: 'Development',
  location: 'Islamabad, Pakistan',
  country: 'Pakistan',
  avatar: 'https://example.com/avatar1.jpg',
  bio: 'Expert in Node.js microservices, Express, MongoDB, Redis, REST APIs and distributed systems.',
  hourlyRate: 50,
  experienceYears: 6,
  score: 96,
  rating: 4.9,
  reviewCount: 120,
  skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'TypeScript'],
  experience: [],
  portfolio: [{ id: 'p1', title: 'API Gateway', description: 'Node API', imageUrl: 'img.jpg', tags: ['Node.js'] }],
  reviews: [],
  externalLinks: { github: 'https://github.com' },
  isVerified: true,
  isPromoted: true,
  promotionExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours remaining
  viewsCount: 200,
  clicksCount: 50,
  inquiriesCount: 10,
  createdAt: '2025-01-01',
};

const graphicDesigner: Professional = {
  id: 'designer-sara',
  name: 'Sara Designer',
  title: 'Senior Graphic & Logo Designer',
  category: 'Design',
  location: 'Lahore, Pakistan',
  country: 'Pakistan',
  avatar: 'https://example.com/avatar2.jpg',
  bio: 'Specialist in Adobe Illustrator, brand logos, vector illustration and social media flyers.',
  hourlyRate: 35,
  experienceYears: 4,
  score: 92,
  rating: 5.0,
  reviewCount: 80,
  skills: ['Graphic Design', 'Logo Design', 'Illustrator', 'Photoshop', 'Brand Identity'],
  experience: [],
  portfolio: [{ id: 'p2', title: 'Brand Kit', description: 'Logos', imageUrl: 'img.jpg', tags: ['Logo'] }],
  reviews: [],
  externalLinks: { website: 'https://sara.design' },
  isVerified: true,
  isPromoted: true,
  promotionExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  viewsCount: 600, // Overexposed
  clicksCount: 100,
  inquiriesCount: 12,
  createdAt: '2025-01-01',
};

const reactDev: Professional = {
  id: 'react-bilal',
  name: 'Bilal React',
  title: 'React & Next.js Frontend Developer',
  category: 'Development',
  location: 'Karachi, Pakistan',
  country: 'Pakistan',
  avatar: 'https://example.com/avatar3.jpg',
  bio: 'Specializing in React, Next.js, Tailwind CSS, TypeScript and responsive web design.',
  hourlyRate: 45,
  experienceYears: 5,
  score: 95,
  rating: 4.8,
  reviewCount: 65,
  skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Redux'],
  experience: [],
  portfolio: [{ id: 'p3', title: 'SaaS App', description: 'Next.js', imageUrl: 'img.jpg', tags: ['React'] }],
  reviews: [],
  externalLinks: { github: 'https://github.com' },
  isVerified: true,
  isPromoted: true,
  promotionExpiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  viewsCount: 100, // Underexposed
  clicksCount: 20,
  inquiriesCount: 5,
  createdAt: '2025-01-01',
};

export function runAllTests(): { passed: boolean; results: Record<string, boolean> } {
  const results: Record<string, boolean> = {};

  console.log('\n======================================================');
  console.log('⚡ STARTING PRORANK RANKING & PROMOTION TEST SUITE ⚡');
  console.log('======================================================\n');

  // Test 1: Relevance scoring & ranking
  const nodeQuery = 'Node.js Developer';
  const nodeRel = calculateRelevanceScore(nodeDev, nodeQuery);
  const designRel = calculateRelevanceScore(graphicDesigner, nodeQuery);

  const t1 = nodeRel.score > designRel.score && nodeRel.score >= 0.7;
  results['1. Relevance: Node.js query matches Node.js dev over Designer'] = t1;
  console.log(`[TEST 1] Relevance Score: Node Dev = ${nodeRel.score}, Designer = ${designRel.score} -> ${t1 ? 'PASS' : 'FAIL'}`);

  // Test 2: Minimum relevance threshold (0.35)
  const t2 = designRel.score < MINIMUM_SPONSORED_RELEVANCE_THRESHOLD && !designRel.isSponsoredEligible;
  results['2. Minimum Threshold: Irrelevant profile (R < 0.35) blocked from Sponsored'] = t2;
  console.log(`[TEST 2] Minimum Threshold (0.35): Designer relevance ${designRel.score} eligible: ${designRel.isSponsoredEligible} -> ${t2 ? 'PASS' : 'FAIL'}`);

  // Test 3: Profile Quality & Professional Score
  const quality = calculateProfileQualityScore(nodeDev);
  const profScore = calculateProfessionalScore(nodeDev);
  const t3 = quality > 0.7 && profScore.displayScore === 96;
  results['3. Profile Quality & ProRank Score Calculation'] = t3;
  console.log(`[TEST 3] Quality: ${quality}, ProRank Score: ${profScore.displayScore}/100 -> ${t3 ? 'PASS' : 'FAIL'}`);

  // Test 4: Freshness decay
  const freshNow = calculateFreshnessScore(Date.now());
  const fresh12h = calculateFreshnessScore(Date.now() - 12 * 60 * 60 * 1000);
  const fresh24h = calculateFreshnessScore(Date.now() - 24 * 60 * 60 * 1000);
  const t4 = freshNow > fresh12h && fresh12h > fresh24h && Math.abs(freshNow - 1.0) < 0.05;
  results['4. Freshness Score Exponential Decay: exp(-t/24)'] = t4;
  console.log(`[TEST 4] Freshness: 0h = ${freshNow}, 12h = ${fresh12h}, 24h = ${fresh24h} -> ${t4 ? 'PASS' : 'FAIL'}`);

  // Test 5: Fairness distribution
  const allTestPros = [nodeDev, graphicDesigner, reactDev];
  const fairnessOverexposed = calculateFairnessScore(graphicDesigner, 3, allTestPros);
  const fairnessUnderexposed = calculateFairnessScore(reactDev, 3, allTestPros);
  const t5 = fairnessUnderexposed > fairnessOverexposed;
  results['5. Fairness Score: Underexposed gets boost, overexposed gets penalty'] = t5;
  console.log(`[TEST 5] Fairness: Overexposed (600 views) = ${fairnessOverexposed}, Underexposed (100 views) = ${fairnessUnderexposed} -> ${t5 ? 'PASS' : 'FAIL'}`);

  // Test 6: Controlled rotation
  const rot1 = calculateRotationFactor(nodeDev.id, Date.now());
  const rot2 = calculateRotationFactor(nodeDev.id, Date.now() + 10 * 60 * 1000); // 10 mins later (diff bucket)
  const t6 = rot1 >= 0 && rot1 <= 0.03 && rot2 >= 0 && rot2 <= 0.03;
  results['6. Controlled Rotation: Factor strictly bounded within [0, 0.03]'] = t6;
  console.log(`[TEST 6] Rotation Factor Bounded: rot1 = ${rot1}, rot2 = ${rot2} -> ${t6 ? 'PASS' : 'FAIL'}`);

  // Test 7: Anti-abuse deduplication
  const visitorA = 'test_hash_visitor_123';
  const firstImpression = validateImpressionEvent(visitorA, nodeDev.id);
  const duplicateImpression = validateImpressionEvent(visitorA, nodeDev.id); // Immediate repeat
  const t7 = firstImpression === true && duplicateImpression === false;
  results['7. Anti-Abuse: Deduplicate impressions within 30-minute cooldown window'] = t7;
  console.log(`[TEST 7] Anti-Abuse: 1st Impression = ${firstImpression}, 2nd Immediate = ${duplicateImpression} (deduped) -> ${t7 ? 'PASS' : 'FAIL'}`);

  // Test 8: Profile promotion eligibility & Quality Gate
  const completeProfile = verifyProfilePromotionEligibility(nodeDev);
  const incompleteProfile = verifyProfilePromotionEligibility({ name: 'Incomplete Dev', bio: 'Short' });
  const t8 = completeProfile.isEligible === true && incompleteProfile.isEligible === false;
  results['8. Eligibility: Incomplete profile blocked from $2 promotion purchase'] = t8;
  console.log(`[TEST 8] Eligibility Check: Complete = ${completeProfile.isEligible}, Incomplete = ${incompleteProfile.isEligible} -> ${t8 ? 'PASS' : 'FAIL'}`);

  // Test 9: Sponsored Quality Gate Edge Cases
  const brandNewPro = isSponsoredEligible({ reviewCount: 0, rating: 5.0, activeDisputes: 0, accountStanding: 'active' });
  const freshPro = isSponsoredEligible({ reviewCount: 2, rating: 3.5, activeDisputes: 0 }); // Grace period
  const lowRatedPro = isSponsoredEligible({ reviewCount: 5, rating: 3.9, activeDisputes: 0 }); // Blocked (rating < 4.0 with >=3 reviews)
  const disputedPro = isSponsoredEligible({ reviewCount: 20, rating: 4.9, activeDisputes: 1 }); // Blocked
  const flaggedPro = isSponsoredEligible({ reviewCount: 10, rating: 4.8, accountStanding: 'flagged' }); // Blocked
  const resolvedPro = isSponsoredEligible({ reviewCount: 20, rating: 4.9, activeDisputes: 0, accountStanding: 'active' }); // Re-eligible

  const t9 =
    brandNewPro.isEligible === true &&
    freshPro.isEligible === true &&
    lowRatedPro.isEligible === false &&
    disputedPro.isEligible === false &&
    flaggedPro.isEligible === false &&
    resolvedPro.isEligible === true;
  results['9. Quality Gate: Grace period for new users, blocks low-rated (3.9 with 5 reviews), disputed & flagged accounts'] = t9;
  console.log(`[TEST 9] Quality Gate: BrandNew=${brandNewPro.isEligible}, Fresh=${freshPro.isEligible}, LowRated=${lowRatedPro.isEligible}, Disputed=${disputedPro.isEligible}, Flagged=${flaggedPro.isEligible}, Resolved=${resolvedPro.isEligible} -> ${t9 ? 'PASS' : 'FAIL'}`);

  // Test 10: Promotion Ranker exclusion of quality gate violations
  const lowRatedPromotedNode: Professional = {
    ...nodeDev,
    id: 'node-lowrated',
    rating: 3.8,
    reviewCount: 10,
    isPromoted: true,
  };
  const rankedWithLowRated = rankSponsoredProfiles([lowRatedPromotedNode, nodeDev], 'Node.js');
  const t10 = rankedWithLowRated.some(r => r.profile.id === 'node-ahmed') && !rankedWithLowRated.some(r => r.profile.id === 'node-lowrated');
  results['10. Promotion Ranker: Automatically excludes paid profiles that fail quality gate'] = t10;
  console.log(`[TEST 10] Promotion Ranker Quality Gate Filtering: Excluded LowRated Pro -> ${t10 ? 'PASS' : 'FAIL'}`);

  // Test 11: End-to-end Search Pipeline
  const searchResp = executeProRankSearch(allTestPros, { query: 'Node.js' });
  const sponsoredIds = searchResp.sponsored.map(s => s.profile.id);
  const t11 = sponsoredIds.includes('node-ahmed') && !sponsoredIds.includes('designer-sara');
  results['11. Search Pipeline: Gated sponsored results + separate organic results'] = t11;
  console.log(`[TEST 11] Search Pipeline: Sponsored Count = ${searchResp.sponsored.length}, Organic Count = ${searchResp.organic.length} -> ${t11 ? 'PASS' : 'FAIL'}`);

  // Test 12: Relevance-First Ranking (Low cached_score newbie vs High cached_score generic pro on niche query)
  const nicheNewbie: Professional = {
    id: 'solidity-newbie',
    name: 'Zayn Web3',
    title: 'Solidity & Smart Contract Developer',
    category: 'Development',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    avatar: 'https://example.com/avatar4.jpg',
    bio: 'Specialist in Ethereum EVM, Solidity smart contracts, Hardhat, DeFi protocols, and security audits.',
    hourlyRate: 60,
    experienceYears: 1,
    score: 65, // Low initial score (new freelancer)
    rating: 5.0,
    reviewCount: 0,
    skills: ['Solidity', 'Smart Contracts', 'Web3', 'Ethereum', 'Hardhat'],
    experience: [],
    portfolio: [{ id: 'p4', title: 'ERC20 Staking', description: 'DeFi protocol', imageUrl: 'img.jpg', tags: ['Solidity'] }],
    reviews: [],
    externalLinks: { github: 'https://github.com/solidity-newbie' },
    isVerified: true,
    isPromoted: false,
    viewsCount: 10,
    clicksCount: 2,
    inquiriesCount: 1,
    createdAt: '2025-02-01',
  };

  const genericHighScorer: Professional = {
    ...nodeDev,
    id: 'generic-star',
    name: 'Generic Veteran',
    score: 99, // Very high cached score
    skills: ['JavaScript', 'HTML', 'CSS', 'Node.js', 'Express'],
    title: 'Senior Full Stack Web Developer',
    bio: '10 years experience building general websites and standard web portals.',
  };

  const nicheSearchResult = executeProRankSearch([genericHighScorer, nicheNewbie], { query: 'Solidity Smart Contract' });
  const topOrganicResult = nicheSearchResult.organic[0];
  const t12 = topOrganicResult && topOrganicResult.profile.id === 'solidity-newbie' && topOrganicResult.organicScore > 0.8;
  results['12. Relevance-First: Niche exact skill match (newbie score 65) beats generic star (score 99)'] = t12;
  console.log(`[TEST 12] Relevance-First Search: Top Result = ${topOrganicResult?.profile.name} (Score: ${topOrganicResult?.organicScore}) -> ${t12 ? 'PASS' : 'FAIL'}`);

  const allPassed = Object.values(results).every(Boolean);
  console.log('\n======================================================');
  console.log(`FINAL TEST STATUS: ${allPassed ? 'ALL TESTS PASSED (100%)' : 'SOME TESTS FAILED'}`);
  console.log('======================================================\n');

  return { passed: allPassed, results };
}

// Execute if run directly
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  runAllTests();
}
