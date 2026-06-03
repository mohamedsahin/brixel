import { Phone } from "lucide-react";
import { waLink, telLink } from "@/lib/contact";
import { WhatsAppIcon } from "./WhatsAppIcon";

// Floating WhatsApp + click-to-call — desktop only.
// On mobile the bottom nav handles contact actions.
export function FloatingButtons() {
  return (
    <div className="fixed bottom-[92px] z-[60] hidden flex-col items-end gap-3 end-5 lg:flex">
      <a
        href={telLink()}
        aria-label="Call us"
        className="grid h-[56px] w-[56px] place-items-center rounded-full bg-teal text-white shadow-lift transition hover:scale-105 hover:bg-teal-700"
      >
        <Phone size={22} />
      </a>
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp us"
        className="grid h-[56px] w-[56px] place-items-center rounded-full bg-wa text-white shadow-lift transition hover:scale-105"
      >
        <WhatsAppIcon size={24} />
      </a>
    </div>
  );
}
