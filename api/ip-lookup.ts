import type { IncomingMessage, ServerResponse } from "node:http";
import dns from "node:dns/promises";
import net from "node:net";
import { isPrivateOrReservedIpv4, isPrivateOrReservedIpv6 } from "./_ssrf";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== "POST" && req.method !== "GET") {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Method not allowed. Use GET or POST." }));
        return;
    }

    let query = "";
    if (req.method === "GET") {
        const parsedUrl = new URL(req.url || "/", "http://localhost");
        query = parsedUrl.searchParams.get("query")?.trim() || "";
    } else {
        let bodyText = "";
        for await (const chunk of req) {
            bodyText += chunk;
        }
        try {
            const body = JSON.parse(bodyText || "{}");
            query = body.query?.trim() || "";
        } catch {
            query = "";
        }
    }

    if (!query) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Query parameter (domain or IP address) is required." }));
        return;
    }

    // Clean input
    const cleanHost = query.replace(/^https?:\/\//i, "").replace(/[:/].*$/, "").trim();

    try {
        let targetIp = cleanHost;
        let isDirectIp = net.isIP(cleanHost) !== 0;
        let resolvedIps: string[] = [];

        // If domain, resolve to IP first
        if (!isDirectIp) {
            try {
                const addresses = await dns.lookup(cleanHost, { all: true });
                if (!addresses || addresses.length === 0) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ error: `Unable to resolve DNS for domain: ${cleanHost}` }));
                    return;
                }
                resolvedIps = addresses.map((a) => a.address);
                targetIp = resolvedIps[0];
            } catch (dnsErr: any) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: `DNS resolution failed for '${cleanHost}': ${dnsErr.message}` }));
                return;
            }
        }

        const ipVersion = net.isIPv6(targetIp) ? "IPv6" : "IPv4";
        const isPrivate =
            ipVersion === "IPv4"
                ? isPrivateOrReservedIpv4(targetIp)
                : isPrivateOrReservedIpv6(targetIp);

        // Attempt Reverse DNS
        let reverseDns: string | null = null;
        try {
            const hostnames = await dns.reverse(targetIp);
            if (hostnames && hostnames.length > 0) {
                reverseDns = hostnames[0];
            }
        } catch {
            reverseDns = null;
        }

        // If private IP, return local network descriptor
        if (isPrivate) {
            const result = {
                query: cleanHost,
                ip: targetIp,
                ipVersion,
                resolvedIps,
                reverseDns,
                isPrivate: true,
                geo: {
                    country: "Internal / Private Network",
                    countryCode: "LOCAL",
                    region: "Private",
                    city: "Local Subnet",
                    zip: "N/A",
                    latitude: 0,
                    longitude: 0,
                    timezone: "Local"
                },
                network: {
                    asn: "Private ASN",
                    org: "RFC 1918 / RFC 4193 Private Network",
                    isp: "Internal Local Area Network",
                    asName: "Private IP Range"
                },
                approximateNote: "This is a private/loopback IP address not routed on the public internet."
            };

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(result));
            return;
        }

        // Fetch real geolocation data from public IP API
        let geoData: any = null;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 4000);
            const geoRes = await fetch(
                `http://ip-api.com/json/${targetIp}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`,
                { signal: controller.signal }
            );
            clearTimeout(timeout);
            if (geoRes.ok) {
                geoData = await geoRes.json();
            }
        } catch {
            geoData = null;
        }

        // Fallback if ip-api is rate-limited or fails
        if (!geoData || geoData.status !== "success") {
            try {
                const controller2 = new AbortController();
                const timeout2 = setTimeout(() => controller2.abort(), 4000);
                const geoRes2 = await fetch(`https://ipwho.is/${targetIp}`, { signal: controller2.signal });
                clearTimeout(timeout2);
                if (geoRes2.ok) {
                    const d = (await geoRes2.json()) as any;
                    if (d.success) {
                        geoData = {
                            status: "success",
                            country: d.country,
                            countryCode: d.country_code,
                            regionName: d.region,
                            city: d.city,
                            zip: d.postal,
                            lat: d.latitude,
                            lon: d.longitude,
                            timezone: d.timezone?.id || "UTC",
                            isp: d.connection?.isp || "Unknown ISP",
                            org: d.connection?.org || d.connection?.isp || "Unknown Org",
                            as: d.connection?.asn ? `AS${d.connection.asn} ${d.connection.org || ""}` : "N/A"
                        };
                    }
                }
            } catch {
                // Secondary fallback failure handled below
            }
        }

        const country = geoData?.country || "Unknown Country";
        const countryCode = geoData?.countryCode || "N/A";
        const region = geoData?.regionName || geoData?.region || "Unknown Region";
        const city = geoData?.city || "Unknown City";
        const zip = geoData?.zip || "N/A";
        const latitude = geoData?.lat || 0;
        const longitude = geoData?.lon || 0;
        const timezone = geoData?.timezone || "UTC";
        const isp = geoData?.isp || "Unknown Provider";
        const org = geoData?.org || isp;
        const asn = geoData?.as ? geoData.as.split(" ")[0] : "Unknown ASN";

        const result = {
            query: cleanHost,
            ip: targetIp,
            ipVersion,
            resolvedIps,
            reverseDns,
            isPrivate: false,
            geo: {
                country,
                countryCode,
                region,
                city,
                zip,
                latitude,
                longitude,
                timezone
            },
            network: {
                asn,
                org,
                isp,
                asName: geoData?.as || "N/A"
            },
            approximateNote: "Geolocation data is estimated based on IP routing allocation and is approximate."
        };

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result));
    } catch (err: any) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: `IP Lookup failed: ${err.message || "Unknown error"}` }));
    }
}
