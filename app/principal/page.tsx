'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import DriveImage from '@/components/DriveImage';
import { useLocale } from '@/lib/locale-context';
import { getPrincipal } from '@/lib/db';
import type { PrincipalProfile } from '@/lib/types';

export default function PrincipalPage() {
  const { t, locale } = useLocale();
  const [p, setP] = useState<PrincipalProfile | null>(null);

  useEffect(() => { getPrincipal().then(setP).catch(() => {}); }, []);

  if (!p) return (
    <><PublicNav /><div className="pt-[120px] text-center text-gray-400 min-h-screen">{t('loading')}</div><PublicFooter /></>
  );

  const Block = ({ icon, title, text }: { icon: string; title: string; text: string }) =>
    !text ? null : (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{icon}</span>
          <h3 className="font-bold text-burgundy text-sm">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
      </div>
    );

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen bg-ivory">
        {/* Hero */}
        <div className="py-16" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-full border-4 border-gold shadow-2xl overflow-hidden bg-white shrink-0">
              <DriveImage src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="text-center md:text-start">
              <div className="text-[11px] font-bold tracking-widest uppercase text-gold-light mb-2">{t('principalProfile')}</div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">{p.name}</h1>
              {p.experienceYears && (
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/80 text-xs">
                  ⭐ {p.experienceYears} {t('years')} {t('experience')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message highlight */}
        {p.message[locale] && (
          <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
            <div className="bg-white rounded-2xl shadow-lg border-t-4 border-gold p-7">
              <div className="text-4xl text-gold/30 leading-none mb-2">&ldquo;</div>
              <p className="font-display italic text-lg text-gray-700 leading-relaxed">{p.message[locale]}</p>
              <div className="text-end text-sm font-bold text-burgundy mt-3">— {p.name}</div>
            </div>
          </div>
        )}

        {/* Details grid */}
        <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-5">
          <Block icon="📖" title={t('biography')} text={p.biography[locale]} />
          <Block icon="🎓" title={t('qualifications')} text={p.qualifications[locale]} />
          <Block icon="🏆" title={t('achievements')} text={p.achievements[locale]} />
          <Block icon="🎯" title={t('schoolVision')} text={p.vision[locale]} />
          <div className="md:col-span-2">
            <Block icon="📜" title={t('schoolMission')} text={p.mission[locale]} />
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
