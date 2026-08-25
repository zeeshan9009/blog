import { supabase } from '../../lib/supabase';
import type { SponsorshipTier, ChallengeSponsorship } from '../../types/challenge';

export const SPONSORSHIP_PRICING: Record<SponsorshipTier, { amountCents: number; label: string; perks: string[] }> = {
  bronze: {
    amountCents: 5000, // $50.00
    label: 'Bronze Sponsor',
    perks: ['"Sponsored by {Company}" badge on the challenge arena page', 'Direct brand link']
  },
  silver: {
    amountCents: 15000, // $150.00
    label: 'Silver Sponsor',
    perks: [
      'Featured company logo on the homepage Challenge Arena card',
      'Dedicated sponsor callout on challenge details',
      'Direct brand link'
    ]
  },
  gold: {
    amountCents: 30000, // $300.00
    label: 'Gold Flagship Sponsor',
    perks: [
      '48-hour co-branded promotion in the Top Developer rail alongside the winner',
      'Featured homepage logo & arena banner placement',
      'Direct brand link & co-tagged social announcements'
    ]
  }
};

/**
 * Checks if a sponsorship tier is available for a challenge.
 * First-payment-wins model.
 */
export async function checkSponsorshipAvailability(
  challengeId: string,
  tier: SponsorshipTier
): Promise<{ available: boolean; reason?: string }> {
  try {
    const { data: challenge } = await supabase
      .from('challenges')
      .select('status')
      .eq('id', challengeId)
      .single();

    if (!challenge) {
      return { available: false, reason: 'Challenge not found' };
    }

    if (challenge.status !== 'draft' && challenge.status !== 'open_entry') {
      return { available: false, reason: 'Sponsorships can only be claimed prior to submission window' };
    }

    const { data: existing } = await supabase
      .from('challenge_sponsorships')
      .select('id, company_name')
      .eq('challenge_id', challengeId)
      .eq('tier', tier)
      .eq('status', 'succeeded')
      .maybeSingle();

    if (existing) {
      return {
        available: false,
        reason: `The ${tier.toUpperCase()} tier for this challenge has already been claimed by ${existing.company_name}.`
      };
    }

    return { available: true };
  } catch (err: any) {
    return { available: false, reason: err.message || 'Availability check failed' };
  }
}

/**
 * Records a successful sponsorship after payment confirmation.
 */
export async function recordSponsorship(
  challengeId: string,
  tier: SponsorshipTier,
  companyName: string,
  companyLogoUrl: string | undefined,
  companyLink: string | undefined,
  stripePaymentIntentId: string
): Promise<ChallengeSponsorship | null> {
  try {
    const amountCents = SPONSORSHIP_PRICING[tier].amountCents;

    const { data, error } = await supabase
      .from('challenge_sponsorships')
      .insert({
        challenge_id: challengeId,
        tier,
        company_name: companyName,
        company_logo_url: companyLogoUrl,
        company_link: companyLink,
        amount_cents: amountCents,
        stripe_payment_intent_id: stripePaymentIntentId,
        status: 'succeeded'
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording sponsorship:', error);
      return null;
    }

    return {
      id: data.id,
      challengeId: data.challenge_id,
      tier: data.tier,
      companyName: data.company_name,
      companyLogoUrl: data.company_logo_url,
      companyLink: data.company_link,
      amountCents: data.amount_cents,
      stripePaymentIntentId: data.stripe_payment_intent_id,
      status: data.status,
      createdAt: data.created_at
    };
  } catch (err) {
    console.error('recordSponsorship exception:', err);
    return null;
  }
}
