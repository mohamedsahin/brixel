"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Sprout, ShoppingBag, Award, Blocks, HeartPulse, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { CONTACT, waLink, telLink } from "@/lib/contact";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-teal pb-safe pt-12 text-[#cfe7e3] sm:pt-14">
      <div className="wrap">
        {/* Top grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column — always visible */}
          <div>
            <Logo white />
            <p className="mt-3 max-w-[32ch] text-[14px] text-[#bfe3dd] sm:text-[14.5px]">
              Your business online — built simply. Friendly web design for small businesses across the UAE.
            </p>
            <div className="mt-4 flex gap-2.5">
              <a className="btn btn-wa btn-sm" href={waLink()} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
              <a className="btn btn-sm bg-white/10 text-white hover:bg-white/20" href={telLink()}>
                <Phone size={15} /> Call
              </a>
            </div>
          </div>

          {/* Collapsible columns on mobile */}
          <FooterAccordion title="Packages">
            <FLink href="/packages/starter"><Sprout size={14} /> Starter Website</FLink>
            <FLink href="/packages/store"><ShoppingBag size={14} /> Online Store</FLink>
            <FLink href="/packages/pro"><Award size={14} /> Pro Website</FLink>
            <FLink href="/packages/custom"><Blocks size={14} /> Custom App</FLink>
            <FLink href="/packages/care"><HeartPulse size={14} /> Care Plan</FLink>
          </FooterAccordion>

          <FooterAccordion title="Company">
            <FLink href="/how-it-works">How it works</FLink>
            <FLink href="/work">Our work</FLink>
            <FLink href="/blog">Blog & guides</FLink>
            <FLink href="/about">About</FLink>
            <FLink href="/faq">FAQ</FLink>
          </FooterAccordion>

          <FooterAccordion title="Get in touch">
            <FLink href={telLink()}>{CONTACT.phone}</FLink>
            <FLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</FLink>
            <FLink href="/contact">Request a callback</FLink>
            <li className="mt-1">
              <Link href="/admin" className="text-[13px] text-[#7fa8a3] hover:text-white">
                Owner login
              </Link>
            </li>
          </FooterAccordion>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-5 text-[12.5px] sm:mt-9 sm:text-[13px]">
          <span>© {new Date().getFullYear()} Brixel. Made with care in the UAE.</span>
          <span className="flex gap-4">
            <Link href="/faq" className="hover:text-white">Privacy</Link>
            <Link href="/faq" className="hover:text-white">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-white/10 md:border-none">
      {/* Mobile: tap to expand */}
      <button
        className="flex w-full items-center justify-between py-3.5 font-head text-sm font-semibold text-white md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          size={16}
          className={cn("text-[#bfe3dd] transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Desktop: always visible header */}
      <h5 className="mb-3 hidden font-head text-sm text-white md:block">{title}</h5>

      {/* Items */}
      <ul
        className={cn(
          "flex flex-col gap-2.5 overflow-hidden text-[14px] transition-all duration-300 sm:text-[14.5px]",
          "md:max-h-none md:opacity-100 md:pb-0",
          open ? "max-h-64 opacity-100 pb-3.5" : "max-h-0 opacity-0 md:max-h-none md:opacity-100",
        )}
      >
        {children}
      </ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="inline-flex items-center gap-2 text-[#cfe7e3] transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}
