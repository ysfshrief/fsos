'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import DriveImage from '@/components/DriveImage';
import { useLocale } from '@/lib/locale-context';
import { getActivities } from '@/lib/db';
import { activityCategories, categoryMeta, toEmbedUrl } from '@/lib/activity-categories';
import { resolveImageUrl } from '@/lib/drive';
import type { Activity, ActivityCategory } from '@/lib/types';

export default function ActivitiesPage() {
  const { t, locale, tx } = useLocale();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<ActivityCategory | 'all'>('all');
  const [selected, setSelected] = useState<Activity | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => { getActivities().then((a) => setActivities(a.filter((x) => x.visible))).catch(() => {}); }, []);

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.category === filter);

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">🎨 {t('activities')}</h1>
          <p className="text-white/70 text-sm">{t('activitiesSub')}</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition
                ${filter === 'all' ? 'border-burgundy bg-burgundy text-white' : 'border-gray-200 text-gray-500 bg-white hover:border-gold'}`}>
              {t('allCategories')}
            </button>
            {activityCategories.map((c) => (
              <button key={c.key} onClick={() => setFilter(c.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border-2 transition
                  ${filter === c.key ? 'border-burgundy bg-burgundy text-white' : 'border-gray-200 text-gray-500 bg-white hover:border-gold'}`}>
                {c.icon} {t(c.tKey)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a) => {
              const meta = categoryMeta(a.category);
              return (
                <button key={a.id} onClick={() => setSelected(a)}
                  className="text-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition">
                  <div className="h-44 bg-gradient-to-br from-burgundy to-gold relative">
                    <DriveImage src={a.coverUrl} alt={tx(a.title)} className="w-full h-full object-cover" />
                    <span className="absolute top-3 start-3 text-[10px] font-bold bg-white/90 text-burgundy px-2.5 py-1 rounded-full">
                      {meta.icon} {t(meta.tKey)}
                    </span>
                    {(a.images.length > 0 || a.videos.length > 0) && (
                      <span className="absolute bottom-3 end-3 text-[10px] font-bold bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur">
                        🖼️ {a.images.length} {a.videos.length > 0 ? `• 🎬 ${a.videos.length}` : ''}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-bold text-gray-800 mb-1">{tx(a.title)}</div>
                    <div className="text-[11px] text-gray-400 mb-2">📅 {a.date}</div>
                    <div className="text-xs text-gray-600 line-clamp-2">{tx(a.description)}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && <div className="text-center py-16 text-gray-400 text-sm">{t('noResults')}</div>}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="h-56 bg-gradient-to-br from-burgundy to-gold relative">
              <DriveImage src={selected.coverUrl} alt={tx(selected.title)} className="w-full h-full object-cover" />
              <button onClick={() => setSelected(null)}
                className="absolute top-3 end-3 w-9 h-9 rounded-full bg-black/40 text-white text-xl flex items-center justify-center backdrop-blur">×</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-gold-pale text-gold px-2.5 py-1 rounded-full">
                  {categoryMeta(selected.category).icon} {t(categoryMeta(selected.category).tKey)}
                </span>
                <span className="text-[11px] text-gray-400">📅 {selected.date}</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-burgundy mb-2">{tx(selected.title)}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{tx(selected.description)}</p>

              {/* Gallery */}
              {selected.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {selected.images.map((img, i) => (
                    <button key={i} onClick={() => setLightbox(resolveImageUrl(img))}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-100 hover:opacity-90">
                      <DriveImage src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Videos */}
              {selected.videos.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-bold text-gray-700">🎬 {t('videos')}</div>
                  {selected.videos.map((v, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden border border-gray-100">
                      <iframe src={toEmbedUrl(v)} className="w-full h-full" allowFullScreen title={`video-${i}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 end-5 text-white text-3xl">×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}

      <PublicFooter />
    </>
  );
}
