import Link from "next/link";
import { ArrowRight, Check, HelpCircle, Star } from "lucide-react";
import { getPackages } from "@/lib/data";
import { PackageCard } from "@/components/PackageCard";
import { SmartImage } from "@/components/SmartImage";
import { Reveal } from "@/components/Reveal";
import { OpenChatButton } from "@/components/OpenChatButton";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { waLink } from "@/lib/contact";
import { IMAGES } from "@/lib/utils";

export default async function HomePage() {
  const packages = await getPackages();

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -end-20 -top-32 h-[380px] w-[380px] animate-floaty rounded-full bg-aqua/50 blur-md" />
        <div className="pointer-events-none absolute -bottom-24 start-[42%] h-[260px] w-[260px] animate-bob rounded-full bg-amber/30 blur-md" />
        <div className="wrap relative z-10">
          <div className="grid items-center gap-12 py-16 md:py-[70px] lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <span className="eyebrow">UAE web design, made simple</span>
              <h1 className="mt-3.5 text-[clamp(38px,5.4vw,62px)] font-extrabold leading-[1.02]">
                Your business online — built simply.
              </h1>
              <svg className="draw-underline mt-1.5 block h-[18px] w-[min(360px,70%)] text-amber" viewBox="0 0 360 18" preserveAspectRatio="none" aria-hidden>
                <path d="M4 12c70-9 150-9 220-6 50 2 90 4 132 1" />
              </svg>
              <p className="mt-5 max-w-[30ch] text-xl text-ink-soft">
                Beautiful websites and online shops for small businesses. No tech words. No stress. Just a friendly team that explains everything plainly.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link href="/contact" className="btn btn-amber btn-lg">
                  Get a free quote <ArrowRight size={18} />
                </Link>
                <OpenChatButton className="btn-teal btn-lg">Chat with us</OpenChatButton>
              </div>
              <div className="mt-7 flex flex-wrap gap-5 text-[14.5px] text-ink-soft">
                <span className="flex items-center gap-1.5"><Check size={17} /> Plain English, zero jargon</span>
                <span className="flex items-center gap-1.5"><Check size={17} /> Arabic + English</span>
              </div>
            </div>
            <Reveal>
              <div className="relative">
                <SmartImage src={IMAGES.hero} label="happy small-business owner" className="h-[420px] rounded-3xl" />
                <div className="card absolute -start-4 bottom-6 flex animate-bob items-center gap-3 px-4 py-3.5 shadow-lift">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-wa text-white">
                    <WhatsAppIcon size={20} />
                  </span>
                  <div>
                    <div className="font-head text-sm font-bold text-teal">New WhatsApp lead!</div>
                    <div className="text-xs text-ink-soft">&quot;Hi, I&apos;d like a quote 👋&quot;</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* trust strip */}
      <section className="bg-mist py-14">
        <div className="wrap grid grid-cols-2 gap-5 py-3 lg:grid-cols-4">
          {[
            ["8+", "years building for UAE businesses"],
            ["120+", "websites & shops launched"],
            ["7 days", "average to first preview"],
            ["AR + EN", "two languages, done right"],
          ].map((x, i) => (
            <Reveal key={i} delay={i * 70} className="text-center">
              <div className="font-head text-[34px] font-extrabold text-teal">{x[0]}</div>
              <div className="mt-0.5 text-sm text-ink-soft">{x[1]}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* packages */}
      <section className="py-20">
        <div className="wrap">
          <div className="mx-auto mb-11 max-w-[56ch] text-center">
            <span className="eyebrow">Simple packages</span>
            <h2 className="mt-2.5 text-[clamp(30px,4vw,44px)]">Pick what fits — we explain the rest</h2>
            <p className="mt-3.5 text-[17px] text-ink-soft">
              No confusing tech words. Just plain choices, with a friendly &quot;from&quot; price so you always know where you stand.
            </p>
          </div>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p, i) => (
              <Reveal key={p.key} delay={i * 60} className="flex">
                <PackageCard pkg={p} />
              </Reveal>
            ))}
            <Reveal delay={packages.length * 60} className="flex">
              <div className="flex h-full w-full flex-col items-start justify-center rounded-2xl border-[1.5px] border-dashed border-aqua bg-mist p-7">
                <span className="grid h-[58px] w-[58px] place-items-center rounded-[17px] bg-white text-teal">
                  <HelpCircle size={28} />
                </span>
                <h3 className="mt-4 text-[23px]">Not sure which one?</h3>
                <p className="mt-3.5 flex-1 text-[15.5px] text-ink-soft">
                  Chat with Bricky, our friendly helper. Answer a couple of easy questions and we&apos;ll point you to the right fit — no pressure.
                </p>
                <OpenChatButton className="btn-teal mt-5 w-full justify-center">Chat with us</OpenChatButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="bg-mist py-20">
        <div className="wrap">
          <div className="mb-10 text-center">
            <span className="eyebrow">Easy as 1-2-3</span>
            <h2 className="mt-2.5 text-[clamp(28px,3.6vw,40px)]">How it works</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Tell us about your business", "A quick chat or message. No tech words needed — just tell us what you do."],
              ["We show you a plan & price", "A clear plan in plain English, with a fixed price. No surprises."],
              ["We build it", "You see a preview early and tell us what to tweak until it's just right."],
              ["We look after it", "With a Care Plan, we keep it healthy, fast and safe — so you don't have to."],
            ].map((s, i) => (
              <Reveal key={i} delay={i * 70} className="rounded-xl border border-line bg-white p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-mist font-head text-lg font-extrabold text-teal">
                  {i + 1}
                </div>
                <h4 className="mt-4 text-lg">{s[0]}</h4>
                <p className="mt-1.5 text-[14.5px] text-ink-soft">{s[1]}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-9 text-center text-ink-soft">
            Simple payment: <b className="text-teal">50% to start, 50% when it&apos;s done.</b> That&apos;s it.
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="py-20">
        <div className="wrap">
          <div className="mb-10 text-center">
            <span className="eyebrow">Loved by local businesses</span>
            <h2 className="mt-2.5 text-[clamp(28px,3.6vw,40px)]">Kind words from UAE owners</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["They explained everything like I was a friend, not a computer person. My salon finally looks professional online.", "Layla H.", "Beauty Lounge, Dubai"],
              ["My shop now takes orders while I sleep. Tabby was set up for me — customers love paying later.", "Omar F.", "Auto Parts, Sharjah"],
              ["Arabic and English, bookings, the lot. It looks expensive but the price was fair and clear.", "Dr. Reem A.", "Dental Clinic, Abu Dhabi"],
            ].map((q, i) => (
              <Reveal key={i} delay={i * 70} className="rounded-xl border border-line bg-white p-6">
                <span className="flex gap-0.5 text-amber">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" stroke="none" />
                  ))}
                </span>
                <p className="mt-3 text-base">&quot;{q[0]}&quot;</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-[42px] w-[42px] place-items-center rounded-full bg-mist font-head font-bold text-teal">
                    {q[1].split(" ").map((w) => w[0]).join("")}
                  </span>
                  <div>
                    <div className="font-head text-[14.5px] font-bold text-teal">{q[1]}</div>
                    <div className="text-[13px] text-ink-soft">{q[2]}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* closing CTA */}
      <section className="pb-24">
        <div className="wrap">
          <Reveal className="rounded-3xl bg-teal px-8 py-14 text-center text-white">
            <h2 className="text-[clamp(28px,3.6vw,40px)] text-white">Ready to get your business online?</h2>
            <p className="mx-auto mt-3.5 max-w-[46ch] text-lg text-[#bfe3dd]">
              Tell us a little about what you do, and we&apos;ll send you a friendly, no-pressure quote.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3.5">
              <Link href="/contact" className="btn btn-amber btn-lg">
                Get a free quote <ArrowRight size={18} />
              </Link>
              <a className="btn btn-wa btn-lg" href={waLink()} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={20} /> WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
