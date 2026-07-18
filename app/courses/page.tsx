'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import DriveImage from '@/components/DriveImage';
import { useLocale } from '@/lib/locale-context';
import { getCourses } from '@/lib/db';
import type { Course } from '@/lib/types';

export default function CoursesPage() {
  const { t, locale, tx } = useLocale();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => { getCourses().then((c) => setCourses(c.filter((x) => x.visible))).catch(() => {}); }, []);

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <div className="absolute inset-0 opacity-10 text-[120px] select-none pointer-events-none flex items-center justify-center">🎓</div>
          <div className="relative">
            <h1 className="font-display text-4xl font-bold text-white mb-2">🎓 {t('courses')}</h1>
            <p className="text-white/70 text-sm">{t('coursesSub')}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition flex flex-col">
              <div className="h-44 bg-gradient-to-br from-burgundy to-gold relative">
                <DriveImage src={c.coverUrl} alt={tx(c.name)} className="w-full h-full object-cover" />
                {c.certificate && (
                  <span className="absolute top-3 end-3 text-[10px] font-bold bg-white/90 text-burgundy px-2.5 py-1 rounded-full">
                    📜 {t('certificate')}
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="font-bold text-gray-800 text-[15px] mb-1">{tx(c.name)}</div>
                <div className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{tx(c.description)}</div>
                <div className="flex gap-2 mb-4 text-[11px]">
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">👥 {c.ageGroup}</span>
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">⏱️ {tx(c.duration)}</span>
                </div>
                <a href={c.registerHref} target="_blank" rel="noopener noreferrer"
                  className="block text-center py-2.5 rounded-xl bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light transition">
                  {t('registerNow')} ←
                </a>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-400 text-sm">{t('noResults')}</div>
          )}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
