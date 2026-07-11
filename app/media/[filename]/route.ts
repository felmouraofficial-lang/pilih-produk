import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const contentTypes = new Map([
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
]);

function getUploadDirectory() {
  return process.env.DATABASE_URL?.includes("/data/")
    ? path.join("/data", "uploads")
    : path.join(process.cwd(), "public", "uploads");
}

export async function GET(_request: Request, context: RouteContext<"/media/[filename]">) {
  const { filename } = await context.params;
  const safeFilename = path.basename(filename);

  if (safeFilename !== filename) {
    return NextResponse.json({ message: "File tidak valid." }, { status: 400 });
  }

  const extension = path.extname(safeFilename).toLowerCase();
  const contentType = contentTypes.get(extension);

  if (!contentType) {
    return NextResponse.json({ message: "Format file tidak didukung." }, { status: 400 });
  }

  try {
    const file = await readFile(path.join(getUploadDirectory(), safeFilename));

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ message: "File tidak ditemukan." }, { status: 404 });
  }
}
