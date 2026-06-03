import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Concierge } from "@/components/Concierge";
import { CookieBanner } from "@/components/CookieBanner";
import { MobileNav } from "@/components/MobileNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* Extra bottom padding on mobile so content clears the fixed bottom nav */}
      <main className="pb-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
      <Concierge />
      <MobileNav />
      <CookieBanner />
    </>
  );
}
