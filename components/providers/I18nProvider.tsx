"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, Locale, DictionaryKey } from "@/i18n/dictionaries";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: DictionaryKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("worknear_locale", newLocale);
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale;
    }
  };

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("worknear_locale") as Locale;
    if (savedLocale && (savedLocale === "en" || savedLocale === "hi")) {
      setLocaleState(savedLocale);
      document.documentElement.lang = savedLocale;
    } else {
      document.documentElement.lang = "en";
    }
  }, []);

  const t = (key: DictionaryKey): string => {
    return dictionaries[locale][key] || dictionaries.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
