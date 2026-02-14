import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  setupAdmin,
  getCredentials,
  SESSION_COOKIE,
} from "@/lib/auth";

// Rate limiter — tracks failed attempts per IP
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const failedAttempts = new Map<string, { count: number; firstAttempt: number }>();

function checkRateLimit(ip: string): { blocked: boolean; retryAfterSecs?: number } {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record) return { blocked: false };

  // Window expired — reset
  if (now - record.firstAttempt > WINDOW_MS) {
    failedAttempts.delete(ip);
    return { blocked: false };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSecs = Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 1000);
    return { blocked: true, retryAfterSecs };
  }

  return { blocked: false };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    record.count++;
  }
}

function clearFailedAttempts(ip: string) {
  failedAttempts.delete(ip);
}

// POST /api/auth — login or setup
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const body = await req.json();
  const { password, action } = body;

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  // First-time setup (not rate limited)
  if (action === "setup") {
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const created = await setupAdmin(password);
    if (!created) {
      return NextResponse.json(
        { error: "Admin already configured" },
        { status: 409 }
      );
    }

    const token = await createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  }

  // Check rate limit before login attempt
  const limit = checkRateLimit(ip);
  if (limit.blocked) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfterSecs! / 60)} minutes.` },
      { status: 429 }
    );
  }

  // Login
  const valid = await verifyPassword(password);
  if (!valid) {
    recordFailedAttempt(ip);
    const updated = failedAttempts.get(ip);
    const remaining = MAX_ATTEMPTS - (updated?.count || 0);
    return NextResponse.json(
      { error: remaining > 0 ? `Wrong password. ${remaining} attempts left.` : "Too many attempts. Try again in 15 minutes." },
      { status: remaining > 0 ? 401 : 429 }
    );
  }

  clearFailedAttempts(ip);
  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}

// GET /api/auth — check session status
export async function GET(req: NextRequest) {
  const creds = await getCredentials();
  const needsSetup = !creds;

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authenticated = token ? await verifySessionToken(token) : false;

  return NextResponse.json({ authenticated, needsSetup });
}

// DELETE /api/auth — logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
