/**
 * Challenge Arena Fixed-$2 Bid Service
 * 
 * Manages fixed-$2 prize pool expansion payments:
 * - Fixed $2.00 (200 cents) per bid
 * - 10% platform fee cut ($0.20 platform fee, $1.80 net added to prize pool)
 * - Pure prize pool expansion: strictly disconnected from voting / rankings
 */

export const FIXED_BID_AMOUNT_CENTS = 200; // $2.00
export const PLATFORM_FEE_BPS = 1000; // 10% (1000 basis points)

const BID_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_BIDS_PER_WINDOW = 10;
const ipBidHistory = new Map<string, number[]>();

export interface BidFeeBreakdown {
  grossAmountCents: number;
  grossAmountDollars: number;
  platformFeeCents: number;
  platformFeeDollars: number;
  netPrizePoolCents: number;
  netPrizePoolDollars: number;
}

/**
 * Calculates the exact fee breakdown for a fixed $2 challenge prize pool bid.
 */
export function calculateBidFeeBreakdown(
  amountCents: number = FIXED_BID_AMOUNT_CENTS,
  platformFeeBps: number = PLATFORM_FEE_BPS
): BidFeeBreakdown {
  const grossAmountCents = Math.max(100, amountCents);
  const platformFeeCents = Math.round((grossAmountCents * platformFeeBps) / 10000);
  const netPrizePoolCents = grossAmountCents - platformFeeCents;

  return {
    grossAmountCents,
    grossAmountDollars: Number((grossAmountCents / 100).toFixed(2)),
    platformFeeCents,
    platformFeeDollars: Number((platformFeeCents / 100).toFixed(2)),
    netPrizePoolCents,
    netPrizePoolDollars: Number((netPrizePoolCents / 100).toFixed(2))
  };
}

/**
 * Validates bid request rate limiting
 */
export function validateBidRateLimit(visitorIp: string): { isAllowed: boolean; rejectionReason?: string } {
  const now = Date.now();
  const ip = visitorIp || 'unknown_ip';

  const timestamps = ipBidHistory.get(ip) || [];
  const validTimestamps = timestamps.filter(ts => now - ts < BID_RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_BIDS_PER_WINDOW) {
    return {
      isAllowed: false,
      rejectionReason: `Rate limit exceeded: maximum ${MAX_BIDS_PER_WINDOW} bid checkout sessions per minute allowed.`
    };
  }

  validTimestamps.push(now);
  ipBidHistory.set(ip, validTimestamps);
  return { isAllowed: true };
}

/**
 * Sanitize bidder labels and sponsor messages to prevent XSS/abuse
 */
export function sanitizeBidderInput(label?: string, message?: string): { cleanLabel: string; cleanMessage?: string } {
  const cleanLabel = (label || 'Anonymous Supporter')
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 40);

  const cleanMessage = message
    ? message.trim().replace(/[<>]/g, '').slice(0, 140)
    : undefined;

  return {
    cleanLabel: cleanLabel.length > 0 ? cleanLabel : 'Anonymous Supporter',
    cleanMessage
  };
}
