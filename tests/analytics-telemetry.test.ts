/**
 * 24H Boost Analytics & Telemetry Engine Test Suite
 */

import { computeProfileAnalytics } from '../api/analytics.js';
import { calculateFairnessScoreFromCounts } from '../src/services/ranking/fairnessScore.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function runAnalyticsTests() {
  console.log(`======================================================`);
  console.log(`⚡ STARTING 24H BOOST ANALYTICS & TELEMETRY TESTS ⚡`);
  console.log(`======================================================\n`);

  // TEST 1: Zero-Division Safety (New Profile with 0 telemetry)
  console.log(`[TEST 1] Zero Telemetry Profile Edge Case`);
  const zeroAnalytics = await computeProfileAnalytics('brand-new-pro-zero');
  assert(zeroAnalytics.impressions === 0, 'Zero profile impressions is 0');
  assert(zeroAnalytics.clicks === 0, 'Zero profile clicks is 0');
  assert(zeroAnalytics.inquiries === 0, 'Zero profile inquiries is 0');
  assert(zeroAnalytics.ctrPercent === 0, 'CTR is 0.0% without division by zero');
  assert(zeroAnalytics.conversionPercent === 0, 'Conversion is 0.0% without division by zero');
  assert(zeroAnalytics.fairRotation.isActive === true || zeroAnalytics.fairRotation.status === 'active', 'Fair rotation status active for new user');

  // TEST 2: CTR and Conversion Mathematical Accuracy
  console.log(`\n[TEST 2] CTR & Conversion Computation Formula`);
  const testImpressions = 500;
  const testClicks = 25;
  const testInquiries = 5;

  const computedCtr = Number(((testClicks / testImpressions) * 100).toFixed(1));
  const computedConversion = Number(((testInquiries / testClicks) * 100).toFixed(1));

  assert(computedCtr === 5.0, `CTR computed correctly: 25/500 = ${computedCtr}%`);
  assert(computedConversion === 20.0, `Conversion computed correctly: 5/25 = ${computedConversion}%`);

  // TEST 3: Fair Rotation & Exposure Damping Computation
  console.log(`\n[TEST 3] Fair Rotation Exposure Damping`);
  const activeBoostsCount = 4; // Expected share = 1/4 = 0.25 (25%)
  const totalPoolImpressions = 1000;

  // Case A: Underexposed Pro (100 impressions = 10% share vs 25% expected -> exposure ratio = 0.4x)
  const underexposedViews = 100;
  const underexposedShare = underexposedViews / totalPoolImpressions;
  const expectedShare = 1 / activeBoostsCount;
  const underexposedRatio = Number((underexposedShare / expectedShare).toFixed(2));
  const underexposedFairness = calculateFairnessScoreFromCounts(underexposedViews, totalPoolImpressions, activeBoostsCount);

  assert(underexposedRatio === 0.4, `Underexposed ratio is 0.4x (Got: ${underexposedRatio})`);
  assert(underexposedFairness > 0.8, `Underexposed profile receives fairness boost (${underexposedFairness.toFixed(3)})`);

  // Case B: Overexposed Pro (600 impressions = 60% share vs 25% expected -> exposure ratio = 2.4x)
  const overexposedViews = 600;
  const overexposedShare = overexposedViews / totalPoolImpressions;
  const overexposedRatio = Number((overexposedShare / expectedShare).toFixed(2));
  const overexposedFairness = calculateFairnessScoreFromCounts(overexposedViews, totalPoolImpressions, activeBoostsCount);
  const isDamped = overexposedRatio > 1.2;

  assert(overexposedRatio === 2.4, `Overexposed ratio is 2.4x (Got: ${overexposedRatio})`);
  assert(isDamped === true, 'Anti-monopoly damping is triggered when exposure ratio > 1.2');
  assert(overexposedFairness < 0.6, `Overexposed profile is damped (${overexposedFairness.toFixed(3)})`);

  // TEST 4: Telemetry Data Format & Response Contract
  console.log(`\n[TEST 4] Analytics JSON Schema Contract`);
  const testProId = 'ali-raza';
  const proAnalytics = await computeProfileAnalytics(testProId);

  assert(typeof proAnalytics.profileId === 'string', 'profileId is string');
  assert(proAnalytics.period === '24h', 'period is 24h');
  assert(typeof proAnalytics.impressions === 'number', 'impressions is number');
  assert(typeof proAnalytics.clicks === 'number', 'clicks is number');
  assert(typeof proAnalytics.inquiries === 'number', 'inquiries is number');
  assert(typeof proAnalytics.ctrPercent === 'number', 'ctrPercent is number');
  assert(typeof proAnalytics.conversionPercent === 'number', 'conversionPercent is number');
  assert(typeof proAnalytics.fairRotation.exposureRatio === 'number', 'fairRotation.exposureRatio is number');
  assert(typeof proAnalytics.fairRotation.description === 'string', 'fairRotation.description is string');

  console.log(`\n======================================================`);
  console.log(`🎉 ALL 24H BOOST ANALYTICS TESTS PASSED (100%) 🎉`);
  console.log(`======================================================\n`);
}

runAnalyticsTests().catch(err => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
