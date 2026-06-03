import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Concierge } from "@/components/Concierge";
import { CookieBanner } from "@/components/CookieBanner";

// Public site chrome. The /admin route lives outside this group, so it gets
// none of the marketing header/footer/concierge.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
      <Concierge />
      <CookieBanner />
    </>
  );
}
