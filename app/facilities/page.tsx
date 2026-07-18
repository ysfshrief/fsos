'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import DriveImage from '@/components/DriveImage';
import { useLocale } from '@/lib/locale-context';
import { getFacilities } from '@/lib/db';
import { resolveImageUrl } from '@/lib/drive';
import type { Facility } from '@/lib/types';

export default function FacilitiesPage() {
  const { t, locale } = useLocale();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => { getFacilities().then((f) => setFacilities(f.filter((x) => x.visible))).catch(() => {}); }, []);

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">🏛️ {t('facilities')}</h1>
          <p className="text-white/70 text-sm">{t('facilitiesSub')}</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          {facilities.map((f, i) => (
            <div key={f.id}
              className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 ? 'md:flex-row-reverse' : ''}`}>
              {/* Text */}
              <div className={i % 2 ? 'md:order-2' : ''}>
                <div className="text-4xl mb-3">{f.icon}</div>
                <h2 className="font-display text-2xl font-bold text-burgundy mb-2">{f.name[locale]}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description[locale]}</p>
              </div>
              {/* Gallery */}
              <div className={i % 2 ? 'md:order-1' : ''}>
                {f.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {f.images.slice(0, 4).map((img, idx) => (
                      <button key={idx} onClick={() => setLightbox(resolveImageUrl(img))}
                        className="aspect-video rounded-xl overflow-hidden border border-gray-100 hover:opacity-90 transition">
                        <DriveImage src={img} alt={f.name[locale]} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-burgundy/10 to-gold/10 flex items-center justify-center text-6xl">
                    {f.icon}
                  </div>
                )}
              </div>
            </div>
          ))}
          {facilities.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">{t('noResults')}</div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-5 end-5 text-white text-3xl">×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-lg shadow-2xl" />
        </div>
      )}

      <PublicFooter />
    </>
  );
}
