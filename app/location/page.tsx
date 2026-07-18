'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { useLocale } from '@/lib/locale-context';
import { getSiteSettings } from '@/lib/db';
import type { SiteSettings } from '@/lib/types';

export default function LocationPage() {
  const { t, locale } = useLocale();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => { getSiteSettings().then(setSettings).catch(() => {}); }, []);

  const address = settings?.address[locale] || 'دمنهور، البحيرة، مصر';
  const mapUrl = settings?.mapEmbedUrl || '';
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">📍 {t('location')}</h1>
          <p className="text-white/70 text-sm">{t('locationSub')}</p>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Address bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏫</span>
              <div>
                <div className="text-sm font-bold text-gray-800">{settings?.schoolName[locale] || t('schoolName')}</div>
                <div className="text-xs text-gray-500">📍 {address}</div>
              </div>
            </div>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light transition">
              🧭 {t('getDirections')}
            </a>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-100">
            {mapUrl ? (
              <iframe
                src={mapUrl}
                className="w-full h-[420px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="map"
              />
            ) : (
              <div className="h-[420px] flex flex-col items-center justify-center text-gray-400 gap-2">
                <span className="text-5xl">🗺️</span>
                <span className="text-sm">لم يتم إضافة رابط الخريطة بعد</span>
                <span className="text-xs">يُضاف من: لوحة الإدارة ← إعدادات الموقع ← رابط خريطة جوجل</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
