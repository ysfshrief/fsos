'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import WelcomeModal from '@/components/WelcomeModal';
import { useLocale } from '@/lib/locale-context';
import { getNews, getSiteSettings } from '@/lib/db';
import type { NewsItem, SiteSettings } from '@/lib/types';

export default function HomePage() {
  const { t, tx, locale } = useLocale();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getNews().then((n) => setNews(n.slice(0, 3))).catch(() => {});
    getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const schoolName = tx(settings?.schoolName) || t('schoolName');

  const portals = [
    { icon: '🎓', title: t('studentPortal'), href: '/login?role=student' },
    { icon: '👨‍👩‍👧', title: t('parentPortal'), href: '/login?role=parent' },
    { icon: '📚', title: t('teacherPortal'), href: '/login?role=teacher' },
    { icon: '📅', title: t('timetables'), href: '/timetables' },
  ];

  const missionPoints = [
    t('mission1'), t('mission2'), t('mission3'), t('mission4'), t('mission5'),
    t('mission6'), t('mission7'), t('mission8'), t('mission9'),
  ];

  return (
    <>
      <WelcomeModal />
      <PublicNav />

      {/* ═══════════ HERO — the marble sign ═══════════ */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/school-sign.jpg" alt={schoolName} fill priority className="object-cover object-center" />
          {/* Soft wash concentrated at the bottom so the plaques (vision & mission) stay readable */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(180deg, rgba(14,33,26,.28) 0%, rgba(14,33,26,.10) 30%, rgba(14,33,26,.55) 70%, rgba(14,33,26,.92) 100%)'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 pt-32">
          <div className="animate-fade-up max-w-3xl">
            {/* Eyebrow with brass rule */}
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-brass-light" />
              <span className="text-brass-light text-[12px] font-bold tracking-[0.25em] uppercase">
                {t('city')} · 1936
              </span>
            </div>

            <h1 className="font-display text-white leading-[1.15] mb-5"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700 }}>
              {schoolName}
            </h1>

            <p className="font-latin italic text-brass-light/90 text-xl md:text-2xl mb-6">
              Franciscan Sisters School · Damanhour
            </p>

            <p className="text-parchment/80 text-[15px] md:text-base leading-relaxed max-w-xl mb-9">
              {t('heroDesc')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/admissions"
                className="group px-8 py-3.5 rounded-full bg-brass text-white font-bold text-sm hover:bg-brass-light transition-all shadow-lg shadow-brass/20 flex items-center gap-2">
                {t('explore')}
                <span className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/login"
                className="px-8 py-3.5 rounded-full text-white font-bold text-sm border border-white/25 bg-white/5 backdrop-blur hover:bg-white/15 transition-all">
                🎓 {t('studentPortalBtn')}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/40 text-xs animate-float">↓</div>
      </section>

      {/* ═══════════ STATS RIBBON ═══════════ */}
      <section className="bg-pine-deep border-y border-brass/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 divide-x divide-brass/15 rtl:divide-x-reverse">
          {[
            { n: settings?.statFounded || '1936', l: t('founded') },
            { n: settings?.statStudents || '2,400+', l: t('students') },
            { n: settings?.statSuccess || '98%', l: t('successRate') },
          ].map((s) => (
            <div key={s.l} className="py-8 text-center">
              <div className="font-display text-4xl md:text-5xl font-bold text-brass-light mb-1">{s.n}</div>
              <div className="text-parchment/50 text-[11px] md:text-xs tracking-wider uppercase">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PORTALS ═══════════ */}
      <section className="py-24 bg-parchment">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="h-px w-10 bg-brass" />
            <span className="text-brass text-[11px] font-bold tracking-[0.25em] uppercase">{t('portalsLabel')}</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-pine mb-12">{t('quickAccess')}</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {portals.map((p, i) => (
              <Link key={p.title} href={p.href}
                className="group relative bg-parchment-warm rounded-sm p-8 border border-pine/10 hover:border-brass/50 transition-all overflow-hidden">
                {/* Corner index */}
                <span className="absolute top-4 end-5 font-display text-2xl text-pine/10 group-hover:text-brass/30 transition">
                  0{i + 1}
                </span>
                <div className="w-14 h-14 rounded-full bg-pine/5 group-hover:bg-brass/10 flex items-center justify-center text-2xl mb-5 transition">
                  {p.icon}
                </div>
                <div className="text-[15px] font-bold text-pine mb-1">{p.title}</div>
                <div className="rule-brass w-0 group-hover:w-full transition-all duration-500 mt-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HERITAGE / STORY ═══════════ */}
      <section className="py-24 relative overflow-hidden bg-pine">
        <div className="absolute inset-0 opacity-[0.04] select-none pointer-events-none flex items-center justify-center">
          <span className="font-display text-[420px] font-bold text-brass-light leading-none">؟</span>
        </div>
        <div className="max-w-6xl mx-auto px-6 relative grid md:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-brass-light" />
              <span className="text-brass-light text-[11px] font-bold tracking-[0.25em] uppercase">{t('ourStory')}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 engraved">{t('legacy')}</h2>
            <p className="text-parchment/75 text-[15px] leading-loose mb-8">
              أسّستها راهبات القديس فرنسيس الأسيزي عام 1936م، لتكون منارةً للعلم والتربية في قلب دمنهور.
              تجمع مدرستنا بين القيم الروحية العميقة وأرقى أساليب التعليم الحديث، ونُعِدّ طالباتنا ليكنّ
              مبدعات أمينات، لديهنّ الانتماء للوطن.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {['🕊️ الإيمان', '📖 العلم', '❤️ المحبة', '🌟 التميّز', '🤝 الخدمة'].map((v) => (
                <span key={v} className="bg-white/[.06] border border-brass/25 px-4 py-1.5 rounded-full text-xs text-parchment/85">{v}</span>
              ))}
            </div>
          </div>
          {/* Founded seal */}
          <div className="flex justify-center">
            <div className="relative w-52 h-52 rounded-full border-2 border-brass/40 flex flex-col items-center justify-center">
              <div className="absolute inset-3 rounded-full border border-brass/20" />
              <Image src="/logo.png" alt="Crest" width={90} height={90} className="object-contain mb-2 animate-float" />
              <div className="font-display text-brass-light text-3xl font-bold">1936</div>
              <div className="text-parchment/50 text-[10px] tracking-widest uppercase">Est.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ VISION & MISSION ═══════════ */}
      <section className="py-24 bg-parchment-warm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-brass text-[11px] font-bold tracking-[0.25em] uppercase">{t('visionMissionLabel')}</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-pine mt-2">{t('visionMissionTitle')}</h2>
            <div className="rule-brass w-24 mx-auto mt-5" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vision */}
            <div className="relative bg-pine rounded-sm p-9 overflow-hidden">
              <span className="absolute -top-4 -end-2 font-display text-[120px] text-white/[0.04] leading-none select-none">🎯</span>
              <div className="relative">
                <h3 className="font-display text-2xl font-bold text-brass-light mb-4">{t('visionTitle')}</h3>
                <div className="rule-brass w-16 mb-5" />
                <p className="text-parchment/85 text-lg leading-loose">{t('visionText')}</p>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-parchment rounded-sm p-9 border border-pine/10">
              <h3 className="font-display text-2xl font-bold text-pine mb-4">{t('missionTitle')}</h3>
              <div className="rule-brass w-16 mb-5" />
              <ul className="space-y-3">
                {missionPoints.map((m, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink/85 text-[14px] leading-relaxed">
                    <span className="shrink-0 font-display text-brass text-sm font-bold mt-0.5 w-5">{i + 1}.</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ NEWS ═══════════ */}
      {news.length > 0 && (
        <section className="py-24 bg-parchment">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="h-px w-10 bg-brass" />
                  <span className="text-brass text-[11px] font-bold tracking-[0.25em] uppercase">{t('latestNews')}</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-pine">{t('newsTitle')}</h2>
              </div>
              <Link href="/news"
                className="px-5 py-2.5 rounded-full border border-pine/30 text-pine text-xs font-bold hover:bg-pine hover:text-white transition">
                {t('viewAll')} <span className="rtl:rotate-180 inline-block">→</span>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((n) => (
                <Link href="/news" key={n.id}
                  className="group bg-parchment-warm rounded-sm overflow-hidden border border-pine/10 hover:border-brass/40 hover:-translate-y-1 transition-all">
                  <div className="h-40 flex items-center justify-center text-5xl relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#1B3A2F,#2C5443)' }}>
                    <span className="relative z-10">{n.emoji}</span>
                    <span className="absolute -bottom-6 -end-4 font-display text-[100px] text-brass/10 leading-none">{n.emoji}</span>
                  </div>
                  <div className="p-5">
                    <span className="inline-block bg-brass/10 text-brass text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full mb-3">{n.tag}</span>
                    <div className="text-[15px] font-bold text-pine leading-snug mb-2 group-hover:text-brass transition">{n.title}</div>
                    <div className="text-[11px] text-ink-muted">{n.date}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PublicFooter />
    </>
  );
}
