'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { getClasses, getHomeworkForClass, addHomework } from '@/lib/db';
import type { SchoolClass, Homework } from '@/lib/types';

const SUBJECTS = ['الرياضيات', 'اللغة العربية', 'العلوم', 'اللغة الفرنسية', 'اللغة الإنجليزية'];

export default function TeacherHomework() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [classId, setClassId] = useState('');
  const [list, setList] = useState<Homework[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    getClasses().then((c) => { setClasses(c); if (c.length) setClassId(c[0].id); });
  }, []);

  const reload = useCallback(() => {
    if (classId) getHomeworkForClass(classId).then(setList);
  }, [classId]);

  useEffect(() => { reload(); }, [reload]);

  const handleAdd = async () => {
    if (!title.trim() || !dueDate || !user) return;
    await addHomework({
      classId, subject, title: title.trim(),
      teacherName: user.name, dueDate, createdAt: Date.now(),
    });
    setTitle(''); setDueDate('');
    reload();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5">{t('homework')}</h2>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title')}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy lg:col-span-2" />
          <select value={subject} onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
        </div>
        <div className="flex gap-2">
          <select value={classId} onChange={(e) => setClassId(e.target.value)}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={handleAdd}
            className="px-5 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('add')}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {list.map((h) => (
          <div key={h.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <div className="text-sm font-bold text-gray-800">{h.title}</div>
              <div className="text-xs text-gray-500">{h.subject} • {h.teacherName}</div>
            </div>
            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full">📅 {h.dueDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
