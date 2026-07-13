'use client';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { useLocale } from '@/lib/locale-context';

const shelves = [
  { icon: '📖', title: 'المناهج الدراسية', desc: 'كتب المواد لجميع المراحل', link: '#' },
  { icon: '📜', title: 'المراجع والإثراء', desc: 'مصادر إضافية للتفوق', link: '#' },
  { icon: '🎨', title: 'القصص والأدب', desc: 'مكتبة القراءة الحرة', link: '#' },
  { icon: '🔬', title: 'العلوم والاكتشاف', desc: 'موسوعات علمية مبسطة', link: '#' },
];

export default function LibraryPage() {
  const { t } = useLocale();
  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">{t('library')}</h1>
          <p className="text-white/70 text-sm">مكتبة رقمية عبر Google Drive — الروابط تُدار من لوحة الإدارة</p>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shelves.map((s) => (
            <a key={s.title} href={s.link}
              className="bg-white rounded-2xl p-7 text-center border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-sm font-bold text-gray-800 mb-1">{s.title}</div>
              <div className="text-xs text-gray-500">{s.desc}</div>
            </a>
          ))}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
