import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function unauthorized() {
  return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 401 });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File foto wajib diupload." }, { status: 400 });
  }

  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return NextResponse.json(
      { message: "Format foto harus JPG, PNG, atau WebP." },
      { status: 400 },
    );
  }

  if (file.size > 2_500_000) {
    return NextResponse.json(
      { message: "Ukuran foto maksimal 2.5MB." },
      { status: 400 },
    );
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  const filename = `${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, filename), bytes);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
