'use client';
import Image from 'next/image';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { useLocale } from '@/lib/locale-context';

export default function AboutPage() {
  const { t } = useLocale();
  const timeline = [
    { year: '1936', title: 'تأسيس المدرسة', desc: 'على يد راهبات القديس فرنسيس', color: 'border-gold text-gold' },
    { year: '1960', title: 'التوسع الكبير', desc: 'إضافة المرحلة الإعدادية والثانوية', color: 'border-burgundy text-burgundy' },
    { year: '2026', title: 'الرقمنة الكاملة', desc: 'إطلاق نظام School OS المتكامل', color: 'border-gray-300 text-gray-400' },
  ];
  return (
    <>
      <PublicNav />
      <div className="pt-[70px]">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <div className="text-[11px] font-bold tracking-widest uppercase text-gold-light mb-2">{t('since')}</div>
          <h1 className="font-display text-4xl font-bold text-white">{t('about')}</h1>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-burgundy mb-4">{t('legacy')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              أسسها راهبات القديس فرنسيس الأسيزي في مدينة دمنهور عام 1936م، حاملاتٍ مشعل التعليم والإيمان في ربوع البحيرة.
              بدأت بفصول محدودة لتُصبح اليوم واحدةً من أعرق المؤسسات التعليمية في مصر.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              عبر السنين، أخرجت المدرسة أطباء ومهندسين وأدباء وعلماء أسهموا في بناء مصر،
              متسلحين بالقيم الإنسانية النبيلة والتعليم المتميز.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gold-pale rounded-xl p-4 text-center">
                <div className="font-display text-3xl font-bold text-burgundy">88+</div>
                <div className="text-xs text-gray-600">عامًا من التميز</div>
              </div>
              <div className="bg-burgundy/5 rounded-xl p-4 text-center">
                <div className="font-display text-3xl font-bold text-burgundy">25K+</div>
                <div className="text-xs text-gray-600">خريج ومتفوق</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow border border-gray-100">
            <div className="text-center mb-6">
              <Image src="/logo.png" alt="Logo" width={100} height={100} className="mx-auto object-contain" />
            </div>
            {timeline.map((tl) => (
              <div key={tl.year} className={`border-e-[3px] ${tl.color.split(' ')[0]} pe-4 mb-5 last:mb-0`}>
                <div className={`text-[11px] font-bold tracking-wide ${tl.color.split(' ')[1]}`}>{tl.year}</div>
                <div className="text-sm font-bold text-gray-800">{tl.title}</div>
                <div className="text-xs text-gray-500">{tl.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
