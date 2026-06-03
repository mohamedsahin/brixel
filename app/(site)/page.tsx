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
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -end-16 -top-24 h-[280px] w-[280px] animate-floaty rounded-full bg-aqua/40 blur-md sm:h-[380px] sm:w-[380px]" />
        <div className="pointer-events-none absolute -bottom-20 start-[38%] h-[200px] w-[200px] animate-bob rounded-full bg-amber/25 blur-md sm:h-[260px] sm:w-[260px]" />

        <div className="wrap relative z-10">
          <div className="grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:py-[70px]">
            {/* Text */}
            <div>
              <span className="eyebrow">UAE web design, made simple</span>
              <h1 className="mt-3 text-[clamp(34px,7vw,62px)] font-extrabold leading-[1.02]">
                Your business online —{" "}
                <span className="relative inline-block">
                  built simply.
                  <svg
                    className="draw-underline absolute -bottom-1 start-0 h-[14px] w-full text-amber"
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path d="M3 9c40-6 85-7 130-4 32 2 52 3 65 1" />
                  </svg>
                </span>
              </h1>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-soft sm:text-xl sm:max-w-[30ch]">
                Beautiful websites and online shops for small businesses. No tech words. No stress.
              </p>

              {/* CTAs — stacked on mobile, row on sm+ */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/contact" className="btn btn-amber btn-lg w-full justify-center sm:w-auto">
                  Get a free quote <ArrowRight size={18} />
                </Link>
                <OpenChatButton className="btn-teal btn-lg w-full justify-center sm:w-auto">
                  Chat with Bricky
                </OpenChatButton>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-4 text-[13.5px] text-ink-soft sm:text-[14.5px]">
                <span className="flex items-center gap-1.5"><Check size={15} className="text-teal" /> Plain English, zero jargon</span>
                <span className="flex items-center gap-1.5"><Check size={15} className="text-teal" /> Arabic + English</span>
                <span className="flex items-center gap-1.5"><Check size={15} className="text-teal" /> UAE team, same-day reply</span>
              </div>
            </div>

            {/* Hero image */}
            <Reveal>
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <SmartImage
                  src={IMAGES.hero}
                  label="happy small-business owner"
                  className="h-[240px] w-full rounded-2xl sm:h-[320px] lg:h-[420px] lg:rounded-3xl"
                  priority
                />
                {/* Floating WhatsApp notification card */}
                <div className="card absolute start-2 bottom-4 flex animate-bob items-center gap-3 px-3.5 py-3 shadow-lift sm:start-2 lg:-start-4 lg:bottom-6">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-wa text-white lg:h-10 lg:w-10">
                    <WhatsAppIcon size={18} />
                  </span>
                  <div>
                    <div className="font-head text-[13px] font-bold text-teal lg:text-sm">New WhatsApp lead!</div>
                    <div className="text-[11px] text-ink-soft lg:text-xs">&quot;Hi, I&apos;d like a quote 👋&quot;</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="bg-mist py-10 sm:py-14">
        <div className="wrap grid grid-cols-2 gap-5 py-2 lg:grid-cols-4">
          {[
            ["8+", "years building for UAE businesses"],
            ["120+", "websites & shops launched"],
            ["7 days", "average to first preview"],
            ["AR + EN", "two languages, done right"],
          ].map((x, i) => (
            <Reveal key={i} delay={i * 70} className="text-center">
              <div className="font-head text-[28px] font-extrabold text-teal sm:text-[34px]">{x[0]}</div>
              <div className="mt-0.5 text-xs text-ink-soft sm:text-sm">{x[1]}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="py-14 sm:py-20">
        <div className="wrap">
          <div className="mx-auto mb-8 max-w-[56ch] text-center sm:mb-11">
            <span className="eyebrow">Simple packages</span>
            <h2 className="mt-2.5 text-[clamp(26px,4vw,44px)]">Pick what fits — we explain the rest</h2>
            <p className="mt-3 text-[15px] text-ink-soft sm:text-[17px]">
              No confusing tech words. Just plain choices, with a friendly &quot;from&quot; price.
            </p>
          </div>
          <div className="grid items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {packages.map((p, i) => (
              <Reveal key={p.key} delay={i * 60} className="flex">
                <PackageCard pkg={p} />
              </Reveal>
            ))}
            <Reveal delay={packages.length * 60} className="flex">
              <div className="flex h-full w-full flex-col items-start justify-center rounded-2xl border-[1.5px] border-dashed border-aqua bg-mist p-6 sm:p-7">
                <span className="grid h-[52px] w-[52px] place-items-center rounded-[17px] bg-white text-teal sm:h-[58px] sm:w-[58px]">
                  <HelpCircle size={26} />
                </span>
                <h3 className="mt-4 text-xl sm:text-[23px]">Not sure which one?</h3>
                <p className="mt-3 flex-1 text-[14.5px] text-ink-soft sm:text-[15.5px]">
                  Chat with Bricky. Answer a couple of easy questions and we&apos;ll point you to the right fit — no pressure.
                </p>
                <OpenChatButton className="btn-teal mt-5 w-full justify-center">Chat with us</OpenChatButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-mist py-14 sm:py-20">
        <div className="wrap">
          <div className="mb-8 text-center sm:mb-10">
            <span className="eyebrow">Easy as 1-2-3</span>
            <h2 className="mt-2.5 text-[clamp(24px,3.6vw,40px)]">How it works</h2>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="flex flex-col gap-0 sm:hidden">
            {[
              ["Tell us about your business", "A quick chat or message. No tech words needed — just tell us what you do."],
              ["We show you a plan & price", "A clear plan in plain English, with a fixed price. No surprises."],
              ["We build it", "You see a preview early and tell us what to tweak until it's just right."],
              ["We look after it", "With a Care Plan, we keep it healthy, fast and safe — so you don't have to."],
            ].map((s, i, arr) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="grid h-10 w-10 flex-none place-items-center rounded-full bg-teal font-head text-sm font-extrabold text-white shadow-card">
                    {i + 1}
                  </div>
                  {i < arr.length - 1 && <div className="mt-1 w-0.5 flex-1 bg-mist-deep" style={{ minHeight: "2rem" }} />}
                </div>
                <div className={`pb-6 ${i === arr.length - 1 ? "" : ""}`}>
                  <h4 className="font-head text-base font-bold text-teal">{s[0]}</h4>
                  <p className="mt-1 text-[14px] text-ink-soft">{s[1]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: card grid */}
          <div className="hidden grid-cols-2 gap-5 sm:grid lg:grid-cols-4">
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

          <div className="mt-7 text-center text-sm text-ink-soft sm:text-base">
            Simple payment: <b className="text-teal">50% to start, 50% when it&apos;s done.</b> That&apos;s it.
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14 sm:py-20">
        <div className="wrap">
          <div className="mb-8 text-center sm:mb-10">
            <span className="eyebrow">Loved by local businesses</span>
            <h2 className="mt-2.5 text-[clamp(24px,3.6vw,40px)]">Kind words from UAE owners</h2>
          </div>

          {/* Mobile: snap-scroll carousel */}
          <div className="-mx-4 sm:mx-0">
            <div className="snap-carousel px-4 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
              {[
                ["They explained everything like I was a friend, not a computer person. My salon finally looks professional online.", "Layla H.", "Beauty Lounge, Dubai"],
                ["My shop now takes orders while I sleep. Tabby was set up for me — customers love paying later.", "Omar F.", "Auto Parts, Sharjah"],
                ["Arabic and English, bookings, the lot. It looks expensive but the price was fair and clear.", "Dr. Reem A.", "Dental Clinic, Abu Dhabi"],
              ].map((q, i) => (
                <Reveal
                  key={i}
                  delay={i * 70}
                  className="min-w-[80vw] rounded-xl border border-line bg-white p-5 sm:min-w-0 sm:p-6"
                >
                  <span className="flex gap-0.5 text-amber">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={15} fill="currentColor" stroke="none" />
                    ))}
                  </span>
                  <p className="mt-3 text-[14.5px] leading-relaxed sm:text-base">&quot;{q[0]}&quot;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="grid h-[40px] w-[40px] place-items-center rounded-full bg-mist font-head text-sm font-bold text-teal">
                      {q[1].split(" ").map((w) => w[0]).join("")}
                    </span>
                    <div>
                      <div className="font-head text-[14px] font-bold text-teal">{q[1]}</div>
                      <div className="text-[12px] text-ink-soft">{q[2]}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-[1180px]">
          <Reveal className="rounded-3xl bg-teal px-6 py-12 text-center text-white sm:px-8 sm:py-14">
            <h2 className="text-[clamp(24px,3.6vw,40px)] text-white">Ready to get your business online?</h2>
            <p className="mx-auto mt-3 max-w-[40ch] text-[15px] text-[#bfe3dd] sm:mt-3.5 sm:text-lg">
              Tell us a little about what you do, and we&apos;ll send you a friendly, no-pressure quote.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:mt-7 sm:flex-row sm:justify-center">
              <Link href="/contact" className="btn btn-amber btn-lg w-full justify-center sm:w-auto">
                Get a free quote <ArrowRight size={18} />
              </Link>
              <a
                className="btn btn-wa btn-lg w-full justify-center sm:w-auto"
                href={waLink()}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={20} /> WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
