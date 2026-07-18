'use client';
import { useState } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { useLocale } from '@/lib/locale-context';
import { submitApplication } from '@/lib/db';

export default function CareersPage() {
  const { t } = useLocale();
  const [form, setForm] = useState({
    fullName: '', position: '', qualification: '', experience: '',
    phone: '', email: '', cvUrl: '', certificatesUrl: '',
  });
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form, v: string) => setForm({ ...form, [k]: v });

  const submit = async () => {
    setError('');
    if (!form.fullName.trim() || !form.position.trim() || !form.phone.trim()) {
      setError('يرجى ملء الاسم والوظيفة والهاتف على الأقل');
      return;
    }
    setBusy(true);
    try {
      await submitApplication(form);
      setDone(true);
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setBusy(false);
    }
  };

  const field = (label: string, key: keyof typeof form, opts?: { type?: string; dir?: 'ltr' | 'rtl'; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        type={opts?.type ?? 'text'}
        dir={opts?.dir}
        placeholder={opts?.placeholder}
        className="w-full px-3 py-2.5 rounded-md border-2 border-gray-200 text-sm outline-none focus:border-burgundy transition"
      />
    </div>
  );

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen bg-ivory">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">💼 {t('careers')}</h1>
          <p className="text-white/70 text-sm">{t('careersSub')}</p>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12">
          {done ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center border border-gray-100">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="font-display text-2xl font-bold text-burgundy mb-2">{t('submitted')}</h2>
              <p className="text-sm text-gray-500">سيتم مراجعة طلبك والتواصل معك قريبًا.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 text-[12px] text-blue-800 mb-6 leading-relaxed">
                📎 {t('applyFormNote')}
              </div>

              {error && <div className="mb-4 bg-red-500/5 border border-red-500/20 text-red-700 rounded-lg p-3 text-xs">{error}</div>}

              <div className="grid sm:grid-cols-2 gap-4">
                {field(t('fullName'), 'fullName')}
                {field(t('position'), 'position')}
                {field(t('qualification'), 'qualification')}
                {field(t('experienceField'), 'experience')}
                {field(t('phoneField'), 'phone', { dir: 'ltr', type: 'tel' })}
                {field(t('email'), 'email', { dir: 'ltr', type: 'email' })}
                <div className="sm:col-span-2">{field(t('cvLink'), 'cvUrl', { dir: 'ltr', placeholder: 'https://drive.google.com/file/d/...' })}</div>
                <div className="sm:col-span-2">{field(t('certsLink'), 'certificatesUrl', { dir: 'ltr', placeholder: 'https://drive.google.com/file/d/...' })}</div>
              </div>

              <button onClick={submit} disabled={busy}
                className="w-full mt-6 py-3 rounded-xl bg-burgundy text-white font-semibold hover:bg-burgundy-light transition disabled:opacity-60">
                {busy ? '...' : t('submit')}
              </button>
            </div>
          )}
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
