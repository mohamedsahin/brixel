"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle, Info, Wrench, HelpCircle } from "lucide-react";
import { Logo } from "./Logo";
import { useLang } from "./LanguageProvider";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { href: "/packages", label: "nav.packages" },
  { href: "/how-it-works", label: "nav.how" },
  { href: "/work", label: "nav.work" },
  { href: "/about", label: "nav.about" },
  { href: "/faq", label: "nav.faq" },
];

/* Secondary pages shown in mobile drawer (main pages live in BottomNav) */
const DRAWER_ITEMS = [
  { href: "/how-it-works", icon: Wrench, label: "How it works" },
  { href: "/about", icon: Info, label: "About us" },
  { href: "/faq", icon: HelpCircle, label: "FAQ" },
];

export function Header() {
  const { t, toggle } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/packages", label: t.nav.packages },
    { href: "/how-it-works", label: t.nav.how },
    { href: "/work", label: t.nav.work },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-cloud/90 backdrop-blur-lg">
        <div className="wrap flex h-14 items-center gap-3 lg:h-[74px]">
          <Link href="/" aria-label="Brixel home">
            <Logo anim />
          </Link>

          {/* Desktop nav */}
          <nav className="ms-auto hidden items-center gap-1 lg:flex">
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "rounded-lg px-3 py-2 font-head text-[15px] font-medium transition hover:bg-mist hover:text-teal",
                  pathname === it.href ? "bg-mist text-teal" : "text-ink",
                )}
              >
                {it.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-2">
            <button
              onClick={toggle}
              className="rounded-full border-[1.5px] border-mist-deep px-3 py-1.5 font-head text-sm font-semibold text-teal transition hover:border-aqua lg:px-3.5 lg:py-2"
            >
              {t.langName}
            </button>
            <Link href="/contact" className="btn btn-teal btn-sm hidden sm:inline-flex lg:hidden">
              <MessageCircle size={15} /> {t.cta.chat}
            </Link>
            <Link href="/contact" className="btn btn-amber btn-sm hidden lg:inline-flex">
              {t.cta.quote}
            </Link>

            {/* Hamburger — mobile only, opens drawer for secondary pages */}
            <button
              className="grid h-9 w-9 place-items-center rounded-xl transition hover:bg-mist lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="More pages"
            >
              <Menu size={22} className="text-teal" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile side drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[54] bg-ink/30 backdrop-blur-sm fade-in lg:hidden"
            onClick={() => setOpen(false)}
          />

          {/* Drawer panel — slides in from right */}
          <div className="fixed right-0 top-0 z-[55] flex h-full w-72 flex-col bg-white shadow-lift slide-in-right lg:hidden">
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-line px-5">
              <span className="font-head text-sm font-semibold text-ink-soft">More pages</span>
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl hover:bg-mist"
                aria-label="Close menu"
              >
                <X size={20} className="text-teal" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1 p-3 flex-1">
              {DRAWER_ITEMS.map(({ href, icon: Icon, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-3.5 font-head text-[15px] font-semibold transition",
                      active ? "bg-mist text-teal" : "text-ink hover:bg-cloud",
                    )}
                  >
                    <Icon size={18} className={active ? "text-teal" : "text-aqua"} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom CTA */}
            <div className="border-t border-line p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn btn-amber w-full justify-center"
              >
                {t.cta.quote}
              </Link>
              <button
                onClick={() => { setOpen(false); toggle(); }}
                className="mt-2.5 w-full rounded-xl border border-line py-2.5 text-center font-head text-sm font-semibold text-teal transition hover:bg-mist"
              >
                {t.langName}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
