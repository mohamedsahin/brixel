import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// List all articles (admin only)
export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      focusKeyword: true, tags: true, status: true,
      views: true, readingMins: true, createdAt: true,
    },
  });
  return NextResponse.json(articles);
}
