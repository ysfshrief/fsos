'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getCourses, saveCourse, deleteCourse } from '@/lib/db';
import { I18nField, TextField, DriveImageField } from '@/components/cms/CmsFields';
import DriveImage from '@/components/DriveImage';
import { emptyI18n, type Course } from '@/lib/types';

const blank = (): Omit<Course, 'id'> => ({
  coverUrl: '', name: emptyI18n(), description: emptyI18n(),
  ageGroup: '', duration: emptyI18n(), certificate: true,
  registerHref: '#', order: 99, visible: true, updatedAt: Date.now(),
});

export default function AdminCourses() {
  const { t, locale } = useLocale();
  const [list, setList] = useState<Course[]>([]);
  const [editing, setEditing] = useState<(Omit<Course, 'id'> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => { getCourses().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing || !editing.name.ar.trim()) return;
    setBusy(true);
    await saveCourse(editing);
    setBusy(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => {
    if (!confirm('تأكيد الحذف؟')) return;
    await deleteCourse(id);
    reload();
  };

  const toggleVisible = async (c: Course) => {
    await saveCourse({ ...c, visible: !c.visible });
    reload();
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">🎓 {t('manageCourses')}</h2>
        {!editing && (
          <button onClick={() => setEditing(blank())}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('addCourse')}
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <DriveImageField label="صورة الغلاف" value={editing.coverUrl} onChange={(v) => setEditing({ ...editing, coverUrl: v })} />
            </div>
            <I18nField label="اسم البرنامج" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <TextField label="الفئة العمرية" value={editing.ageGroup} onChange={(v) => setEditing({ ...editing, ageGroup: v })} dir="ltr" placeholder="6-12" />
            <div className="md:col-span-2">
              <I18nField label="الوصف" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
            </div>
            <I18nField label="المدة" value={editing.duration} onChange={(v) => setEditing({ ...editing, duration: v })} />
            <TextField label="رابط التسجيل" value={editing.registerHref} onChange={(v) => setEditing({ ...editing, registerHref: v })} dir="ltr" placeholder="https://..." />
            <TextField label="ترتيب العرض" value={String(editing.order)} onChange={(v) => setEditing({ ...editing, order: Number(v) || 99 })} dir="ltr" />
            <label className="flex items-center gap-2 text-sm text-gray-700 pt-6">
              <input type="checkbox" checked={editing.certificate} onChange={(e) => setEditing({ ...editing, certificate: e.target.checked })}
                className="w-4 h-4 accent-burgundy" />
              يمنح شهادة معتمدة
            </label>
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
          {list.map((c) => (
            <div key={c.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${c.visible ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              <div className="h-28 bg-gradient-to-br from-burgundy to-gold">
                <DriveImage src={c.coverUrl} alt={c.name[locale]} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-sm font-bold text-gray-800 mb-0.5">{c.name[locale]}</div>
                <div className="text-[11px] text-gray-400 mb-3">👥 {c.ageGroup} • ⏱️ {c.duration[locale]}</div>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditing(c)} className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200">✏️ {t('edit')}</button>
                  <button onClick={() => toggleVisible(c)} className="px-2.5 py-1.5 rounded-md bg-blue-500/10 text-blue-600 text-[11px] font-bold hover:bg-blue-500/20">{c.visible ? '👁️' : '🙈'}</button>
                  <button onClick={() => remove(c.id)} className="px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
