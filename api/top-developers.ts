import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import type { TopDeveloperEntry } from "../src/types/challenge.js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  // 60s Edge Cache
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120, max-age=10");

  try {
    const nowIso = new Date().toISOString();

    // Query active top developer entries (expires_at > now)
    const { data, error } = await supabase
      .from("top_developer_entries")
      .select(`
        id,
        profile_id,
        challenge_id,
        rank_position,
        expires_at,
        created_at,
        profiles (
          id,
          name,
          headline,
          profile_image
        ),
        challenges (
          id,
          title
        )
      `)
      .gt("expires_at", nowIso)
      .order("rank_position", { ascending: true })
      .limit(10);

    if (error) {
      console.warn("Error querying top_developer_entries:", error.message);
    }

    const topDevs: TopDeveloperEntry[] = [];

    if (data && data.length > 0) {
      for (const row of data as any[]) {
        // Check for Gold sponsor on this challenge
        const { data: goldSponsor } = await supabase
          .from("challenge_sponsorships")
          .select("company_name, company_logo_url, company_link, tier")
          .eq("challenge_id", row.challenge_id)
          .eq("tier", "gold")
          .eq("status", "succeeded")
          .maybeSingle();

        topDevs.push({
          id: row.id,
          profileId: row.profile_id,
          name: row.profiles?.name || "Challenge Winner",
          avatar: row.profiles?.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row.profile_id)}`,
          title: row.profiles?.headline || "Full Stack Specialist",
          challengeId: row.challenge_id,
          challengeTitle: row.challenges?.title || "Skill Challenge",
          rankPosition: row.rank_position,
          expiresAt: row.expires_at,
          coSponsor: goldSponsor ? {
            companyName: goldSponsor.company_name,
            companyLogoUrl: goldSponsor.company_logo_url,
            companyLink: goldSponsor.company_link,
            tier: 'gold'
          } : null,
          createdAt: row.created_at
        });
      }
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ topDevelopers: topDevs }));
    return;
  } catch (err: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message || "Failed to fetch top developers" }));
    return;
  }
}
