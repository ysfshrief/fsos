'use client';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getSiteSettings, saveSiteSettings } from '@/lib/db';
import { I18nField, TextField, DriveImageField } from '@/components/cms/CmsFields';
import type { SiteSettings } from '@/lib/types';

export default function AdminSettings() {
  const { t } = useLocale();
  const [s, setS] = useState<SiteSettings | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getSiteSettings().then(setS); }, []);

  if (!s) return <div className="text-sm text-gray-400 py-10 text-center">{t('loading')}</div>;

  const set = <K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) =>
    setS({ ...s, [key]: val });

  const handleSave = async () => {
    setBusy(true);
    await saveSiteSettings(s);
    setBusy(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const Card = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="space-y-3.5">{children}</div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">⚙️ إعدادات الموقع</h2>
        <button onClick={handleSave} disabled={busy}
          className="px-5 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light disabled:opacity-60">
          💾 {savedMsg ? t('saved') : t('save')}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="الهوية والعلامة" icon="🏫">
          <DriveImageField label="شعار المدرسة" value={s.logoUrl} onChange={(v) => set('logoUrl', v)} />
          <I18nField label="اسم المدرسة" value={s.schoolName} onChange={(v) => set('schoolName', v)} />
          <I18nField label="الشعار النصي (Tagline)" value={s.tagline} onChange={(v) => set('tagline', v)} />
        </Card>

        <Card title="معلومات التواصل" icon="📞">
          <TextField label="الهاتف" value={s.phone} onChange={(v) => set('phone', v)} dir="ltr" />
          <TextField label="البريد الإلكتروني" value={s.email} onChange={(v) => set('email', v)} dir="ltr" />
          <I18nField label="العنوان" value={s.address} onChange={(v) => set('address', v)} />
          <I18nField label="ساعات العمل" value={s.workingHours} onChange={(v) => set('workingHours', v)} />
        </Card>

        <Card title="روابط التواصل الاجتماعي" icon="🌐">
          <TextField label="Facebook" value={s.facebook} onChange={(v) => set('facebook', v)} dir="ltr" placeholder="https://facebook.com/..." />
          <TextField label="Instagram" value={s.instagram} onChange={(v) => set('instagram', v)} dir="ltr" placeholder="https://instagram.com/..." />
          <TextField label="YouTube" value={s.youtube} onChange={(v) => set('youtube', v)} dir="ltr" placeholder="https://youtube.com/..." />
          <TextField label="WhatsApp" value={s.whatsapp} onChange={(v) => set('whatsapp', v)} dir="ltr" placeholder="201000000000" />
        </Card>

        <Card title="الإحصائيات وخرائط جوجل" icon="📊">
          <div className="grid grid-cols-3 gap-2">
            <TextField label="سنة التأسيس" value={s.statFounded} onChange={(v) => set('statFounded', v)} dir="ltr" />
            <TextField label="عدد الطلاب" value={s.statStudents} onChange={(v) => set('statStudents', v)} dir="ltr" />
            <TextField label="نسبة النجاح" value={s.statSuccess} onChange={(v) => set('statSuccess', v)} dir="ltr" />
          </div>
          <TextField label="رابط خريطة جوجل (Embed URL)" value={s.mapEmbedUrl} onChange={(v) => set('mapEmbedUrl', v)} dir="ltr" placeholder="https://www.google.com/maps/embed?..." />
          <p className="text-[10px] text-gray-400 leading-relaxed">
            🗺️ من خرائط جوجل: مشاركة ← تضمين خريطة ← انسخ رابط الـ src فقط
          </p>
        </Card>
      </div>
    </div>
  );
}
