import type { IncomingMessage, ServerResponse } from "node:http";
import { validateContactRateLimit } from "../src/services/ranking/antiAbuse";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", async () => {
    try {
      const data = JSON.parse(body || "{}");
      const { profileId, senderName, senderEmail, message, budget } = data;

      if (!profileId || !senderName || !senderEmail || !message) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Missing required contact inquiry fields" }));
        return;
      }

      const visitorIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anon";
      const isAllowed = validateContactRateLimit(visitorIp);

      if (!isAllowed) {
        res.statusCode = 429;
        res.end(JSON.stringify({ error: "Too many contact requests. Limit: 5 per hour." }));
        return;
      }

      const contactRequest = {
        id: "req_" + Math.random().toString(36).substring(2, 12),
        profile_id: profileId,
        sender_name: senderName,
        sender_email: senderEmail,
        message,
        budget: budget || "Not specified",
        status: "new",
        created_at: new Date().toISOString(),
      };

      res.statusCode = 200;
      res.end(JSON.stringify({
        success: true,
        contactRequest,
      }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message || "Failed to process contact inquiry" }));
    }
  });
}
