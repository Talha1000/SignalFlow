import dns from "dns/promises";

/**
 * Enterprise Fail-Closed SSRF & Network Boundary Defense
 *
 * Implements strict, defense-in-depth validation for outbound webhooks:
 * 1. Protocol: HTTPS only.
 * 2. Port: 443 only (prevents internal port scanning e.g. :5432, :6379, :22, :8080).
 * 3. Credentials: No embedded username or password in URL.
 * 4. Hostname: Rejects localhost, internal TLDs, and loopback aliases.
 * 5. IPv4: Full CIDR range defense against RFC 1918, RFC 6598 (CGNAT), RFC 3927 (link-local / AWS metadata),
 *    RFC 1122 (loopback), RFC 5737 (test-nets), multicast, and reserved spaces.
 * 6. IPv6: Full defense against loopback (::1), ULA (fc00::/7), link-local (fe80::/10),
 *    multicast (ff00::/8), and IPv4-mapped IPv6 (::ffff:0:0/96).
 * 7. Obfuscation: Rejects hex, octal, dword/integer, and mixed-mode IP formats.
 * 8. DNS Resolution: Always fail-closed. If resolution fails, times out, or resolves to ANY internal IP, rejects request.
 */

// Helper to convert IPv4 dotted-quad or integer to a 32-bit unsigned number
function parseIpv4ToNumber(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length === 4) {
    let num = 0;
    for (let i = 0; i < 4; i++) {
      const part = parts[i];
      let val: number;
      if (part.startsWith("0x") || part.startsWith("0X")) {
        val = parseInt(part, 16);
      } else if (part.length > 1 && part.startsWith("0")) {
        val = parseInt(part, 8);
      } else {
        val = parseInt(part, 10);
      }
      if (isNaN(val) || val < 0 || val > 255) return null;
      num = (num << 8) + val;
    }
    return (num >>> 0);
  }

  // Single integer / DWORD representation (e.g. 2130706433 for 127.0.0.1)
  if (/^\d+$/.test(ip)) {
    const val = parseInt(ip, 10);
    if (!isNaN(val) && val >= 0 && val <= 0xffffffff) {
      return (val >>> 0);
    }
  }

  // Hexadecimal single integer (e.g. 0x7f000001)
  if (/^0x[0-9a-fA-F]+$/i.test(ip)) {
    const val = parseInt(ip, 16);
    if (!isNaN(val) && val >= 0 && val <= 0xffffffff) {
      return (val >>> 0);
    }
  }

  return null;
}

/**
 * Checks whether an IPv4 numeric address falls within any non-public or private CIDR blocks.
 */
function isPrivateOrReservedIpv4(num: number): boolean {
  // Helper to test CIDR range
  const inRange = (prefix: number, maskBits: number) => {
    const mask = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;
    return (num & mask) === (prefix & mask);
  };

  const toNum = (a: number, b: number, c: number, d: number) =>
    (((a << 24) | (b << 16) | (c << 8) | d) >>> 0);

  // 0.0.0.0/8 (Current network / "this host")
  if (inRange(toNum(0, 0, 0, 0), 8)) return true;

  // 10.0.0.0/8 (Private RFC 1918)
  if (inRange(toNum(10, 0, 0, 0), 8)) return true;

  // 100.64.0.0/10 (Shared Address Space / CGNAT RFC 6598)
  if (inRange(toNum(100, 64, 0, 0), 10)) return true;

  // 127.0.0.0/8 (Loopback RFC 1122)
  if (inRange(toNum(127, 0, 0, 0), 8)) return true;

  // 169.254.0.0/16 (Link Local RFC 3927 & AWS/GCP/Azure Metadata 169.254.169.254)
  if (inRange(toNum(169, 254, 0, 0), 16)) return true;

  // 172.16.0.0/12 (Private RFC 1918)
  if (inRange(toNum(172, 16, 0, 0), 12)) return true;

  // 192.0.0.0/24 (IETF Protocol Assignments)
  if (inRange(toNum(192, 0, 0, 0), 24)) return true;

  // 192.0.2.0/24 (TEST-NET-1 RFC 5737)
  if (inRange(toNum(192, 0, 2, 0), 24)) return true;

  // 192.88.99.0/24 (6to4 Relay Anycast)
  if (inRange(toNum(192, 88, 99, 0), 24)) return true;

  // 192.168.0.0/16 (Private RFC 1918)
  if (inRange(toNum(192, 168, 0, 0), 16)) return true;

  // 198.18.0.0/15 (Network Interconnect Benchmark RFC 2544)
  if (inRange(toNum(198, 18, 0, 0), 15)) return true;

  // 198.51.100.0/24 (TEST-NET-2 RFC 5737)
  if (inRange(toNum(198, 51, 100, 0), 24)) return true;

  // 203.0.113.0/24 (TEST-NET-3 RFC 5737)
  if (inRange(toNum(203, 0, 113, 0), 24)) return true;

  // 224.0.0.0/4 (Multicast RFC 5771)
  if (inRange(toNum(224, 0, 0, 0), 4)) return true;

  // 240.0.0.0/4 (Reserved / Future Use RFC 1112)
  if (inRange(toNum(240, 0, 0, 0), 4)) return true;

  // 255.255.255.255/32 (Broadcast)
  if (num === 0xffffffff) return true;

  return false;
}

/**
 * Checks whether an IPv6 address string is private, loopback, link-local, or reserved.
 */
