"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Briefcase, MessageCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const LEFT_TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/packages", icon: LayoutGrid, label: "Packages" },
];
const RIGHT_TABS = [
  { href: "/work", icon: Briefcase, label: "Work" },
  { href: "/contact", icon: FileText, label: "Quote" },
];

export function MobileNav() {
  const pathname = usePathname();

  function openChat() {
    window.dispatchEvent(new CustomEvent("brixel:open-concierge"));
  }

  function renderTab({ href, icon: Icon, label }: { href: string; icon: typeof Home; label: string }) {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-[3px] py-2 transition-colors active:scale-95",
          active ? "text-teal" : "text-ink-soft",
        )}
      >
        <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
        <span className={cn("text-[10px] font-head font-semibold tracking-wide", active ? "text-teal" : "text-ink-soft")}>
          {label}
        </span>
      </Link>
    );
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[58] border-t border-line bg-cloud/95 backdrop-blur-2xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex h-16 items-stretch">
        {LEFT_TABS.map(renderTab)}

        {/* Centre Bricky chat button */}
        <button
          onClick={openChat}
          className="flex flex-1 flex-col items-center justify-center gap-[3px] py-2 active:scale-95"
        >
          <span className="pulse-ring grid h-[38px] w-[38px] place-items-center rounded-full bg-teal text-white shadow-lift">
            <MessageCircle size={18} />
          </span>
          <span className="text-[10px] font-head font-bold text-teal">Bricky</span>
        </button>

        {RIGHT_TABS.map(renderTab)}
      </div>
    </nav>
  );
}
