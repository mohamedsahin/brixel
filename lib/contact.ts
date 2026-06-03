// Business contact details, sourced from public env vars so they render
// on both server and client. Configure in .env (see .env.example).

export const CONTACT = {
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+971 50 123 4567",
  phoneRaw: process.env.NEXT_PUBLIC_PHONE_RAW ?? "+971501234567",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "971501234567",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@brixel.ae",
};

export function waLink(message?: string) {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink() {
  return `tel:${CONTACT.phoneRaw}`;
}
