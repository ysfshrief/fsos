'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { getGradesForStudent, getHomeworkForClass } from '@/lib/db';
import KpiCard from '@/components/KpiCard';
import type { Grade, Homework } from '@/lib/types';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);

  useEffect(() => {
    if (!user) return;
    getGradesForStudent(user.uid).then(setGrades).catch(() => {});
    if (user.classId) getHomeworkForClass(user.classId).then(setHomework).catch(() => {});
  }, [user]);

  const avg = grades.length
    ? (grades.reduce((s, g) => s + g.oral + g.written + g.practical, 0) / grades.length).toFixed(1)
    : '—';

  return (
    <div>
      <div className="bg-gradient-to-l from-gold-pale to-gold/5 border border-gold/25 rounded-xl p-4 mb-5 flex gap-3">
        <span className="text-xl">📢</span>
        <div>
          <div className="text-[13px] font-bold text-burgundy mb-0.5">إعلان: امتحانات الفصل الدراسي الثاني</div>
          <div className="text-[13px] text-gray-700">تبدأ الامتحانات النهائية يوم الأحد 22 يونيو 2026.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <KpiCard label={t('attendanceRate')} value="94%" change="↑" changeType="pos" icon="📅" barWidth={94} />
        <KpiCard label={t('avg')} value={String(avg)} change="↑ +2.3" changeType="pos" icon="📊" barWidth={87} />
        <KpiCard label={t('pendingHw')} value={String(homework.length)} change="⏰" changeType="wrn" icon="📝" barWidth={40} />
        <KpiCard label={t('classRank')} value="#4" change="↑" changeType="pos" icon="🏆" barWidth={75} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Homework preview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-bold text-[15px] text-gray-800">{t('homework')}</div>
          {homework.length === 0 && <div className="p-6 text-center text-xs text-gray-400">لا توجد واجبات معلقة 🎉</div>}
          {homework.map((h) => (
            <div key={h.id} className="p-4 border-b border-gray-50 last:border-0 flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold text-gray-800">{h.title}</div>
                <div className="text-xs text-gray-500">{h.subject} • {h.teacherName}</div>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full shrink-0">
                📅 {h.dueDate}
              </span>
            </div>
          ))}
        </div>

        {/* Grades preview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-bold text-[15px] text-gray-800">{t('myGrades')}</div>
          <div className="p-4 space-y-3">
            {grades.map((g) => {
              const total = g.oral + g.written + g.practical;
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{g.subject}</span>
                    <span className="font-bold text-gray-800">{total}/100</span>
                  </div>
                  <div className="h-[3px] bg-gray-100 rounded">
                    <div className="h-full rounded bg-gradient-to-r from-burgundy to-gold" style={{ width: `${total}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
