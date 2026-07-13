'use client';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { useAuth } from '@/lib/auth-context';
import KpiCard from '@/components/KpiCard';

export default function TeacherDashboard() {
  const { t } = useLocale();
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">{user?.name}</h2>
      <p className="text-xs text-gray-500 mb-5">{user?.subject}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <KpiCard label={t('totalStudents')} value="142" icon="👥" barWidth={80} />
        <KpiCard label={t('attendanceRate')} value="96%" change="↑" changeType="pos" icon="📅" barWidth={96} />
        <KpiCard label={t('pendingHw')} value="28" change="⏳" changeType="wrn" icon="📝" barWidth={55} />
        <KpiCard label={t('avg')} value="82.3" change="↑" changeType="pos" icon="🎯" barWidth={82} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/portal/teacher/attendance"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">📅</div>
          <div className="font-bold text-gray-800 mb-1">{t('attendance')}</div>
          <div className="text-xs text-gray-500">تسجيل حضور وغياب الطلاب اليومي</div>
        </Link>
        <Link href="/portal/teacher/grading"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">📊</div>
          <div className="font-bold text-gray-800 mb-1">{t('gradeEntry')}</div>
          <div className="text-xs text-gray-500">رصد درجات الشفهي والتحريري والعملي</div>
        </Link>
      </div>
    </div>
  );
}
