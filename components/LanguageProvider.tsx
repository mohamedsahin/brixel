"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ar";

interface Dict {
  nav: { packages: string; how: string; work: string; about: string; faq: string; contact: string };
  cta: { quote: string; chat: string };
  langName: string;
}

export const STRINGS: Record<Lang, Dict> = {
  en: {
    nav: { packages: "Packages", how: "How it works", work: "Our work", about: "About", faq: "FAQ", contact: "Contact" },
    cta: { quote: "Get a free quote", chat: "Chat with us" },
    langName: "العربية",
  },
  ar: {
    nav: { packages: "الباقات", how: "كيف نعمل", work: "أعمالنا", about: "من نحن", faq: "الأسئلة", contact: "تواصل" },
    cta: { quote: "احصل على عرض سعر مجاني", chat: "تحدث معنا" },
    langName: "English",
  },
};

interface Ctx {
  lang: Lang;
  t: Dict;
  toggle: () => void;
}
const LangContext = createContext<Ctx>({ lang: "en", t: STRINGS.en, toggle: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const saved = (localStorage.getItem("brixel_lang") as Lang) || "en";
    setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("brixel_lang", lang);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, t: STRINGS[lang], toggle: () => setLang((l) => (l === "en" ? "ar" : "en")) }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
