"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      onClick={copy}
      className="btn btn-ghost btn-sm w-full justify-center transition"
    >
      {copied ? <><Check size={14} className="text-teal" /> Copied!</> : <><Copy size={14} /> Copy link</>}
    </button>
  );
}
