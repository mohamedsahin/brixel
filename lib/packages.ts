// Brixel package config — the single source of truth for prices/copy.
// Seeded into the DB (prisma/seed.ts); the admin Package manager edits the DB
// copy. getPackages() (lib/data.ts) reads the DB and falls back to this.

export type PackageType = "one_time" | "recurring";

export interface PackageDef {
  key: "starter" | "store" | "pro" | "custom" | "care";
  name: string;
  fromPrice: number;
  priceRange: string;
  type: PackageType;
  recurring: string;
  blurb: string;
  bestFor: string;
  features: string[];
  tech: string[];
  order: number;
  featured?: boolean;
}

export const PACKAGES: PackageDef[] = [
  {
    key: "starter",
    name: "Starter Website",
    fromPrice: 4500,
    priceRange: "AED 4,500 – 7,500",
    type: "one_time",
    recurring: "",
    order: 1,
    blurb:
      "Think of this like a nice digital shop window. People can find you online, see what you do, and tap a button to message you on WhatsApp. You can change the words and pictures yourself anytime — easy, like editing a Word document.",
    bestFor: "Small businesses that just want to be found online and look professional.",
    features: [
      "A beautiful one-page or small website",
      "A big “Message us on WhatsApp” button",
      "Your photos, services and opening hours",
      "Edit the words & pictures yourself, anytime",
      "Shows up nicely on Google",
    ],
    tech: [
      "Responsive Next.js build",
      "CMS for self-editing",
      "On-page SEO + sitemap",
      "Google Business setup",
      "1 year hosting guidance",
    ],
  },
  {
    key: "store",
    name: "Online Store",
    fromPrice: 9000,
    priceRange: "AED 9,000 – 18,000",
    type: "one_time",
    recurring: "",
    order: 2,
    blurb:
      "This is your shop, but open 24/7 on the internet. People pick what they want, pay with card or “pay later” (Tabby/Tamara), and you get the order. We count the stock for you and tell you when something sells.",
    bestFor: "Anyone who wants to sell products online.",
    features: [
      "A proper online shop, open all day & night",
      "Card payment + “pay later” (Tabby / Tamara)",
      "Orders land in your inbox automatically",
      "We count your stock for you",
      "Delivery & pickup options",
    ],
    tech: [
      "Headless commerce + cart",
      "Payment gateway (cards, Tabby/Tamara)",
      "Inventory & order management",
      "Shipping rules",
      "Order email automation",
    ],
  },
  {
    key: "pro",
    name: "Pro Website",
    fromPrice: 20000,
    priceRange: "AED 20,000 – 40,000",
    type: "one_time",
    recurring: "",
    order: 3,
    featured: true,
    blurb:
      "A big, special website made just for you — not a copy of anyone else's. It speaks both Arabic and English, lets people book appointments, and connects to your other business tools. Built to look premium and win trust.",
    bestFor: "Businesses that want a premium look, online bookings, or two languages.",
    features: [
      "A one-of-a-kind design, made just for you",
      "Works in Arabic and English",
      "Customers can book appointments online",
      "Connects to your other business tools",
      "Premium look that builds trust",
    ],
    tech: [
      "Fully bespoke design system",
      "Arabic RTL + English i18n",
      "Booking / calendar integration",
      "CRM & tooling integrations",
      "Performance-tuned (Core Web Vitals)",
    ],
  },
  {
    key: "custom",
    name: "Custom App",
    fromPrice: 8000,
    priceRange: "from AED 8,000 (most projects 25,000+)",
    type: "one_time",
    recurring: "",
    order: 4,
    blurb:
      "When your idea is too special for a normal website, we build it from scratch like LEGO — exactly the shape you need. For things like booking systems, dashboards, or your own software.",
    bestFor: "Special ideas a normal website can't handle.",
    features: [
      "Built from scratch to your exact idea",
      "Booking systems, dashboards, your own software",
      "Works on phone and computer",
      "Grows with your business",
      "A clear plan & quote before we start",
    ],
    tech: [
      "Custom full-stack app (Next.js + DB)",
      "Auth & roles",
      "Dashboards / admin tooling",
      "Third-party API integrations",
      "Scoped in phases",
    ],
  },
  {
    key: "care",
    name: "Care Plan",
    fromPrice: 400,
    priceRange: "AED 400 – 1,500 / month",
    type: "recurring",
    recurring: "/month",
    order: 5,
    blurb:
      "Like a regular checkup for your website so it stays healthy, fast, and safe. We fix problems before you even notice them.",
    bestFor: "Anyone who already has (or is getting) a site and wants peace of mind.",
    features: [
      "Regular checkups so nothing breaks",
      "We keep it fast and safe",
      "Small text & picture changes done for you",
      "Backups, just in case",
      "We fix problems before you notice",
    ],
    tech: [
      "Updates & security patches",
      "Uptime + performance monitoring",
      "Daily backups",
      "Monthly content edits",
      "Priority WhatsApp support",
    ],
  },
];

export const PACKAGE_KEYS = ["starter", "store", "pro", "custom", "care"] as const;
export type PackageKey = (typeof PACKAGE_KEYS)[number];

export function fmtAED(n: number) {
  return "AED " + n.toLocaleString("en-US");
}
