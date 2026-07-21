'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/lib/locale-context';
import { getAllUsers } from '@/lib/db';
import KpiCard from '@/components/KpiCard';
import type { AppUser } from '@/lib/types';

export default function AdminDashboard() {
  const { t } = useLocale();
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => { getAllUsers().then(setUsers).catch(() => {}); }, []);

  const students = users.filter((u) => u.role === 'student').length;
  const teachers = users.filter((u) => u.role === 'teacher').length;
  const pending = users.filter((u) => !u.approved);

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <KpiCard label={t('totalStudents')} value={String(students)} icon="👥" barWidth={90} />
        <KpiCard label={t('teachers')} value={String(teachers)} icon="📚" barWidth={70} />
        <KpiCard label={t('attendanceRate')} value="96.2%" change="↑" changeType="pos" icon="📅" barWidth={96} />
        <KpiCard label={t('pending')} value={String(pending.length)} change={pending.length ? '⏳' : '✓'} changeType={pending.length ? 'wrn' : 'pos'} icon="🛡️" barWidth={pending.length ? 30 : 100} />
      </div>

      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="font-bold text-[15px] text-gray-800">حسابات بانتظار الموافقة</span>
            <Link href="/portal/admin/users" className="text-xs text-burgundy font-semibold hover:underline">{t('users')} ←</Link>
          </div>
          {pending.slice(0, 3).map((u) => (
            <div key={u.uid} className="p-4 border-b border-gray-50 last:border-0 flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold text-gray-800">{u.name}</div>
                <div className="text-xs text-gray-500">{u.email} • {t(u.role)}</div>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full">⏳ {t('pending')}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/portal/admin/banners"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">🖼️</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageBanners')}</div>
          <div className="text-xs text-gray-500">سلايدر الصفحة الرئيسية الديناميكي</div>
        </Link>
        <Link href="/portal/admin/buses"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">🚌</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageBuses')}</div>
          <div className="text-xs text-gray-500">الباصات والمناطق والمواعيد والسائقين</div>
        </Link>
        <Link href="/portal/admin/users"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-bold text-gray-800 mb-1">{t('users')}</div>
          <div className="text-xs text-gray-500">إدارة الحسابات والموافقات والأدوار</div>
        </Link>
        <Link href="/portal/admin/news"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">📰</div>
          <div className="font-bold text-gray-800 mb-1">{t('newsManage')}</div>
          <div className="text-xs text-gray-500">نشر أخبار وفعاليات الموقع العام</div>
        </Link>
        <Link href="/portal/admin/achievers"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageAchievers')}</div>
          <div className="text-xs text-gray-500">إدارة الطلاب المتفوقين في لوحة الشرف</div>
        </Link>
        <Link href="/portal/admin/courses"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">🎓</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageCourses')}</div>
          <div className="text-xs text-gray-500">إدارة البرامج التعليمية الإضافية</div>
        </Link>
        <Link href="/portal/admin/staff"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageStaff')}</div>
          <div className="text-xs text-gray-500">هيئة المدرسة والصورة الجماعية</div>
        </Link>
        <Link href="/portal/admin/principal"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">🎓</div>
          <div className="font-bold text-gray-800 mb-1">{t('managePrincipal')}</div>
          <div className="text-xs text-gray-500">سيرة ورسالة ورؤية المديرة</div>
        </Link>
        <Link href="/portal/admin/facilities"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">🏛️</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageFacilities')}</div>
          <div className="text-xs text-gray-500">المرافق ومعارض الصور</div>
        </Link>
        <Link href="/portal/admin/activities"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">🎨</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageActivities')}</div>
          <div className="text-xs text-gray-500">الأنشطة الطلابية بالصور والفيديو</div>
        </Link>
        <Link href="/portal/admin/partners"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">🤝</div>
          <div className="font-bold text-gray-800 mb-1">{t('managePartners')}</div>
          <div className="text-xs text-gray-500">شركاء المدرسة والروابط</div>
        </Link>
        <Link href="/portal/admin/applications"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">💼</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageApplications')}</div>
          <div className="text-xs text-gray-500">طلبات التوظيف الواردة</div>
        </Link>
        <Link href="/portal/admin/messages"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">📨</div>
          <div className="font-bold text-gray-800 mb-1">{t('manageMessages')}</div>
          <div className="text-xs text-gray-500">رسائل الأخصائي الاجتماعي السرية</div>
        </Link>
        <Link href="/portal/admin/settings"
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
          <div className="text-3xl mb-2">⚙️</div>
          <div className="font-bold text-gray-800 mb-1">{t('siteSettings')}</div>
          <div className="text-xs text-gray-500">الهوية، التواصل، السوشيال ميديا، الخرائط</div>
        </Link>
      </div>
    </div>
  );
}
