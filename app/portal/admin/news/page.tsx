'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getNews, addNews, deleteNews } from '@/lib/db';
import type { NewsItem } from '@/lib/types';

const TAGS = ['إعلانات', 'إنجازات', 'فعاليات', 'رياضة', 'بيئة', 'تخرج'];
const EMOJIS = ['📅', '🏆', '🎨', '⚽', '🌿', '🎓', '📢', '🎉'];

export default function AdminNews() {
  const { t } = useLocale();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState(TAGS[0]);
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  const reload = useCallback(() => { getNews().then(setNews).catch(() => {}); }, []);
  useEffect(() => { reload(); }, [reload]);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addNews({
      title: title.trim(), tag, emoji,
      date: new Date().toISOString().slice(0, 10),
      createdAt: Date.now(),
    });
    setTitle('');
    reload();
  };

  const handleDelete = async (id: string) => {
    await deleteNews(id);
    reload();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5">{t('newsManage')}</h2>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm mb-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('title')}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy lg:col-span-2" />
          <select value={tag} onChange={(e) => setTag(e.target.value)}
            className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
            {TAGS.map((x) => <option key={x}>{x}</option>)}
          </select>
          <div className="flex gap-2">
            <select value={emoji} onChange={(e) => setEmoji(e.target.value)}
              className="px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none flex-1">
              {EMOJIS.map((x) => <option key={x}>{x}</option>)}
            </select>
            <button onClick={handleAdd}
              className="px-5 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
              + {t('addNews')}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {news.map((n) => (
          <div key={n.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{n.emoji}</span>
              <div>
                <div className="text-sm font-bold text-gray-800">{n.title}</div>
                <div className="text-xs text-gray-500">{n.tag} • {n.date}</div>
              </div>
            </div>
            <button onClick={() => handleDelete(n.id)}
              className="px-3 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20 shrink-0">
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
