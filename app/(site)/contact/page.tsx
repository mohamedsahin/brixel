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
      <PageHead eyebrow="Get in touch" title="Get a free quote" sub="Tell us about your business — or just say hi. Pick whatever way is easiest for you." />
      <section className="py-20 pt-10">
        <div className="wrap grid gap-10 lg:grid-cols-[1.3fr_.85fr] lg:items-start">
          <div className="card p-8">
            <h3 className="mb-4 text-[22px]">Send us an enquiry</h3>
            <EnquiryForm packages={packages} prefill={prefill} />
          </div>

          <div className="flex flex-col gap-4">
            <a className="card flex items-center gap-3.5 px-5 py-5" href={waLink()} target="_blank" rel="noreferrer">
              <span className="grid h-[46px] w-[46px] flex-none place-items-center rounded-xl bg-wa text-white">
                <WhatsAppIcon size={24} />
              </span>
              <div>
                <div className="font-head font-bold text-teal">WhatsApp us</div>
                <div className="text-sm text-ink-soft">{CONTACT.phone}</div>
              </div>
            </a>
            <a className="card flex items-center gap-3.5 px-5 py-5" href={telLink()}>
              <span className="grid h-[46px] w-[46px] flex-none place-items-center rounded-xl bg-teal text-white">
                <Phone size={22} />
              </span>
              <div>
                <div className="font-head font-bold text-teal">Call us</div>
                <div className="text-sm text-ink-soft">{CONTACT.phone}</div>
              </div>
            </a>
            <a className="card flex items-center gap-3.5 px-5 py-5" href={`mailto:${CONTACT.email}`}>
              <span className="grid h-[46px] w-[46px] flex-none place-items-center rounded-xl bg-mist text-teal">
                <Mail size={22} />
              </span>
              <div>
                <div className="font-head font-bold text-teal">Email</div>
                <div className="text-sm text-ink-soft">{CONTACT.email}</div>
              </div>
            </a>
            <div className="card px-5 py-5">
              <CallbackToggle />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
