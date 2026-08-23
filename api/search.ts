import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { INITIAL_PROFESSIONALS } from "../src/data/mockTalentData";
import { executeProRankSearch } from "../src/services/ranking/searchEngine";
import { validateSearchRateLimit } from "../src/services/ranking/antiAbuse";
import type { Professional } from "../src/types/talent";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS & Content Type
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

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
    const host = req.headers.host || "localhost";
    const parsedUrl = new URL(req.url || "/", `http://${host}`);
    const query = parsedUrl.searchParams.get("q") || "";
    const category = parsedUrl.searchParams.get("category") || "All";
    const location = parsedUrl.searchParams.get("location") || "";
    const maxRate = parsedUrl.searchParams.get("maxRate") ? Number(parsedUrl.searchParams.get("maxRate")) : undefined;
    const page = parsedUrl.searchParams.get("page") ? Number(parsedUrl.searchParams.get("page")) : 1;
    const limit = parsedUrl.searchParams.get("limit") ? Number(parsedUrl.searchParams.get("limit")) : 20;

    const visitorIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anon";
    const isRateLimitAllowed = validateSearchRateLimit(visitorIp);

    if (!isRateLimitAllowed) {
      res.statusCode = 429;
      res.end(JSON.stringify({ error: "Search rate limit exceeded. Please wait a few minutes." }));
      return;
    }

    // 1. Fetch live profiles from Supabase
    let candidateProfiles: Professional[] = INITIAL_PROFESSIONALS;
    try {
      const { data: dbProfiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "published");

      if (dbProfiles && dbProfiles.length > 0) {
        // Fetch active promotions
        const nowIso = new Date().toISOString();
        const { data: promotions } = await supabase
          .from("promotions")
          .select("profile_id")
          .eq("status", "active")
          .lte("starts_at", nowIso)
          .gt("ends_at", nowIso);

        const promotedIds = new Set((promotions || []).map(p => p.profile_id));

        candidateProfiles = dbProfiles.map(row => ({
          id: row.id,
          name: row.name,
          title: row.headline || "",
          category: row.category_id || "Web Development",
          location: row.location || "Global",
          country: row.country || "Global",
          avatar: row.profile_image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
          bio: row.bio || "",
          hourlyRate: row.hourly_rate || 50,
          experienceYears: row.experience_years || 3,
          score: row.professional_score || 80,
          rating: 5.0,
          reviewCount: 0,
          skills: Array.isArray(row.skills) ? row.skills : [],
          experience: Array.isArray(row.experience) ? row.experience : [],
          portfolio: Array.isArray(row.portfolio) ? row.portfolio : [],
          reviews: Array.isArray(row.reviews) ? row.reviews : [],
          externalLinks: row.external_links || {},
          isVerified: Boolean(row.is_verified),
          isPromoted: promotedIds.has(row.id),
          viewsCount: Number(row.views_count || 0),
          clicksCount: Number(row.clicks_count || 0),
          inquiriesCount: Number(row.inquiries_count || 0),
          createdAt: row.created_at || new Date().toISOString(),
        }));
      }
    } catch (dbErr) {
      console.warn("Search Supabase fetch error, using fallback pool:", dbErr);
    }

    // 2. Execute UNCHANGED ProRank Ranking Engine
    const searchResults = executeProRankSearch(candidateProfiles, {
      query,
      category,
      location,
      maxRate,
      page,
      limit,
    });

    res.statusCode = 200;
    res.end(JSON.stringify(searchResults));
  } catch (error: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message || "Search engine failure" }));
  }
}
