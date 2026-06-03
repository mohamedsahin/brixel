import Link from "next/link";
import { Phone, Sprout, ShoppingBag, Award, Blocks, HeartPulse } from "lucide-react";
import { Logo } from "./Logo";
import { CONTACT, waLink, telLink } from "@/lib/contact";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="bg-teal pb-7 pt-14 text-[#cfe7e3]">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo white />
            <p className="mt-3.5 max-w-[32ch] text-[14.5px] text-[#bfe3dd]">
              Your business online — built simply. Friendly web design for small businesses across the UAE.
            </p>
            <div className="mt-4 flex gap-2.5">
              <a className="btn btn-wa btn-sm" href={waLink()} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
              <a className="btn btn-sm bg-white/10 text-white" href={telLink()}>
                <Phone size={15} /> Call
              </a>
            </div>
          </div>

          <FooterCol title="Packages">
            <FLink href="/packages/starter"><Sprout size={16} /> Starter Website</FLink>
            <FLink href="/packages/store"><ShoppingBag size={16} /> Online Store</FLink>
            <FLink href="/packages/pro"><Award size={16} /> Pro Website</FLink>
            <FLink href="/packages/custom"><Blocks size={16} /> Custom App</FLink>
            <FLink href="/packages/care"><HeartPulse size={16} /> Care Plan</FLink>
          </FooterCol>

          <FooterCol title="Company">
            <FLink href="/how-it-works">How it works</FLink>
            <FLink href="/work">Our work</FLink>
            <FLink href="/about">About</FLink>
            <FLink href="/faq">FAQ</FLink>
          </FooterCol>

          <FooterCol title="Get in touch">
            <FLink href={telLink()}>{CONTACT.phone}</FLink>
            <FLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</FLink>
            <FLink href="/contact">Request a callback</FLink>
            <li className="mt-1.5">
              <Link href="/admin" className="text-[13px] text-[#7fa8a3] hover:text-white">
                Owner login
              </Link>
            </li>
          </FooterCol>
        </div>

        <div className="mt-9 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-5 text-[13px]">
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

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 className="mb-3 font-head text-sm text-white">{title}</h5>
      <ul className="flex flex-col gap-2.5 text-[14.5px]">{children}</ul>
    </div>
  );
}

function FLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="inline-flex items-center gap-2 text-[#cfe7e3] hover:text-white">
        {children}
      </Link>
    </li>
  );
}
