import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const adminCookieName = "affiliate_admin_session";

const sessionMaxAge = 60 * 60 * 8;

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "local-development-session-secret"
  );
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "AdminShopee!2026";
}

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

function signSession(payload: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

export function createAdminSession() {
  const payload = `admin.${Date.now()}`;
  return `${payload}.${signSession(payload)}`;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAge,
  };
}

export function verifyPassword(password: string) {
  const expected = Buffer.from(getAdminPassword());
  const received = Buffer.from(password);

  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}

export function verifyCredentials(username: string, password: string) {
  const expectedUsername = Buffer.from(getAdminUsername());
  const receivedUsername = Buffer.from(username);

  if (expectedUsername.length !== receivedUsername.length) return false;
  if (!crypto.timingSafeEqual(expectedUsername, receivedUsername)) return false;

  return verifyPassword(password);
}

export function isAdminRequest(request: NextRequest) {
  const token = request.cookies.get(adminCookieName)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const payload = `${parts[0]}.${parts[1]}`;
  const signature = parts[2];
  const expectedSignature = signSession(payload);
  const issuedAt = Number(parts[1]);

  if (!Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > sessionMaxAge * 1000) return false;

  const received = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (received.length !== expected.length) return false;

  return crypto.timingSafeEqual(received, expected);
}
