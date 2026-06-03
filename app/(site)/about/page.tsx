import type { Metadata } from "next";
import { Globe, Shield, Clock } from "lucide-react";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";
import { OpenChatButton } from "@/components/OpenChatButton";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { IMAGES } from "@/lib/utils";

export const metadata: Metadata = { title: "About" };

const values = [
  { Icon: Globe, t: "Arabic + English", d: "Built right, both ways" },
  { Icon: WhatsAppIcon, t: "WhatsApp first", d: "Reach us the easy way" },
  { Icon: Shield, t: "Local payment know-how", d: "Tabby, Tamara, cards" },
  { Icon: Clock, t: "Same-day replies", d: "We don't keep you waiting" },
];

export default function AboutPage() {
  return (
    <div>
      <PageHead
        eyebrow="About Brixel"
        title="Building blocks for the web"
        sub="Brixel means brick + pixel — simple building blocks that put your business online, beautifully."
      />
      <section className="py-20 pt-10">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SmartImage src={IMAGES.team} label="the Brixel team" className="h-[360px] rounded-3xl" />
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-[30px]">A friendly team, right here in the UAE</h2>
            <p className="mt-4 text-[17px] text-ink-soft">
              We started Brixel because getting a website felt scary and confusing for small business owners. Quotes were full of words no one understood. We wanted to fix that.
            </p>
            <p className="mt-3.5 text-[17px] text-ink-soft">
              So we explain everything like we&apos;re chatting with a friend. We build in Arabic and English, we know how UAE customers love to pay (and to WhatsApp), and we&apos;re a quick message away when you need us.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {values.map(({ Icon, t, d }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-none text-aqua">
                    <Icon size={22} />
                  </span>
                  <div>
                    <div className="font-head text-[15px] font-bold text-teal">{t}</div>
                    <div className="text-[13.5px] text-ink-soft">{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <OpenChatButton className="btn-teal btn-lg mt-7">Say hi to Bricky</OpenChatButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
