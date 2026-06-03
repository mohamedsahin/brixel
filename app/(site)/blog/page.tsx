import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { getArticles } from "@/lib/data";
import { ArticleCard } from "@/components/ArticleCard";
import { PageHead } from "@/components/PageHead";

export const revalidate = 1800; // ISR: re-generate every 30 min

export const metadata: Metadata = {
  title: "Web Design Tips & Guides for UAE Small Businesses | Brixel Blog",
  description:
    "Free guides, tips and advice to help small business owners in the UAE get online, get found on Google, and grow. From the Brixel team.",
  openGraph: {
    title: "Brixel Blog — UAE Web Design Guides",
    description: "Free tips and guides for UAE small businesses: websites, SEO, online payments, and more.",
    type: "website",
  },
};

export default async function BlogPage() {
  const articles = await getArticles("published", 50);

  return (
    <div>
      <PageHead
        eyebrow="Free guides & tips"
        title="The Brixel Blog"
        sub="Practical, plain-language advice to help your UAE business get online and get found."
      />

      <section className="py-12 sm:py-16">
        <div className="wrap">
          {articles.length === 0 ? (
            /* Empty state — shown before first article is generated */
            <div className="mx-auto max-w-lg py-16 text-center">
              <Rss className="mx-auto mb-4 text-aqua" size={48} />
              <h2 className="text-2xl">First article coming tomorrow!</h2>
              <p className="mt-3 text-ink-soft">
                Our AI writer publishes a new SEO article every day at 7 AM UAE time. Check back soon — or get a free quote right now.
              </p>
              <Link href="/contact" className="btn btn-amber btn-lg mt-6">
                Get a free quote <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <>
              {/* Article grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-14 rounded-3xl bg-teal px-6 py-10 text-center text-white sm:px-8 sm:py-12">
                <h2 className="text-[clamp(22px,3vw,36px)] text-white">
                  Want a website for your UAE business?
                </h2>
                <p className="mx-auto mt-3 max-w-[42ch] text-[15px] text-[#bfe3dd] sm:text-lg">
                  We build beautiful, affordable websites for small businesses across the UAE — in Arabic and English.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link href="/contact" className="btn btn-amber btn-lg w-full justify-center sm:w-auto">
                    Get a free quote <ArrowRight size={18} />
                  </Link>
                  <Link href="/packages" className="btn bg-white/10 text-white hover:bg-white/20 btn-lg w-full justify-center sm:w-auto">
                    See our packages
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
