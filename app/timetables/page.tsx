'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import TimetableGrid from '@/components/TimetableGrid';
import { useLocale } from '@/lib/locale-context';
import { getTimetables } from '@/lib/db';
import type { Timetable, TimetableKind } from '@/lib/types';

export default function TimetablesPage() {
  const { t } = useLocale();
  const [all, setAll] = useState<Timetable[]>([]);
  const [kind, setKind] = useState<TimetableKind>('class');
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTimetables()
      .then((list) => setAll(list.filter((x) => x.visible)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter((tt) => tt.kind === kind);
  const selected = filtered.find((tt) => tt.id === selectedId) || filtered[0];

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <div className="absolute inset-0 opacity-10 text-[120px] select-none pointer-events-none flex items-center justify-center">📅</div>
          <div className="relative">
            <h1 className="font-display text-4xl font-bold text-white mb-2">📅 {t('timetables')}</h1>
            <p className="text-white/70 text-sm">{t('timetablesSub')}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Kind toggle */}
          <div className="flex justify-center gap-2 mb-8">
            {(['class', 'teacher'] as TimetableKind[]).map((k) => (
              <button
                key={k}
                onClick={() => { setKind(k); setSelectedId(''); }}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${
                  kind === k
                    ? 'bg-burgundy text-white shadow-md'
                    : 'bg-white text-burgundy border border-burgundy/20 hover:bg-burgundy/5'
                }`}
              >
                {k === 'class' ? `🏫 ${t('classSchedule')}` : `👨‍🏫 ${t('teacherSchedule')}`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">{t('loading')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">{t('noTimetables')}</div>
          ) : (
            <>
              {/* Selector */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {filtered.map((tt) => (
                  <button
                    key={tt.id}
                    onClick={() => setSelectedId(tt.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      selected?.id === tt.id
                        ? 'bg-gold text-white'
                        : 'bg-gold-pale text-burgundy hover:bg-gold/20'
                    }`}
                  >
                    {tt.name}
                  </button>
                ))}
              </div>

              {/* Grid */}
              {selected && (
                <div>
                  <div className="text-center mb-5">
                    <h2 className="font-display text-2xl font-bold text-burgundy">{selected.name}</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {selected.kind === 'class' ? t('classSchedule') : t('teacherSchedule')}
                    </p>
                  </div>
                  <TimetableGrid timetable={selected} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
