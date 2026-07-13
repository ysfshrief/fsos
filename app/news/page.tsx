'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { useLocale } from '@/lib/locale-context';
import { getNews } from '@/lib/db';
import type { NewsItem } from '@/lib/types';

const gradients = [
  'from-burgundy to-gold', 'from-purple-700 to-gold', 'from-emerald-600 to-gold',
  'from-teal-600 to-gold', 'from-amber-700 to-gold', 'from-blue-700 to-gold',
];

export default function NewsPage() {
  const { t } = useLocale();
  const [news, setNews] = useState<NewsItem[]>([]);
  useEffect(() => { getNews().then(setNews).catch(() => {}); }, []);

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white">{t('newsTitle')}</h1>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <div key={n.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div className={`h-36 flex items-center justify-center text-5xl bg-gradient-to-br ${gradients[i % gradients.length]}`}>{n.emoji}</div>
              <div className="p-4">
                <span className="inline-block bg-gold-pale text-gold text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mb-2">{n.tag}</span>
                <div className="text-sm font-semibold text-gray-800 leading-snug mb-2">{n.title}</div>
                <div className="text-[11px] text-gray-400">{n.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
