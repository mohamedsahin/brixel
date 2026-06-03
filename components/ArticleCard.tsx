import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { coverImageUrl } from "@/lib/articleGenerator";
import { SmartImage } from "./SmartImage";
import type { ArticleRow } from "@/lib/data";

export function ArticleCard({ article }: { article: ArticleRow }) {
  const tags = (article.tags as string[]) ?? [];
  const imgUrl = coverImageUrl(article.coverImageQuery, 600, 380);
  const dateStr = new Date(article.createdAt).toLocaleDateString("en-AE", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-card"
    >
      {/* Cover image */}
      <SmartImage
        src={imgUrl}
        label={article.title}
        className="h-[190px] w-full transition-transform duration-500 group-hover:scale-[1.04] sm:h-[210px]"
      />

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 font-head text-[11px] font-semibold text-teal">
              <Tag size={10} /> {tags[0]}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="font-head text-[17px] font-bold leading-snug text-teal line-clamp-2 group-hover:text-aqua transition-colors sm:text-lg">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-ink-soft line-clamp-3 sm:text-sm">
          {article.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-[12px] text-ink-faint">
          <span>{dateStr}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {article.readingMins} min read
          </span>
        </div>
      </div>
    </Link>
  );
}
