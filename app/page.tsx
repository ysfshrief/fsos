'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { useLocale } from '@/lib/locale-context';
import { getNews } from '@/lib/db';
import type { NewsItem } from '@/lib/types';

export default function HomePage() {
  const { t } = useLocale();
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    getNews().then((n) => setNews(n.slice(0, 3))).catch(() => {});
  }, []);

  const cards = [
    { icon: '🎓', title: t('studentPortal'), href: '/login?role=student', bg: 'bg-burgundy/10' },
    { icon: '👨‍👩‍👧', title: t('parentPortal'), href: '/login?role=parent', bg: 'bg-gold/10' },
    { icon: '📚', title: t('teacherPortal'), href: '/login?role=teacher', bg: 'bg-blue-600/10' },
    { icon: '📋', title: t('adminInfo'), href: '/admissions', bg: 'bg-green-600/10' },
  ];

  return (
    <>
      <PublicNav />

      {/* HERO */}
      <section className="min-h-screen pt-[70px] flex items-center relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg,#4A1219 0%,#6E1E2B 45%,#8B2535 75%,#9D2F3C 100%)' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 15% 55%,rgba(201,162,39,.14) 0%,transparent 55%)'
        }} />
        <div className="max-w-6xl mx-auto w-full px-6 py-20 relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold-light px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase mb-6">
              ✨ {t('since')}
            </div>
            <h1 className="text-5xl md:text-[52px] font-bold text-white leading-tight mb-3">
              {t('schoolName')}
            </h1>
            <p className="font-display italic text-xl text-white/70 mb-6">
              Franciscan Sisters Private School – Damanhour
            </p>
            <p className="text-[15px] text-white/60 leading-relaxed mb-9 max-w-md">
              {t('heroDesc')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/admissions" className="px-7 py-3 rounded-xl bg-gold text-white font-semibold hover:bg-gold-light transition">
                📋 {t('explore')}
              </Link>
              <Link href="/login" className="px-7 py-3 rounded-xl text-white font-semibold border border-white/25 bg-white/10 hover:bg-white/20 transition">
                🎓 {t('studentPortalBtn')}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-12">
              {[
                { n: '1936', l: t('founded') },
                { n: '2,400+', l: t('students') },
                { n: '98%', l: t('successRate') },
              ].map((s) => (
                <div key={s.l} className="p-4 bg-white/[.08] border border-white/10 rounded-xl text-center backdrop-blur">
                  <span className="font-display text-3xl font-bold text-gold-light block">{s.n}</span>
                  <div className="text-[11px] text-white/55 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center gap-5">
            <Image src="/logo.png" alt="Crest" width={210} height={210} className="object-contain drop-shadow-2xl animate-float" priority />
            <p className="font-display italic text-white/75 text-center">&quot;في خدمة العلم والإيمان والإنسان&quot;</p>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-[11px] font-bold tracking-widest uppercase text-gold mb-2">{t('portalsLabel')}</div>
          <h2 className="font-display text-3xl font-bold text-burgundy mb-10">{t('quickAccess')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((c) => (
              <Link key={c.title} href={c.href}
                className="relative bg-white rounded-2xl p-7 text-center border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-burgundy to-gold" />
                <div className={`w-14 h-14 rounded-xl ${c.bg} flex items-center justify-center text-2xl mx-auto mb-4`}>{c.icon}</div>
                <div className="text-sm font-bold text-gray-800">{c.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="font-display text-[100px] font-bold leading-none select-none" style={{ color: 'rgba(201,162,39,.18)' }}>1936</div>
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-gold-light mb-2">{t('ourStory')}</div>
            <h2 className="font-display text-3xl font-bold text-white mb-4">{t('legacy')}</h2>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              أسستها راهبات القديس فرنسيس الأسيزي عام 1936م، لتكون منارةً للعلم والتربية في دمنهور.
              تجمع مدرستنا بين القيم الروحية العميقة وأرقى أساليب التعليم الحديث.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {['🕊️ الإيمان', '📖 العلم', '❤️ المحبة', '🌟 التميز', '🤝 الخدمة'].map((v) => (
                <span key={v} className="bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-xs text-white/80">{v}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-gold mb-2">{t('latestNews')}</div>
              <h2 className="font-display text-3xl font-bold text-burgundy">{t('newsTitle')}</h2>
            </div>
            <Link href="/news" className="px-4 py-2 rounded-md border-2 border-burgundy text-burgundy text-xs font-semibold hover:bg-burgundy hover:text-white transition">
              {t('viewAll')} ←
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n) => (
              <div key={n.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition cursor-pointer">
                <div className="h-36 flex items-center justify-center text-5xl bg-gradient-to-br from-burgundy to-gold">{n.emoji}</div>
                <div className="p-4">
                  <span className="inline-block bg-gold-pale text-gold text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mb-2">{n.tag}</span>
                  <div className="text-sm font-semibold text-gray-800 leading-snug mb-2">{n.title}</div>
                  <div className="text-[11px] text-gray-400">{n.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </>
  );
}
