'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import DriveImage from '@/components/DriveImage';
import { useLocale } from '@/lib/locale-context';
import { getPartners } from '@/lib/db';
import type { Partner } from '@/lib/types';

export default function PartnershipsPage() {
  const { t, locale } = useLocale();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => { getPartners().then((p) => setPartners(p.filter((x) => x.visible))).catch(() => {}); }, []);

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">🤝 {t('partnerships')}</h1>
          <p className="text-white/70 text-sm">{t('partnershipsSub')}</p>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((p) => (
            <div key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center mb-4">
                <DriveImage src={p.logoUrl} alt={p.name[locale]} className="w-full h-full object-contain p-2" />
              </div>
              <div className="font-bold text-gray-800 text-sm mb-2">{p.name[locale]}</div>
              <div className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{p.description[locale]}</div>
              {p.website && p.website !== '#' && (
                <a href={p.website} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-burgundy hover:underline">
                  🔗 {t('visitWebsite')}
                </a>
              )}
            </div>
          ))}
          {partners.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-400 text-sm">{t('noResults')}</div>
          )}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
