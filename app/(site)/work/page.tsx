import type { Metadata } from "next";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { IMAGES } from "@/lib/utils";

export const metadata: Metadata = { title: "Our work" };

const items = [
  ["Layla Beauty Lounge", "Starter Website", "A calm, pretty shop window with one-tap WhatsApp booking.", IMAGES.salon],
  ["Farouk Auto Parts", "Online Store", "An always-open shop with card + pay-later and live stock counts.", IMAGES.store],
  ["Smile Dental Clinic", "Pro Website", "Bilingual premium site with online appointment booking.", IMAGES.dental],
  ["Belhoul Interiors", "Pro Website", "A bilingual portfolio that wins trust at first glance.", IMAGES.interior],
  ["Nasser Logistics", "Custom App", "A driver dashboard built from scratch to fit their routes.", IMAGES.logistics],
  ["Sara's Cakes", "Starter Website", "A sweet little site that turns scrolls into WhatsApp orders.", IMAGES.bakery],
];

export default function WorkPage() {
  return (
    <div>
      <PageHead
        eyebrow="Our work"
        title="A few businesses we've helped"
        sub="Real local businesses, online and looking professional. (Sample case studies — swap in your own anytime.)"
      />
      <section className="py-20 pt-12">
        <div className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 50}>
              <div className="group card overflow-hidden">
                <div className="overflow-hidden">
                  <SmartImage src={it[3]} label={`project — ${it[0]}`} className="h-[210px] transition-transform duration-500 group-hover:scale-[1.07]" />
                </div>
                <div className="p-6">
                  <span className="badge bg-mist text-teal">{it[1]}</span>
                  <h3 className="mt-3 text-xl">{it[0]}</h3>
                  <p className="mt-2 text-[15px] text-ink-soft">{it[2]}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
