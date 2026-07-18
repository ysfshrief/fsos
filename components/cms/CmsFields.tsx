'use client';
import { useState } from 'react';
import type { I18nText } from '@/lib/types';
import { resolveImageUrl, isValidImageLink } from '@/lib/drive';

/* ---------- Plain text field ---------- */
export function TextField({
  label, value, onChange, placeholder, dir,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; dir?: 'ltr' | 'rtl';
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy transition"
      />
    </div>
  );
}

/* ---------- Multilingual text field (AR / EN / FR tabs) ---------- */
const langTabs: { code: keyof I18nText; label: string; dir: 'rtl' | 'ltr' }[] = [
  { code: 'ar', label: 'عربي', dir: 'rtl' },
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'fr', label: 'FR', dir: 'ltr' },
];

export function I18nField({
  label, value, onChange, multiline,
}: {
  label: string; value: I18nText; onChange: (v: I18nText) => void; multiline?: boolean;
}) {
  const [tab, setTab] = useState<keyof I18nText>('ar');
  const active = langTabs.find((l) => l.code === tab)!;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-gray-700">{label}</label>
        <div className="flex gap-1">
          {langTabs.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setTab(l.code)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition
                ${tab === l.code
                  ? 'border-burgundy text-burgundy bg-burgundy/5'
                  : 'border-gray-200 text-gray-400 bg-white'}`}
            >
              {l.label}
              {value[l.code]?.trim() ? '' : ' ·'}
            </button>
          ))}
        </div>
      </div>
      {multiline ? (
        <textarea
          value={value[tab]}
          dir={active.dir}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy transition resize-y"
        />
      ) : (
        <input
          value={value[tab]}
          dir={active.dir}
          onChange={(e) => onChange({ ...value, [tab]: e.target.value })}
          className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy transition"
        />
      )}
    </div>
  );
}

/* ---------- Google Drive image field (paste link + live preview) ---------- */
export function DriveImageField({
  label, value, onChange,
}: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const valid = isValidImageLink(value);
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="الصق رابط Google Drive (Share link)"
            dir="ltr"
            className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy transition"
          />
          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
            📎 من Drive: زر يمين على الصورة ← مشاركة ← &quot;أي شخص لديه الرابط&quot; ← نسخ الرابط
          </p>
        </div>
        <div className="w-16 h-16 rounded-lg border-2 border-gray-100 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
          {valid ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolveImageUrl(value)} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-300 text-xl">🖼️</span>
          )}
        </div>
      </div>
    </div>
  );
}
