'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/lib/locale-context';
import LangSwitcher from './LangSwitcher';

// Full list (shown in the drawer / "More" menu)
const allLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/admissions', key: 'admissions' },
  { href: '/hall-of-fame', key: 'hallOfFame' },
  { href: '/courses', key: 'courses' },
  { href: '/staff', key: 'staff' },
  { href: '/facilities', key: 'facilities' },
  { href: '/activities', key: 'activities' },
  { href: '/partnerships', key: 'partnerships' },
  { href: '/careers', key: 'careers' },
  { href: '/social-specialist', key: 'socialSpecialist' },
  { href: '/location', key: 'location' },
  { href: '/news', key: 'news' },
  { href: '/library', key: 'library' },
];

// Curated primary links shown inline on desktop (lg+)
const primaryLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/admissions', key: 'admissions' },
  { href: '/hall-of-fame', key: 'hallOfFame' },
  { href: '/activities', key: 'activities' },
  { href: '/news', key: 'news' },
];

export default function PublicNav() {
  const { t } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-[70px] bg-ivory/95 backdrop-blur border-b border-ivory-dark flex items-center">
      <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Logo" width={42} height={42} className="object-contain" />
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-burgundy">{t('schoolName')}</div>
            <div className="text-[9px] text-gray-400">École des Sœurs Franciscaines – Damanhour</div>
          </div>
        </Link>

        {/* Desktop primary links (lg+) */}
        <div className="hidden lg:flex items-center gap-0.5">
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-2.5 py-2 rounded-md text-[13px] font-medium transition
                ${pathname === l.href ? 'text-burgundy font-bold' : 'text-gray-600 hover:text-burgundy hover:bg-gold-pale'}`}
            >
              {t(l.key)}
            </Link>
          ))}
          {/* More button opens full drawer */}
          <button
            onClick={() => setOpen(!open)}
            className={`px-2.5 py-2 rounded-md text-[13px] font-medium transition flex items-center gap-1
              ${open ? 'text-burgundy font-bold bg-gold-pale' : 'text-gray-600 hover:text-burgundy hover:bg-gold-pale'}`}
          >
            {t('menuMore')} <span className="text-[9px]">▾</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <LangSwitcher />
          <Link
            href="/login"
            className="hidden sm:inline-flex px-4 py-2 rounded-md bg-burgundy text-white text-[13px] font-semibold hover:bg-burgundy-light transition"
          >
            🔑 {t('portalLogin')}
          </Link>
          {/* Hamburger (below lg) */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-10 h-10 rounded-md border border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-burgundy transition"
            aria-label="menu"
          >
            <span className={`block w-5 h-0.5 bg-burgundy transition ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-burgundy transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-burgundy transition ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Drawer / mega-menu (all sizes when open) */}
      {open && (
        <>
          <div className="fixed inset-0 top-[70px] bg-black/30 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-[70px] inset-x-0 bg-ivory border-b border-ivory-dark shadow-lg z-50 max-h-[calc(100vh-70px)] overflow-y-auto">
            <div className="max-w-6xl mx-auto p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {allLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium transition
                    ${pathname === l.href ? 'bg-burgundy/10 text-burgundy font-bold' : 'text-gray-600 hover:bg-gold-pale'}`}
                >
                  {t(l.key)}
                </Link>
              ))}
            </div>
            <div className="max-w-6xl mx-auto p-3 pt-0 sm:hidden">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2.5 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light transition"
              >
                🔑 {t('portalLogin')}
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
