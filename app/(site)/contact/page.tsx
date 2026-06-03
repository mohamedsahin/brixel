import type { Metadata } from "next";
import { Phone, Mail } from "lucide-react";
import { getPackages } from "@/lib/data";
import { PageHead } from "@/components/PageHead";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CallbackToggle } from "@/components/CallbackToggle";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { CONTACT, waLink, telLink } from "@/lib/contact";

export const metadata: Metadata = { title: "Get a free quote" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { package?: string };
}) {
  const packages = await getPackages();
  const prefill = packages.some((p) => p.key === searchParams.package) ? searchParams.package! : "";

  return (
    <div>
      <PageHead
        eyebrow="Get in touch"
        title="Get a free quote"
        sub="Tell us about your business — or just say hi. Pick whatever way is easiest."
      />

      <section className="py-12 pt-8 sm:py-20 sm:pt-10">
        <div className="wrap grid gap-6 sm:gap-8 lg:grid-cols-[1.3fr_.85fr] lg:items-start">
          {/* Enquiry form */}
          <div className="card p-5 sm:p-8">
            <h3 className="mb-4 text-xl sm:text-[22px]">Send us an enquiry</h3>
            <EnquiryForm packages={packages} prefill={prefill} />
          </div>

          {/* Contact options */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Quick contact cards — row on mobile */}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-1 sm:gap-4">
              <a
                className="card flex flex-col items-center gap-2 px-3 py-4 text-center sm:flex-row sm:gap-3.5 sm:px-5 sm:text-left"
                href={waLink()}
                target="_blank"
                rel="noreferrer"
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-wa text-white sm:h-[46px] sm:w-[46px]">
                  <WhatsAppIcon size={22} />
                </span>
                <div>
                  <div className="font-head text-[13px] font-bold text-teal sm:text-[15px]">WhatsApp</div>
                  <div className="hidden text-sm text-ink-soft sm:block">{CONTACT.phone}</div>
                </div>
              </a>

              <a
                className="card flex flex-col items-center gap-2 px-3 py-4 text-center sm:flex-row sm:gap-3.5 sm:px-5 sm:text-left"
                href={telLink()}
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-teal text-white sm:h-[46px] sm:w-[46px]">
                  <Phone size={20} />
                </span>
                <div>
                  <div className="font-head text-[13px] font-bold text-teal sm:text-[15px]">Call us</div>
                  <div className="hidden text-sm text-ink-soft sm:block">{CONTACT.phone}</div>
                </div>
              </a>

              <a
                className="card flex flex-col items-center gap-2 px-3 py-4 text-center sm:flex-row sm:gap-3.5 sm:px-5 sm:text-left"
                href={`mailto:${CONTACT.email}`}
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-mist text-teal sm:h-[46px] sm:w-[46px]">
                  <Mail size={20} />
                </span>
                <div>
                  <div className="font-head text-[13px] font-bold text-teal sm:text-[15px]">Email</div>
                  <div className="hidden text-sm text-ink-soft sm:block">{CONTACT.email}</div>
                </div>
              </a>
            </div>

            {/* Callback card */}
            <div className="card px-5 py-5">
              <CallbackToggle />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
