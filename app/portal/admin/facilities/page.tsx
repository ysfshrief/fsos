'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getFacilities, saveFacility, deleteFacility } from '@/lib/db';
import { I18nField, TextField } from '@/components/cms/CmsFields';
import { emptyI18n, type Facility } from '@/lib/types';

const blank = (): Omit<Facility, 'id'> => ({
  name: emptyI18n(), description: emptyI18n(), icon: '🏫',
  images: [], order: 99, visible: true, updatedAt: Date.now(),
});

const icons = ['🔬', '💻', '📚', '⚽', '🎭', '🏥', '🎵', '🍽️', '🤖', '🏫', '🎨', '🧪'];

export default function AdminFacilities() {
  const { t, locale } = useLocale();
  const [list, setList] = useState<Facility[]>([]);
  const [editing, setEditing] = useState<(Omit<Facility, 'id'> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => { getFacilities().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing || !editing.name.ar.trim()) return;
    setBusy(true);
    await saveFacility(editing);
    setBusy(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => {
    if (!confirm('تأكيد الحذف؟')) return;
    await deleteFacility(id);
    reload();
  };

  const toggleVisible = async (f: Facility) => { await saveFacility({ ...f, visible: !f.visible }); reload(); };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">🏛️ {t('manageFacilities')}</h2>
        {!editing && (
          <button onClick={() => setEditing(blank())}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('addFacility')}
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <I18nField label="اسم المرفق" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">الأيقونة</label>
              <div className="flex flex-wrap gap-1.5">
                {icons.map((ic) => (
                  <button key={ic} type="button" onClick={() => setEditing({ ...editing, icon: ic })}
                    className={`w-9 h-9 rounded-md border-2 text-lg ${editing.icon === ic ? 'border-burgundy bg-burgundy/5' : 'border-gray-200'}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <I18nField label="الوصف" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('galleryLinks')}</label>
              <textarea
                value={editing.images.join('\n')}
                onChange={(e) => setEditing({ ...editing, images: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                rows={4} dir="ltr"
                placeholder="https://drive.google.com/file/d/...&#10;https://drive.google.com/file/d/..."
                className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy resize-y font-mono text-[11px]"
              />
              <p className="text-[10px] text-gray-400 mt-1">كل رابط Drive في سطر منفصل</p>
            </div>
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
          {list.map((f) => (
            <div key={f.id} className={`bg-white rounded-xl border shadow-sm p-4 ${f.visible ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <div className="text-sm font-bold text-gray-800">{f.name[locale]}</div>
                  <div className="text-[10px] text-gray-400">🖼️ {f.images.length} صورة</div>
                </div>
              </div>
              <div className="text-[12px] text-gray-600 mb-3 line-clamp-2">{f.description[locale]}</div>
              <div className="flex gap-1.5">
                <button onClick={() => setEditing(f)} className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200">✏️ {t('edit')}</button>
                <button onClick={() => toggleVisible(f)} className="px-2.5 py-1.5 rounded-md bg-blue-500/10 text-blue-600 text-[11px] font-bold hover:bg-blue-500/20">{f.visible ? '👁️' : '🙈'}</button>
                <button onClick={() => remove(f.id)} className="px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
