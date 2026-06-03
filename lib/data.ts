import { prisma } from "./prisma";
import { PACKAGES, type PackageDef } from "./packages";

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

// Dashboard data — each query is defensive so the panel never hard-crashes
// if the DB is unavailable.
export async function getDashboard() {
  try {
    const [leads, callbacks, conversations, notifications, events] = await Promise.all([
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      prisma.callback.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
      prisma.conversation.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
      prisma.event.groupBy({ by: ["type"], _count: { _all: true } }),
    ]);
    const eventCounts: Record<string, number> = {};
    for (const e of events) eventCounts[e.type] = e._count._all;
    return { leads, callbacks, conversations, notifications, eventCounts, ok: true };
  } catch {
    return {
      leads: [],
      callbacks: [],
      conversations: [],
      notifications: [],
      eventCounts: {},
      ok: false,
    };
  }
}
