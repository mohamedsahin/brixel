import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
      <section className="py-12 pt-8 sm:py-20 sm:pt-10">
        <div className="wrap max-w-[760px]">
          {faqs.map((q, i) => (
            <details key={i} className="group mb-3 overflow-hidden rounded-2xl border border-line bg-white shadow-soft" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden sm:px-6 sm:py-5">
                <span className="flex-1 font-head text-base font-bold text-teal sm:text-lg">{q[0]}</span>
                <ChevronDown
                  className="flex-none text-aqua transition-transform duration-200 group-open:rotate-180"
                  size={20}
                />
              </summary>
              <div className="px-5 pb-5 text-[14.5px] leading-relaxed text-ink-soft sm:px-6 sm:pb-5 sm:text-base">
                {q[1]}
              </div>
            </details>
          ))}

          <div className="mt-8 rounded-2xl bg-teal p-6 text-center sm:mt-7 sm:p-8">
            <p className="font-head text-base font-semibold text-white sm:text-lg">Still have a question?</p>
            <p className="mt-1.5 text-[13.5px] text-[#bfe3dd] sm:text-sm">We reply fast — usually same day.</p>
            <Link href="/contact" className="btn btn-amber btn-lg mt-4 w-full justify-center sm:w-auto">
              Ask us — get a free quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
