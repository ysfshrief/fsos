'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { getHomeworkForClass } from '@/lib/db';
import type { Homework } from '@/lib/types';

const subjectIcons: Record<string, string> = {
  'الرياضيات': '📐', 'العلوم': '🔬', 'اللغة العربية': '✏️',
  'اللغة الفرنسية': '🇫🇷', 'اللغة الإنجليزية': '🇬🇧',
};

export default function StudentHomework() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [homework, setHomework] = useState<Homework[]>([]);

  useEffect(() => {
    if (user?.classId) getHomeworkForClass(user.classId).then(setHomework).catch(() => {});
  }, [user]);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5">{t('homework')}</h2>
      <div className="space-y-3.5">
        {homework.map((h) => (
          <div key={h.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl shrink-0">
              {subjectIcons[h.subject] ?? '📄'}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div>
                  <div className="text-sm font-bold text-gray-800">{h.title}</div>
                  <div className="text-xs text-gray-500">{h.subject} • {h.teacherName}</div>
                </div>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full">
                  📅 {h.dueDate}
                </span>
              </div>
            </div>
          </div>
        ))}
        {homework.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center text-sm text-gray-400 border border-gray-100">
            لا توجد واجبات حاليًا 🎉
          </div>
        )}
      </div>
    </div>
  );
}
