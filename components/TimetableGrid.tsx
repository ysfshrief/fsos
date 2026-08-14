'use client';
import { useLocale } from '@/lib/locale-context';
import type { Timetable } from '@/lib/types';

const DAYS_AR = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
const DAYS_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

/** Renders a weekly timetable as a responsive grid. Read-only. */
export default function TimetableGrid({ timetable }: { timetable: Timetable }) {
  const { locale } = useLocale();
  const days = locale === 'ar' ? DAYS_AR : DAYS_EN;
  // Most schools run Sat–Thu (6 days). We show all days that have slots, min Sat–Thu.
  const usedDays = new Set(timetable.slots.map((s) => s.day));
  const dayList = [0, 1, 2, 3, 4, 5].filter((d) => usedDays.has(d) || d <= 4);
  const periods = Array.from({ length: timetable.periods }, (_, i) => i + 1);

  const cell = (day: number, period: number) =>
    timetable.slots.find((s) => s.day === day && s.period === period);

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full border-collapse text-center min-w-[720px]">
        <thead>
          <tr>
            <th className="bg-burgundy text-white text-xs font-bold p-3 sticky start-0 z-10">
              {locale === 'ar' ? 'اليوم / الحصة' : 'Day / Period'}
            </th>
            {periods.map((p) => (
              <th key={p} className="bg-burgundy text-white p-2 min-w-[90px]">
                <div className="text-sm font-bold">{p}</div>
                <div className="text-[9px] text-white/70 font-normal mt-0.5">
                  {timetable.periodTimes[p - 1] || ''}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dayList.map((day, ri) => (
            <tr key={day} className={ri % 2 ? 'bg-ivory/40' : 'bg-white'}>
              <td className="bg-gold-pale text-burgundy text-sm font-bold p-3 sticky start-0 z-10 border-e border-gray-200">
                {days[day]}
              </td>
              {periods.map((p) => {
                const c = cell(day, p);
                return (
                  <td key={p} className="p-1.5 border border-gray-100 align-top">
                    {c ? (
                      <div className="rounded-lg bg-burgundy/[.04] border border-burgundy/10 px-2 py-2 h-full">
                        <div className="text-[13px] font-bold text-burgundy leading-tight">{c.subject}</div>
                        {c.teacher && (
                          <div className="text-[10px] text-gray-500 mt-1">{c.teacher}</div>
                        )}
                        {c.className && (
                          <div className="text-[10px] text-gold font-semibold mt-1">{c.className}</div>
                        )}
                        {c.room && (
                          <div className="text-[9px] text-gray-400 mt-0.5">📍 {c.room}</div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full min-h-[42px]" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
