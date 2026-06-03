import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Tajawal } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";

const head = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-head" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const ar = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-ar" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://brixel.ae"),
  title: {
    default: "Brixel — Your business online, built simply",
    template: "%s · Brixel",
  },
  description:
    "Brixel builds simple, beautiful websites and online shops for small businesses in the UAE. Plain English, no jargon. Get a free quote.",
  openGraph: {
    title: "Brixel — Your business online, built simply",
    description: "Friendly web design for small businesses across the UAE.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${head.variable} ${body.variable} ${ar.variable}`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
