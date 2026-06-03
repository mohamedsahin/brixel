import type { Metadata } from "next";
import { getPackages } from "@/lib/data";
import { PackageCard } from "@/components/PackageCard";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Packages" };

export default async function PackagesPage() {
  const packages = await getPackages();
  return (
    <div>
      <PageHead
        eyebrow="Our packages"
        title="Simple choices, plain prices"
        sub="Every package is explained in everyday words. Tap “Show me more details” only if you're curious about the tech."
      />
      <section className="py-20 pt-8">
        <div className="wrap grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.key} delay={i * 50} className="flex">
              <PackageCard pkg={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
