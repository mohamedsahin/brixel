import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["New", "Contacted", "Quoted", "Won", "Lost"]).optional(),
  temperature: z.enum(["hot", "warm", "cold"]).optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  try {
    const lead = await prisma.lead.update({ where: { id: params.id }, data: parsed.data });
    if (parsed.data.status === "Won") {
      await prisma.event.create({ data: { type: "won" } });
    }
    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
