import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "ranklancr@gmail.com").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSKEY || "ranklancr_admin_2026";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "ranklancr_admin_token_2026_secure";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function verifyAdminAuth(req: IncomingMessage, body: any): boolean {
  const authHeader = req.headers["x-admin-key"] || req.headers["authorization"]?.replace("Bearer ", "");
  if (authHeader === ADMIN_SECRET || authHeader === ADMIN_PASSWORD) return true;
  if (body && (body.adminKey === ADMIN_SECRET || body.adminKey === ADMIN_PASSWORD)) return true;
  return false;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-key");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  try {
    const host = req.headers?.host || "localhost";
    const rawUrl = req.url || "/";
    const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
    const action = parsedUrl.searchParams.get("action") || "";

    // 1. Email & Password Verification Endpoint
    if (req.method === "POST" && action === "auth") {
      const body = await parseBody(req);
      const emailInput = (body.email || "").toLowerCase().trim();
      const passwordInput = body.password || body.passkey || "";

      // Verify email and password
      const isEmailValid = emailInput === ADMIN_EMAIL || (!emailInput && body.passkey === ADMIN_PASSWORD);
      const isPasswordValid = passwordInput === ADMIN_PASSWORD;

      if (isEmailValid && isPasswordValid) {
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          token: ADMIN_SECRET,
          adminEmail: ADMIN_EMAIL,
          message: "Admin authentication successful"
        }));
        return;
      }

      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Invalid admin email or password. Access denied." }));
      return;
    }

    // Verify auth for all other actions
    const body = req.method === "POST" ? await parseBody(req) : {};
    if (!verifyAdminAuth(req, body)) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized. Admin passkey required." }));
      return;
    }

    // =========================================================================
    // 2. GET stats & submissions — Comprehensive Telemetry & Submissions List
    // =========================================================================
    if (req.method === "GET" && (action === "stats" || action === "submissions" || !action)) {
      try {
        const [
          chRes,
          entriesRes,
          subsRes,
          sponsRes,
          auctionSlotsRes,
          spotlightSlotsRes,
          profilesRes,
          settingsRes
        ] = await Promise.all([
          supabase.from("challenges").select("*").order("created_at", { ascending: false }),
          supabase.from("challenge_entries").select("*").eq("status", "succeeded"),
          supabase.from("challenge_submissions").select("*").order("created_at", { ascending: false }),
          supabase.from("challenge_sponsorships").select("*").eq("status", "succeeded"),
          supabase.from("challenge_sponsorship_slots").select("*"),
          supabase.from("promoted_slots").select("*").order("slot_index", { ascending: true }),
          supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200),
          supabase.from("challenge_voting_settings").select("*")
        ]);

        const challenges = chRes.data || [];
        const entries = entriesRes.data || [];
        const submissions = subsRes.data || [];
        const sponsorships = sponsRes.data || [];
        const auctionSlots = auctionSlotsRes.data || [];
        const spotlightSlots = spotlightSlotsRes.data || [];
        const profiles = profilesRes.data || [];
        const votingSettingsList = settingsRes.data || [];

        // Build entries map by (challenge_id + profile_id) for rapid payment cross-referencing
        const entriesMap = new Map<string, any>();
        entries.forEach((e: any) => {
          entriesMap.set(`${e.challenge_id}_${e.profile_id}`, e);
        });

        const challengeMap = new Map<string, any>();
        challenges.forEach((c: any) => challengeMap.set(c.id, c));

        const profileMap = new Map<string, any>();
        profiles.forEach((p: any) => profileMap.set(p.id, p));

        const enrichedSubmissions = submissions.map((s: any) => {
          const entryKey = `${s.challenge_id}_${s.profile_id}`;
          const entry = entriesMap.get(entryKey);
          const ch = challengeMap.get(s.challenge_id) || {};
          const prof = profileMap.get(s.profile_id) || {};

          const paymentStatus = s.payment_status || (entry ? "paid" : "unpaid");
          const paymentTxnId = s.payment_transaction_id || (entry ? entry.paddle_transaction_id : null);
          const submissionStatus = s.status || (paymentStatus === "paid" ? "submitted" : "draft");

          return {
            id: s.id,
            challengeId: s.challenge_id,
            challengeTitle: ch.title || "Challenge",
            profileId: s.profile_id,
            authorName: prof.name || s.profiles?.name || "Participant",
            authorEmail: prof.email || s.profiles?.email || "N/A",
            authorAvatar: prof.profile_image || s.profiles?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.id)}`,
            authorHeadline: prof.headline || s.profiles?.headline || "Developer",
            title: s.title,
            submissionUrl: s.submission_url,
            submissionText: s.submission_text,
            status: submissionStatus,
            paymentStatus: paymentStatus,
            paymentTransactionId: paymentTxnId,
            reviewFeedback: s.review_feedback,
            voteCount: Number(s.vote_count || 0),
            createdAt: s.created_at,
            updatedAt: s.updated_at || s.created_at
          };
        });

        const entryRevenueDollars = entries.length * 5.0;
        const fixedSponsorshipDollars = sponsorships.reduce((sum, s) => sum + (s.amount_cents || 0) / 100, 0);
        const auctionSponsorshipDollars = auctionSlots.reduce((sum, s) => sum + ((s.current_bid_cents || 0) / 100), 0);
        const spotlightRevenueDollars = spotlightSlots.reduce((sum, s) => sum + ((s.current_price_cents || 0) / 100), 0);

        const totalRevenueDollars = entryRevenueDollars + fixedSponsorshipDollars + auctionSponsorshipDollars + spotlightRevenueDollars;

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          financials: {
            totalRevenueDollars,
            entryRevenueDollars,
            sponsorshipRevenueDollars: fixedSponsorshipDollars + auctionSponsorshipDollars,
            spotlightRevenueDollars
          },
          metrics: {
            totalChallenges: challenges.length,
            activeChallenges: challenges.filter(c => c.status !== "closed").length,
            totalEntries: entries.length,
            totalSubmissions: enrichedSubmissions.length,
            pendingSubmissions: enrichedSubmissions.filter(s => s.status === "submitted" || s.status === "submission_pending").length,
            approvedSubmissions: enrichedSubmissions.filter(s => s.status === "approved").length,
            rejectedSubmissions: enrichedSubmissions.filter(s => s.status === "rejected").length,
            totalVotes: enrichedSubmissions.reduce((sum, s) => sum + s.voteCount, 0),
            totalProfiles: profiles.length
          },
          challenges: challenges.map(c => ({
            ...c,
            votingSettings: votingSettingsList.find(vs => vs.challenge_id === c.id) || null
          })),
          submissions: enrichedSubmissions,
          sponsorships,
          auctionSlots,
          spotlightSlots,
          profiles
        }));
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Failed to fetch stats" }));
        return;
      }
    }

    // =========================================================================
    // 3. POST /api/admin?action=approve-submission
    // =========================================================================
    if (req.method === "POST" && action === "approve-submission") {
      const { submissionId } = body;
      if (!submissionId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "submissionId is required" }));
        return;
      }

      const { data: updated, error } = await supabase
        .from("challenge_submissions")
        .update({
          status: "approved",
          updated_at: new Date().toISOString()
        })
        .eq("id", submissionId)
        .select("*, profiles(*)")
        .single();

      if (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      // Notify participant
      if (updated?.profile_id) {
        try {
          await supabase.from("notifications").insert({
            user_id: updated.profile_id,
            challenge_id: updated.challenge_id,
            type: "submission_approved",
            title: "Project Approved! 🎉",
            message: `Your project "${updated.title}" has been approved and is now live on the public voting page!`
          });
        } catch {}
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, submission: updated, message: "Submission approved successfully" }));
      return;
    }

    // =========================================================================
    // 4. POST /api/admin?action=reject-submission
    // =========================================================================
    if (req.method === "POST" && action === "reject-submission") {
      const { submissionId, reason } = body;
      if (!submissionId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "submissionId is required" }));
        return;
      }

      const { data: updated, error } = await supabase
        .from("challenge_submissions")
        .update({
          status: "rejected",
          review_feedback: reason || "Submission did not meet challenge criteria",
          updated_at: new Date().toISOString()
        })
        .eq("id", submissionId)
        .select()
        .single();

      if (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      // Notify participant
      if (updated?.profile_id) {
        try {
          await supabase.from("notifications").insert({
            user_id: updated.profile_id,
            challenge_id: updated.challenge_id,
            type: "submission_rejected",
            title: "Submission Status Update",
            message: `Your submission was not approved. Feedback: ${reason || "Does not meet challenge specifications."}`
          });
        } catch {}
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, submission: updated, message: "Submission marked as rejected" }));
      return;
    }

    // =========================================================================
    // 5. POST /api/admin?action=request-changes
    // =========================================================================
    if (req.method === "POST" && action === "request-changes") {
      const { submissionId, feedback } = body;
      if (!submissionId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "submissionId is required" }));
        return;
      }

      const { data: updated, error } = await supabase
        .from("challenge_submissions")
        .update({
          status: "submission_pending",
          review_feedback: feedback || "Changes requested by reviewer",
          updated_at: new Date().toISOString()
        })
        .eq("id", submissionId)
        .select()
        .single();

      if (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      // Notify participant
      if (updated?.profile_id) {
        try {
          await supabase.from("notifications").insert({
            user_id: updated.profile_id,
            challenge_id: updated.challenge_id,
            type: "changes_requested",
            title: "Changes Requested on Project",
            message: `The challenge review team requested changes on your project: ${feedback || "Please review requirements."}`
          });
        } catch {}
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, submission: updated, message: "Changes requested from participant" }));
      return;
    }

    // =========================================================================
    // 6. POST /api/admin?action=reconcile-payments — Batch Reconcile
    // =========================================================================
    if (req.method === "POST" && action === "reconcile-payments") {
      try {
        const { data: entries } = await supabase
          .from("challenge_entries")
          .select("*")
          .eq("status", "succeeded");

        let reconciledCount = 0;
        if (entries && entries.length > 0) {
          for (const entry of entries) {
            const { data: sub } = await supabase
              .from("challenge_submissions")
              .select("id, status, payment_status, payment_transaction_id")
              .eq("challenge_id", entry.challenge_id)
              .eq("profile_id", entry.profile_id)
              .maybeSingle();

            if (sub) {
              if (sub.payment_status !== "paid" || !sub.payment_transaction_id || sub.status === "draft" || sub.status === "payment_pending") {
                await supabase
                  .from("challenge_submissions")
                  .update({
                    payment_status: "paid",
                    payment_transaction_id: entry.paddle_transaction_id || `txn_rec_${Date.now()}`,
                    status: sub.status === "draft" || sub.status === "payment_pending" ? "submitted" : sub.status,
                    updated_at: new Date().toISOString()
                  })
                  .eq("id", sub.id);
                reconciledCount++;
              }
            }
          }
        }

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          reconciledCount,
          message: `Payment reconciliation completed. ${reconciledCount} submission(s) synchronized.`
        }));
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || "Failed to reconcile payments" }));
        return;
      }
    }

    // =========================================================================
    // 7. POST /api/admin?action=update-voting-settings
    // =========================================================================
    if (req.method === "POST" && action === "update-voting-settings") {
      const {
        challengeId,
        maxVotesPerVoter,
        allowOncePerParticipant,
        requireAuth,
        isPublic,
        minVotes,
        maxVotes,
        votingStartAt,
        votingEndAt,
        voteStatus
      } = body;

      if (!challengeId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "challengeId is required" }));
        return;
      }

      const payload = {
        challenge_id: challengeId,
        max_votes_per_voter: Number(maxVotesPerVoter) || 1,
        allow_once_per_participant: allowOncePerParticipant !== false,
        require_auth: Boolean(requireAuth),
        is_public: isPublic !== false,
        min_votes: Number(minVotes) || 1,
        max_votes: Number(maxVotes) || 10,
        voting_start_at: votingStartAt || null,
        voting_end_at: votingEndAt || null,
        vote_status: voteStatus || "active",
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("challenge_voting_settings")
        .upsert(payload, { onConflict: "challenge_id" })
        .select()
        .single();

      if (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, votingSettings: data, message: "Voting rules updated successfully" }));
      return;
    }

    // =========================================================================
    // 8. POST create-challenge
    // =========================================================================
    if (req.method === "POST" && action === "create-challenge") {
      const { title, prompt, category, bannerImage, entryFeeDollars } = body;
      if (!title || !prompt) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: "Title and prompt are required" }));
        return;
      }

      const now = Date.now();
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const payload = {
        title: title.trim(),
        slug: baseSlug || `challenge-${now}`,
        prompt: prompt.trim(),
        category: category || "Development",
        banner_image: bannerImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
        entry_fee_cents: Math.round((Number(entryFeeDollars) || 5) * 100),
        status: "open_entry",
        entry_deadline: new Date(now + 2 * 86400000).toISOString(),
        submission_deadline: new Date(now + 5 * 86400000).toISOString(),
        voting_deadline: new Date(now + 8 * 86400000).toISOString()
      };

      const { data, error } = await supabase
        .from("challenges")
        .insert(payload)
        .select()
        .single();

      if (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: error.message }));
        return;
      }

      // Initialize default voting settings for challenge
      if (data?.id) {
        try {
          await supabase.from("challenge_voting_settings").insert({
            challenge_id: data.id,
            max_votes_per_voter: 1,
            allow_once_per_participant: true,
            require_auth: false,
            is_public: true,
            voting_start_at: data.submission_deadline,
            voting_end_at: data.voting_deadline,
            vote_status: "upcoming"
          });
        } catch {}
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, challenge: data }));
      return;
    }

    // =========================================================================
    // 9. POST update-phase
    // =========================================================================
    if (req.method === "POST" && action === "update-phase") {
      const { challengeId, status } = body;
      const { data, error } = await supabase
        .from("challenges")
        .update({ status })
        .eq("id", challengeId)
        .select()
        .single();

      if (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ success: false, error: error.message }));
        return;
      }

      // Sync voting settings status
      if (status === "voting_window") {
        try {
          await supabase
            .from("challenge_voting_settings")
            .update({ vote_status: "active" })
            .eq("challenge_id", challengeId);
        } catch {}
      } else if (status === "closed") {
        try {
          await supabase
            .from("challenge_voting_settings")
            .update({ vote_status: "ended" })
            .eq("challenge_id", challengeId);
        } catch {}
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, challenge: data }));
      return;
    }

    // =========================================================================
    // 10. POST disqualify-submission / delete-submission
    // =========================================================================
    if (req.method === "POST" && (action === "disqualify-submission" || action === "delete-submission")) {
      const { submissionId } = body;
      if (!submissionId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "submissionId is required" }));
        return;
      }

      await supabase.from("challenge_votes").delete().eq("submission_id", submissionId);
      await supabase.from("challenge_submissions").delete().eq("id", submissionId);
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, message: "Submission removed" }));
      return;
    }

    // =========================================================================
    // 11. POST toggle-verified
    // =========================================================================
    if (req.method === "POST" && action === "toggle-verified") {
      const { profileId, isVerified } = body;
      const { data } = await supabase
        .from("profiles")
        .update({ is_verified: isVerified })
        .eq("id", profileId)
        .select()
        .single();

      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, profile: data }));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Action not supported" }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message || "Admin API internal error" }));
  }
}
