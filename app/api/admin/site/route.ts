import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteContent, updateSiteContent } from "@/services/site-service";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const site = await getSiteContent();
  return NextResponse.json({ site });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorized();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const site = await updateSiteContent(body || {});
  return NextResponse.json({ site });
}
