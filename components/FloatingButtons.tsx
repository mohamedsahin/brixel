import { Phone } from "lucide-react";
import { waLink, telLink } from "@/lib/contact";
import { WhatsAppIcon } from "./WhatsAppIcon";

// Floating WhatsApp + click-to-call on every page (sits above the concierge launcher).
export function FloatingButtons() {
  return (
    <div className="fixed bottom-[92px] z-[60] flex flex-col items-end gap-3 end-5">
      <a
        href={telLink()}
        aria-label="Call us"
        className="grid h-[58px] w-[58px] place-items-center rounded-full bg-teal text-white shadow-lift transition hover:scale-105"
      >
        <Phone size={24} />
      </a>
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp us"
        className="grid h-[58px] w-[58px] place-items-center rounded-full bg-wa text-white shadow-lift transition hover:scale-105"
      >
        <WhatsAppIcon size={26} />
      </a>
    </div>
  );
}
