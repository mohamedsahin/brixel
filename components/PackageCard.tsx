import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { PkgIcon } from "./icons";
import { fmtAED, type PackageDef } from "@/lib/packages";
import { cn } from "@/lib/utils";

// Plain-English copy on top; tech details tucked into a native <details>.
export function PackageCard({ pkg }: { pkg: PackageDef }) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-card",
        pkg.featured ? "border-[1.5px] border-aqua" : "border-line hover:border-mist-deep",
      )}
    >
      {pkg.featured && (
        <span className="absolute -top-3 end-6 inline-flex items-center gap-1.5 rounded-full bg-aqua px-3 py-1.5 font-head text-xs font-semibold text-white">
          <Sparkles size={13} /> Most loved
        </span>
      )}
      <span
        className={cn(
          "grid h-[58px] w-[58px] place-items-center rounded-[17px] transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-[-5deg] group-hover:bg-aqua group-hover:text-white",
          pkg.featured ? "bg-teal text-white" : "bg-mist text-teal",
        )}
      >
        <PkgIcon pkgKey={pkg.key} size={28} />
      </span>

      <h3 className="mt-4 text-[23px]">{pkg.name}</h3>
      <div className="mt-1 font-head text-[15px] font-bold text-aqua">
        from <b className="text-xl text-teal">{fmtAED(pkg.fromPrice)}</b>
        {pkg.recurring}
      </div>
      <p className="mt-3.5 flex-1 text-[15.5px] text-ink-soft">{pkg.blurb}</p>

      <details className="group/d mt-3.5 border-t border-dashed border-line pt-3">
        <summary className="flex cursor-pointer list-none items-center gap-1.5 font-head text-sm font-semibold text-aqua [&::-webkit-details-marker]:hidden">
          <ChevronRight size={15} className="transition group-open/d:rotate-90" /> Show me more details
        </summary>
        <div className="pt-3 text-sm text-ink-soft">
          <div className="mb-1.5 font-head font-semibold text-teal">
            Best for: <span className="font-normal text-ink-soft">{pkg.bestFor}</span>
          </div>
          <ul className="ms-4 list-disc space-y-1.5">
            {pkg.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <div className="mt-2.5 text-xs text-ink-faint">For the curious — what&apos;s under the hood:</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {pkg.tech.map((x, i) => (
              <span key={i} className="rounded-md border border-line bg-cloud px-2 py-0.5 text-xs text-ink-faint">
                {x}
              </span>
            ))}
          </div>
        </div>
      </details>

      <div className="mt-5 flex flex-col gap-2.5">
        <Link href={`/contact?package=${pkg.key}`} className="btn btn-amber w-full">
          Enquire about this
        </Link>
        <Link href={`/packages/${pkg.key}`} className="btn btn-ghost w-full">
          Read more
        </Link>
      </div>
    </div>
  );
}
