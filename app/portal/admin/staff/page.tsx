'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getStaff, saveStaff, deleteStaff, getStaffGroupImage, saveStaffGroupImage } from '@/lib/db';
import { I18nField, TextField, DriveImageField } from '@/components/cms/CmsFields';
import DriveImage from '@/components/DriveImage';
import { emptyI18n, type StaffMember, type StaffGroupImage, type StaffCategory } from '@/lib/types';

const blank = (): Omit<StaffMember, 'id'> => ({
  name: '', photoUrl: '', category: 'teaching', role: emptyI18n(),
  order: 99, visible: true, updatedAt: Date.now(),
});

const cats: { v: StaffCategory; label: string }[] = [
  { v: 'administration', label: 'الإدارة' },
  { v: 'teaching', label: 'هيئة التدريس' },
  { v: 'specialist', label: 'أخصائي' },
];

export default function AdminStaff() {
  const { t, locale, tx } = useLocale();
  const [list, setList] = useState<StaffMember[]>([]);
  const [group, setGroup] = useState<StaffGroupImage | null>(null);
  const [editing, setEditing] = useState<(Omit<StaffMember, 'id'> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [groupSaved, setGroupSaved] = useState(false);

  const reload = useCallback(() => {
    getStaff().then(setList).catch(() => {});
    getStaffGroupImage().then(setGroup).catch(() => {});
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing || !editing.name.trim()) return;
    setBusy(true);
    await saveStaff(editing);
    setBusy(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => {
    if (!confirm('تأكيد الحذف؟')) return;
    await deleteStaff(id);
    reload();
  };

  const toggleVisible = async (m: StaffMember) => { await saveStaff({ ...m, visible: !m.visible }); reload(); };

  const saveGroup = async () => {
    if (!group) return;
    await saveStaffGroupImage(group);
    setGroupSaved(true);
    setTimeout(() => setGroupSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">👥 {t('manageStaff')}</h2>
        {!editing && (
          <button onClick={() => setEditing(blank())}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('addStaff')}
          </button>
        )}
      </div>

      {/* Group image editor */}
      {!editing && group && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <DriveImageField label={`📸 ${t('groupImage')}`} value={group.imageUrl} onChange={(v) => setGroup({ ...group, imageUrl: v })} />
            </div>
            <button onClick={saveGroup}
              className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light shrink-0">
              💾 {groupSaved ? t('saved') : t('save')}
            </button>
          </div>
        </div>
      )}

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <TextField label="الاسم" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">القسم</label>
              <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as StaffCategory })}
                className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
                {cats.map((c) => <option key={c.v} value={c.v}>{c.label}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <DriveImageField label="الصورة" value={editing.photoUrl} onChange={(v) => setEditing({ ...editing, photoUrl: v })} />
            </div>
            <div className="md:col-span-2">
              <I18nField label="المنصب / المادة / التخصص" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} />
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
          {list.map((m) => (
            <div key={m.id} className={`bg-white rounded-xl border shadow-sm p-4 ${m.visible ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <DriveImage src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-800 truncate">{m.name}</div>
                  <div className="text-[11px] text-burgundy">{tx(m.role)}</div>
                  <div className="text-[10px] text-gray-400">{cats.find((c) => c.v === m.category)?.label}</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setEditing(m)} className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200">✏️ {t('edit')}</button>
                <button onClick={() => toggleVisible(m)} className="px-2.5 py-1.5 rounded-md bg-blue-500/10 text-blue-600 text-[11px] font-bold hover:bg-blue-500/20">{m.visible ? '👁️' : '🙈'}</button>
                <button onClick={() => remove(m.id)} className="px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
