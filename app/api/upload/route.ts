// ✅ CORRECT PATH: app/api/upload/route.ts (NOT api/upload)
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ CREATE UPLOADS DIRECTORY IF NOT EXISTS
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // ✅ VALIDATE FILE TYPE & SIZE
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ SANITIZE FILENAME
    const ext = path.extname(file.name);
    const name = file.name.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const fileName = `${Date.now()}-${name}${ext}`;

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`,
      name: fileName
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}