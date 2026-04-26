"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Lang, translations } from "./translations";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
};

const LanguageCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "shenatech-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  // Sync the html element's lang + dir attributes with current state
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "ar" ? "en" : "ar");
  }, [lang, setLang]);

  const t = useCallback(
    (key: string) => {
      const dict = translations[lang];
      return dict[key] ?? translations.en[key] ?? key;
    },
    [lang],
  );

  return (
    <LanguageCtx.Provider value={{ lang, setLang, toggle, t }}>{children}</LanguageCtx.Provider>
  );
}

export function useLanguage(): Ctx {
  const ctx = useContext(LanguageCtx);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
