import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/api/content", "/api/upload"];
const SESSION_COOKIE = "ratty_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect write operations on content/upload APIs
  if (
    PROTECTED_PATHS.some((p) => pathname.startsWith(p)) &&
    req.method !== "GET"
  ) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token by calling our auth endpoint internally
    // We do a lightweight check here — the cookie exists and has the right shape
    const parts = token.split(".");
    if (parts.length !== 2) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const payload = JSON.parse(
        Buffer.from(parts[0], "base64url").toString("utf-8")
      );
      if (!payload.exp || payload.exp < Date.now()) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/content/:path*", "/api/upload/:path*"],
};
