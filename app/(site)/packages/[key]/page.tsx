import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, Users, Phone } from "lucide-react";
import { getPackage, getPackages } from "@/lib/data";
import { PkgIcon } from "@/components/icons";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { fmtAED } from "@/lib/packages";
import { waLink, telLink } from "@/lib/contact";

export async function generateStaticParams() {
  const pkgs = await getPackages();
  return pkgs.map((p) => ({ key: p.key }));
}

export async function generateMetadata({ params }: { params: { key: string } }): Promise<Metadata> {
  const pkg = await getPackage(params.key);
  return { title: pkg ? pkg.name : "Package" };
}

export default async function PackageDetail({ params }: { params: { key: string } }) {
  const pkg = await getPackage(params.key);
  if (!pkg) notFound();

  return (
    <section className="py-16 pb-8">
      <div className="wrap">
        <Link href="/packages" className="btn btn-ghost btn-sm mb-6">
          ← All packages
        </Link>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
          <div>
            <span className="grid h-16 w-16 place-items-center rounded-[18px] bg-mist text-teal">
              <PkgIcon pkgKey={pkg.key} size={32} />
            </span>
            <h1 className="mt-3 text-[clamp(32px,4.4vw,50px)]">{pkg.name}</h1>
            <div className="mt-2 font-head text-lg font-bold text-aqua">
              from <b className="text-[26px] text-teal">{fmtAED(pkg.fromPrice)}</b>
              {pkg.recurring} <span className="font-normal text-ink-soft">· {pkg.priceRange}</span>
            </div>
            <p className="mt-5 max-w-[54ch] text-[19px] text-ink-soft">{pkg.blurb}</p>

            <div className="mt-5 inline-flex items-center gap-2.5 rounded-2xl bg-mist px-5 py-4">
              <Users size={20} />
              <span>
                <b className="font-head text-teal">Best for:</b> {pkg.bestFor}
              </span>
            </div>

            <h3 className="mt-9 text-[22px]">What you get</h3>
            <ul className="mt-4 grid gap-3">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-[16.5px]">
                  <Check className="mt-0.5 flex-none text-aqua" size={20} /> {f}
                </li>
              ))}
            </ul>

            <details className="group/d mt-7 border-t border-dashed border-line pt-3">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 font-head text-sm font-semibold text-aqua [&::-webkit-details-marker]:hidden">
                <ChevronRight size={15} className="transition group-open/d:rotate-90" /> Show me more details (for the curious)
              </summary>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {pkg.tech.map((x, i) => (
                  <span key={i} className="rounded-md border border-line bg-cloud px-2 py-0.5 text-xs text-ink-faint">
                    {x}
                  </span>
                ))}
              </div>
            </details>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="card p-7">
              <h3 className="text-xl">Like the sound of this?</h3>
              <p className="mt-2 text-[15px] text-ink-soft">
                Tell us a little about your business and we&apos;ll send a free, friendly quote.
              </p>
              <Link href={`/contact?package=${pkg.key}`} className="btn btn-amber btn-lg mt-4 w-full">
                Enquire about this <ArrowRight size={18} />
              </Link>
              <div className="mt-3 flex gap-2.5">
                <a className="btn btn-wa btn-sm flex-1" href={waLink(`Hi! I'm interested in the ${pkg.name}.`)} target="_blank" rel="noreferrer">
                  <WhatsAppIcon size={17} /> WhatsApp
                </a>
                <a className="btn btn-ghost btn-sm flex-1" href={telLink()}>
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
