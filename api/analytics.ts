import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { calculateFairnessScoreFromCounts } from "../src/services/ranking/fairnessScore.js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  const host = req.headers?.host || "localhost";
  const rawUrl = req.url || "/";
  const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
  const pathname = parsedUrl.pathname.replace(/\/$/, "");
  const routeParam = parsedUrl.searchParams.get("route") || "";

  // 1. ROUTE: /api/analytics/track
  if (pathname.endsWith("/track") || routeParam === "track") {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: "Method Not Allowed" }));
      return;
    }

    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const { eventType, profileId, items } = payload;
        const now = new Date().toISOString();

        if (items && Array.isArray(items)) {
          const impressionsToInsert = items
            .filter((it: any) => it.profileId)
            .map((it: any) => ({ profile_id: it.profileId, search_query: it.query || null, timestamp: now }));

          if (impressionsToInsert.length > 0) {
            await supabase.from("profile_impressions").insert(impressionsToInsert);
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, count: impressionsToInsert.length }));
          return;
        }

        if (eventType === "click" && profileId) {
          await supabase.from("profile_clicks").insert([{ profile_id: profileId, timestamp: now }]);
        } else if (eventType === "inquiry" && profileId) {
          await supabase.from("profile_inquiries").insert([{ profile_id: profileId, timestamp: now }]);
        } else if (eventType === "impression" && profileId) {
          await supabase.from("profile_impressions").insert([{ profile_id: profileId, timestamp: now }]);
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ success: true }));
      } catch (err: any) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 2. ROUTE: /api/analytics (or /api/analytics/:profileId)
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");

    let profileId = parsedUrl.searchParams.get("profileId") || "";
    if (!profileId && pathname.includes("/analytics/")) {
      const parts = pathname.split("/analytics/");
      if (parts[1] && !["track"].includes(parts[1])) {
        profileId = decodeURIComponent(parts[1].split("/")[0]);
      }
    }
    if (!profileId && routeParam && !["track"].includes(routeParam)) {
      profileId = routeParam;
    }

    if (!profileId) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "profileId is required" }));
      return;
    }

    try {
      const data = await computeProfileAnalytics(profileId);
      res.statusCode = 200;
      res.end(JSON.stringify(data));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: "Method Not Allowed" }));
}

export async function computeProfileAnalytics(profileId: string) {
  const sinceTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [impRes, clickRes, inqRes, totalImpRes, activeProsRes] = await Promise.all([
    supabase.from("profile_impressions").select("id", { count: "exact", head: true }).eq("profile_id", profileId).gte("timestamp", sinceTime),
    supabase.from("profile_clicks").select("id", { count: "exact", head: true }).eq("profile_id", profileId).gte("timestamp", sinceTime),
    supabase.from("profile_inquiries").select("id", { count: "exact", head: true }).eq("profile_id", profileId).gte("timestamp", sinceTime),
    supabase.from("profile_impressions").select("id", { count: "exact", head: true }).gte("timestamp", sinceTime),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("status", "published")
  ]);

  const impressions = impRes.count || 0;
  const clicks = clickRes.count || 0;
  const inquiries = inqRes.count || 0;
  const totalSystemImpressions = totalImpRes.count || 0;
  const activeEligibleCount = Math.max(1, activeProsRes.count || 10);

  const ctrPercent = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0.0;
  const conversionPercent = clicks > 0 ? Number(((inquiries / clicks) * 100).toFixed(2)) : 0.0;

  const expectedShare = 1 / activeEligibleCount;
  const actualShare = totalSystemImpressions > 0 ? impressions / totalSystemImpressions : expectedShare;
  const exposureRatio = Number((actualShare / expectedShare).toFixed(2));
  const fairnessFactor = calculateFairnessScoreFromCounts(impressions, totalSystemImpressions, activeEligibleCount);
  const isDamped = exposureRatio > 1.2;

  return {
    profileId,
    period: "24h" as const,
    impressions,
    clicks,
    inquiries,
    ctrPercent,
    conversionPercent,
    fairRotation: {
      isActive: true,
      status: isDamped ? "damped" : "active",
      isDamped,
      exposureRatio,
      fairnessFactor,
      statusLabel: isDamped ? "EXPOSURE DAMPED" : "BALANCED ROTATION",
      description: isDamped ? "Damping active" : "Normal balanced exposure"
    },
    calculatedAt: new Date().toISOString()
  };
}
