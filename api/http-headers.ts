import type { IncomingMessage, ServerResponse } from "node:http";
import { validateUrlForSsrf } from "./_ssrf";

export interface SecurityHeaderItem {
    name: string;
    headerKey: string;
    status: "present" | "warning" | "missing";
    value?: string;
    description: string;
    recommendation: string;
}

export function evaluateSecurityHeaders(headers: Record<string, string>): {
    items: SecurityHeaderItem[];
    score: number;
    maxScore: number;
    passedCount: number;
    warningCount: number;
    missingCount: number;
    grade: string;
} {
    const h = Object.keys(headers).reduce((acc, k) => {
        acc[k.toLowerCase()] = headers[k];
        return acc;
    }, {} as Record<string, string>);

    const items: SecurityHeaderItem[] = [];
    let score = 0;
    const maxScore = 10;

    // 1. Strict-Transport-Security (HSTS) - 2.5 pts
    const hsts = h["strict-transport-security"];
    if (hsts) {
        const hasSubdomains = /includesubdomains/i.test(hsts);
        const maxAgeMatch = hsts.match(/max-age=(\d+)/i);
        const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0;

        if (maxAge >= 15552000 && hasSubdomains) {
            items.push({
                name: "Strict-Transport-Security (HSTS)",
                headerKey: "strict-transport-security",
                status: "present",
                value: hsts,
                description: "Enforces strong HTTPS connections across the domain and all subdomains.",
                recommendation: "Configured optimally with adequate max-age and includeSubDomains."
            });
            score += 2.5;
        } else {
            items.push({
                name: "Strict-Transport-Security (HSTS)",
                headerKey: "strict-transport-security",
                status: "warning",
                value: hsts,
                description: "HSTS header is present but should include subdomains and a max-age of at least 6 months (15552000s).",
                recommendation: "Update to: max-age=31536000; includeSubDomains; preload"
            });
            score += 1.5;
        }
    } else {
        items.push({
            name: "Strict-Transport-Security (HSTS)",
            headerKey: "strict-transport-security",
            status: "missing",
            description: "Protects against SSL stripping and man-in-the-middle protocol downgrade attacks.",
            recommendation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'"
        });
    }

    // 2. Content-Security-Policy (CSP) - 2.5 pts
    const csp = h["content-security-policy"];
    if (csp) {
        if (csp.includes("unsafe-inline") || csp.includes("unsafe-eval") || csp.includes("*")) {
            items.push({
                name: "Content-Security-Policy (CSP)",
                headerKey: "content-security-policy",
                status: "warning",
                value: csp,
                description: "CSP is present but contains permissive directives (e.g. unsafe-inline or wildcard).",
                recommendation: "Refine CSP directives using nonces, hashes, or explicit domain allowlists."
            });
            score += 1.5;
        } else {
            items.push({
                name: "Content-Security-Policy (CSP)",
                headerKey: "content-security-policy",
                status: "present",
                value: csp,
                description: "Restricts resource loading to prevent XSS, clickjacking, and data injection.",
                recommendation: "Strict policy detected."
            });
            score += 2.5;
        }
    } else {
        items.push({
            name: "Content-Security-Policy (CSP)",
            headerKey: "content-security-policy",
            status: "missing",
            description: "Essential defense against Cross-Site Scripting (XSS) and unauthorized resource loading.",
            recommendation: "Implement a Content-Security-Policy defining trusted script, style, and object sources."
        });
    }

    // 3. X-Frame-Options - 1.5 pts
    const xfo = h["x-frame-options"];
    if (xfo) {
        if (/deny|sameorigin/i.test(xfo)) {
            items.push({
                name: "X-Frame-Options",
                headerKey: "x-frame-options",
                status: "present",
                value: xfo,
                description: "Prevents Clickjacking by controlling whether the site can be rendered in a frame or iframe.",
                recommendation: "Properly configured to DENY or SAMEORIGIN."
            });
            score += 1.5;
        } else {
            items.push({
                name: "X-Frame-Options",
                headerKey: "x-frame-options",
                status: "warning",
                value: xfo,
                description: "X-Frame-Options value is non-standard or deprecated.",
                recommendation: "Set to DENY or SAMEORIGIN (or use CSP frame-ancestors directive)."
            });
            score += 0.8;
        }
    } else if (csp && /frame-ancestors/i.test(csp)) {
        items.push({
            name: "X-Frame-Options",
            headerKey: "x-frame-options",
            status: "present",
            value: "Covered by CSP frame-ancestors",
            description: "Clickjacking protection is actively handled by CSP frame-ancestors directive.",
            recommendation: "CSP frame-ancestors is the modern replacement for X-Frame-Options."
        });
        score += 1.5;
    } else {
        items.push({
            name: "X-Frame-Options",
            headerKey: "x-frame-options",
            status: "missing",
            description: "Prevents UI redressing and Clickjacking attacks.",
            recommendation: "Set 'X-Frame-Options: DENY' or 'X-Frame-Options: SAMEORIGIN'."
        });
    }

    // 4. X-Content-Type-Options - 1.5 pts
    const xcto = h["x-content-type-options"];
    if (xcto && /nosniff/i.test(xcto)) {
        items.push({
            name: "X-Content-Type-Options",
            headerKey: "x-content-type-options",
            status: "present",
            value: xcto,
            description: "Prevents browsers from MIME-sniffing a response away from the declared content-type.",
            recommendation: "Configured correctly with 'nosniff'."
        });
        score += 1.5;
    } else {
        items.push({
            name: "X-Content-Type-Options",
            headerKey: "x-content-type-options",
            status: "missing",
            description: "Protects against MIME confusion attacks where non-executable types are treated as executable.",
            recommendation: "Set 'X-Content-Type-Options: nosniff'."
        });
    }

    // 5. Referrer-Policy - 1.0 pt
    const refPol = h["referrer-policy"];
    if (refPol) {
        items.push({
            name: "Referrer-Policy",
            headerKey: "referrer-policy",
            status: "present",
            value: refPol,
            description: "Controls how much referrer information is sent when navigating away from your site.",
            recommendation: "Configured to control referrer leakage."
        });
        score += 1.0;
    } else {
        items.push({
            name: "Referrer-Policy",
            headerKey: "referrer-policy",
            status: "missing",
            description: "Prevents leaking sensitive URL paths in Referer headers to external origins.",
            recommendation: "Set 'Referrer-Policy: strict-origin-when-cross-origin'."
        });
    }

    // 6. Permissions-Policy - 1.0 pt
    const permPol = h["permissions-policy"] || h["feature-policy"];
    if (permPol) {
        items.push({
            name: "Permissions-Policy",
            headerKey: "permissions-policy",
            status: "present",
            value: permPol,
            description: "Restricts browser APIs and hardware features (e.g. camera, microphone, geolocation).",
            recommendation: "Active policy restricts sensitive browser capabilities."
        });
        score += 1.0;
    } else {
        items.push({
            name: "Permissions-Policy",
            headerKey: "permissions-policy",
            status: "missing",
            description: "Restricts access to browser features and third-party iframe capabilities.",
            recommendation: "Define 'Permissions-Policy: camera=(), microphone=(), geolocation=()'."
        });
    }

    const passedCount = items.filter((i) => i.status === "present").length;
    const warningCount = items.filter((i) => i.status === "warning").length;
    const missingCount = items.filter((i) => i.status === "missing").length;

    const roundedScore = Math.min(10, Math.round(score * 10) / 10);
    let grade = "A";
    if (roundedScore < 5) grade = "F";
    else if (roundedScore < 7) grade = "C";
    else if (roundedScore < 8.5) grade = "B";

    return {
        items,
        score: roundedScore,
        maxScore,
        passedCount,
        warningCount,
        missingCount,
        grade
    };
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== "POST") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed. Use POST." }));
        return;
    }

    // Read request body
    let bodyText = "";
    req.on("data", (chunk) => {
        bodyText += chunk;
        if (bodyText.length > 1e6) {
            // 1MB max body limit
            req.destroy();
        }
    });

    req.on("end", async () => {
        try {
            const data = JSON.parse(bodyText || "{}");
            const rawUrl: string = data.url?.trim();
            const method: string = (data.method || "GET").toUpperCase();
            const customHeaders: Record<string, string> = data.headers || {};
            const requestBody: string = data.body || "";

            if (!rawUrl) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "URL parameter is required." }));
                return;
            }

            // Normalise URL scheme if missing
            let targetUrlStr = rawUrl;
            if (!/^https?:\/\//i.test(targetUrlStr)) {
                targetUrlStr = `https://${targetUrlStr}`;
            }

            // Initial SSRF Validation
            const ssrfCheck = await validateUrlForSsrf(targetUrlStr);
            if (!ssrfCheck.safe) {
                res.statusCode = 403;
                res.setHeader("Content-Type", "application/json");
                res.end(
                    JSON.stringify({
                        error: `SSRF Protection: ${ssrfCheck.reason || "Destination IP or domain is blocked."}`
                    })
                );
                return;
            }

            // Sanitize custom request headers (prevent dangerous hop-by-hop overrides)
            const sanitizedHeaders: Record<string, string> = {
                "User-Agent": "Mozilla/5.0 (compatible; SecurityHeaderChecker/2.0; +https://ranktool.dev)",
                "Accept": "*/*"
            };

            const forbiddenHeaders = ["host", "connection", "keep-alive", "transfer-encoding", "te"];
            for (const [k, v] of Object.entries(customHeaders)) {
                if (!forbiddenHeaders.includes(k.toLowerCase()) && typeof v === "string") {
                    sanitizedHeaders[k] = v;
                }
            }

            // Execute HTTP Request with redirect tracking & SSRF validation per hop
            let currentUrl = targetUrlStr;
            let redirectCount = 0;
            const redirectChain: string[] = [currentUrl];
            const maxRedirects = 5;

            const startTime = Date.now();
            let finalResponse: Response | null = null;

            while (redirectCount <= maxRedirects) {
                // AbortController for timeout (8 seconds)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                try {
                    const fetchOptions: RequestInit = {
                        method: redirectCount > 0 ? "GET" : method,
                        headers: sanitizedHeaders,
                        redirect: "manual",
                        signal: controller.signal
                    };

                    if (method === "POST" && redirectCount === 0 && requestBody) {
                        fetchOptions.body = requestBody;
                    }

                    const response = await fetch(currentUrl, fetchOptions);
                    clearTimeout(timeoutId);

                    const isRedirect = [301, 302, 303, 307, 308].includes(response.status);
                    const locationHeader = response.headers.get("location");

                    if (isRedirect && locationHeader) {
                        redirectCount++;
                        if (redirectCount > maxRedirects) {
                            res.statusCode = 400;
                            res.setHeader("Content-Type", "application/json");
                            res.end(JSON.stringify({ error: `Too many redirects (exceeded limit of ${maxRedirects}).` }));
                            return;
                        }

                        // Resolve relative redirect locations
                        const nextUrl = new URL(locationHeader, currentUrl).toString();
                        redirectChain.push(nextUrl);

                        // Validate next redirect destination for SSRF
                        const redirectSsrf = await validateUrlForSsrf(nextUrl);
                        if (!redirectSsrf.safe) {
                            res.statusCode = 403;
                            res.setHeader("Content-Type", "application/json");
                            res.end(
                                JSON.stringify({
                                    error: `Redirect SSRF Block: Target redirected to disallowed host: ${redirectSsrf.reason}`
                                })
                            );
                            return;
                        }

                        currentUrl = nextUrl;
                        continue;
                    }

                    finalResponse = response;
                    break;
                } catch (fetchErr: any) {
                    clearTimeout(timeoutId);
                    if (fetchErr.name === "AbortError") {
                        res.statusCode = 504;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ error: "Connection timed out after 8 seconds." }));
                        return;
                    }
                    throw fetchErr;
                }
            }

            const responseTimeMs = Date.now() - startTime;

            if (!finalResponse) {
                res.statusCode = 502;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Failed to establish connection with remote server." }));
                return;
            }

            // Extract all headers
            const responseHeaders: Record<string, string> = {};
            finalResponse.headers.forEach((val, key) => {
                responseHeaders[key] = val;
            });

            // Categorize headers for detailed explorer
            const headerEntries = Object.entries(responseHeaders).map(([key, value]) => {
                const k = key.toLowerCase();
                let category = "General";
                if (k.includes("security") || k.includes("frame") || k.includes("xss") || k.includes("strict") || k.includes("referrer") || k.includes("permissions") || k.includes("cross-origin")) {
                    category = "Security";
                } else if (k.includes("cache") || k.includes("etag") || k.includes("age") || k.includes("expires") || k.includes("vary")) {
                    category = "Caching & Performance";
                } else if (k.includes("access-control-") || k.includes("cors")) {
                    category = "CORS & Access";
                } else if (k.includes("server") || k.includes("cf-") || k.includes("x-powered-by") || k.includes("via") || k.includes("alt-svc")) {
                    category = "Infrastructure";
                } else if (k.includes("content") || k.includes("transfer") || k.includes("encoding")) {
                    category = "Content & Encoding";
                }
                return { key, value, category };
            });

            // Evaluate Security Directives
            const securityAudit = evaluateSecurityHeaders(responseHeaders);

            const result = {
                targetUrl: targetUrlStr,
                finalUrl: currentUrl,
                method,
                statusCode: finalResponse.status,
                statusText: finalResponse.statusText || (finalResponse.status === 200 ? "OK" : ""),
                responseTimeMs,
                redirectCount,
                redirectChain,
                headers: responseHeaders,
                headerEntries,
                securityAudit,
                contentType: responseHeaders["content-type"] || null,
                contentLength: responseHeaders["content-length"] || null,
                server: responseHeaders["server"] || null,
                disclaimer: "Automated analysis based on standard web security directives. This score does not replace a professional penetration test."
            };

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
        } catch (err: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
                JSON.stringify({
                    error: `Network or Connection Error: ${err.message || "Failed to inspect target host."}`
                })
            );
        }
    });
}
