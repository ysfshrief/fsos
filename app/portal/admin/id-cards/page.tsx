'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getAllUsers } from '@/lib/db';
import StudentIdCard from '@/components/StudentIdCard';
import type { AppUser } from '@/lib/types';

export default function AdminIdCards() {
  const { t } = useLocale();
  const [students, setStudents] = useState<AppUser[]>([]);
  const [selected, setSelected] = useState<AppUser | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllUsers()
      .then((all) => setStudents(all.filter((u) => u.role === 'student')))
      .catch(() => {});
  }, []);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">🪪 {t('manageIdCards')}</h2>
      <p className="text-sm text-gray-500 mb-6">اختر طالبًا لإنشاء بطاقة الـ QR الخاصة به، ثم حمّلها أو اطبعها لإضافتها للكارنيه.</p>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Student list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 بحث بالاسم..."
            className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy mb-3" />
          <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-50">
            {filtered.map((s) => (
              <button key={s.uid} onClick={() => setSelected(s)}
                className={`w-full text-start px-3 py-2.5 rounded-lg text-sm transition ${
                  selected?.uid === s.uid ? 'bg-burgundy/10 text-burgundy font-bold' : 'hover:bg-gray-50 text-gray-700'
                }`}>
                {s.name}
                {s.classId && <span className="text-[11px] text-gray-400 block">{s.classId}</span>}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-400">لا يوجد طلاب</div>
            )}
          </div>
        </div>

        {/* Card preview */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-8 flex items-center justify-center">
          {selected ? (
            <StudentIdCard student={selected} />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-3">🪪</div>
              <div className="text-sm">اختر طالبًا من القائمة لعرض بطاقته</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
