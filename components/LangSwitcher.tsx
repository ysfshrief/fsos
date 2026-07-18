'use client';
import { useLocale } from '@/lib/locale-context';
import type { Locale } from '@/lib/types';

const langs: { code: Locale; label: string }[] = [
  { code: 'ar', label: 'عربي' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
];

export default function LangSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex gap-1">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition
            ${locale === l.code
              ? 'border-burgundy text-burgundy bg-burgundy/5'
              : 'border-gray-200 text-gray-500 bg-white hover:border-gold'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
