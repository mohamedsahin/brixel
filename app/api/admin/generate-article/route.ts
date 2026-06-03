import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin-auth";
import { generateArticle } from "@/lib/articleGenerator";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const article = await generateArticle();

    let slug = article.slug;
    const collision = await prisma.article.findUnique({ where: { slug } });
    if (collision) slug = `${slug}-${Date.now().toString(36)}`;

    const created = await prisma.article.create({
      data: {
        title:           article.title,
        slug,
        excerpt:         article.excerpt,
        content:         article.content as object,
        focusKeyword:    article.focusKeyword,
        metaTitle:       article.metaTitle,
        metaDescription: article.metaDescription,
        tags:            article.tags,
        coverImageQuery: article.coverImageQuery ?? "small business",
        readingMins:     article.readingMins,
        status:          "published",
      },
    });

    try { revalidatePath("/blog"); } catch {}

    return NextResponse.json({ ok: true, slug: created.slug, title: created.title });
  } catch (err) {
    console.error("[admin/generate-article]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
