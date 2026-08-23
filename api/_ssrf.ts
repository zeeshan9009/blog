import dns from "node:dns/promises";
import net from "node:net";

export interface SsrfValidationResult {
    safe: boolean;
    reason?: string;
    resolvedIp?: string;
}

/**
 * Checks whether an IPv4 address belongs to a private, loopback, link-local, or reserved subnet.
 */
export function isPrivateOrReservedIpv4(ip: string): boolean {
    const parts = ip.split(".").map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
        return true; // Treat invalid IPv4 as unsafe
    }

    const [a, b] = parts;

    // 0.0.0.0/8 (Current network)
    if (a === 0) return true;

    // 10.0.0.0/8 (Private)
    if (a === 10) return true;

    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;

    // 100.64.0.0/10 (Shared Address Space / CGNAT)
    if (a === 100 && b >= 64 && b <= 127) return true;

    // 169.254.0.0/16 (Link-local, AWS/GCP/Azure Cloud Metadata)
    if (a === 169 && b === 254) return true;

    // 172.16.0.0/12 (Private: 172.16.0.0 - 172.31.255.255)
    if (a === 172 && b >= 16 && b <= 31) return true;

    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (a === 192 && b === 0 && parts[2] === 0) return true;

    // 192.168.0.0/16 (Private)
    if (a === 192 && b === 168) return true;

    // 198.18.0.0/15 (Network benchmark tests)
    if (a === 198 && (b === 18 || b === 19)) return true;

    // 198.51.100.0/24 (Documentation / TEST-NET-2)
    if (a === 198 && b === 51 && parts[2] === 100) return true;

    // 203.0.113.0/24 (Documentation / TEST-NET-3)
    if (a === 203 && b === 0 && parts[2] === 113) return true;

    // 224.0.0.0/4 (Multicast: 224 - 239)
    if (a >= 224 && a <= 239) return true;

    // 240.0.0.0/4 (Reserved for future use: 240 - 255)
    if (a >= 240) return true;

    return false;
}

/**
 * Checks whether an IPv6 address is private, loopback, link-local, or reserved.
 */
export function isPrivateOrReservedIpv6(ip: string): boolean {
    const normalized = ip.toLowerCase();

    // Loopback
    if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1" || normalized === "::") {
        return true;
    }

    // Link-local: fe80::/10 (fe80 to febf)
    if (/^fe[89ab]/i.test(normalized)) {
        return true;
    }

    // Unique local / Private: fc00::/7 (fc00 to fdff)
    if (/^f[cd]/i.test(normalized)) {
        return true;
    }

    // IPv4 mapped IPv6 (e.g. ::ffff:127.0.0.1 or ::ffff:192.168.1.1)
    if (normalized.includes("::ffff:")) {
        const ipv4Part = normalized.split("::ffff:")[1];
        if (ipv4Part && net.isIPv4(ipv4Part)) {
            return isPrivateOrReservedIpv4(ipv4Part);
        }
        return true;
    }

    return false;
}

/**
 * Validates a target URL against SSRF threats by resolving DNS and inspecting target IP.
 */
export async function validateUrlForSsrf(urlString: string): Promise<SsrfValidationResult> {
    let url: URL;
    try {
        url = new URL(urlString);
    } catch {
        return { safe: false, reason: "Malformed or invalid URL syntax" };
    }

    // Protocol enforcement
    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return {
            safe: false,
            reason: `Unsupported protocol '${url.protocol}'. Only 'http:' and 'https:' are permitted.`
        };
    }

    const hostname = url.hostname.toLowerCase();

    // Check banned hostnames
    if (
        hostname === "localhost" ||
        hostname.endsWith(".localhost") ||
        hostname === "metadata.google.internal" ||
        hostname === "instance-data" ||
        hostname === "local" ||
        hostname.endsWith(".local") ||
        hostname.endsWith(".internal")
    ) {
        return {
            safe: false,
            reason: "Access to localhost and internal domain names is blocked for security."
        };
    }

    // Check if hostname is direct IP
    if (net.isIPv4(hostname)) {
        if (isPrivateOrReservedIpv4(hostname)) {
            return {
                safe: false,
                reason: `IP address ${hostname} belongs to a private, loopback, or reserved subnet.`
            };
        }
        return { safe: true, resolvedIp: hostname };
    }

    if (net.isIPv6(hostname)) {
        if (isPrivateOrReservedIpv6(hostname)) {
            return {
                safe: false,
                reason: `IPv6 address ${hostname} belongs to a private, loopback, or link-local subnet.`
            };
        }
        return { safe: true, resolvedIp: hostname };
    }

    // Resolve DNS records to verify actual IP
    try {
        const addresses = await dns.lookup(hostname, { all: true });
        if (!addresses || addresses.length === 0) {
            return { safe: false, reason: `Unable to resolve DNS for host: ${hostname}` };
        }

        for (const addr of addresses) {
            if (addr.family === 4 && isPrivateOrReservedIpv4(addr.address)) {
                return {
                    safe: false,
                    reason: `Domain resolved to private or internal IP address (${addr.address}).`
                };
            }
            if (addr.family === 6 && isPrivateOrReservedIpv6(addr.address)) {
                return {
                    safe: false,
                    reason: `Domain resolved to private or link-local IPv6 address (${addr.address}).`
                };
            }
        }

        return { safe: true, resolvedIp: addresses[0].address };
    } catch (err: any) {
        return {
            safe: false,
            reason: `DNS resolution failed: ${err.message || "Host not found"}`
        };
    }
}
