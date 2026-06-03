import { prisma } from "./prisma";
import { PACKAGES, type PackageDef } from "./packages";

// ── Article types ────────────────────────────────────────────────────────────
export type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: unknown;
  focusKeyword: string;
  metaTitle: string;
  metaDescription: string;
  tags: unknown;
  coverImageQuery: string;
  readingMins: number;
  status: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
};

// Read packages from the DB; fall back to the static config so the public
// site renders even before `prisma db push` / seeding has run.
export async function getPackages(): Promise<PackageDef[]> {
  try {
    const rows = await prisma.package.findMany({ orderBy: { order: "asc" } });
    if (rows.length === 0) return PACKAGES;
    return rows.map((r) => ({
      key: r.key as PackageDef["key"],
      name: r.name,
      fromPrice: r.fromPrice,
      priceRange: r.priceRange,
      type: r.type === "recurring" ? "recurring" : "one_time",
      recurring: r.recurring,
      blurb: r.blurb,
      bestFor: r.bestFor,
      features: r.features as string[],
      tech: r.tech as string[],
      order: r.order,
      featured: r.featured,
    }));
  } catch {
    return PACKAGES;
  }
}

export async function getPackage(key: string) {
  const all = await getPackages();
  return all.find((p) => p.key === key) ?? null;
}

// ── Article queries ──────────────────────────────────────────────────────────
export async function getArticles(status = "published", take = 50): Promise<ArticleRow[]> {
  try {
    return await prisma.article.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
      take,
    }) as ArticleRow[];
  } catch {
    return [];
  }
}

export async function getArticle(slug: string): Promise<ArticleRow | null> {
  try {
    return await prisma.article.findUnique({ where: { slug } }) as ArticleRow | null;
  } catch {
    return null;
  }
}

export async function getAllArticleSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { status: "published" },
      select: { slug: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function incrementArticleViews(slug: string) {
  try {
    await prisma.article.update({ where: { slug }, data: { views: { increment: 1 } } });
  } catch {}
}

// ── Dashboard ────────────────────────────────────────────────────────────────
export async function getDashboard() {
  try {
    const [leads, callbacks, conversations, notifications, events, articles] = await Promise.all([
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      prisma.callback.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      prisma.conversation.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.event.groupBy({ by: ["type"], _count: { _all: true } }),
      prisma.article.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    ]);
    const eventCounts: Record<string, number> = {};
    for (const e of events) eventCounts[e.type] = e._count._all;
    return { leads, callbacks, conversations, notifications, eventCounts, articles, ok: true };
  } catch {
    return {
      leads: [],
      callbacks: [],
      conversations: [],
      notifications: [],
      eventCounts: {},
      articles: [],
      ok: false,
    };
  }
}
