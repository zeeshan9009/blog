import type { IncomingMessage, ServerResponse } from "node:http";
import dns from "node:dns/promises";
import https from "node:https";
import http from "node:http";
import { isPrivateOrReservedIpv4 } from "./_ssrf.js";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
  const toolParam = parsedUrl.searchParams.get("tool") || "";

  // 1. DNS LOOKUP TOOL
  if (pathname.endsWith("/dns-lookup") || toolParam === "dns") {
    const domain = parsedUrl.searchParams.get("domain") || "google.com";
    try {
      const [aRecords, mxRecords] = await Promise.allSettled([
        dns.resolve4(domain),
        dns.resolveMx(domain)
      ]);

      res.statusCode = 200;
      res.end(JSON.stringify({
        domain,
        records: {
          A: aRecords.status === "fulfilled" ? aRecords.value : [],
          MX: mxRecords.status === "fulfilled" ? mxRecords.value : []
        }
      }));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 2. IP LOOKUP TOOL
  if (pathname.endsWith("/ip-lookup") || toolParam === "ip") {
    const ip = parsedUrl.searchParams.get("ip") || "8.8.8.8";
    res.statusCode = 200;
    res.end(JSON.stringify({
      ip,
      isPrivate: isPrivateOrReservedIpv4(ip),
      status: "success"
    }));
    return;
  }

  // 3. HTTP HEADERS TOOL
  if (pathname.endsWith("/http-headers") || toolParam === "headers") {
    const targetUrl = parsedUrl.searchParams.get("url") || "https://example.com";
    try {
      const parsedTarget = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
      const client = parsedTarget.protocol === "https:" ? https : http;

      const proxyReq = client.request(parsedTarget, { method: "HEAD", timeout: 5000 }, proxyRes => {
        res.statusCode = 200;
        res.end(JSON.stringify({
          url: parsedTarget.toString(),
          statusCode: proxyRes.statusCode,
          headers: proxyRes.headers
        }));
      });

      proxyReq.on("error", err => {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      });
      proxyReq.end();
    } catch (err: any) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid URL" }));
    }
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ status: "ok", service: "RankLancr Diagnostics Engine" }));
}
