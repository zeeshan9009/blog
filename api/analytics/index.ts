import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { calculateFairnessScoreFromCounts } from "../../src/services/ranking/fairnessScore.js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile24HAnalytics {
  profileId: string;
  period: "24h";
  impressions: number;
  sponsoredImpressions: number;
  clicks: number;
  inquiries: number;
  ctrPercent: number;
  conversionPercent: number;
  fairRotation: {
    status: "ACTIVE" | "OPTIMAL" | "DAMPED";
    exposureRatio: number;
    fairnessFactor: number;
    isDamped: boolean;
    description: string;
  };
  lastUpdated: string;
}

export async function computeProfileAnalytics(profileId: string): Promise<Profile24HAnalytics> {
  const sinceTimestamp = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  let impressions = 0;
  let sponsoredImpressions = 0;
  let clicks = 0;
  let inquiries = 0;
  let totalSponsoredPool = 0;
  let activeBoostsCount = 1;

  try {
    // 1. Fetch 24H Impressions for this profile
    const { count: impCount } = await supabase
      .from("profile_impressions")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .gte("created_at", sinceTimestamp);

    const { count: sponCount } = await supabase
      .from("profile_impressions")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("was_sponsored", true)
      .gte("created_at", sinceTimestamp);

    // 2. Fetch 24H Clicks for this profile
    const { count: clkCount } = await supabase
      .from("profile_clicks")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .gte("created_at", sinceTimestamp);

    // 3. Fetch 24H Inquiries for this profile
    const { count: inqCount } = await supabase
      .from("profile_inquiries")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .gte("created_at", sinceTimestamp);

    // 4. Global sponsored pool for dynamic fairness computation
    const { count: globalSponCount } = await supabase
      .from("profile_impressions")
      .select("*", { count: "exact", head: true })
      .eq("was_sponsored", true)
      .gte("created_at", sinceTimestamp);

    const { count: boostCount } = await supabase
      .from("promotions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gt("ends_at", new Date().toISOString());

    impressions = impCount || 0;
    sponsoredImpressions = sponCount || 0;
    clicks = clkCount || 0;
    inquiries = inqCount || 0;
    totalSponsoredPool = Math.max(sponsoredImpressions, globalSponCount || 0);
    activeBoostsCount = Math.max(1, boostCount || 1);
  } catch (err) {
    console.warn("[ANALYTICS] Supabase query fallback:", err);
  }

  // Calculate CTR: (clicks / impressions) * 100
  const ctrPercent = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(1)) : 0;

  // Calculate Conversion: (inquiries / clicks) * 100
  const conversionPercent = clicks > 0 ? Number(((inquiries / clicks) * 100).toFixed(1)) : (inquiries > 0 ? 100 : 0);

  // Compute Live Fair Rotation Exposure Ratio & Fairness Score
  const expectedShare = 1 / activeBoostsCount;
  const actualShare = totalSponsoredPool > 0 ? sponsoredImpressions / totalSponsoredPool : 0;
  const exposureRatio = Number((actualShare / expectedShare).toFixed(2));
  const fairnessFactor = calculateFairnessScoreFromCounts(sponsoredImpressions, totalSponsoredPool, activeBoostsCount);

  const isDamped = exposureRatio > 1.2;
  const fairStatus: "ACTIVE" | "OPTIMAL" | "DAMPED" = isDamped
    ? "DAMPED"
    : exposureRatio >= 0.8
    ? "ACTIVE"
    : "OPTIMAL";

  const description = isDamped
    ? `Anti-monopoly damping active (${exposureRatio}x exposure ratio)`
    : `Anti-monopoly damping on (Balanced ${exposureRatio}x exposure)`;

  return {
    profileId,
    period: "24h",
    impressions,
    sponsoredImpressions,
    clicks,
    inquiries,
    ctrPercent,
    conversionPercent,
    fairRotation: {
      status: fairStatus,
      exposureRatio,
      fairnessFactor,
      isDamped,
      description
    },
    lastUpdated: new Date().toISOString()
  };
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  // 5s edge cache with 15s stale-while-revalidate for fast live dashboard loading
  res.setHeader("Cache-Control", "public, s-maxage=5, stale-while-revalidate=15, max-age=5");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  try {
    const host = req.headers?.host || "localhost";
    const rawUrl = req.url || "/";
    const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
    const reqQuery = (req as any).query;

    const profileId = (reqQuery?.profileId as string) || parsedUrl.searchParams.get("profileId") || "";

    if (!profileId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Missing required profileId parameter" }));
      return;
    }

    const analytics = await computeProfileAnalytics(profileId);
    res.statusCode = 200;
    res.end(JSON.stringify(analytics));
  } catch (error: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || "Failed to compute analytics" }));
  }
}
