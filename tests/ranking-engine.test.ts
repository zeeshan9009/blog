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
import { validateImpressionEvent, validateClickEvent, verifyProfilePromotionEligibility } from '../src/services/ranking/antiAbuse';
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

  // Test 8: Profile promotion eligibility
  const completeProfile = verifyProfilePromotionEligibility(nodeDev);
  const incompleteProfile = verifyProfilePromotionEligibility({ name: 'Incomplete Dev', bio: 'Short' });
  const t8 = completeProfile.isEligible === true && incompleteProfile.isEligible === false;
  results['8. Eligibility: Incomplete profile blocked from $1 promotion purchase'] = t8;
  console.log(`[TEST 8] Eligibility Check: Complete = ${completeProfile.isEligible}, Incomplete = ${incompleteProfile.isEligible} -> ${t8 ? 'PASS' : 'FAIL'}`);

  // Test 9: End-to-end Search Pipeline
  const searchResp = executeProRankSearch(allTestPros, { query: 'Node.js' });
  const sponsoredIds = searchResp.sponsored.map(s => s.profile.id);
  const t9 = sponsoredIds.includes('node-ahmed') && !sponsoredIds.includes('designer-sara');
  results['9. Search Pipeline: Gated sponsored results + separate organic results'] = t9;
  console.log(`[TEST 9] Search Pipeline: Sponsored Count = ${searchResp.sponsored.length}, Organic Count = ${searchResp.organic.length} -> ${t9 ? 'PASS' : 'FAIL'}`);

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
