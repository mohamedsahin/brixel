"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { waLink } from "@/lib/contact";
import { fmtAED, type PackageDef } from "@/lib/packages";

type Form = {
  name: string;
  business: string;
  phone: string;
  email: string;
  packageKey: string;
  message: string;
  preferredContact: "WhatsApp" | "Call" | "Email";
};

export function EnquiryForm({
  packages,
  prefill = "",
}: {
  packages: PackageDef[];
  prefill?: string;
}) {
  const [f, setF] = useState<Form>({
    name: "",
    business: "",
    phone: "",
    email: "",
    packageKey: prefill,
    message: "",
    preferredContact: "WhatsApp",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Form, v: string) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Please tell us your name";
    if (!/^[+\d][\d\s-]{6,}$/.test(f.phone.trim())) er.phone = "Please enter a valid phone number";
    if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = "That email doesn't look right";
    setErrors(er);
    if (Object.keys(er).length) return;

    setSending(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setErrors({ form: "Sorry, something went wrong. Please try WhatsApp or call us." });
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="py-2.5 text-center">
        <CheckCircle2 className="mx-auto text-aqua" size={52} />
        <h3 className="mt-3 text-2xl">Thank you, {f.name.split(" ")[0]}!</h3>
        <p className="mx-auto mt-2.5 max-w-[38ch] text-ink-soft">
          We&apos;ve got your message. A real person from the Brixel team will reach out on{" "}
          <b>{f.preferredContact}</b> very soon — usually the same day.
        </p>
        <a className="btn btn-wa mt-5" href={waLink("Hi Brixel! I just sent an enquiry.")} target="_blank" rel="noreferrer">
          <WhatsAppIcon size={18} /> WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Field label="Your name" req error={errors.name}>
          <input className="input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Layla" />
        </Field>
        <Field label="Business name">
          <input className="input" value={f.business} onChange={(e) => set("business", e.target.value)} placeholder="e.g. Layla's Salon" />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <Field label="Phone / WhatsApp" req error={errors.phone}>
          <input className="input" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+971 50 …" inputMode="tel" />
        </Field>
        <Field label="Email (optional)" error={errors.email}>
          <input className="input" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.ae" inputMode="email" />
        </Field>
      </div>
      <Field label="Which package interests you?">
        <select className="select" value={f.packageKey} onChange={(e) => set("packageKey", e.target.value)}>
          <option value="">I&apos;m not sure yet — help me choose</option>
          {packages.map((p) => (
            <option key={p.key} value={p.key}>
              {p.name} — from {fmtAED(p.fromPrice)}{p.recurring}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tell us about your business">
        <textarea className="textarea" value={f.message} onChange={(e) => set("message", e.target.value)} placeholder="What do you do? What would you love your website to do for you?" />
      </Field>
      <Field label="How should we reach you?">
        <div className="flex flex-wrap gap-2">
          {(["WhatsApp", "Call", "Email"] as const).map((o) => (
            <button
              type="button"
              key={o}
              onClick={() => set("preferredContact", o)}
              className={`min-w-[90px] flex-1 rounded-xl border-[1.5px] py-2.5 font-head text-sm font-semibold transition ${
                f.preferredContact === o ? "border-aqua bg-aqua-soft text-teal" : "border-line bg-white text-ink-soft"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </Field>
      {errors.form && <p className="mb-3 text-sm text-red-600">{errors.form}</p>}
      <button className="btn btn-amber btn-lg w-full" type="submit" disabled={sending}>
        {sending ? "Sending…" : "Send enquiry"} <ArrowRight size={18} />
      </button>
      <p className="mt-3 text-center text-xs text-ink-faint">
        No spam, ever. We only use your details to reply about your project.
      </p>
    </form>
  );
}

function Field({
  label,
  req,
  error,
  children,
}: {
  label: string;
  req?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="label">
        {label} {req && <span className="text-amber-600">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[13px] text-red-600">{error}</p>}
    </div>
  );
}
