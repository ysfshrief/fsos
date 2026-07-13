'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { getGradesForStudent } from '@/lib/db';
import type { Grade } from '@/lib/types';

function pill(total: number) {
  if (total >= 85) return { g: 'A', cls: 'bg-green-500/10 text-green-600' };
  if (total >= 75) return { g: 'B', cls: 'bg-blue-500/10 text-blue-600' };
  return { g: 'C', cls: 'bg-amber-500/10 text-amber-600' };
}

export default function StudentGrades() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    if (user) getGradesForStudent(user.uid).then(setGrades).catch(() => {});
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5">{t('myGrades')}</h2>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
              <th className="p-3 text-start">{t('subject')}</th>
              <th className="p-3 text-start">{t('oral')} /30</th>
              <th className="p-3 text-start">{t('written')} /55</th>
              <th className="p-3 text-start">{t('practical')} /15</th>
              <th className="p-3 text-start">{t('total')}</th>
              <th className="p-3 text-start">—</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => {
              const total = g.oral + g.written + g.practical;
              const p = pill(total);
              return (
                <tr key={g.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="p-3.5 text-sm font-medium">{g.subject}</td>
                  <td className="p-3.5 text-sm">{g.oral}</td>
                  <td className="p-3.5 text-sm">{g.written}</td>
                  <td className="p-3.5 text-sm">{g.practical}</td>
                  <td className="p-3.5 text-sm font-bold">{total}/100</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center justify-center w-10 h-6 rounded-full text-[11px] font-bold ${p.cls}`}>{p.g}</span>
                  </td>
                </tr>
              );
            })}
            {grades.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-xs text-gray-400">لا توجد درجات مسجلة بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
