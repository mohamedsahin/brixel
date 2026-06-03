import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { callbackSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { notifyOwner } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rl = rateLimit(`callback:${clientIp(req)}`, 8, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = callbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please add your name and a valid number." }, { status: 400 });
  }
  const d = parsed.data;

  try {
    await prisma.callback.create({
      data: { name: d.name, phone: d.phone, bestTime: d.bestTime || null, status: "pending" },
    });
    await prisma.notification.create({ data: { type: "callback", payload: { name: d.name } } });
    await notifyOwner({
      subject: `Callback requested — ${d.name}`,
      html: `<p><b>${d.name}</b> wants a callback on <b>${d.phone}</b> (${d.bestTime || "anytime"}).</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/callbacks]", err);
    return NextResponse.json({ error: "Could not save your callback request." }, { status: 500 });
  }
}
