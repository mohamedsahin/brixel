"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { useLang } from "./LanguageProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, toggle } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/packages", label: t.nav.packages },
    { href: "/how-it-works", label: t.nav.how },
    { href: "/work", label: t.nav.work },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cloud/85 backdrop-blur-md">
      <div className="wrap flex h-[74px] items-center gap-4">
        <Link href="/" aria-label="Brixel home">
          <Logo anim />
        </Link>

        <nav className="ms-auto hidden items-center gap-1 lg:flex">
          {items.map((it) => (
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

        <div className="ms-auto flex items-center gap-2.5 lg:ms-2">
          <button
            onClick={toggle}
            className="rounded-full border-[1.5px] border-mist-deep px-3.5 py-2 font-head text-sm font-semibold text-teal transition hover:border-aqua"
          >
            {t.langName}
          </button>
          <Link href="/contact" className="btn btn-teal btn-sm hidden sm:inline-flex">
            <MessageCircle size={16} /> {t.cta.chat}
          </Link>
          <Link href="/contact" className="btn btn-amber btn-sm">
            {t.cta.quote}
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="text-teal" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[55] flex flex-col gap-1.5 bg-cloud p-6 lg:hidden">
          <div className="mb-4 flex items-center">
            <Logo />
            <button className="ms-auto" onClick={() => setOpen(false)} aria-label="Close">
              <X size={28} className="text-teal" />
            </button>
          </div>
          {[...items, { href: "/contact", label: t.nav.contact }].map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="border-b border-line px-2 py-3.5 font-head text-xl font-semibold text-ink"
            >
              {it.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-amber btn-lg mt-4">
            {t.cta.quote}
          </Link>
        </div>
      )}
    </header>
  );
}
