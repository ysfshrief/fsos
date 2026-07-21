'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { getUserById, getGradesForStudent, getHomeworkForClass } from '@/lib/db';
import KpiCard from '@/components/KpiCard';
import BusTracker from '@/components/BusTracker';
import type { AppUser, Grade, Homework } from '@/lib/types';

export default function ParentDashboard() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [children, setChildren] = useState<AppUser[]>([]);
  const [selected, setSelected] = useState<AppUser | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);

  useEffect(() => {
    if (!user?.childrenIds?.length) return;
    Promise.all(user.childrenIds.map(getUserById)).then((kids) => {
      const valid = kids.filter((k): k is AppUser => !!k);
      setChildren(valid);
      if (valid.length) setSelected(valid[0]);
    });
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    getGradesForStudent(selected.uid).then(setGrades).catch(() => {});
    if (selected.classId) getHomeworkForClass(selected.classId).then(setHomework).catch(() => {});
  }, [selected]);

  const avg = grades.length
    ? (grades.reduce((s, g) => s + g.oral + g.written + g.practical, 0) / grades.length).toFixed(1)
    : '—';

  return (
    <div>
      {/* Children selector */}
      <div className="flex gap-3 mb-5 overflow-x-auto pb-1">
        {children.map((c) => (
          <button key={c.uid} onClick={() => setSelected(c)}
            className={`shrink-0 bg-white rounded-xl px-5 py-3.5 flex items-center gap-3 border-2 transition
              ${selected?.uid === c.uid ? 'border-burgundy' : 'border-gray-200'}`}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg,#6E1E2B,#C9A227)' }}>
              {c.name.charAt(0)}
            </div>
            <div className="text-start">
              <div className="text-[13px] font-bold text-gray-800">{c.name}</div>
              <div className="text-[11px] text-gray-400">{c.classId}</div>
            </div>
          </button>
        ))}
        {children.length === 0 && (
          <div className="text-sm text-gray-400 py-4">لا يوجد أبناء مرتبطون بهذا الحساب — يقوم المسؤول بربطهم من لوحة الإدارة</div>
        )}
      </div>

      {selected && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
            <KpiCard label={t('avg')} value={String(avg)} change="↑" changeType="pos" icon="📊" barWidth={87} />
            <KpiCard label={t('attendanceRate')} value="94%" change="↑" changeType="pos" icon="📅" barWidth={94} />
            <KpiCard label={t('pendingHw')} value={String(homework.length)} change="⏰" changeType="wrn" icon="📝" barWidth={40} />
            <KpiCard label={t('classRank')} value="#4" change="↑" changeType="pos" icon="🏆" barWidth={75} />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-[15px] text-gray-800">{t('grades')} — {selected.name}</div>
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
              {grades.length === 0 && <div className="text-center text-xs text-gray-400 py-4">لا توجد درجات بعد</div>}
            </div>
          </div>

          {/* School bus tracking */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />
              <h3 className="font-bold text-gray-800">🚌 {t('busPage')}</h3>
            </div>
            {selected.busId ? (
              <BusTracker busId={selected.busId} region={selected.busRegion} />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-400">
                🚏 {t('notSubscribed')}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
