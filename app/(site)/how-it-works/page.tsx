import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "How it works" };

const steps = [
  ["Tell us about your business", "Send a message, book a call, or chat with Bricky. Tell us what you do and what you'd love your website to do. No tech words needed — promise."],
  ["We show you a plan & price", "We come back with a simple plan written in plain English and a clear, fixed price. You'll know exactly what you're getting and what it costs before anything starts."],
  ["We build it (you stay in the loop)", "We get to work and show you a preview early. You tell us what to change — colours, words, pictures — until it feels right. We handle all the technical bits behind the scenes."],
  ["We launch & look after it", "We put your site live and show you how to use it. With a Care Plan, we keep it healthy, fast and safe — quietly fixing things before you'd ever notice."],
];

export default function HowPage() {
  return (
    <div>
      <PageHead eyebrow="The process" title="How it works" sub="Working with us is calm and clear. Here's exactly what happens, step by step." />
      <section className="py-20 pt-12">
        <div className="wrap max-w-[820px]">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="flex gap-6" style={{ paddingBottom: i < 3 ? 40 : 0 }}>
                <div className="flex flex-col items-center">
                  <div className="grid h-13 w-13 flex-none place-items-center rounded-2xl bg-teal font-head text-[22px] font-extrabold text-white" style={{ width: 52, height: 52 }}>
                    {i + 1}
                  </div>
                  {i < 3 && <div className="mt-2 w-0.5 flex-1 bg-mist-deep" />}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-[23px]">{s[0]}</h3>
                  <p className="mt-2 max-w-[58ch] text-[16.5px] text-ink-soft">{s[1]}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <div className="card mt-9 bg-mist p-8 text-center">
            <h3 className="text-[22px]">The payment, plainly</h3>
            <p className="mt-2.5 text-[17px] text-ink-soft">
              You pay <b className="text-teal">half to begin</b> and <b className="text-teal">half when it&apos;s finished</b> and you&apos;re happy. Nothing hidden.
            </p>
            <Link href="/contact" className="btn btn-amber btn-lg mt-5">
              Get a free quote <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
