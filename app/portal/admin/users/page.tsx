'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getAllUsers, setUserApproval } from '@/lib/db';
import type { AppUser, Role } from '@/lib/types';

const roleChips: Record<Role, string> = {
  student: 'bg-blue-500/10 text-blue-600',
  parent: 'bg-gold-pale text-yellow-700',
  teacher: 'bg-green-500/10 text-green-600',
  admin: 'bg-gray-200 text-gray-700',
  driver: 'bg-orange-500/10 text-orange-600',
};

export default function AdminUsers() {
  const { t } = useLocale();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [filter, setFilter] = useState<'all' | Role>('all');
  const [search, setSearch] = useState('');

  const reload = useCallback(() => { getAllUsers().then(setUsers).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const handleApproval = async (uid: string, approved: boolean) => {
    await setUserApproval(uid, approved);
    reload();
  };

  const filtered = users.filter((u) =>
    (filter === 'all' || u.role === filter) &&
    (u.name.includes(search) || u.email.includes(search))
  );

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">{t('users')}</h2>
        <div className="flex gap-2 flex-wrap">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 بحث..."
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy w-44" />
          <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | Role)}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
            <option value="all">الكل</option>
            <option value="student">{t('student')}</option>
            <option value="parent">{t('parent')}</option>
            <option value="teacher">{t('teacher')}</option>
            <option value="admin">{t('admin')}</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
              <th className="p-3 text-start">الاسم</th>
              <th className="p-3 text-start">الدور</th>
              <th className="p-3 text-start">{t('email')}</th>
              <th className="p-3 text-start">الحالة</th>
              <th className="p-3 text-start">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.uid} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg,#6E1E2B,#C9A227)' }}>
                      {u.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${roleChips[u.role]}`}>{t(u.role)}</span>
                </td>
                <td className="p-3.5 text-xs text-gray-500" dir="ltr">{u.email}</td>
                <td className="p-3.5">
                  {u.approved
                    ? <span className="text-[10px] font-bold bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full">● {t('active')}</span>
                    : <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full">⏳ {t('pending')}</span>}
                </td>
                <td className="p-3.5">
                  {!u.approved ? (
                    <div className="flex gap-1.5">
                      <button onClick={() => handleApproval(u.uid, true)}
                        className="px-3 py-1.5 rounded-md bg-green-600 text-white text-[11px] font-bold hover:bg-green-700">
                        {t('approve')}
                      </button>
                    </div>
                  ) : u.role !== 'admin' ? (
                    <button onClick={() => handleApproval(u.uid, false)}
                      className="px-3 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">
                      تعطيل
                    </button>
                  ) : <span className="text-xs text-gray-300">—</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-xs text-gray-400">لا توجد نتائج</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
