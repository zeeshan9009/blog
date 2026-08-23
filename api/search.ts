import type { IncomingMessage, ServerResponse } from "node:http";
import { INITIAL_PROFESSIONALS } from "../src/data/mockTalentData";
import { executeProRankSearch } from "../src/services/ranking/searchEngine";
import { validateSearchRateLimit } from "../src/services/ranking/antiAbuse";

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

    const searchResults = executeProRankSearch(INITIAL_PROFESSIONALS, {
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
