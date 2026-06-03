import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Tag, Calendar, ChevronRight, Phone } from "lucide-react";
import { getArticle, getAllArticleSlugs, getArticles } from "@/lib/data";
import { coverImageUrl, type ArticleContent, type ArticleSection, type ArticleFaq } from "@/lib/articleGenerator";
import { SmartImage } from "@/components/SmartImage";
import { ArticleCard } from "@/components/ArticleCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { waLink, telLink } from "@/lib/contact";

export const revalidate = 86400; // ISR: refresh once per day

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Article not found" };

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://brixel.ae";
  const imgUrl = coverImageUrl(article.coverImageQuery, 1200, 630);

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: [...(article.tags as string[]), article.focusKeyword].join(", "),
    alternates: { canonical: `${base}/blog/${article.slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      authors: ["Brixel Team"],
      images: [{ url: imgUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: [imgUrl],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, related] = await Promise.all([
    getArticle(params.slug),
    getArticles("published", 4),
  ]);
  if (!article) notFound();

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://brixel.ae";
  const content = article.content as ArticleContent;
  const tags = (article.tags as string[]) ?? [];
  const dateStr = new Date(article.createdAt).toLocaleDateString("en-AE", {
    day: "numeric", month: "long", year: "numeric",
  });
  const imgUrl = coverImageUrl(article.coverImageQuery, 1200, 630);

  const faqs: ArticleFaq[] = (content.faqs ?? []) as ArticleFaq[];

  // Article JSON-LD schema
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: imgUrl,
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Brixel", url: base },
    publisher: {
      "@type": "Organization",
      name: "Brixel",
      url: base,
      logo: { "@type": "ImageObject", url: `${base}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/blog/${article.slug}` },
    keywords: tags.join(", "),
  };

  // FAQ JSON-LD — powers "People also ask" rich snippets in Google
  const jsonLdFaq = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  // BreadcrumbList schema
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${base}/blog/${article.slug}` },
    ],
  };

  // Keep jsonLd as alias for backward compat in the template
  const jsonLd = jsonLdArticle;

  const relatedArticles = related.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      {/* JSON-LD structured data — Article + FAQ rich snippets + Breadcrumb */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {jsonLdFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* Breadcrumb */}
      <div className="bg-mist">
        <div className="wrap flex items-center gap-1.5 py-3 text-[13px] text-ink-soft">
          <Link href="/" className="hover:text-teal">Home</Link>
          <ChevronRight size={13} />
          <Link href="/blog" className="hover:text-teal">Blog</Link>
          <ChevronRight size={13} />
          <span className="line-clamp-1 text-teal">{article.title}</span>
        </div>
      </div>

      <article className="py-10 sm:py-14">
        <div className="wrap">
          <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_300px] lg:items-start">

            {/* ── Main content column ── */}
            <div className="min-w-0">
              {/* Tags */}
              {tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1 font-head text-[12px] font-semibold text-teal">
                      <Tag size={11} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-[clamp(26px,4vw,46px)] leading-tight">{article.title}</h1>

              {/* Meta row */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {dateStr}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {article.readingMins} min read
                </span>
                <span className="font-head text-[12px] font-semibold uppercase tracking-wide text-aqua">
                  By Brixel Team
                </span>
              </div>

              {/* Cover image */}
              <div className="mt-6 overflow-hidden rounded-2xl">
                <SmartImage
                  src={imgUrl}
                  label={article.title}
                  className="h-[220px] w-full sm:h-[320px] lg:h-[400px]"
                  priority
                />
              </div>

              {/* Article body */}
              <div className="prose-brixel mt-8">
                {/* Intro */}
                <p className="text-[17px] leading-[1.8] text-ink sm:text-[18px]">{content.intro}</p>

                {/* Sections */}
                {content.sections?.map((section: ArticleSection, i: number) => (
                  <div key={i} className="mt-8">
                    <h2 className="text-[22px] font-extrabold text-teal sm:text-[26px]">{section.h2}</h2>
                    {section.paragraphs?.map((p: string, j: number) => (
                      <p key={j} className="mt-4 text-[16px] leading-[1.8] text-ink-soft sm:text-[17px]">{p}</p>
                    ))}
                    {section.list && section.list.length > 0 && (
                      <ul className="mt-4 space-y-2.5">
                        {section.list.map((item: string, k: number) => (
                          <li key={k} className="flex items-start gap-3 text-[15.5px] text-ink-soft sm:text-[16px]">
                            <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-aqua" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.callout && (
                      <div className="mt-5 rounded-r-2xl border-l-4 border-aqua bg-mist px-5 py-4">
                        <p className="text-[15px] font-medium leading-relaxed text-teal sm:text-[16px]">
                          {section.callout}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Conclusion */}
                {content.conclusion && (
                  <p className="mt-8 text-[16px] leading-[1.8] text-ink-soft sm:text-[17px]">
                    {content.conclusion}
                  </p>
                )}

                {/* FAQ section — powers Google "People also ask" rich snippets */}
                {faqs.length > 0 && (
                  <div className="mt-10">
                    <h2 className="text-[22px] font-extrabold text-teal sm:text-[26px]">
                      Frequently Asked Questions
                    </h2>
                    <div className="mt-4 flex flex-col gap-3">
                      {faqs.map((faq: ArticleFaq, i: number) => (
                        <details key={i} className="group rounded-xl border border-line bg-white overflow-hidden" open={i === 0}>
                          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                            <span className="flex-1 font-head text-[15px] font-bold text-teal">{faq.question}</span>
                            <svg className="flex-none text-aqua transition-transform duration-200 group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </summary>
                          <div className="border-t border-line px-5 pb-4 pt-3 text-[14.5px] leading-relaxed text-ink-soft">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA section */}
                {content.ctaHeading && (
                  <div className="mt-10 rounded-3xl bg-teal p-7 text-white sm:p-8">
                    <h2 className="text-[22px] text-white sm:text-[26px]">{content.ctaHeading}</h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#bfe3dd] sm:text-[16px]">
                      {content.ctaText}
                    </p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link href="/contact" className="btn btn-amber btn-lg w-full justify-center sm:w-auto">
                        Get a free quote <ArrowRight size={18} />
                      </Link>
                      <a
                        href={waLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-wa btn-lg w-full justify-center sm:w-auto"
                      >
                        <WhatsAppIcon size={20} /> WhatsApp us
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags footer */}
              {tags.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                  <span className="font-head text-[13px] font-semibold text-ink-soft">Topics:</span>
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-line bg-cloud px-3 py-1 text-[12px] text-ink-soft">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Sticky sidebar ── */}
            <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
              {/* Quote CTA card */}
              <div className="card p-5 sm:p-6">
                <div className="mb-1 font-head text-xs font-semibold uppercase tracking-widest text-aqua">
                  Free quote
                </div>
                <h3 className="mt-1 text-[19px]">Ready to get your business online?</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  UAE team, plain English, 50% upfront. We'll send a friendly quote within the same day.
                </p>
                <Link href="/contact" className="btn btn-amber mt-4 w-full justify-center">
                  Get a free quote <ArrowRight size={16} />
                </Link>
                <div className="mt-3 flex gap-2">
                  <a href={waLink()} target="_blank" rel="noreferrer" className="btn btn-wa btn-sm flex-1 justify-center">
                    <WhatsAppIcon size={15} /> WhatsApp
                  </a>
                  <a href={telLink()} className="btn btn-ghost btn-sm flex-1 justify-center">
                    <Phone size={14} /> Call
                  </a>
                </div>
              </div>

              {/* Focus keyword / SEO badge */}
              <div className="rounded-xl border border-line bg-cloud px-4 py-3.5">
                <div className="font-head text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
                  Topic
                </div>
                <div className="mt-1 font-head text-[14px] font-bold text-teal">
                  {article.focusKeyword}
                </div>
              </div>

              {/* Share */}
              <ShareButtons url={`${base}/blog/${article.slug}`} title={article.title} />
            </aside>
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-[22px] sm:text-[26px]">More from the blog</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

function ShareButtons({ url, title }: { url: string; title: string }) {
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  return (
    <div className="rounded-xl border border-line bg-cloud px-4 py-4">
      <div className="mb-2.5 font-head text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
        Share this article
      </div>
      <div className="flex flex-col gap-2">
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="btn btn-wa btn-sm w-full justify-center"
        >
          <WhatsAppIcon size={15} /> Share on WhatsApp
        </a>
        <CopyButton url={url} />
      </div>
    </div>
  );
}

// Client-side copy button
import { CopyLinkButton } from "@/components/CopyLinkButton";
function CopyButton({ url }: { url: string }) {
  return <CopyLinkButton url={url} />;
}
