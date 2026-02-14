import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "public", "content.json");

export async function GET() {
  const data = await fs.readFile(CONTENT_PATH, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function PUT(req: Request) {
  const body = await req.json();
  await fs.writeFile(CONTENT_PATH, JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}
