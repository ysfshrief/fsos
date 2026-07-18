'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getSpecialistMessages, setMessageStatus, deleteSpecialistMessage } from '@/lib/db';
import { resolveImageUrl } from '@/lib/drive';
import type { SpecialistMessage } from '@/lib/types';

export default function AdminMessages() {
  const { t } = useLocale();
  const [list, setList] = useState<SpecialistMessage[]>([]);

  const reload = useCallback(() => { getSpecialistMessages().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const toggle = async (m: SpecialistMessage) => {
    await setMessageStatus(m.id, m.status === 'new' ? 'handled' : 'new');
    reload();
  };

  const remove = async (id: string) => { if (confirm('تأكيد الحذف؟')) { await deleteSpecialistMessage(id); reload(); } };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">🤝 {t('manageMessages')} <span className="text-sm text-gray-400">({list.length})</span></h2>
      <p className="text-xs text-gray-500 mb-5">🔒 رسائل سرية — يُرجى التعامل معها بخصوصية</p>

      <div className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className={`bg-white rounded-xl border shadow-sm p-5 ${m.status === 'new' ? 'border-blue-200' : 'border-gray-100'}`}>
            <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
              <div>
                <div className="text-sm font-bold text-gray-800">{m.subject || '(بدون موضوع)'}</div>
                <div className="text-[11px] text-gray-400">
                  {m.name || 'مجهول'} • {new Date(m.createdAt).toLocaleDateString('ar-EG')}
                </div>
              </div>
              <button onClick={() => toggle(m)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${m.status === 'new' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>
                {m.status === 'new' ? t('statusNew') : t('statusHandled')} ↻
              </button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3 bg-gray-50 rounded-lg p-3">{m.message}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-600 mb-2">
              <span dir="ltr" className="text-start">📞 {m.contact}</span>
              {m.preferredTime && <span>🕐 {m.preferredTime}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {m.attachmentUrl && (
                <a href={resolveImageUrl(m.attachmentUrl)} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-bold px-3 py-1.5 rounded-md bg-burgundy/10 text-burgundy hover:bg-burgundy/20">📎 {t('viewAttachment')}</a>
              )}
              <button onClick={() => remove(m.id)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 ms-auto">🗑️ {t('delete')}</button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-sm text-gray-400">{t('noSubmissions')}</div>
        )}
      </div>
    </div>
  );
}
