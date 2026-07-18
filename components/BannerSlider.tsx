'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { getBanners } from '@/lib/db';
import { resolveImageUrl } from '@/lib/drive';
import type { Banner } from '@/lib/types';

export default function BannerSlider() {
  const { t, locale } = useLocale();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getBanners().then((b) => setBanners(b.filter((x) => x.visible))).catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Nothing to show → render nothing (homepage keeps its normal hero)
  if (banners.length === 0) return null;

  return (
    <section className="relative h-[380px] md:h-[460px] mt-[70px] overflow-hidden bg-burgundy-dark">
      {banners.map((b, i) => {
        const hasImage = !!b.imageUrl?.trim();
        return (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Background */}
            {hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={resolveImageUrl(b.imageUrl)} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B 55%,#8B2535)' }} />
            )}
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

            {/* Content */}
            <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center items-start">
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold-light px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-4">
                ✦ {t('schoolName')}
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3 max-w-2xl drop-shadow">
                {b.title[locale]}
              </h2>
              {b.subtitle[locale] && (
                <p className="text-white/80 text-sm md:text-lg mb-6 max-w-xl drop-shadow">{b.subtitle[locale]}</p>
              )}
              {b.ctaLabel[locale] && b.ctaHref && (
                <Link href={b.ctaHref}
                  className="px-6 py-2.5 rounded-xl bg-gold text-white font-semibold hover:bg-gold-light transition shadow-lg">
                  {b.ctaLabel[locale]} ←
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 inset-x-0 z-20 flex justify-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-7 bg-gold' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              aria-label={`slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
