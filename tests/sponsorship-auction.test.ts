import {
  calculateMinNextSponsorshipBid,
  BASE_AUCTION_FLOOR_CENTS,
  BASE_MIN_INCREMENT_CENTS
} from '../src/services/challenges/sponsorshipAuctionEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

console.log('--- Running Challenge Sponsorship Ascending Auction Tests ---');

// Test 1: Starting Floor Bid
{
  const minFirstBid = calculateMinNextSponsorshipBid(0);
  assert(minFirstBid === 10000, 'Initial bid must be $100.00 floor (10,000 cents)');
  console.log('✓ Test 1: Floor bid of $100.00 verified.');
}

// Test 2: Min increment +$25 when 10% is less than $25
{
  // Current: $100.00 (10,000 cents). 10% is $10.00. Max($25, $10) = $25. Next min = $125.00
  const nextFrom100 = calculateMinNextSponsorshipBid(10000);
  assert(nextFrom100 === 12500, `Next bid from $100 must be $125 (was ${nextFrom100})`);

  // Current: $150.00 (15,000 cents). 10% is $15.00. Max($25, $15) = $25. Next min = $175.00
  const nextFrom150 = calculateMinNextSponsorshipBid(15000);
  assert(nextFrom150 === 17500, `Next bid from $150 must be $175 (was ${nextFrom150})`);
  console.log('✓ Test 2: Fixed +$25.00 minimum increment applied on low price bands.');
}

// Test 3: Min increment +10% when 10% exceeds $25
{
  // Current: $400.00 (40,000 cents). 10% is $40.00. Max($25, $40) = $40. Next min = $440.00 (44,000 cents)
  const nextFrom400 = calculateMinNextSponsorshipBid(40000);
  assert(nextFrom400 === 44000, `Next bid from $400 must be $440 (was ${nextFrom400})`);

  // Current: $1,000.00 (100,000 cents). 10% is $100.00. Next min = $1,100.00 (110,000 cents)
  const nextFrom1000 = calculateMinNextSponsorshipBid(100000);
  assert(nextFrom1000 === 110000, `Next bid from $1000 must be $1100 (was ${nextFrom1000})`);
  console.log('✓ Test 3: Percentage +10% minimum increment applied on high price bands.');
}

// Test 4: Multi-round Outbid War Simulation
{
  let currentBid = 0;
  const bidsPlaced: number[] = [];

  for (let round = 1; round <= 5; round++) {
    const minNext = calculateMinNextSponsorshipBid(currentBid);
    currentBid = minNext;
    bidsPlaced.push(currentBid / 100);
  }

  // Round 1: $100 -> Round 2: $125 -> Round 3: $150 -> Round 4: $175 -> Round 5: $200
  assert(bidsPlaced[0] === 100, 'Round 1 must be $100');
  assert(bidsPlaced[1] === 125, 'Round 2 must be $125');
  assert(bidsPlaced[2] === 150, 'Round 3 must be $150');
  assert(bidsPlaced[3] === 175, 'Round 4 must be $175');
  assert(bidsPlaced[4] === 200, 'Round 5 must be $200');
  console.log(`✓ Test 4: 5-round outbid progression verified: [${bidsPlaced.join(', ')}]`);
}

console.log('--- All Sponsorship Auction Tests Passed Successfully! ---');
