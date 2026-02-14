import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "public", "content.json");

export async function GET() {
  const data = await fs.readFile(CONTENT_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await fs.writeFile(CONTENT_PATH, JSON.stringify(body, null, 2));

  // Bust the cache so pages reflect the new content immediately
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
