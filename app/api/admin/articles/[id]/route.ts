import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Update article status (published / draft / archived)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { status } = body as { status?: string };
  if (!status || !["published", "draft", "archived"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = await prisma.article.update({
    where: { id: params.id },
    data: { status },
  });
  try { revalidatePath("/blog"); } catch {}
  return NextResponse.json({ ok: true, status: updated.status });
}

// Delete an article
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.article.delete({ where: { id: params.id } });
  try { revalidatePath("/blog"); } catch {}
  return NextResponse.json({ ok: true });
}
