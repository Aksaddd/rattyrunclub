import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sanitize filename
  const ext = path.extname(file.name).toLowerCase();
  const safeName = `${Date.now()}${ext}`;
  const filePath = path.join(UPLOADS_DIR, safeName);

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ path: `/uploads/${safeName}` });
}

export async function DELETE(req: Request) {
  const { filePath } = await req.json();

  // Only allow deleting from /uploads/
  if (!filePath || !filePath.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const fullPath = path.join(process.cwd(), "public", filePath);
  try {
    await fs.unlink(fullPath);
  } catch {
    // File may already be gone
  }

  return NextResponse.json({ ok: true });
}
