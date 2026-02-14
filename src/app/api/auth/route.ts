import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  setupAdmin,
  getCredentials,
  SESSION_COOKIE,
} from "@/lib/auth";

// POST /api/auth — login or setup
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, action } = body;

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  // First-time setup
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

  // Login
  const valid = await verifyPassword(password);
  if (!valid) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
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
