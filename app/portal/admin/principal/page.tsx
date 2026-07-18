'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getPrincipal, savePrincipal } from '@/lib/db';
import { I18nField, TextField, DriveImageField } from '@/components/cms/CmsFields';
import type { PrincipalProfile } from '@/lib/types';

export default function AdminPrincipal() {
  const { t } = useLocale();
  const [p, setP] = useState<PrincipalProfile | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getPrincipal().then(setP); }, []);

  if (!p) return <div className="text-sm text-gray-400 py-10 text-center">{t('loading')}</div>;

  const set = <K extends keyof PrincipalProfile>(k: K, v: PrincipalProfile[K]) => setP({ ...p, [k]: v });

  const save = async () => {
    setBusy(true);
    await savePrincipal(p);
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">🎓 {t('managePrincipal')}</h2>
        <button onClick={save} disabled={busy}
          className="px-5 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light disabled:opacity-60">
          💾 {saved ? t('saved') : t('save')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <TextField label="اسم المديرة" value={p.name} onChange={(v) => set('name', v)} />
          <TextField label="سنوات الخبرة" value={p.experienceYears} onChange={(v) => set('experienceYears', v)} dir="ltr" />
        </div>
        <DriveImageField label="صورة المديرة" value={p.photoUrl} onChange={(v) => set('photoUrl', v)} />
        <I18nField label={t('biography')} value={p.biography} onChange={(v) => set('biography', v)} multiline />
        <I18nField label={t('qualifications')} value={p.qualifications} onChange={(v) => set('qualifications', v)} multiline />
        <I18nField label={t('achievements')} value={p.achievements} onChange={(v) => set('achievements', v)} multiline />
        <I18nField label={t('principalMessage')} value={p.message} onChange={(v) => set('message', v)} multiline />
        <I18nField label={t('schoolVision')} value={p.vision} onChange={(v) => set('vision', v)} multiline />
        <I18nField label={t('schoolMission')} value={p.mission} onChange={(v) => set('mission', v)} multiline />
      </div>
    </div>
  );
}
