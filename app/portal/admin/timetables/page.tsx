'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getTimetables, saveTimetable, deleteTimetable } from '@/lib/db';
import type { Timetable, TimetableKind, TimetableSlot } from '@/lib/types';

const DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

const emptyTimetable = (kind: TimetableKind): Omit<Timetable, 'id'> => ({
  kind,
  name: '',
  periods: 8,
  periodTimes: ['8:00 - 8:45', '9:00 - 9:45', '10:00 - 10:45', '11:00 - 11:45', '12:00 - 12:45', '13:00 - 13:45', '14:00 - 14:45', '15:00 - 15:45'],
  slots: [],
  visible: true,
  updatedAt: Date.now(),
});

export default function AdminTimetables() {
  const { t } = useLocale();
  const [list, setList] = useState<Timetable[]>([]);
  const [editing, setEditing] = useState<(Omit<Timetable, 'id'> & { id?: string }) | null>(null);

  const reload = useCallback(() => { getTimetables().then(setList).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const startNew = (kind: TimetableKind) => setEditing(emptyTimetable(kind));
  const startEdit = (tt: Timetable) => setEditing({ ...tt, slots: tt.slots.map((s) => ({ ...s })), periodTimes: [...tt.periodTimes] });

  const handleSave = async () => {
    if (!editing || !editing.name.trim()) { alert('اكتب اسم الفصل / المدرس'); return; }
    await saveTimetable(editing);
    setEditing(null);
    reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا الجدول؟')) return;
    await deleteTimetable(id);
    reload();
  };

  // --- cell editing helpers (operate on editing.slots) ---
  const setCell = (day: number, period: number, patch: Partial<TimetableSlot>) => {
    if (!editing) return;
    const slots = [...editing.slots];
    const idx = slots.findIndex((s) => s.day === day && s.period === period);
    const merged: TimetableSlot = {
      day, period,
      subject: '', ...(idx >= 0 ? slots[idx] : {}), ...patch,
    };
    // If subject cleared and nothing else, remove the slot
    if (!merged.subject && !merged.teacher && !merged.className && !merged.room) {
      if (idx >= 0) slots.splice(idx, 1);
    } else if (idx >= 0) {
      slots[idx] = merged;
    } else {
      slots.push(merged);
    }
    setEditing({ ...editing, slots });
  };

  const getCell = (day: number, period: number) =>
    editing?.slots.find((s) => s.day === day && s.period === period);

  const setPeriods = (n: number) => {
    if (!editing) return;
    const periodTimes = [...editing.periodTimes];
    while (periodTimes.length < n) periodTimes.push('');
    periodTimes.length = n;
    setEditing({ ...editing, periods: n, periodTimes, slots: editing.slots.filter((s) => s.period <= n) });
  };

  // ===================== LIST VIEW =====================
  if (!editing) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-5">📅 {t('timetablesManage')}</h2>

        <div className="flex gap-2 mb-6">
          <button onClick={() => startNew('class')}
            className="px-4 py-2.5 rounded-lg bg-burgundy text-white text-sm font-bold hover:bg-burgundy/90">
            + 🏫 {t('addClassSchedule')}
          </button>
          <button onClick={() => startNew('teacher')}
            className="px-4 py-2.5 rounded-lg bg-gold text-white text-sm font-bold hover:bg-gold/90">
            + 👨‍🏫 {t('addTeacherSchedule')}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((tt) => (
            <div key={tt.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tt.kind === 'class' ? 'bg-burgundy/10 text-burgundy' : 'bg-gold/15 text-gold'
                }`}>
                  {tt.kind === 'class' ? '🏫 فصل' : '👨‍🏫 مدرس'}
                </span>
                {!tt.visible && <span className="text-[10px] text-gray-400">مخفي</span>}
              </div>
              <div className="font-bold text-gray-800 mb-1">{tt.name}</div>
              <div className="text-xs text-gray-400 mb-4">{tt.slots.length} حصة • {tt.periods} فترة</div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(tt)}
                  className="flex-1 px-3 py-1.5 rounded-md bg-burgundy/10 text-burgundy text-xs font-bold hover:bg-burgundy/20">
                  ✏️ تعديل
                </button>
                <button onClick={() => handleDelete(tt.id)}
                  className="px-3 py-1.5 rounded-md bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100">
                  🗑️
                </button>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 text-sm">
              لا توجد جداول بعد. اضغط أحد الأزرار بالأعلى لإضافة جدول.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===================== EDIT VIEW =====================
  const isClass = editing.kind === 'class';
  const periods = Array.from({ length: editing.periods }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          {editing.id ? '✏️ تعديل الجدول' : '➕ جدول جديد'} ({isClass ? 'فصل' : 'مدرس'})
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setEditing(null)}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200">
            إلغاء
          </button>
          <button onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-burgundy text-white text-sm font-bold hover:bg-burgundy/90">
            💾 حفظ
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-5">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              {isClass ? 'اسم الفصل (مثال: 2 إعدادي/أ)' : 'اسم المدرس'}
            </label>
            <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              placeholder={isClass ? '2 إعدادي/أ' : 'مريم نبيل'}
              className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">عدد الحصص في اليوم</label>
            <select value={editing.periods} onChange={(e) => setPeriods(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none focus:border-burgundy">
              {[4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n} value={n}>{n} حصص</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={editing.visible}
                onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
                className="w-4 h-4 accent-burgundy" />
              ظاهر في الموقع
            </label>
          </div>
        </div>

        {/* Period times */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-gray-600 mb-1.5">مواعيد الحصص</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {periods.map((p) => (
              <input key={p} value={editing.periodTimes[p - 1] || ''}
                onChange={(e) => {
                  const pt = [...editing.periodTimes];
                  pt[p - 1] = e.target.value;
                  setEditing({ ...editing, periodTimes: pt });
                }}
                placeholder={`حصة ${p}`}
                className="px-2 py-1.5 rounded-md border border-gray-200 text-xs outline-none focus:border-burgundy" />
            ))}
          </div>
        </div>
      </div>

      {/* Grid editor */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-center min-w-[820px]">
          <thead>
            <tr>
              <th className="bg-burgundy text-white text-xs p-2 sticky start-0">اليوم \ الحصة</th>
              {periods.map((p) => (
                <th key={p} className="bg-burgundy text-white text-xs p-2 min-w-[130px]">
                  حصة {p}
                  <div className="text-[9px] text-white/60 font-normal">{editing.periodTimes[p - 1]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((dayName, day) => (
              <tr key={day}>
                <td className="bg-gold-pale text-burgundy text-xs font-bold p-2 sticky start-0">{dayName}</td>
                {periods.map((p) => {
                  const c = getCell(day, p);
                  return (
                    <td key={p} className="p-1 border border-gray-100 align-top">
                      <input
                        value={c?.subject || ''}
                        onChange={(e) => setCell(day, p, { subject: e.target.value })}
                        placeholder="المادة"
                        className="w-full px-1.5 py-1 rounded border border-gray-200 text-[12px] font-bold text-burgundy outline-none focus:border-burgundy mb-1" />
                      <input
                        value={isClass ? (c?.teacher || '') : (c?.className || '')}
                        onChange={(e) => setCell(day, p, isClass ? { teacher: e.target.value } : { className: e.target.value })}
                        placeholder={isClass ? 'المدرس' : 'الفصل'}
                        className="w-full px-1.5 py-1 rounded border border-gray-100 text-[10px] text-gray-500 outline-none focus:border-gold" />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-3">💡 اكتب المادة في الخانة العلوية و{isClass ? 'المدرس' : 'الفصل'} في الخانة السفلية. اترك الخانة فارغة للحصص الخالية.</p>
    </div>
  );
}
