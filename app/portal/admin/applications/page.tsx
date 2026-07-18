'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getApplications, setApplicationStatus, deleteApplication } from '@/lib/db';
import { resolveImageUrl } from '@/lib/drive';
import type { JobApplication } from '@/lib/types';

const statusStyles: Record<JobApplication['status'], string> = {
  new: 'bg-blue-500/10 text-blue-600',
  reviewed: 'bg-amber-500/10 text-amber-700',
  contacted: 'bg-green-500/10 text-green-600',
};

export default function AdminApplications() {
  const { t } = useLocale();
  const [list, setList] = useState<JobApplication[]>([]);

  const reload = useCallback(() => { getApplications().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const cycle = async (a: JobApplication) => {
    const next: JobApplication['status'] = a.status === 'new' ? 'reviewed' : a.status === 'reviewed' ? 'contacted' : 'new';
    await setApplicationStatus(a.id, next);
    reload();
  };

  const remove = async (id: string) => { if (confirm('تأكيد الحذف؟')) { await deleteApplication(id); reload(); } };

  const statusLabel = (s: JobApplication['status']) =>
    s === 'new' ? t('statusNew') : s === 'reviewed' ? t('statusReviewed') : t('statusContacted');

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5">💼 {t('manageApplications')} <span className="text-sm text-gray-400">({list.length})</span></h2>

      <div className="space-y-3">
        {list.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
              <div>
                <div className="text-sm font-bold text-gray-800">{a.fullName}</div>
                <div className="text-xs text-burgundy font-semibold">{a.position}</div>
              </div>
              <button onClick={() => cycle(a)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyles[a.status]}`}>
                {statusLabel(a.status)} ↻
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-600 mb-3">
              <div>🎓 {a.qualification || '—'}</div>
              <div>⏳ {a.experience || '—'}</div>
              <div dir="ltr" className="text-start">📱 {a.phone}</div>
              <div dir="ltr" className="text-start">✉️ {a.email || '—'}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {a.cvUrl && (
                <a href={resolveImageUrl(a.cvUrl)} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-bold px-3 py-1.5 rounded-md bg-burgundy/10 text-burgundy hover:bg-burgundy/20">📄 {t('viewCV')}</a>
              )}
              {a.certificatesUrl && (
                <a href={resolveImageUrl(a.certificatesUrl)} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] font-bold px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">📜 {t('viewCerts')}</a>
              )}
              <button onClick={() => remove(a.id)}
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
