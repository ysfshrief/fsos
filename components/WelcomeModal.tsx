'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/locale-context';

const SEEN_KEY = 'fsos-welcome-seen';

export default function WelcomeModal() {
  const { t } = useLocale();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show only on the visitor's first ever visit
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(SEEN_KEY, '1');
    setShow(false);
  };

  const goApply = () => { dismiss(); router.push('/admissions'); };
  const goBrowse = () => { dismiss(); };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-burgundy-dark/70 backdrop-blur-sm animate-[fadeIn_.3s_ease]"
        onClick={goBrowse} />

      {/* Card */}
      <div className="relative w-full max-w-lg bg-ivory rounded-3xl shadow-2xl overflow-hidden animate-[popIn_.4s_cubic-bezier(.2,.8,.2,1)]">
        {/* Top ribbon */}
        <div className="h-1.5 bg-gradient-to-r from-burgundy via-gold to-burgundy" />

        <button onClick={goBrowse}
          className="absolute top-4 end-4 w-8 h-8 rounded-full bg-white/70 hover:bg-white text-gray-500 hover:text-burgundy flex items-center justify-center text-lg transition"
          aria-label="close">×</button>

        <div className="px-8 pt-8 pb-9 text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Image src="/logo.png" alt="Logo" fill className="object-contain drop-shadow-lg animate-float" />
          </div>

          <h2 className="font-display text-xl md:text-2xl font-bold text-burgundy leading-snug mb-2">
            {t('welcomeTitle')}
          </h2>
          <p className="text-sm text-gray-500 mb-7">{t('welcomeSub')}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Apply */}
            <button onClick={goApply}
              className="group rounded-2xl p-5 bg-gradient-to-br from-burgundy to-burgundy-light text-white text-start hover:-translate-y-0.5 hover:shadow-lg transition">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-bold text-[15px] mb-0.5">{t('welcomeApply')}</div>
              <div className="text-[11px] text-white/70 leading-snug">{t('welcomeApplyDesc')}</div>
              <div className="mt-3 text-[11px] font-semibold text-gold-light opacity-0 group-hover:opacity-100 transition">←</div>
            </button>

            {/* Browse */}
            <button onClick={goBrowse}
              className="group rounded-2xl p-5 bg-white border-2 border-gold/40 text-gray-700 text-start hover:-translate-y-0.5 hover:shadow-lg hover:border-gold transition">
              <div className="text-2xl mb-2">🧭</div>
              <div className="font-bold text-[15px] mb-0.5 text-burgundy">{t('welcomeBrowse')}</div>
              <div className="text-[11px] text-gray-500 leading-snug">{t('welcomeBrowseDesc')}</div>
              <div className="mt-3 text-[11px] font-semibold text-gold opacity-0 group-hover:opacity-100 transition">←</div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(.92) translateY(10px) }
          to { opacity: 1; transform: scale(1) translateY(0) }
        }
      `}</style>
    </div>
  );
}
