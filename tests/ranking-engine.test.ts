/**
 * RankLancr ProRank Organic Ranking Engine Automated Test Suite
 */

import { calculateRelevanceScore } from '../src/services/ranking/relevanceScore';
import { calculateProfileQualityScore } from '../src/services/ranking/profileQualityScore';
import { calculateProfessionalScore } from '../src/services/ranking/professionalScore';
import { rankOrganicProfiles } from '../src/services/ranking/organicRanker';
import { executeProRankSearch } from '../src/services/ranking/searchEngine';
import { isSponsoredEligible } from '../src/services/ranking/antiAbuse';
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
  bio: 'Expert in Node.js microservices, Express, MongoDB, Redis, REST APIs and distributed systems with high scalability.',
  hourlyRate: 50,
  experienceYears: 6,
  score: 96,
  rating: 4.9,
  reviewCount: 120,
  skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'TypeScript'],
  experience: [
    {
      id: 'e1',
      title: 'Senior Backend Engineer',
      company: 'Tech Corp',
      period: '2021 - Present',
      description: 'Led architecture for Node microservices'
    }
  ],
  portfolio: [
    { id: 'p1', title: 'API Gateway', description: 'Node API with JWT and Redis', imageUrl: 'img.jpg', tags: ['Node.js'] },
    { id: 'p2', title: 'Payment Service', description: 'Stripe integration', imageUrl: 'img2.jpg', tags: ['Express'] }
  ],
  reviews: [],
  externalLinks: { github: 'https://github.com' },
  isVerified: true,
  isPromoted: false,
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
  isPromoted: false,
  viewsCount: 600,
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
  isPromoted: false,
  viewsCount: 100,
  clicksCount: 20,
  inquiriesCount: 5,
  createdAt: '2025-01-01',
};

const lowRatingDev: Professional = {
  id: 'low-rating-dev',
  name: 'Disputed Dev',
  title: 'Low Rating Developer',
  category: 'Development',
  location: 'Global',
  country: 'Global',
  avatar: 'https://example.com/avatar4.jpg',
  bio: 'Developer with issues',
  hourlyRate: 20,
  experienceYears: 1,
  score: 40,
  rating: 3.2,
  reviewCount: 10,
  activeDisputes: 2,
  accountStanding: 'flagged',
  skills: ['PHP'],
  experience: [],
  portfolio: [],
  reviews: [],
  externalLinks: {},
  isVerified: false,
  isPromoted: false,
  viewsCount: 10,
  clicksCount: 1,
  inquiriesCount: 0,
  createdAt: '2025-01-01'
};

async function runTests() {
  console.log("=================================================");
  console.log("  PRORANK ORGANIC RANKING & INTEGRITY TEST SUITE  ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Relevance Score Tests
  console.log("[1] RELEVANCE SCORE ALGORITHM TESTS");
  const nodeQueryRel = calculateRelevanceScore(nodeDev, "Node.js Express API");
  assert(nodeQueryRel.score >= 0.50, `Node dev relevance to Node query should be >= 0.50 (got ${nodeQueryRel.score})`);
  assert(nodeQueryRel.breakdown.titleMatch > 0, "Title match breakdown should be > 0");

  const nodeDesignerQueryRel = calculateRelevanceScore(nodeDev, "Logo Design Photoshop");
  assert(nodeDesignerQueryRel.score < 0.20, `Node dev relevance to Design query should be low (got ${nodeDesignerQueryRel.score})`);

  // 2. Profile Quality & Professional Score Tests
  console.log("\n[2] QUALITY & PROFESSIONAL SCORING TESTS");
  const quality = calculateProfileQualityScore(nodeDev);
  assert(quality >= 0.85, `Profile quality score for complete profile should be >= 0.85 (got ${quality})`);

  const proScore = calculateProfessionalScore(nodeDev);
  assert(proScore.displayScore >= 80, `Professional score should be >= 80 (got ${proScore.displayScore})`);

  // 3. Quality Gate & Anti-Abuse
  console.log("\n[3] QUALITY GATE TESTS (SPOTLIGHT & AUCTION ELIGIBILITY)");
  assert(isSponsoredEligible(nodeDev).isEligible === true, "High rating profile with 0 disputes should be eligible");
  assert(isSponsoredEligible(lowRatingDev).isEligible === false, "Low rating profile with disputes must be rejected");

  // 4. Organic Ranking Order
  console.log("\n[4] ORGANIC RANKING ENGINE TESTS");
  const organicRanked = rankOrganicProfiles([nodeDev, graphicDesigner, reactDev], "React Frontend Next.js");
  assert(organicRanked[0].profile.id === 'react-bilal', `Top organic profile for React search should be Bilal React (got ${organicRanked[0]?.profile?.name})`);

  // 5. Complete Search Execution
  console.log("\n[5] SEARCH ENGINE INTEGRATION TESTS");
  const searchResults = executeProRankSearch([nodeDev, graphicDesigner, reactDev], {
    query: "Node.js",
    page: 1,
    limit: 10
  });

  assert(searchResults.sponsored.length === 0, "Sponsored results array should be empty following legacy boost removal");
  assert(searchResults.organic.length > 0, "Organic results should return matching profiles");
  assert(searchResults.organic[0].profile.id === 'node-ahmed', "Top organic match for Node.js should be Ahmed Khan");

  console.log("\n-------------------------------------------------");
  console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("-------------------------------------------------");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
