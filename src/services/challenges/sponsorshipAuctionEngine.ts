import { supabase } from '../../lib/supabase';
import type { ChallengeSponsorshipAuction, SponsorshipBidRecord } from '../../types/challenge';

export const BASE_AUCTION_FLOOR_CENTS = 10000; // $100.00 USD
export const BASE_MIN_INCREMENT_CENTS = 2500;  // $25.00 USD or +10%

/**
 * Calculates the minimum qualifying next bid for the challenge sponsorship auction.
 * Rule: +10% or +$25.00, whichever is higher.
 */
export function calculateMinNextSponsorshipBid(currentBidCents: number): number {
  if (!currentBidCents || currentBidCents < BASE_AUCTION_FLOOR_CENTS) {
    return BASE_AUCTION_FLOOR_CENTS;
  }
  const incrementByPercent = Math.ceil(currentBidCents * 0.10);
  const increment = Math.max(BASE_MIN_INCREMENT_CENTS, incrementByPercent);
  return currentBidCents + increment;
}

/**
 * Validates a proposed sponsorship auction bid against current state and challenge phase.
 */
export async function validateSponsorshipAuctionBid(
  challengeId: string,
  amountCents: number
): Promise<{ allowed: boolean; minRequiredCents: number; reason?: string }> {
  try {
    // 1. Check challenge phase
    const { data: challenge, error: chErr } = await supabase
      .from('challenges')
      .select('status')
      .eq('id', challengeId)
      .single();

    if (chErr || !challenge) {
      return { allowed: false, minRequiredCents: BASE_AUCTION_FLOOR_CENTS, reason: 'Challenge not found' };
    }

    if (challenge.status !== 'open_entry' && challenge.status !== 'submission_window') {
      return {
        allowed: false,
        minRequiredCents: BASE_AUCTION_FLOOR_CENTS,
        reason: 'Sponsorship auction is only open during entry and submission windows prior to voting.'
      };
    }

    // 2. Query current high bid on this challenge slot
    const { data: slot } = await supabase
      .from('challenge_sponsorship_slots')
      .select('current_bid_cents')
      .eq('challenge_id', challengeId)
      .maybeSingle();

    const currentBidCents = slot?.current_bid_cents || 0;
    const minRequiredCents = calculateMinNextSponsorshipBid(currentBidCents);

    if (amountCents < minRequiredCents) {
      return {
        allowed: false,
        minRequiredCents,
        reason: `Bid amount $${(amountCents / 100).toFixed(2)} is below the minimum qualifying outbid of $${(minRequiredCents / 100).toFixed(2)}.`
      };
    }

    return { allowed: true, minRequiredCents };
  } catch (err: any) {
    return { allowed: false, minRequiredCents: BASE_AUCTION_FLOOR_CENTS, reason: err.message || 'Validation error' };
  }
}

/**
 * Records a verified winning outbid in the database.
 * Updates the live slot holder and records to immutable ledger.
 */
export async function recordSponsorshipAuctionBid(params: {
  challengeId: string;
  companyName: string;
  companyLogoUrl?: string;
  companyLink?: string;
  amountCents: number;
  stripePaymentIntentId: string;
}): Promise<{ success: boolean; slot?: ChallengeSponsorshipAuction }> {
  try {
    const nowIso = new Date().toISOString();

    // 1. Insert into immutable ledger
    await supabase.from('challenge_sponsorship_bids').insert({
      challenge_id: params.challengeId,
      company_name: params.companyName,
      company_logo_url: params.companyLogoUrl,
      company_link: params.companyLink,
      amount_cents: params.amountCents,
      stripe_payment_intent_id: params.stripePaymentIntentId,
      status: 'succeeded'
    });

    // 2. Upsert the live slot holder
    const { data: updatedSlot, error: slotErr } = await supabase
      .from('challenge_sponsorship_slots')
      .upsert({
        challenge_id: params.challengeId,
        current_bid_cents: params.amountCents,
        min_increment_cents: BASE_MIN_INCREMENT_CENTS,
        current_sponsor_name: params.companyName,
        current_sponsor_logo_url: params.companyLogoUrl,
        current_sponsor_link: params.companyLink,
        claimed_at: nowIso
      }, { onConflict: 'challenge_id' })
      .select()
      .single();

    if (slotErr) {
      console.error('Error updating sponsorship auction slot:', slotErr);
      return { success: false };
    }

    const minNext = calculateMinNextSponsorshipBid(updatedSlot.current_bid_cents);

    return {
      success: true,
      slot: {
        id: updatedSlot.id,
        challengeId: updatedSlot.challenge_id,
        currentBidCents: updatedSlot.current_bid_cents,
        minIncrementCents: updatedSlot.min_increment_cents,
        minNextBidCents: minNext,
        currentSponsorName: updatedSlot.current_sponsor_name,
        currentSponsorLogoUrl: updatedSlot.current_sponsor_logo_url,
        currentSponsorLink: updatedSlot.current_sponsor_link,
        totalBidsCount: (updatedSlot.total_bids_count || 0) + 1,
        claimedAt: updatedSlot.claimed_at
      }
    };
  } catch (err) {
    console.error('recordSponsorshipAuctionBid exception:', err);
    return { success: false };
  }
}
