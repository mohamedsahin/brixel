import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHead } from "@/components/PageHead";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  ["How much does a website cost?", "Our Starter Website begins at AED 4,500. Online shops start at AED 9,000, and bigger custom sites at AED 20,000. The exact price depends on what you need — we'll give you a clear, fixed quote before any work begins."],
  ["How long does it take?", "A Starter Website is often ready in about a week. Bigger projects take a little longer, but you'll always see a preview early and know the timeline up front."],
  ["Do I need to know anything about tech?", "Not at all — that's our job. We explain everything in plain words and handle all the technical bits for you."],
  ["Can I edit it myself afterwards?", "Yes! For most sites you can change words and pictures yourself, as easily as editing a document. And if you'd rather we do it, the Care Plan covers small changes for you."],
  ["What's the Care Plan?", "Think of it like a regular checkup for your website — we keep it fast, safe and up to date, and fix little problems before you'd ever notice. From AED 400/month."],
  ["Do you work in Arabic?", "Absolutely. We build in both Arabic and English, and you can chat with us in either language — including on WhatsApp."],
  ["How do payments work?", "Simple: half to begin, half when it's finished and you're happy. No hidden fees."],
];

export default function FaqPage() {
  return (
    <div>
      <PageHead eyebrow="Questions?" title="Frequently asked questions" sub="Plain answers to the things people ask us most." />
      <section className="py-20 pt-10">
        <div className="wrap max-w-[760px]">
          {faqs.map((q, i) => (
            <details key={i} className="group card mb-3 overflow-hidden" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-3.5 px-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="flex-1 font-head text-lg font-bold text-teal">{q[0]}</span>
                <ChevronRight className="flex-none text-aqua transition group-open:rotate-90" size={20} />
              </summary>
              <div className="px-6 pb-5 text-base text-ink-soft">{q[1]}</div>
            </details>
          ))}
          <div className="mt-7 text-center">
            <p className="text-ink-soft">Still wondering something?</p>
            <Link href="/contact" className="btn btn-amber btn-lg mt-3">
              Ask us — get a free quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
