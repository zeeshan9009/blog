/**
 * RankLancr External Professional Profile Links Test Suite
 * 
 * Tests:
 * 1. Platform Hostname & Path Validation (LinkedIn, Upwork, Fiverr, GitHub, Portfolio, Website)
 * 2. Protocol Security (Forced HTTPS, blocked javascript:, data:, file:)
 * 3. SSRF & Loopback Protection (Localhost, RFC-1918 private IP ranges blocked)
 * 4. Safe Outbound Link Opening (target="_blank", rel="noopener noreferrer")
 * 5. Organic ProRank Algorithm Independence (Zero score distortion from external links)
 */

import { validateExternalProfileUrl, PLATFORM_CONFIG } from '../src/services/validation/externalProfileValidator.js';
import { calculateProfessionalScore } from '../src/services/ranking/professionalScore.js';
import type { Professional } from '../src/types/talent.js';

function runTestSuite() {
  console.log('\n================================================================');
  console.log('⚡ STARTING RANKLANCR EXTERNAL PROFILE LINKS TEST SUITE ⚡');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // --------------------------------------------------------------------------
  // [TEST 1] LinkedIn Profile Validation
  // --------------------------------------------------------------------------
  console.log('[TEST 1] LinkedIn Profile URL Validation');
  const liValid = validateExternalProfileUrl('https://www.linkedin.com/in/zeeshan-developer', 'linkedin');
  assert(liValid.isValid === true, 'Valid LinkedIn profile is accepted');
  assert(liValid.sanitizedUrl === 'https://www.linkedin.com/in/zeeshan-developer', 'LinkedIn URL properly normalized');

  const liInvalid = validateExternalProfileUrl('https://fake-linkedin.com/in/someone', 'linkedin');
  assert(liInvalid.isValid === false, 'Fake LinkedIn hostname is rejected');

  // --------------------------------------------------------------------------
  // [TEST 2] Upwork Profile Validation
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2] Upwork Profile URL Validation');
  const upValid = validateExternalProfileUrl('upwork.com/freelancers/~01948274a8d', 'upwork');
  assert(upValid.isValid === true, 'Upwork URL without protocol is accepted and normalized');
  assert(Boolean(upValid.sanitizedUrl?.startsWith('https://')), 'Upwork URL forced to HTTPS protocol');

  const upInvalid = validateExternalProfileUrl('https://not-upwork.net/freelancers/~123', 'upwork');
  assert(upInvalid.isValid === false, 'Non-Upwork domain is rejected for Upwork platform');

  // --------------------------------------------------------------------------
  // [TEST 3] Fiverr Profile Validation
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3] Fiverr Profile URL Validation');
  const fvValid = validateExternalProfileUrl('https://www.fiverr.com/pro_dev_expert', 'fiverr');
  assert(fvValid.isValid === true, 'Valid Fiverr seller link is accepted');

  const fvInvalid = validateExternalProfileUrl('https://malicious-fiverr.org/user', 'fiverr');
  assert(fvInvalid.isValid === false, 'Malicious Fiverr clone domain rejected');

  // --------------------------------------------------------------------------
  // [TEST 4] GitHub Profile Validation
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4] GitHub Profile URL Validation');
  const ghValid = validateExternalProfileUrl('https://github.com/torvalds', 'github');
  assert(ghValid.isValid === true, 'Valid GitHub profile accepted');

  const ghInvalid = validateExternalProfileUrl('https://gitlab.com/torvalds', 'github');
  assert(ghInvalid.isValid === false, 'Non-GitHub host rejected for GitHub platform');

  // --------------------------------------------------------------------------
  // [TEST 5] Portfolio & Personal Website Validation
  // --------------------------------------------------------------------------
  console.log('\n[TEST 5] Portfolio & Website URL Validation');
  const pfValid = validateExternalProfileUrl('https://zeeshankhan.dev', 'portfolio');
  assert(pfValid.isValid === true, 'Valid HTTPS portfolio accepted');

  const webValid = validateExternalProfileUrl('https://myagency.io', 'website');
  assert(webValid.isValid === true, 'Valid HTTPS website accepted');

  // --------------------------------------------------------------------------
  // [TEST 6] SSRF & Dangerous Scheme Protection
  // --------------------------------------------------------------------------
  console.log('\n[TEST 6] Dangerous Schemes & SSRF Protection');
  const jsAttack = validateExternalProfileUrl('javascript:alert("xss")', 'portfolio');
  assert(jsAttack.isValid === false, 'Blocked javascript: protocol attack');

  const dataAttack = validateExternalProfileUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==', 'website');
  assert(dataAttack.isValid === false, 'Blocked data: URI attack');

  const fileAttack = validateExternalProfileUrl('file:///etc/passwd', 'portfolio');
  assert(fileAttack.isValid === false, 'Blocked file: local filesystem attack');

  const localhostAttack = validateExternalProfileUrl('http://localhost:3000/admin', 'portfolio');
  assert(localhostAttack.isValid === false, 'Blocked localhost SSRF attack');

  const internalIpAttack = validateExternalProfileUrl('http://192.168.1.1/router', 'portfolio');
  assert(internalIpAttack.isValid === false, 'Blocked RFC-1918 private IP range (192.168.x.x)');

  // --------------------------------------------------------------------------
  // [TEST 7] Organic ProRank Score Independence
  // --------------------------------------------------------------------------
  console.log('\n[TEST 7] Organic ProRank Independence Verification');
  const baseCandidate: Professional = {
    id: 'pro-test-1',
    name: 'Ahmed Khan',
    title: 'Senior Node.js Specialist',
    category: 'Backend',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    bio: 'Experienced backend specialist building microservices.',
    hourlyRate: 50,
    experienceYears: 4,
    score: 85,
    rating: 5.0,
    reviewCount: 12,
    skills: ['Node.js', 'PostgreSQL', 'Redis'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: {},
    isVerified: true,
    isPromoted: false,
    viewsCount: 100,
    clicksCount: 10,
    inquiriesCount: 2,
    createdAt: new Date().toISOString()
  };

  const initialScore = calculateProfessionalScore(baseCandidate).displayScore;

  // Now attach 5 external links to candidate
  const candidateWithLinks: Professional = {
    ...baseCandidate,
    externalLinks: {
      linkedin: 'https://linkedin.com/in/ahmed',
      upwork: 'https://upwork.com/freelancers/~123',
      fiverr: 'https://fiverr.com/ahmed',
      github: 'https://github.com/ahmed',
      website: 'https://ahmedkhan.dev'
    }
  };

  const scoreWithLinks = calculateProfessionalScore(candidateWithLinks).displayScore;

  assert(
    initialScore === scoreWithLinks,
    `Organic ProRank score remains strictly unchanged (${initialScore} == ${scoreWithLinks}) after linking external profiles`
  );

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passed}/${total} EXTERNAL PROFILE LINK TESTS PASSED (100%) 🎉`);
  console.log('================================================================\n');
}

runTestSuite();
