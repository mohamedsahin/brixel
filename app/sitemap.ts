import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://brixel.ae";
const routes = ["", "/packages", "/how-it-works", "/work", "/about", "/faq", "/contact"];
const packageKeys = ["starter", "store", "pro", "custom", "care"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...routes.map((r) => ({ url: `${base}${r}`, lastModified: now })),
    ...packageKeys.map((k) => ({ url: `${base}/packages/${k}`, lastModified: now })),
  ];
}
