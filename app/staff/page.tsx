'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import DriveImage from '@/components/DriveImage';
import { useLocale } from '@/lib/locale-context';
import { getStaff, getStaffGroupImage } from '@/lib/db';
import type { StaffMember, StaffGroupImage } from '@/lib/types';

export default function StaffPage() {
  const { t, locale } = useLocale();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [group, setGroup] = useState<StaffGroupImage | null>(null);

  useEffect(() => {
    getStaff().then((s) => setStaff(s.filter((x) => x.visible))).catch(() => {});
    getStaffGroupImage().then(setGroup).catch(() => {});
  }, []);

  const admin = staff.filter((s) => s.category === 'administration');
  const teachers = staff.filter((s) => s.category === 'teaching');
  const specialists = staff.filter((s) => s.category === 'specialist');

  const Card = ({ m }: { m: StaffMember }) => (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition text-center">
      <div className="h-32 bg-gradient-to-br from-burgundy/10 to-gold/10 flex items-end justify-center">
        <div className="w-20 h-20 rounded-full border-4 border-white shadow -mb-10 overflow-hidden bg-gray-100">
          <DriveImage src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="pt-12 pb-5 px-3">
        <div className="text-sm font-bold text-gray-800">{m.name}</div>
        <div className="text-[11px] text-burgundy font-semibold mt-0.5">{m.role[locale]}</div>
      </div>
    </div>
  );

  const Section = ({ title, members }: { title: string; members: StaffMember[] }) =>
    members.length === 0 ? null : (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-burgundy to-gold rounded-full" />
          <h2 className="font-display text-2xl font-bold text-burgundy">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {members.map((m) => <Card key={m.id} m={m} />)}
        </div>
      </div>
    );

  return (
    <>
      <PublicNav />
      <div className="pt-[70px] min-h-screen">
        <div className="py-14 text-center" style={{ background: 'linear-gradient(135deg,#4A1219,#6E1E2B)' }}>
          <h1 className="font-display text-4xl font-bold text-white mb-2">👥 {t('staff')}</h1>
          <p className="text-white/70 text-sm">{t('staffSub')}</p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Group image */}
          {group?.imageUrl && (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-12 border-4 border-white">
              <DriveImage src={group.imageUrl} alt="Staff" className="w-full object-cover" />
            </div>
          )}

          {/* Principal link banner */}
          <Link href="/principal"
            className="flex items-center justify-between gap-4 bg-gradient-to-l from-gold-pale to-white border border-gold/30 rounded-2xl p-5 mb-12 hover:shadow-md transition group">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <div className="font-bold text-burgundy text-sm">{t('principalProfile')}</div>
                <div className="text-xs text-gray-500">اقرأ رسالة مديرة المدرسة ورؤيتها</div>
              </div>
            </div>
            <span className="text-burgundy font-bold group-hover:-translate-x-1 transition">←</span>
          </Link>

          <Section title={t('administration')} members={admin} />
          <Section title={t('teachingStaff')} members={teachers} />
          <Section title={t('specialists')} members={specialists} />
        </div>
      </div>
      <PublicFooter />
    </>
  );
}
