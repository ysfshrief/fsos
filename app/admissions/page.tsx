'use client';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { useLocale } from '@/lib/locale-context';

export default function AdmissionsPage() {
  const { t } = useLocale();
  const cards = [
    { icon: '📋', title: 'المستندات المطلوبة', items: ['شهادة الميلاد (أصل + صورة)', 'شهادة المرحلة السابقة', '6 صور شخصية 4×6', 'بطاقة ولي الأمر', 'ملف طبي حديث'] },
    { icon: '🗓️', title: 'مواعيد القبول', items: ['الأحد إلى الخميس', 'من 8:00 ص حتى 2:00 م', 'مبنى الإدارة — الطابق الأرضي', '📞 045-000-0000'] },
    { icon: '🎯', title: 'شروط القبول', items: ['اجتياز اختبار تحديد المستوى', 'مقابلة ولي الأمر مع الإدارة', 'سداد رسوم التسجيل', 'الالتزام بالنظام الداخلي'] },
  ];
  return (
    <>
      <PublicNav />
      <div className="pt-[70px]">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">{t('admissions')}</h1>
          <p className="text-white/70 text-sm">يرجى التواصل مع إدارة المدرسة — لا يتوفر تسجيل إلكتروني</p>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex gap-3 items-start bg-amber-500/5 border border-amber-500/25 rounded-xl p-4 mb-10">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-bold text-burgundy text-sm mb-0.5">ملاحظة مهمة</div>
              <div className="text-sm text-gray-700">لا يتوفر نظام تسجيل إلكتروني. يجب التقدم شخصيًا في مبنى الإدارة خلال أوقات الدوام الرسمي.</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-bold text-burgundy mb-3">{c.title}</div>
                <ul className="space-y-1.5">
                  {c.items.map((i) => (
                    <li key={i} className="text-xs text-gray-600">✓ {i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
