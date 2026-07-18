'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getActivities, saveActivity, deleteActivity } from '@/lib/db';
import { I18nField, TextField, DriveImageField } from '@/components/cms/CmsFields';
import DriveImage from '@/components/DriveImage';
import { activityCategories, categoryMeta } from '@/lib/activity-categories';
import { emptyI18n, type Activity, type ActivityCategory } from '@/lib/types';

const blank = (): Omit<Activity, 'id'> => ({
  title: emptyI18n(), description: emptyI18n(), category: 'sports',
  coverUrl: '', images: [], videos: [], date: new Date().toISOString().slice(0, 10),
  order: 99, visible: true, updatedAt: Date.now(),
});

export default function AdminActivities() {
  const { t, locale, tx } = useLocale();
  const [list, setList] = useState<Activity[]>([]);
  const [editing, setEditing] = useState<(Omit<Activity, 'id'> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => { getActivities().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing || !editing.title.ar.trim()) return;
    setBusy(true);
    await saveActivity(editing);
    setBusy(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => { if (confirm('تأكيد الحذف؟')) { await deleteActivity(id); reload(); } };
  const toggleVisible = async (a: Activity) => { await saveActivity({ ...a, visible: !a.visible }); reload(); };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">🎨 {t('manageActivities')}</h2>
        {!editing && (
          <button onClick={() => setEditing(blank())}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('addActivity')}
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <I18nField label="عنوان النشاط" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">التصنيف</label>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as ActivityCategory })}
                className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
                {activityCategories.map((c) => <option key={c.key} value={c.key}>{c.icon} {t(c.tKey)}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <I18nField label="الوصف" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
            </div>
            <div className="md:col-span-2">
              <DriveImageField label="صورة الغلاف" value={editing.coverUrl} onChange={(v) => setEditing({ ...editing, coverUrl: v })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('galleryLinks')}</label>
              <textarea value={editing.images.join('\n')} rows={3} dir="ltr"
                onChange={(e) => setEditing({ ...editing, images: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-[11px] font-mono outline-none focus:border-burgundy resize-y"
                placeholder="https://drive.google.com/file/d/..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('videoLinks')}</label>
              <textarea value={editing.videos.join('\n')} rows={2} dir="ltr"
                onChange={(e) => setEditing({ ...editing, videos: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-[11px] font-mono outline-none focus:border-burgundy resize-y"
                placeholder="https://youtube.com/watch?v=...  أو  https://drive.google.com/file/d/..." />
            </div>
            <TextField label="التاريخ" value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} dir="ltr" />
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((a) => (
            <div key={a.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${a.visible ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              <div className="h-24 bg-gradient-to-br from-burgundy to-gold relative">
                <DriveImage src={a.coverUrl} alt={tx(a.title)} className="w-full h-full object-cover" />
                <span className="absolute top-2 start-2 text-[9px] font-bold bg-white/90 text-burgundy px-2 py-0.5 rounded-full">
                  {categoryMeta(a.category).icon} {t(categoryMeta(a.category).tKey)}
                </span>
              </div>
              <div className="p-4">
                <div className="text-sm font-bold text-gray-800 mb-0.5">{tx(a.title)}</div>
                <div className="text-[10px] text-gray-400 mb-3">📅 {a.date} • 🖼️ {a.images.length} • 🎬 {a.videos.length}</div>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditing(a)} className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200">✏️ {t('edit')}</button>
                  <button onClick={() => toggleVisible(a)} className="px-2.5 py-1.5 rounded-md bg-blue-500/10 text-blue-600 text-[11px] font-bold hover:bg-blue-500/20">{a.visible ? '👁️' : '🙈'}</button>
                  <button onClick={() => remove(a.id)} className="px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
