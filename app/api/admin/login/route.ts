import { NextResponse, type NextRequest } from "next/server";
import {
  adminCookieName,
  createAdminSession,
  getAdminCookieOptions,
  verifyCredentials,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  if (!body?.username || !body?.password || !verifyCredentials(body.username, body.password)) {
    return NextResponse.json(
      { message: "Username atau password salah." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    adminCookieName,
    createAdminSession(),
    getAdminCookieOptions(),
  );

  return response;
}
