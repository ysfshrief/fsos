'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getAchievers, saveAchiever, deleteAchiever } from '@/lib/db';
import { I18nField, TextField, DriveImageField } from '@/components/cms/CmsFields';
import DriveImage from '@/components/DriveImage';
import { emptyI18n, type Achiever } from '@/lib/types';

const blank = (): Omit<Achiever, 'id'> => ({
  name: '', photoUrl: '', grade: '', achievement: emptyI18n(),
  category: 'علمي', year: String(new Date().getFullYear()),
  medal: 'gold', certificateUrl: '', order: 99, visible: true, updatedAt: Date.now(),
});

const medals = [
  { v: 'gold', label: '🥇 ذهبية' }, { v: 'silver', label: '🥈 فضية' },
  { v: 'bronze', label: '🥉 برونزية' }, { v: 'star', label: '⭐ نجمة' },
];
const categories = ['علمي', 'رياضي', 'فني', 'ثقافي'];

export default function AdminAchievers() {
  const { t, locale } = useLocale();
  const [list, setList] = useState<Achiever[]>([]);
  const [editing, setEditing] = useState<(Omit<Achiever, 'id'> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => { getAchievers().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing || !editing.name.trim()) return;
    setBusy(true);
    await saveAchiever(editing);
    setBusy(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => {
    if (!confirm('تأكيد الحذف؟')) return;
    await deleteAchiever(id);
    reload();
  };

  const toggleVisible = async (a: Achiever) => {
    await saveAchiever({ ...a, visible: !a.visible });
    reload();
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">🏆 {t('manageAchievers')}</h2>
        {!editing && (
          <button onClick={() => setEditing(blank())}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('addAchiever')}
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <TextField label="اسم الطالب" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <TextField label="الصف" value={editing.grade} onChange={(v) => setEditing({ ...editing, grade: v })} />
            <div className="md:col-span-2">
              <DriveImageField label="صورة الطالب" value={editing.photoUrl} onChange={(v) => setEditing({ ...editing, photoUrl: v })} />
            </div>
            <div className="md:col-span-2">
              <I18nField label="الإنجاز" value={editing.achievement} onChange={(v) => setEditing({ ...editing, achievement: v })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">التصنيف</label>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <TextField label="السنة" value={editing.year} onChange={(v) => setEditing({ ...editing, year: v })} dir="ltr" />
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">الميدالية</label>
              <select value={editing.medal} onChange={(e) => setEditing({ ...editing, medal: e.target.value as Achiever['medal'] })}
                className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
                {medals.map((m) => <option key={m.v} value={m.v}>{m.label}</option>)}
              </select>
            </div>
            <TextField label="ترتيب العرض" value={String(editing.order)} onChange={(v) => setEditing({ ...editing, order: Number(v) || 99 })} dir="ltr" />
            <div className="md:col-span-2">
              <DriveImageField label="رابط الشهادة (اختياري)" value={editing.certificateUrl} onChange={(v) => setEditing({ ...editing, certificateUrl: v })} />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button onClick={save} disabled={busy}
              className="px-5 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light disabled:opacity-60">
              💾 {t('save')}
            </button>
            <button onClick={() => setEditing(null)}
              className="px-5 py-2 rounded-md bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200">
              {t('cancel')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((a) => (
            <div key={a.id} className={`bg-white rounded-xl border shadow-sm p-4 ${a.visible ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <DriveImage src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-800 truncate">{a.name}</div>
                  <div className="text-[11px] text-gray-400">{a.grade} • {a.year}</div>
                </div>
              </div>
              <div className="text-[12px] text-gray-600 mb-3 line-clamp-2">{a.achievement[locale]}</div>
              <div className="flex gap-1.5">
                <button onClick={() => setEditing(a)} className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200">✏️ {t('edit')}</button>
                <button onClick={() => toggleVisible(a)} className="px-2.5 py-1.5 rounded-md bg-blue-500/10 text-blue-600 text-[11px] font-bold hover:bg-blue-500/20">{a.visible ? '👁️' : '🙈'}</button>
                <button onClick={() => remove(a.id)} className="px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
