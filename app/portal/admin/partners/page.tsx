'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getPartners, savePartner, deletePartner } from '@/lib/db';
import { I18nField, TextField, DriveImageField } from '@/components/cms/CmsFields';
import DriveImage from '@/components/DriveImage';
import { emptyI18n, type Partner } from '@/lib/types';

const blank = (): Omit<Partner, 'id'> => ({
  name: emptyI18n(), description: emptyI18n(), logoUrl: '', website: '',
  order: 99, visible: true, updatedAt: Date.now(),
});

export default function AdminPartners() {
  const { t, locale, tx } = useLocale();
  const [list, setList] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<(Omit<Partner, 'id'> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => { getPartners().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing || !editing.name.ar.trim()) return;
    setBusy(true);
    await savePartner(editing);
    setBusy(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => { if (confirm('تأكيد الحذف؟')) { await deletePartner(id); reload(); } };
  const toggleVisible = async (p: Partner) => { await savePartner({ ...p, visible: !p.visible }); reload(); };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">🤝 {t('managePartners')}</h2>
        {!editing && (
          <button onClick={() => setEditing(blank())}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('addPartner')}
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <I18nField label="اسم الشريك" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <TextField label="رابط الموقع" value={editing.website} onChange={(v) => setEditing({ ...editing, website: v })} dir="ltr" placeholder="https://..." />
            <div className="md:col-span-2">
              <DriveImageField label="الشعار (Logo)" value={editing.logoUrl} onChange={(v) => setEditing({ ...editing, logoUrl: v })} />
            </div>
            <div className="md:col-span-2">
              <I18nField label="الوصف" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
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
          {list.map((p) => (
            <div key={p.id} className={`bg-white rounded-xl border shadow-sm p-4 ${p.visible ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                  <DriveImage src={p.logoUrl} alt={tx(p.name)} className="w-full h-full object-contain p-1" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-800 truncate">{tx(p.name)}</div>
                  <div className="text-[11px] text-gray-400 line-clamp-1">{tx(p.description)}</div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setEditing(p)} className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200">✏️ {t('edit')}</button>
                <button onClick={() => toggleVisible(p)} className="px-2.5 py-1.5 rounded-md bg-blue-500/10 text-blue-600 text-[11px] font-bold hover:bg-blue-500/20">{p.visible ? '👁️' : '🙈'}</button>
                <button onClick={() => remove(p.id)} className="px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
