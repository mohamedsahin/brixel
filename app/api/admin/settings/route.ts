import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getSetting, setSetting } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
  const value = await getSetting(key);
  return NextResponse.json({ key, value });
}

export async function PATCH(req: Request) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key, value } = await req.json().catch(() => ({}));
  if (!key || value === undefined) return NextResponse.json({ error: "key + value required" }, { status: 400 });
  await setSetting(key, String(value));
  return NextResponse.json({ ok: true, key, value });
}
