import { supabase } from '../../lib/supabase';
import type { ChallengeEntry } from '../../types/challenge';

export interface EntryValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validates if a user/profile is eligible to enter a challenge.
 * Quality gate: Account must be in good standing, no active disputes.
 */
export async function validateChallengeEntryEligibility(
  challengeId: string,
  profileId: string
): Promise<EntryValidationResult> {
  try {
    // 1. Check challenge existence and status
    const { data: challenge, error: chErr } = await supabase
      .from('challenges')
      .select('status, entry_deadline')
      .eq('id', challengeId)
      .single();

    if (chErr || !challenge) {
      return { allowed: false, reason: 'Challenge not found' };
    }

    if (challenge.status !== 'open_entry') {
      return { allowed: false, reason: `Entries are closed. Current status: ${challenge.status}` };
    }

    if (challenge.entry_deadline && new Date(challenge.entry_deadline) <= new Date()) {
      return { allowed: false, reason: 'Entry deadline has passed' };
    }

    // 2. Check if already entered
    const { data: existingEntry } = await supabase
      .from('challenge_entries')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('profile_id', profileId)
      .eq('status', 'succeeded')
      .maybeSingle();

    if (existingEntry) {
      return { allowed: false, reason: 'You have already entered this challenge' };
    }

    // 3. Check profile standing quality gate (reusing isSponsoredEligible principle)
    const { data: profile } = await supabase
      .from('profiles')
      .select('status, active_disputes, account_standing')
      .eq('id', profileId)
      .maybeSingle();

    if (profile) {
      if (profile.status === 'suspended' || profile.account_standing === 'suspended') {
        return { allowed: false, reason: 'Account is suspended from challenge participation' };
      }
      if (Number(profile.active_disputes || 0) > 0) {
        return { allowed: false, reason: 'Accounts with active disputes are ineligible to enter' };
      }
    }

    return { allowed: true };
  } catch (err: any) {
    return { allowed: false, reason: err.message || 'Validation error' };
  }
}

/**
 * Creates a record of successful entry in challenge_entries table
 */
export async function recordChallengeEntry(
  challengeId: string,
  profileId: string,
  stripePaymentIntentId: string
): Promise<ChallengeEntry | null> {
  try {
    const { data, error } = await supabase
      .from('challenge_entries')
      .insert({
        challenge_id: challengeId,
        profile_id: profileId,
        stripe_payment_intent_id: stripePaymentIntentId,
        status: 'succeeded'
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording challenge entry:', error);
      return null;
    }

    return {
      id: data.id,
      challengeId: data.challenge_id,
      profileId: data.profile_id,
      stripePaymentIntentId: data.stripe_payment_intent_id,
      status: data.status,
      createdAt: data.created_at
    };
  } catch (err) {
    console.error('recordChallengeEntry exception:', err);
    return null;
  }
}
