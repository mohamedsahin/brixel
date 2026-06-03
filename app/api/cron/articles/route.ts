import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateArticle } from "@/lib/articleGenerator";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  // Accept: Bearer <CRON_SECRET> (manual/external trigger)
  //      OR: Vercel's internal cron signature header
  const auth = req.headers.get("authorization");
  const isVercelCron = !!req.headers.get("x-vercel-cron-signature");
  const isManualAuth = !!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !isManualAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    console.log("[cron/articles] Generating article…");
    const article = await generateArticle();

    // Guarantee slug uniqueness
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

    // Revalidate blog listing so new article appears without a redeploy
    try {
      revalidatePath("/blog");
    } catch {}

    const ms = Date.now() - startedAt;
    console.log(`[cron/articles] Published "${created.title}" (${ms}ms)`);

    return NextResponse.json({
      ok:    true,
      slug:  created.slug,
      title: created.title,
      ms,
    });
  } catch (err) {
    console.error("[cron/articles]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Allow GET so Vercel's health-check ping doesn't 405
export async function GET() {
  return NextResponse.json({ ok: true, note: "POST to generate an article" });
}
