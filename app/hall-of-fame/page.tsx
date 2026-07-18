'use client';
import { useEffect, useState, useMemo } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import DriveImage from '@/components/DriveImage';
import { useLocale } from '@/lib/locale-context';
import { getAchievers } from '@/lib/db';
import type { Achiever } from '@/lib/types';

const medalStyles: Record<string, { ring: string; badge: string; emoji: string }> = {
  gold: { ring: 'from-gold-light to-gold', badge: 'bg-gold text-white', emoji: '🥇' },
  silver: { ring: 'from-gray-300 to-gray-400', badge: 'bg-gray-400 text-white', emoji: '🥈' },
  bronze: { ring: 'from-amber-600 to-amber-800', badge: 'bg-amber-700 text-white', emoji: '🥉' },
  star: { ring: 'from-burgundy to-burgundy-light', badge: 'bg-burgundy text-white', emoji: '⭐' },
};

export default function HallOfFamePage() {
  const { t, locale } = useLocale();
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => { getAchievers().then((a) => setAchievers(a.filter((x) => x.visible))).catch(() => {}); }, []);

  const grades = useMemo(() => Array.from(new Set(achievers.map((a) => a.grade))), [achievers]);
  const categories = useMemo(() => Array.from(new Set(achievers.map((a) => a.category))), [achievers]);
  const years = useMemo(() => Array.from(new Set(achievers.map((a) => a.year))).sort().reverse(), [achievers]);

  const filtered = achievers.filter((a) =>
    (!search || a.name.includes(search)) &&
    (!grade || a.grade === grade) &&
    (!category || a.category === category) &&
    (!year || a.year === year)
  );

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <div className="absolute inset-0 opacity-10 text-[120px] select-none pointer-events-none flex items-center justify-center">🏆</div>
          <div className="relative">
            <h1 className="font-display text-4xl font-bold text-white mb-2">🏆 {t('hallOfFame')}</h1>
            <p className="text-white/70 text-sm">{t('hallOfFameSub')}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Filters */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`🔍 ${t('searchAchiever')}`}
              className="px-4 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy flex-1 min-w-[180px]" />
            <select value={grade} onChange={(e) => setGrade(e.target.value)}
              className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
              <option value="">{t('filterGrade')}</option>
              {grades.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
              <option value="">{t('filterCategory')}</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
              <option value="">{t('filterYear')}</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((a) => {
              const m = medalStyles[a.medal] ?? medalStyles.star;
              return (
                <div key={a.id}
                  className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1.5 hover:shadow-xl transition group">
                  {/* Card header with gradient + medal */}
                  <div className={`relative h-40 bg-gradient-to-br ${m.ring} flex items-center justify-center`}>
                    <div className="absolute top-3 end-3 text-2xl">{m.emoji}</div>
                    <div className="absolute top-3 start-3 text-[10px] font-bold bg-black/20 text-white px-2 py-0.5 rounded-full backdrop-blur">
                      {a.year}
                    </div>
                    {/* Photo circle */}
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                      <DriveImage src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-4 text-center">
                    <div className="text-sm font-bold text-gray-800 mb-0.5">{a.name}</div>
                    <div className="text-[11px] text-gray-400 mb-2.5">{a.grade}</div>
                    <div className="text-[12px] text-gray-600 leading-snug mb-3 min-h-[32px]">{a.achievement[locale]}</div>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${m.badge}`}>{a.category}</span>
                      {a.certificateUrl && (
                        <a href={a.certificateUrl} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gold-pale hover:text-gold transition">
                          📜 الشهادة
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">🔍 {t('noResults')}</div>
          )}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
