'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Locale } from './types';
import { dictionaries, localeDir } from './i18n';

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LocaleContext = createContext<Ctx>({
  locale: 'ar', setLocale: () => {}, t: (k) => k, dir: 'rtl',
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && ['ar', 'en', 'fr'].includes(saved)) setLocaleState(saved);
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

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, dir: localeDir(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
