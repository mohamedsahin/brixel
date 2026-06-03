import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateArticle } from "@/lib/articleGenerator";
import { isAutoPublish } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const isVercelCron = !!req.headers.get("x-vercel-cron-signature");
  const isManualAuth = !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !isManualAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    console.log("[cron/articles] Generating article…");
    const [article, autoPublish] = await Promise.all([generateArticle(), isAutoPublish()]);
    const status = autoPublish ? "published" : "draft";

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
        tags:            [...(article.tags ?? []), ...(article.lsiKeywords ?? [])].slice(0, 8),
        coverImageQuery: article.coverImageQuery ?? "small business",
        readingMins:     article.readingMins,
        status,
      },
    });

    if (status === "published") {
      try { revalidatePath("/blog"); } catch {}
    }

    const ms = Date.now() - startedAt;
    console.log(`[cron/articles] ${status === "published" ? "Published" : "Saved draft"}: "${created.title}" (${ms}ms)`);

    return NextResponse.json({ ok: true, slug: created.slug, title: created.title, status, ms });
  } catch (err) {
    console.error("[cron/articles]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, note: "POST to generate an article" });
}