function isPrivateOrReservedIpv6(ipv6: string): boolean {
  let clean = ipv6.toLowerCase().trim();

  // Strip brackets if present [::1]
  if (clean.startsWith("[") && clean.endsWith("]")) {
    clean = clean.slice(1, -1);
  }

  // Strip scope ID e.g. fe80::1%eth0
  const percentIdx = clean.indexOf("%");
  if (percentIdx !== -1) {
    clean = clean.substring(0, percentIdx);
  }

  // Check IPv4-mapped IPv6: ::ffff:192.0.2.128 or normalized hex ::ffff:7f00:1 / ::ffff:a9fe:a9fe
  if (clean.startsWith("::ffff:") || clean.startsWith("0:0:0:0:0:ffff:")) {
    const suffix = clean.replace(/^(0:0:0:0:0:ffff:|::ffff:)/, "");
    const dotParts = suffix.split(".");
    if (dotParts.length === 4) {
      const v4Num = parseIpv4ToNumber(suffix);
      return v4Num === null || isPrivateOrReservedIpv4(v4Num);
    }
    const hexParts = suffix.split(":");
    if (hexParts.length === 2) {
      const h1 = parseInt(hexParts[0], 16);
      const h2 = parseInt(hexParts[1], 16);
      if (!isNaN(h1) && !isNaN(h2)) {
        const v4Num = (((h1 << 16) | h2) >>> 0);
        return isPrivateOrReservedIpv4(v4Num);
      }
    }
    return true; // Malformed ::ffff: prefix -> block
  }

  // Unspecified (:: or 0:0:0:0:0:0:0:0)
  if (clean === "::" || /^0(:0){1,7}$/.test(clean)) return true;

  // Loopback (::1 or 0:0:0:0:0:0:0:1)
  if (clean === "::1" || /^(0:){1,7}1$/.test(clean)) return true;

  // Unique Local Addresses (fc00::/7 -> fc.. or fd..)
  if (clean.startsWith("fc") || clean.startsWith("fd")) return true;

  // Link-Local (fe80::/10 -> fe8.., fe9.., fea.., feb..)
  if (/^fe[89ab]/i.test(clean)) return true;

  // Multicast (ff00::/8)
  if (clean.startsWith("ff")) return true;

  // NAT64 prefix (64:ff9b::/96)
  if (clean.startsWith("64:ff9b:")) return true;

  // Documentation (2001:db8::/32)
  if (clean.startsWith("2001:db8:") || clean.startsWith("2001:0db8:")) return true;

  // Teredo (2001::/32)
  if (clean.startsWith("2001:0000:") || clean.startsWith("2001:0:")) return true;

  // Discard prefix (100::/64)
  if (clean.startsWith("100::") || clean.startsWith("0100::")) return true;

  return false;
}

/**
 * Checks whether an IP string (either v4 or v6) is private or reserved.
 */
export function isPrivateIp(ip: string): boolean {
  // Check IPv4
  const v4Num = parseIpv4ToNumber(ip);
  if (v4Num !== null) {
    return isPrivateOrReservedIpv4(v4Num);
  }

  // Check IPv6
  if (ip.includes(":")) {
    return isPrivateOrReservedIpv6(ip);
  }

  // Unrecognized format -> fail safe by treating as private/unsafe
  return true;
}

/**
 * Synchronous URL syntax and static host validation.
 */
export function isSafePublicWebhookUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // 1. Strict HTTPS only
    if (url.protocol !== "https:") return false;

    // 2. Reject credentials in URL
    if (url.username || url.password) return false;

    // 3. Port: allow default (empty) or 443 only
    if (url.port && url.port !== "443") return false;

    const hostname = url.hostname.toLowerCase().trim();
    if (!hostname) return false;

    // 4. Reject localhost, local domain names, and internal TLDs
    const internalSuffixes = [
      "localhost",
      ".localhost",
      ".local",
      ".internal",
      ".corp",
      ".lan",
      ".home",
      ".arpa",
      ".localdomain",
      ".test",
      ".example",
      ".invalid",
    ];
    for (const suffix of internalSuffixes) {
      if (hostname === suffix || hostname.endsWith(suffix)) {
        return false;
      }
    }

    // 5. If hostname looks like an IP literal, validate directly
    let ipLiteral = hostname;
    if (ipLiteral.startsWith("[") && ipLiteral.endsWith("]")) {
      ipLiteral = ipLiteral.slice(1, -1);
    }

    const v4Num = parseIpv4ToNumber(ipLiteral);
    if (v4Num !== null) {
      return !isPrivateOrReservedIpv4(v4Num);
    }

    if (ipLiteral.includes(":")) {
      return !isPrivateOrReservedIpv6(ipLiteral);
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Asynchronous, Fail-Closed deep SSRF validation.
 * Performs real DNS lookup and rejects if ANY resolved address is private, internal, or if DNS resolution fails.
 */
export async function isSafePublicWebhookUrlAsync(urlString: string): Promise<boolean> {
  // First pass: static syntax and hostname check
  if (!isSafePublicWebhookUrl(urlString)) {
    return false;
  }

  try {
    const url = new URL(urlString);
    let hostname = url.hostname.toLowerCase().trim();
    if (hostname.startsWith("[") && hostname.endsWith("]")) {
      hostname = hostname.slice(1, -1);
    }

    // Direct IP literals already evaluated in isSafePublicWebhookUrl
    if (parseIpv4ToNumber(hostname) !== null || hostname.includes(":")) {
      return !isPrivateIp(hostname);
    }

    // Resolve DNS using dns.promises.lookup with verbatim: true and all: true
    // Fail-Closed: if DNS lookup throws (NXDOMAIN, timeout, error) -> reject request
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    if (!records || records.length === 0) {
      return false; // Fail closed
    }

    for (const record of records) {
      if (isPrivateIp(record.address)) {
        return false; // Any private resolved IP immediately fails
      }
    }

    return true;
  } catch {
    // Fail closed on DNS errors, timeouts, or resolution exceptions
    return false;
  }
}
