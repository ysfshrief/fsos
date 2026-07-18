'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getSiteSettings } from '@/lib/db';
import type { SiteSettings } from '@/lib/types';
import JoeBadge from './JoeBadge';

export default function PublicFooter() {
  const { t, locale, tx } = useLocale();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => { getSiteSettings().then(setSettings).catch(() => {}); }, []);

  const phone = settings?.phone || '045-000-0000';
  const email = settings?.email || 'info@franciscan-dam.edu.eg';
  const address = tx(settings?.address) || 'دمنهور، البحيرة، مصر';
  const socials = [
    { url: settings?.facebook, icon: 'f', label: 'Facebook' },
    { url: settings?.instagram, icon: '📷', label: 'Instagram' },
    { url: settings?.youtube, icon: '▶', label: 'YouTube' },
    { url: settings?.whatsapp ? `https://wa.me/${settings.whatsapp}` : '', icon: '💬', label: 'WhatsApp' },
  ].filter((s) => s.url);

  return (
    <footer className="bg-gray-800 text-white/70 pt-14 pb-7">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo.png" alt="Logo" width={38} height={38} className="brightness-125" />
              <div className="text-white font-semibold text-[13px] leading-snug">
                {t('schoolName')}
                <div className="text-[10px] text-white/40 font-normal">École des Sœurs Franciscaines</div>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed max-w-[260px]">
              {t('since')} — دمنهور، البحيرة، مصر.
            </p>
          </div>
          <div>
            <div className="text-white text-xs font-bold mb-3">{t('quickLinks')}</div>
            <Link href="/about" className="block text-xs mb-2 hover:text-gold-light">{t('about')}</Link>
            <Link href="/admissions" className="block text-xs mb-2 hover:text-gold-light">{t('admissions')}</Link>
            <Link href="/news" className="block text-xs mb-2 hover:text-gold-light">{t('news')}</Link>
          </div>
          <div>
            <div className="text-white text-xs font-bold mb-3">{t('portals')}</div>
            <Link href="/login" className="block text-xs mb-2 hover:text-gold-light">{t('studentPortal')}</Link>
            <Link href="/login" className="block text-xs mb-2 hover:text-gold-light">{t('parentPortal')}</Link>
            <Link href="/login" className="block text-xs mb-2 hover:text-gold-light">{t('teacherPortal')}</Link>
          </div>
          <div>
            <div className="text-white text-xs font-bold mb-3">{t('contactUs')}</div>
            <div className="text-xs mb-2">📍 {address}</div>
            <div className="text-xs mb-2" dir="ltr">📞 {phone}</div>
            <div className="text-xs" dir="ltr">✉️ {email}</div>
            {socials.length > 0 && (
              <div className="flex gap-2 mt-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.url as string} target="_blank" rel="noopener noreferrer"
                    title={s.label}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-gold hover:text-white flex items-center justify-center text-xs transition">
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 flex flex-wrap justify-between items-center gap-3 text-xs">
          <span>© 2026 {t('schoolNameFull')} — {t('rights')}</span>
          <JoeBadge width={150} />
        </div>
      </div>
    </footer>
  );
}
