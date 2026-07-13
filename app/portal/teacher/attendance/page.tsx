'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { getClasses, getStudentsInClass, getAttendance, saveAttendance } from '@/lib/db';
import type { SchoolClass, AppUser, AttendanceRecord } from '@/lib/types';

type Status = 'present' | 'absent' | 'late';

export default function TeacherAttendance() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [classId, setClassId] = useState('');
  const [students, setStudents] = useState<AppUser[]>([]);
  const [records, setRecords] = useState<Record<string, Status>>({});
  const [savedMsg, setSavedMsg] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    getClasses().then((c) => {
      setClasses(c);
      if (c.length) setClassId(c[0].id);
    });
  }, []);

  const loadClass = useCallback(async (cid: string) => {
    const st = await getStudentsInClass(cid);
    setStudents(st);
    const existing = await getAttendance(today, cid);
    if (existing) {
      setRecords(existing.records);
    } else {
      const initial: Record<string, Status> = {};
      st.forEach((s) => { initial[s.uid] = 'present'; });
      setRecords(initial);
    }
  }, [today]);

  useEffect(() => {
    if (classId) loadClass(classId);
  }, [classId, loadClass]);

  const setStatus = (uid: string, s: Status) => setRecords((r) => ({ ...r, [uid]: s }));

  const handleSave = async () => {
    if (!user || !classId) return;
    const rec: AttendanceRecord = {
      id: `${today}_${classId}`,
      date: today, classId, records, savedBy: user.uid,
    };
    await saveAttendance(rec);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const btnCls = (active: boolean, color: string) =>
    `px-3 py-1.5 rounded-md border-2 text-[11px] font-bold transition
     ${active ? color : 'border-gray-200 text-gray-500 bg-white hover:border-gold'}`;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">{t('attendance')} — {today}</h2>
        <div className="flex gap-2">
          <select value={classId} onChange={(e) => setClassId(e.target.value)}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={handleSave}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            💾 {savedMsg ? t('saved') : t('save')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {students.map((s, i) => (
          <div key={s.uid} className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-50 last:border-0">
            <span className="text-xs text-gray-400 w-5">{i + 1}</span>
            <span className="flex-1 text-sm font-medium text-gray-800 min-w-[140px]">{s.name}</span>
            <div className="flex gap-1.5">
              <button onClick={() => setStatus(s.uid, 'present')}
                className={btnCls(records[s.uid] === 'present', 'border-green-500 bg-green-500/5 text-green-600')}>
                ✓ {t('present')}
              </button>
              <button onClick={() => setStatus(s.uid, 'absent')}
                className={btnCls(records[s.uid] === 'absent', 'border-red-500 bg-red-500/5 text-red-600')}>
                ✗ {t('absent')}
              </button>
              <button onClick={() => setStatus(s.uid, 'late')}
                className={btnCls(records[s.uid] === 'late', 'border-amber-500 bg-amber-500/5 text-amber-600')}>
                ⏰ {t('late')}
              </button>
            </div>
          </div>
        ))}
        {students.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-400">لا يوجد طلاب في هذا الفصل</div>
        )}
      </div>
    </div>
  );
}
