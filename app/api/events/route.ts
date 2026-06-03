import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Journey-event ingestion for the analytics funnel.
export async function POST(req: Request) {
  const rl = rateLimit(`event:${clientIp(req)}`, 60, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    await prisma.event.create({
      data: {
        type: parsed.data.type,
        sessionId: parsed.data.sessionId ?? null,
        metadata: parsed.data.metadata ?? undefined,
      },
    });
  } catch {
    /* analytics is best-effort */
  }
  return NextResponse.json({ ok: true });
}
