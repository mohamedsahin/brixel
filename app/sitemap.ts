import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://brixel.ae";
const STATIC_ROUTES = ["", "/packages", "/how-it-works", "/work", "/about", "/faq", "/contact", "/blog"];
const PKG_KEYS = ["starter", "store", "pro", "custom", "care"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const articleSlugs = await getAllArticleSlugs();

  return [
    // Static pages — highest priority
    ...STATIC_ROUTES.map((r) => ({
      url: `${base}${r}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: r === "" ? 1.0 : 0.8,
    })),
    // Package detail pages
    ...PKG_KEYS.map((k) => ({
      url: `${base}/packages/${k}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Blog articles — daily change, high SEO value
    ...articleSlugs.map((slug) => ({
      url: `${base}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];
}
