'use client';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { useLocale } from '@/lib/locale-context';
import { submitSpecialistMessage, getSiteSettings } from '@/lib/db';
import type { SiteSettings } from '@/lib/types';

export default function SocialSpecialistPage() {
  const { t, locale, tx } = useLocale();
  const [form, setForm] = useState({ name: '', contact: '', subject: '', message: '', attachmentUrl: '', preferredTime: '' });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => { getSiteSettings().then(setSettings).catch(() => {}); }, []);

  const set = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const submit = async () => {
    setError('');
    if (!form.message.trim() || !form.contact.trim()) {
      setError('يرجى كتابة الرسالة ووسيلة التواصل');
      return;
    }
    setBusy(true);
    try {
      await submitSpecialistMessage(form);
      setDone(true);
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen bg-ivory">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">🤝 {t('socialSpecialist')}</h1>
          <p className="text-white/70 text-sm">{t('socialSub')}</p>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-[1fr_280px] gap-6">
          {/* Form */}
          <div>
            {done ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center border border-gray-100">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="font-display text-2xl font-bold text-burgundy mb-2">{t('submitted')}</h2>
                <p className="text-sm text-gray-500">سيتواصل معك الأخصائي في أقرب وقت.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 text-[12px] text-green-800 mb-6 flex gap-2">
                  <span>🔒</span><span>{t('confidentialNote')}</span>
                </div>

                {error && <div className="mb-4 bg-red-500/5 border border-red-500/20 text-red-700 rounded-lg p-3 text-xs">{error}</div>}

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('fullName')} <span className="text-gray-400 font-normal">(اختياري)</span></label>
                      <input value={form.name} onChange={(e) => set('name', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('contactField')}</label>
                      <input value={form.contact} onChange={(e) => set('contact', e.target.value)} dir="ltr"
                        className="w-full px-3 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('subjectField')}</label>
                    <input value={form.subject} onChange={(e) => set('subject', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('messageField')}</label>
                    <textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={4}
                      className="w-full px-3 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy resize-y" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('preferredTime')}</label>
                      <input value={form.preferredTime} onChange={(e) => set('preferredTime', e.target.value)}
                        placeholder="مثال: الأحد صباحًا"
                        className="w-full px-3 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('attachmentLink')}</label>
                      <input value={form.attachmentUrl} onChange={(e) => set('attachmentUrl', e.target.value)} dir="ltr"
                        placeholder="https://drive.google.com/..."
                        className="w-full px-3 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy" />
                    </div>
                  </div>
                </div>

                <button onClick={submit} disabled={busy}
                  className="w-full mt-6 py-3 rounded-xl bg-burgundy text-white font-semibold hover:bg-burgundy-light transition disabled:opacity-60">
                  {busy ? '...' : t('sendMessage')}
                </button>
              </div>
            )}
          </div>

          {/* Contact sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="font-bold text-burgundy text-sm mb-3">📞 {t('contactUs')}</div>
              <div className="text-xs text-gray-600 space-y-2">
                <div dir="ltr" className="text-start">📱 {settings?.phone || '045-000-0000'}</div>
                <div dir="ltr" className="text-start">✉️ {settings?.email || 'info@franciscan-dam.edu.eg'}</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="font-bold text-burgundy text-sm mb-2">🕐 {t('workingHoursLabel')}</div>
              <div className="text-xs text-gray-600">{tx(settings?.workingHours) || 'الأحد - الخميس: 8:00 ص - 2:00 م'}</div>
            </div>
          </div>
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
