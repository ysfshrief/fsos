'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getClasses, getStudentsInClass, getGradesForStudent, saveGrade } from '@/lib/db';
import type { SchoolClass, AppUser } from '@/lib/types';

const SUBJECTS = ['الرياضيات', 'اللغة العربية', 'العلوم', 'اللغة الفرنسية', 'اللغة الإنجليزية'];
const TERM = '2025-2';

interface Row { uid: string; name: string; oral: number; written: number; practical: number }

export default function TeacherGrading() {
  const { t } = useLocale();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [classId, setClassId] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [rows, setRows] = useState<Row[]>([]);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    getClasses().then((c) => { setClasses(c); if (c.length) setClassId(c[0].id); });
  }, []);

  const loadRows = useCallback(async () => {
    if (!classId) return;
    const students = await getStudentsInClass(classId);
    const loaded: Row[] = [];
    for (const s of students) {
      const grades = await getGradesForStudent(s.uid);
      const g = grades.find((x) => x.subject === subject && x.term === TERM);
      loaded.push({ uid: s.uid, name: s.name, oral: g?.oral ?? 0, written: g?.written ?? 0, practical: g?.practical ?? 0 });
    }
    setRows(loaded);
  }, [classId, subject]);

  useEffect(() => { loadRows(); }, [loadRows]);

  const update = (uid: string, field: 'oral' | 'written' | 'practical', val: number, max: number) => {
    const clamped = Math.min(Math.max(0, val), max);
    setRows((r) => r.map((row) => (row.uid === uid ? { ...row, [field]: clamped } : row)));
  };

  const handleSave = async () => {
    for (const r of rows) {
      await saveGrade({ studentId: r.uid, studentName: r.name, subject, term: TERM, oral: r.oral, written: r.written, practical: r.practical });
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const inputCls = 'w-16 px-2 py-1.5 rounded-md border-2 border-gray-200 text-sm text-center outline-none focus:border-burgundy';

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">{t('gradeEntry')}</h2>
        <div className="flex gap-2 flex-wrap">
          <select value={classId} onChange={(e) => setClassId(e.target.value)}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleSave}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            💾 {savedMsg ? t('saved') : t('save')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
              <th className="p-3 text-start">الطالب</th>
              <th className="p-3">{t('oral')} /30</th>
              <th className="p-3">{t('written')} /55</th>
              <th className="p-3">{t('practical')} /15</th>
              <th className="p-3">{t('total')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.uid} className="border-t border-gray-50">
                <td className="p-3 text-sm font-medium">{r.name}</td>
                <td className="p-3 text-center">
                  <input type="number" value={r.oral} min={0} max={30}
                    onChange={(e) => update(r.uid, 'oral', Number(e.target.value), 30)} className={inputCls} />
                </td>
                <td className="p-3 text-center">
                  <input type="number" value={r.written} min={0} max={55}
                    onChange={(e) => update(r.uid, 'written', Number(e.target.value), 55)} className={inputCls} />
                </td>
                <td className="p-3 text-center">
                  <input type="number" value={r.practical} min={0} max={15}
                    onChange={(e) => update(r.uid, 'practical', Number(e.target.value), 15)} className={inputCls} />
                </td>
                <td className="p-3 text-center text-sm font-bold">{r.oral + r.written + r.practical}/100</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-xs text-gray-400">{t('loading')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
