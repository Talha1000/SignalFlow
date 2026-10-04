import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;

  // 1. Route Protection: Guard /app/* routes
  if (pathname.startsWith("/app")) {
    const sessionToken = request.cookies.get("signalflow_session")?.value;
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. CORS Handling
  const origin = request.headers.get("origin");
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
  let isAllowedOrigin = false;
  let allowedOriginHeader = "";

  if (origin) {
    if (allowedOriginsEnv) {
      const allowedOrigins = allowedOriginsEnv.split(",").map((o) => o.trim());
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        isAllowedOrigin = true;
        allowedOriginHeader = origin;
      }
    } else {
      // Default: allow localhost development and same host origin
      const host = request.headers.get("host");
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        (host && origin.includes(host))
      ) {
        isAllowedOrigin = true;
        allowedOriginHeader = origin;
      }
    }
  }

  // Handle API preflight OPTIONS
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const preflightResponse = new NextResponse(null, { status: 204 });
    if (isAllowedOrigin && allowedOriginHeader) {
      preflightResponse.headers.set("Access-Control-Allow-Origin", allowedOriginHeader);
      preflightResponse.headers.set("Access-Control-Allow-Credentials", "true");
    }
    preflightResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    preflightResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-request-id");
    preflightResponse.headers.set("Access-Control-Max-Age", "86400");
    preflightResponse.headers.set("x-request-id", requestId);
    return preflightResponse;
  }

  const response = NextResponse.next();

  // 3. Distributed Tracing & Request ID
  response.headers.set("x-request-id", requestId);

  // 4. Security Headers (SOC2 / Enterprise Standard)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // 5. API CORS Headers for /api/* endpoints
  if (pathname.startsWith("/api/")) {
    if (isAllowedOrigin && allowedOriginHeader) {
      response.headers.set("Access-Control-Allow-Origin", allowedOriginHeader);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-request-id");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

