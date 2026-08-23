import type { IncomingMessage, ServerResponse } from "node:http";
import dns from "node:dns/promises";

export interface DnsRecordResult {
    type: string;
    name: string;
    value: string;
    ttl?: number;
    priority?: number;
}

// Google DoH Type Map
const DOH_TYPE_IDS: Record<string, number> = {
    A: 1,
    NS: 2,
    CNAME: 5,
    SOA: 6,
    MX: 15,
    TXT: 16,
    AAAA: 28,
    CAA: 257
};

async function resolveWithDoH(domain: string, type: string): Promise<DnsRecordResult[]> {
    const typeId = DOH_TYPE_IDS[type.toUpperCase()] || 1;
    const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${typeId}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return [];
    const data = (await res.json()) as any;

    if (!data.Answer || !Array.isArray(data.Answer)) return [];

    return data.Answer.map((ans: any) => {
        let val = String(ans.data || "").trim();
        // Remove surrounding quotes from TXT records if present
        if (type.toUpperCase() === "TXT" && val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
        }
        return {
            type: type.toUpperCase(),
            name: ans.name || domain,
            value: val,
            ttl: ans.TTL
        };
    });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== "POST" && req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed. Use GET or POST." }));
        return;
    }

    let domain = "";
    let recordType = "ALL";

    if (req.method === "GET") {
        const parsedUrl = new URL(req.url || "/", "http://localhost");
        domain = parsedUrl.searchParams.get("domain")?.trim() || "";
        recordType = (parsedUrl.searchParams.get("type") || "ALL").toUpperCase();
    } else {
        let bodyText = "";
        for await (const chunk of req) {
            bodyText += chunk;
        }
        try {
            const body = JSON.parse(bodyText || "{}");
            domain = body.domain?.trim() || "";
            recordType = (body.type || "ALL").toUpperCase();
        } catch {
            domain = "";
        }
    }

    if (!domain) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Domain parameter is required." }));
        return;
    }

    // Clean domain
    const cleanDomain = domain.replace(/^https?:\/\//i, "").replace(/[:/].*$/, "").trim().toLowerCase();

    const targetTypes =
        recordType === "ALL"
            ? ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "CAA"]
            : [recordType];

    const records: DnsRecordResult[] = [];
    const startTime = Date.now();

    for (const t of targetTypes) {
        try {
            switch (t) {
                case "A": {
                    const resA = await dns.resolve4(cleanDomain, { ttl: true });
                    resA.forEach((r) => records.push({ type: "A", name: cleanDomain, value: r.address, ttl: r.ttl }));
                    break;
                }
                case "AAAA": {
                    const resAaaa = await dns.resolve6(cleanDomain, { ttl: true });
                    resAaaa.forEach((r) => records.push({ type: "AAAA", name: cleanDomain, value: r.address, ttl: r.ttl }));
                    break;
                }
                case "CNAME": {
                    const resCname = await dns.resolveCname(cleanDomain);
                    resCname.forEach((c) => records.push({ type: "CNAME", name: cleanDomain, value: c }));
                    break;
                }
                case "MX": {
                    const resMx = await dns.resolveMx(cleanDomain);
                    resMx.forEach((m) =>
                        records.push({ type: "MX", name: cleanDomain, value: m.exchange, priority: m.priority })
                    );
                    break;
                }
                case "TXT": {
                    const resTxt = await dns.resolveTxt(cleanDomain);
                    resTxt.forEach((tArr) => records.push({ type: "TXT", name: cleanDomain, value: tArr.join(" ") }));
                    break;
                }
                case "NS": {
                    const resNs = await dns.resolveNs(cleanDomain);
                    resNs.forEach((n) => records.push({ type: "NS", name: cleanDomain, value: n }));
                    break;
                }
                case "SOA": {
                    const resSoa = await dns.resolveSoa(cleanDomain);
                    if (resSoa) {
                        records.push({
                            type: "SOA",
                            name: cleanDomain,
                            value: `Primary: ${resSoa.nsname} | Admin: ${resSoa.hostmaster} | Serial: ${resSoa.serial}`
                        });
                    }
                    break;
                }
                case "CAA": {
                    const resCaa = await dns.resolveCaa(cleanDomain);
                    resCaa.forEach((c: any) =>
                        records.push({ type: "CAA", name: cleanDomain, value: `${c.critical ? "1" : "0"} ${c.issue ? `issue "${c.issue}"` : c.issuewild ? `issuewild "${c.issuewild}"` : c.iodef ? `iodef "${c.iodef}"` : "flag"}` })
                    );
                    break;
                }
            }
        } catch {
            // Node direct resolution error on this record type; fallback to Google DoH for this type
            try {
                const dohRecords = await resolveWithDoH(cleanDomain, t);
                records.push(...dohRecords);
            } catch {
                // Ignore single record lookup misses
            }
        }
    }

    const queryTimeMs = Date.now() - startTime;

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
        JSON.stringify({
            domain: cleanDomain,
            recordType,
            records,
            recordsCount: records.length,
            queryTimeMs
        })
    );
}
