import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface MailArgs {
  subject: string;
  html: string;
}

// Sends owner notifications. No-ops gracefully if Resend isn't configured
// (so local dev works without an email key).
export async function notifyOwner({ subject, html }: MailArgs) {
  const to = process.env.OWNER_EMAIL;
  const from = process.env.EMAIL_FROM ?? "Brixel <hello@brixel.ae>";
  if (!resend || !to) {
    console.log("[email] skipped (Resend not configured):", subject);
    return;
  }
  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

export function leadEmailHtml(opts: {
  name: string;
  phone: string;
  email?: string | null;
  business?: string | null;
  packageName?: string;
  message?: string | null;
  source: string;
  temperature?: string | null;
}) {
  const row = (k: string, v?: string | null) =>
    v ? `<tr><td style="padding:4px 12px 4px 0;color:#7A8A8F">${k}</td><td style="padding:4px 0"><b>${v}</b></td></tr>` : "";
  return `
  <div style="font-family:system-ui,sans-serif;color:#14242A">
    <h2 style="color:#0E5C5A;margin:0 0 12px">New ${opts.temperature === "hot" ? "🔥 HOT " : ""}lead — ${opts.name}</h2>
    <table style="border-collapse:collapse;font-size:14px">
      ${row("Name", opts.name)}
      ${row("Business", opts.business)}
      ${row("Phone / WhatsApp", opts.phone)}
      ${row("Email", opts.email)}
      ${row("Interested in", opts.packageName)}
      ${row("Source", opts.source)}
      ${row("Temperature", opts.temperature)}
      ${row("Message / summary", opts.message)}
    </table>
    <p style="margin-top:16px"><a href="${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/admin" style="color:#0E5C5A">Open the admin panel →</a></p>
  </div>`;
}
