import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

// DEMO admin gate. Swap for Clerk / NextAuth in production (see README).
export async function POST(req: Request) {
  const rl = rateLimit(`login:${clientIp(req)}`, 8, 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  cookies().set(ADMIN_COOKIE, "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return NextResponse.json({ ok: true });
}
