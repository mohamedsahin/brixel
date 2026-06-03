import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Editable from the admin Package manager — writes to the DB so customer-facing
// prices come from one place and stay accurate.
const putSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  fromPrice: z.number().int().nonnegative().optional(),
  priceRange: z.string().trim().max(120).optional(),
  blurb: z.string().trim().max(2000).optional(),
});

export async function PUT(req: Request, { params }: { params: { key: string } }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = putSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid", details: parsed.error.flatten() }, { status: 400 });

  try {
    const pkg = await prisma.package.update({ where: { key: params.key }, data: parsed.data });
    return NextResponse.json({ ok: true, pkg });
  } catch {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }
}
