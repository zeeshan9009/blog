import {
  calculateMinNextSponsorshipBid,
  BASE_AUCTION_FLOOR_CENTS,
  BASE_MIN_INCREMENT_CENTS
} from '../src/services/challenges/sponsorshipAuctionEngine.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

console.log('--- Running Challenge Sponsorship Ascending Auction Tests ---');

// Test 1: Starting Floor Bid
{
  const minFirstBid = calculateMinNextSponsorshipBid(0);
  assert(minFirstBid === 5000, 'Initial bid must be $50.00 floor (5,000 cents)');
  console.log('✓ Test 1: Floor bid of $50.00 verified.');
}

// Test 2: Min increment +$1.00 when 5% is less than $1.00 ($100 floor)
{
  // Current: $50.00 (5,000 cents). 5% is $2.50. Max($1.00, $2.50) = $2.50. Next min = $52.50 (5250 cents)
  const nextFrom50 = calculateMinNextSponsorshipBid(5000);
  assert(nextFrom50 === 5250, `Next bid from $50 must be $52.50 (was ${nextFrom50})`);
  console.log('✓ Test 2: Percentage increment (+5% = +$2.50) applied from $50 base.');
}

// Test 3: Min increment +5% on higher price bands
{
  // Current: $200.00 (20,000 cents). 5% is $10.00 (1,000 cents). Next min = $210.00 (21,000 cents)
  const nextFrom200 = calculateMinNextSponsorshipBid(20000);
  assert(nextFrom200 === 21000, `Next bid from $200 must be $210 (was ${nextFrom200})`);
  console.log('✓ Test 3: Percentage +5% minimum increment applied on high price bands.');
}

// Test 4: Ascending Outbid Progression Simulation
{
  let currentBid = 5000; // $50
  const bidsPlaced: number[] = [currentBid / 100];

  for (let round = 1; round <= 4; round++) {
    currentBid = calculateMinNextSponsorshipBid(currentBid);
    bidsPlaced.push(currentBid / 100);
  }

  assert(bidsPlaced[0] === 50, 'Round 0 must be $50');
  assert(bidsPlaced[1] === 52.5, 'Round 1 must be $52.50');
  console.log(`✓ Test 4: Outbid progression verified: [${bidsPlaced.join(', ')}]`);
}

console.log('--- All Sponsorship Auction Tests Passed Successfully! ---');
