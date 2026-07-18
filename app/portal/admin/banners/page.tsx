'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getBanners, saveBanner, deleteBanner } from '@/lib/db';
import { I18nField, TextField, DriveImageField } from '@/components/cms/CmsFields';
import DriveImage from '@/components/DriveImage';
import { emptyI18n, type Banner } from '@/lib/types';

const blank = (): Omit<Banner, 'id'> => ({
  title: emptyI18n(), subtitle: emptyI18n(), imageUrl: '',
  ctaLabel: emptyI18n(), ctaHref: '', order: 99, visible: true, updatedAt: Date.now(),
});

export default function AdminBanners() {
  const { t, locale } = useLocale();
  const [list, setList] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<(Omit<Banner, 'id'> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => { getBanners().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing || !editing.title.ar.trim()) return;
    setBusy(true);
    await saveBanner(editing);
    setBusy(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => { if (confirm('تأكيد الحذف؟')) { await deleteBanner(id); reload(); } };
  const toggleVisible = async (b: Banner) => { await saveBanner({ ...b, visible: !b.visible }); reload(); };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
        <h2 className="text-xl font-bold text-gray-800">🖼️ {t('manageBanners')}</h2>
        {!editing && (
          <button onClick={() => setEditing(blank())}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('addBanner')}
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-5">💡 البانرات تظهر كسلايدر متحرك أعلى الصفحة الرئيسية. لو مفيش بانرات، تظهر الواجهة الافتراضية.</p>

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <DriveImageField label={t('bannerImage')} value={editing.imageUrl} onChange={(v) => setEditing({ ...editing, imageUrl: v })} />
            </div>
            <I18nField label={t('bannerTitle')} value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <I18nField label={t('bannerSubtitle')} value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
            <I18nField label={t('ctaLabel')} value={editing.ctaLabel} onChange={(v) => setEditing({ ...editing, ctaLabel: v })} />
            <TextField label={t('ctaHref')} value={editing.ctaHref} onChange={(v) => setEditing({ ...editing, ctaHref: v })} dir="ltr" placeholder="/admissions" />
            <TextField label="ترتيب العرض" value={String(editing.order)} onChange={(v) => setEditing({ ...editing, order: Number(v) || 99 })} dir="ltr" />
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={save} disabled={busy}
              className="px-5 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light disabled:opacity-60">💾 {t('save')}</button>
            <button onClick={() => setEditing(null)}
              className="px-5 py-2 rounded-md bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200">{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((b) => (
            <div key={b.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${b.visible ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              <div className="flex flex-col sm:flex-row">
                {/* Preview */}
                <div className="sm:w-56 h-32 shrink-0 relative bg-gradient-to-br from-burgundy to-gold">
                  {b.imageUrl ? (
                    <DriveImage src={b.imageUrl} alt={b.title[locale]} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60 text-xs">بدون صورة (تدرّج افتراضي)</div>
                  )}
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-center px-4">
                    <div className="text-white font-bold text-sm line-clamp-1">{b.title[locale]}</div>
                    <div className="text-white/70 text-[10px] line-clamp-1">{b.subtitle[locale]}</div>
                  </div>
                </div>
                {/* Controls */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="text-[11px] text-gray-500">
                    ترتيب: {b.order} {b.ctaHref && <>• زر: {b.ctaLabel[locale]} → {b.ctaHref}</>}
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    <button onClick={() => setEditing(b)} className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200">✏️ {t('edit')}</button>
                    <button onClick={() => toggleVisible(b)} className="px-2.5 py-1.5 rounded-md bg-blue-500/10 text-blue-600 text-[11px] font-bold hover:bg-blue-500/20">{b.visible ? '👁️' : '🙈'}</button>
                    <button onClick={() => remove(b.id)} className="px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-sm text-gray-400">{t('noBanners')}</div>
          )}
        </div>
      )}
    </div>
  );
}
