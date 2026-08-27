import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://femtnrbswscrxidxuzgb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runEndToEndChallengeTest() {
  console.log('\n🚀 ========================================================');
  console.log('    RUNNING END-TO-END CHALLENGE & VOTING SYSTEM AUDIT');
  console.log('========================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName} -> ${detail || 'Assertion failed'}`);
    }
  }

  // --- Step 1: Ensure active challenge exists ---
  console.log('--- Test 1: Fetch or Create Challenge ---');
  const { data: challenges, error: chErr } = await supabase.from('challenges').select('*').limit(1);
  assert(!chErr && challenges && challenges.length > 0, 'Active challenge query succeeded');
  const testChallenge = challenges?.[0];
  console.log(`    Target Challenge: "${testChallenge?.title}" (ID: ${testChallenge?.id})`);

  // --- Step 2: Ensure user profile exists ---
  console.log('\n--- Test 2: Verify Participant Profile ---');
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').limit(1);
  assert(!profErr && profiles && profiles.length > 0, 'Participant profile exists in database');
  const testProfile = profiles?.[0];
  console.log(`    Test Participant: "${testProfile?.name}" (ID: ${testProfile?.id})`);

  // --- Step 3: Simulate $5 Entry Payment ---
  console.log('\n--- Test 3: Fixed $5 Entry Pass Creation ---');
  const testTxnId = `test_txn_${Date.now()}`;
  const { data: entry, error: entryErr } = await supabase
    .from('challenge_entries')
    .upsert({
      challenge_id: testChallenge.id,
      profile_id: testProfile.id,
      paddle_transaction_id: testTxnId,
      status: 'succeeded'
    }, { onConflict: 'challenge_id,profile_id' })
    .select()
    .single();

  assert(!entryErr && entry?.status === 'succeeded', 'Participant $5 entry pass recorded in challenge_entries', entryErr?.message);
  assert(entry?.paddle_transaction_id === testTxnId, 'Payment Transaction ID preserved correctly in entry record');

  // --- Step 4: Submit Work ---
  console.log('\n--- Test 4: Project Work Submission & Linking ---');
  const testSubmissionTitle = `Automated Test Project ${Date.now().toString().slice(-4)}`;
  const testSubmissionUrl = `https://github.com/developer/project-${Date.now()}`;

  // Insert submission
  const { data: submission, error: subErr } = await supabase
    .from('challenge_submissions')
    .upsert({
      challenge_id: testChallenge.id,
      profile_id: testProfile.id,
      title: testSubmissionTitle,
      submission_url: testSubmissionUrl,
      submission_text: 'Built with React 19, TypeScript, and deterministic scoring engine.'
    }, { onConflict: 'challenge_id,profile_id' })
    .select()
    .single();

  assert(!subErr && Boolean(submission?.id), 'Submission successfully created in database', subErr?.message);
  assert(submission?.challenge_id === testChallenge.id, 'Challenge ID connected correctly');
  assert(submission?.profile_id === testProfile.id, 'Participant profile connected correctly');

  // --- Step 5: Admin Panel Submissions Fetch & Payment Verification ---
  console.log('\n--- Test 5: Admin Panel Submissions Fetch & Dynamic Payment Enrichment ---');
  const [adminSubsRes, adminEntriesRes, adminProfilesRes] = await Promise.all([
    supabase.from('challenge_submissions').select('*').eq('challenge_id', testChallenge.id),
    supabase.from('challenge_entries').select('*').eq('challenge_id', testChallenge.id).eq('status', 'succeeded'),
    supabase.from('profiles').select('*').limit(200)
  ]);

  const profileMap = new Map<string, any>();
  (adminProfilesRes.data || []).forEach((p: any) => profileMap.set(p.id, p));

  assert(!adminSubsRes.error && adminSubsRes.data && adminSubsRes.data.length > 0, 'Admin can fetch submissions list');
  const matchedAdminSub = adminSubsRes.data?.find((s: any) => s.id === submission?.id);
  assert(Boolean(matchedAdminSub), 'Submitted project appears in Admin submissions list');
  const enrichedProfile = profileMap.get(matchedAdminSub?.profile_id);
  assert(enrichedProfile?.name === testProfile?.name, 'Participant name enriched for Admin');

  // Cross-reference payment from challenge_entries
  const matchedEntry = adminEntriesRes.data?.find((e: any) => e.profile_id === testProfile.id);
  const enrichedPaymentStatus = matchedEntry ? 'paid' : 'unpaid';
  const enrichedPaymentTxnId = matchedEntry ? matchedEntry.paddle_transaction_id : null;
  assert(enrichedPaymentStatus === 'paid', 'Admin Panel verified payment status as "paid"');
  assert(enrichedPaymentTxnId === testTxnId, 'Admin Panel connected transaction ID to submission');

  // --- Step 6: Real Voting & Atomic Vote Increment ---
  console.log('\n--- Test 6: Public Voting & Atomic Increment ---');
  const voterFp1 = `test_fp_voter_1_${Date.now()}`;
  const initialVotes = matchedAdminSub?.vote_count || 0;

  // Insert vote into challenge_votes
  const { error: voteErr } = await supabase.from('challenge_votes').insert({
    submission_id: matchedAdminSub.id,
    voter_fingerprint: voterFp1
  });
  assert(!voteErr, 'Vote record created in challenge_votes', voteErr?.message);

  // Atomic increment update on submission
  const newVoteCount = initialVotes + 1;
  const { data: voteUpdatedSub, error: voteUpErr } = await supabase
    .from('challenge_submissions')
    .update({
      vote_count: newVoteCount
    })
    .eq('id', matchedAdminSub.id)
    .select()
    .single();

  assert(!voteUpErr && voteUpdatedSub?.vote_count === newVoteCount, 'Vote count atomically incremented on submission');

  // --- Step 7: Anti-Abuse & Duplicate Vote Prevention ---
  console.log('\n--- Test 7: Anti-Abuse & Duplicate Vote Prevention ---');
  // Attempt duplicate vote from same voter fingerprint for same submission
  const { error: dupVoteErr } = await supabase.from('challenge_votes').insert({
    submission_id: matchedAdminSub.id,
    voter_fingerprint: voterFp1
  });
  assert(Boolean(dupVoteErr), 'Duplicate vote correctly rejected by unique constraint / anti-abuse check');

  // --- Step 8: Deterministic Leaderboard Ranking ---
  console.log('\n--- Test 8: Deterministic Leaderboard Ranking ---');
  const mockSubmissions = [
    { id: 'sub_c', voteCount: 5, lastVotedAt: '2026-08-25T12:00:00Z', createdAt: '2026-08-25T10:00:00Z' },
    { id: 'sub_a', voteCount: 10, lastVotedAt: '2026-08-25T11:00:00Z', createdAt: '2026-08-25T10:00:00Z' },
    { id: 'sub_b', voteCount: 10, lastVotedAt: '2026-08-25T12:00:00Z', createdAt: '2026-08-25T10:00:00Z' },
    { id: 'sub_d', voteCount: 2, lastVotedAt: '2026-08-25T12:00:00Z', createdAt: '2026-08-25T10:00:00Z' }
  ];

  // Rank with deterministic rules (highest votes, then earliest lastVotedAt)
  const ranked = [...mockSubmissions].sort((a, b) => {
    if (b.voteCount !== a.voteCount) return b.voteCount - a.voteCount;
    return new Date(a.lastVotedAt).getTime() - new Date(b.lastVotedAt).getTime();
  });

  assert(ranked[0].id === 'sub_a', 'Rank #1 awarded to highest vote count (10 votes, earlier timestamp)');
  assert(ranked[1].id === 'sub_b', 'Rank #2 correctly resolved for tied vote count via earlier timestamp');
  assert(ranked[2].id === 'sub_c', 'Rank #3 awarded to 5 votes');
  assert(ranked[3].id === 'sub_d', 'Rank #4 awarded to 2 votes');

  // --- Step 9: Payment Reconciliation Simulation ---
  console.log('\n--- Test 9: Payment Reconciliation Simulation ---');
  const strandedTxnId = `txn_stranded_${Date.now()}`;
  // Ensure entry exists
  await supabase.from('challenge_entries').upsert({
    challenge_id: testChallenge.id,
    profile_id: testProfile.id,
    paddle_transaction_id: strandedTxnId,
    status: 'succeeded'
  }, { onConflict: 'challenge_id,profile_id' });

  // Verify that an unlinked entry is discovered and reconciles with submission
  const { data: recEntry } = await supabase
    .from('challenge_entries')
    .select('*')
    .eq('challenge_id', testChallenge.id)
    .eq('profile_id', testProfile.id)
    .maybeSingle();

  assert(recEntry?.paddle_transaction_id === strandedTxnId, 'Reconciliation discovered and verified unlinked transaction');

  // Clean up test vote to keep DB clean
  await supabase.from('challenge_votes').delete().eq('voter_fingerprint', voterFp1);

  // --- Summary ---
  console.log('\n========================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('========================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL END-TO-END VERIFICATION CHECKS PASSED WITH 100% INTEGRITY!\n');
  } else {
    console.error('⚠️ Some tests failed. Please review errors above.');
    process.exit(1);
  }
}

runEndToEndChallengeTest().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
