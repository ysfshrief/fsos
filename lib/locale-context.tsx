'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Locale, I18nText } from './types';
import { dictionaries, localeDir } from './i18n';

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  /** Localize an I18nText with fallback: current locale → en → ar. */
  tx: (text?: I18nText | null) => string;
  dir: 'rtl' | 'ltr';
}

const fallbackTx = (text?: I18nText | null, locale: Locale = 'ar') =>
  text ? (text[locale] || text.en || text.ar || '') : '';

const LocaleContext = createContext<Ctx>({
  locale: 'ar', setLocale: () => {}, t: (k) => k, tx: (x) => fallbackTx(x), dir: 'rtl',
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && ['ar', 'en', 'fr', 'it'].includes(saved)) setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDir(locale);
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('locale', l);
  };

  const t = (key: string) => dictionaries[locale][key] ?? key;
  const tx = (text?: I18nText | null) => fallbackTx(text, locale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, tx, dir: localeDir(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
