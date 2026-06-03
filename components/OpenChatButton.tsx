"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Opens the Concierge widget (which listens for this window event).
export function OpenChatButton({
  className,
  children,
  withIcon = true,
}: {
  className?: string;
  children: React.ReactNode;
  withIcon?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("brixel:open-concierge"))}
      className={cn("btn", className)}
    >
      {withIcon && <MessageCircle size={18} />} {children}
    </button>
  );
}
