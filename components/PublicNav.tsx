'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/locale-context';
import LangSwitcher from './LangSwitcher';

export default function PublicNav() {
  const { t } = useLocale();
  const pathname = usePathname();

  const links = [
    { href: '/', key: 'home' },
    { href: '/about', key: 'about' },
    { href: '/admissions', key: 'admissions' },
    { href: '/news', key: 'news' },
    { href: '/library', key: 'library' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-[70px] bg-ivory/95 backdrop-blur border-b border-ivory-dark flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/logo.png" alt="Logo" width={42} height={42} className="object-contain" />
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-burgundy">{t('schoolName')}</div>
            <div className="text-[9px] text-gray-400">École des Sœurs Franciscaines – Damanhour</div>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 rounded-md text-[13px] font-medium transition
                ${pathname === l.href ? 'text-burgundy font-bold' : 'text-gray-600 hover:text-burgundy hover:bg-gold-pale'}`}
            >
              {t(l.key)}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <LangSwitcher />
          <Link
            href="/login"
            className="px-4 py-2 rounded-md bg-burgundy text-white text-[13px] font-semibold hover:bg-burgundy-light transition"
          >
            🔑 {t('portalLogin')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
