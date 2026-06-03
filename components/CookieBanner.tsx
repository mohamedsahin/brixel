"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(!localStorage.getItem("brixel_cookie"));
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-[560px] items-center gap-4 rounded-2xl bg-ink px-5 py-4 text-sm text-[#dfeae8] shadow-lift">
      <span className="flex-1">
        We use a few cookies to make the site work and understand what&apos;s helpful.{" "}
        <Link href="/faq" className="underline">Learn more</Link>.
      </span>
      <button
        className="btn btn-amber btn-sm"
        onClick={() => {
          localStorage.setItem("brixel_cookie", "1");
          setShow(false);
        }}
      >
        Got it
      </button>
    </div>
  );
}
