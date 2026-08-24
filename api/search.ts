import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { INITIAL_PROFESSIONALS } from "../src/data/mockTalentData.js";
import { executeProRankSearch } from "../src/services/ranking/searchEngine.js";
import { validateSearchRateLimit } from "../src/services/ranking/antiAbuse.js";
import { tokenize } from "../src/services/ranking/relevanceScore.js";
import type { Professional } from "../src/types/talent.js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS & Content Type & CDN Edge Caching
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Vary", "Accept-Encoding, Origin");
  
  // Edge/CDN Caching: 30s shared edge cache, 60s stale-while-revalidate, 10s browser cache
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60, max-age=10");
  res.setHeader("CDN-Cache-Control", "public, s-maxage=60");

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
    const reqQuery = (req as any).query;
    let query = "";
    let category = "All";
    let location = "";
    let maxRate: number | undefined;
    let page = 1;
    let limit = 20;

    if (reqQuery && typeof reqQuery === "object") {
      query = reqQuery.q || reqQuery.query || "";
      category = reqQuery.category || "All";
      location = reqQuery.location || "";
      maxRate = reqQuery.maxRate ? Number(reqQuery.maxRate) : undefined;
      page = reqQuery.page ? Number(reqQuery.page) : 1;
      limit = reqQuery.limit ? Number(reqQuery.limit) : 20;
    } else {
      const host = req.headers?.host || "localhost";
      const rawUrl = req.url || "/";
      const parsedUrl = new URL(rawUrl.startsWith("http") ? rawUrl : `http://${host}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`);
      query = parsedUrl.searchParams.get("q") || parsedUrl.searchParams.get("query") || "";
      category = parsedUrl.searchParams.get("category") || "All";
      location = parsedUrl.searchParams.get("location") || "";
      maxRate = parsedUrl.searchParams.get("maxRate") ? Number(parsedUrl.searchParams.get("maxRate")) : undefined;
      page = parsedUrl.searchParams.get("page") ? Number(parsedUrl.searchParams.get("page")) : 1;
      limit = parsedUrl.searchParams.get("limit") ? Number(parsedUrl.searchParams.get("limit")) : 20;
    }

    const visitorIp = (req.headers?.["x-forwarded-for"] as string) || req.socket?.remoteAddress || "anon";
    const isRateLimitAllowed = validateSearchRateLimit(visitorIp);

    if (!isRateLimitAllowed) {
      res.statusCode = 429;
      res.end(JSON.stringify({ error: "Search rate limit exceeded. Please wait a few minutes." }));
      return;
    }

    // 1. Fetch filtered candidate subset from Supabase (Optimized for 10k+ scale)
    let candidateProfiles: Professional[] = INITIAL_PROFESSIONALS;
    try {
      let queryBuilder = supabase
        .from("profiles")
        .select("*")
        .eq("status", "published")
        .gte("profile_completeness", 90);

      if (category && category !== "All") {
        queryBuilder = queryBuilder.ilike("category_id", category);
      }

      if (maxRate && maxRate > 0) {
        queryBuilder = queryBuilder.lte("hourly_rate", maxRate);
      }

      if (location && location.trim().length > 0) {
        queryBuilder = queryBuilder.ilike("location", `%${location.trim()}%`);
      }

      const hasQuery = query && query.trim().length > 0;
      const candidatePoolLimit = hasQuery ? Math.max(150, limit * 5) : 100;

      if (hasQuery) {
        const cleanQ = query.trim();
        const tokens = tokenize(cleanQ);

        // Build relevance-aware candidate filter with skills array overlap and text search
        const conditions: string[] = [
          `headline.ilike.%${cleanQ}%`,
          `bio.ilike.%${cleanQ}%`,
          `name.ilike.%${cleanQ}%`
        ];

        if (tokens.length > 0) {
          // PostgREST array overlap operator: skills.ov.{token1,token2}
          conditions.push(`skills.ov.{${tokens.join(',')}}`);
          for (const t of tokens.slice(0, 3)) {
            conditions.push(`headline.ilike.%${t}%`);
            conditions.push(`bio.ilike.%${t}%`);
          }
        }

        queryBuilder = queryBuilder.or(conditions.join(','));
      }

      // Order by cached_score and fetch bounded top candidate pool
      queryBuilder = queryBuilder.order("cached_score", { ascending: false }).limit(candidatePoolLimit);

      const { data: dbProfiles, error: dbError } = await queryBuilder;

      if (!dbError && dbProfiles && dbProfiles.length > 0) {
        // Fetch active promotions with single indexed lookup
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
          score: row.cached_score || row.professional_score || 80,
          rating: Number(row.rating || 5.0),
          reviewCount: Number(row.review_count || 0),
          activeDisputes: Number(row.active_disputes || 0),
          accountStanding: row.account_standing || 'active',
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
